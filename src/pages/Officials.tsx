import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Filter,
  Star,
  Download,
  Flag,
  ChartBar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, DashboardFilters } from "@/lib/api";
import { OfficialRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalAthletes: number;
  flaggedPercentage: number;
  avgComposite: number;
  submissionsToday: number;
}

export default function Officials() {
  const { toast } = useToast();
  
  const [records, setRecords] = useState<OfficialRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFilters>({
    region: "Mumbai",
    ageBand: "",
    gender: "",
    testType: ""
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsResult, statsResult] = await Promise.all([
        api.getOfficialRecords(filters),
        api.getDashboardStats(filters)
      ]);

      if (recordsResult.ok) {
        setRecords(recordsResult.data || []);
      }
      
      if (statsResult.ok) {
        setStats(statsResult.data || null);
      }
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (recordId: string) => {
    const result = await api.shortlistAthlete(recordId);
    if (result.ok) {
      setRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, shortlisted: true } : record
      ));
      toast({
        title: "Athlete Shortlisted",
        description: "Athlete has been added to the shortlist."
      });
    } else {
      toast({
        title: "Shortlist Failed",
        description: result.error || "Failed to shortlist athlete.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getBenchmarkDistribution = () => {
    const distribution = records.reduce((acc, record) => {
      acc[record.benchmarkLabel] = (acc[record.benchmarkLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Below", value: distribution.Below || 0, fill: "#ef4444" },
      { name: "Meets", value: distribution.Meets || 0, fill: "#f59e0b" },
      { name: "Exceeds", value: distribution.Exceeds || 0, fill: "#10b981" }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SAI Dashboard
            <Badge variant="secondary" className="ml-3">Demo</Badge>
          </h1>
          <p className="text-lg text-muted-foreground">
            Sports Assessment Institute - Official Performance Tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="metric-card">
            <CardContent className="flex items-center p-6">
              <Users className="h-12 w-12 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Athletes</p>
                <p className="text-2xl font-bold">{stats?.totalAthletes || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="flex items-center p-6">
              <Flag className="h-12 w-12 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Flagged %</p>
                <p className="text-2xl font-bold">{stats?.flaggedPercentage || 0}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-12 w-12 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Composite</p>
                <p className="text-2xl font-bold">{stats?.avgComposite.toFixed(1) || "0.0"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="flex items-center p-6">
              <Calendar className="h-12 w-12 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats?.submissionsToday || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select 
                      value={filters.region || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, region: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Age Band</Label>
                    <Select 
                      value={filters.ageBand || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, ageBand: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Ages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="U14">Under 14</SelectItem>
                        <SelectItem value="U16">Under 16</SelectItem>
                        <SelectItem value="U18">Under 18</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select 
                      value={filters.gender || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Test Type</Label>
                    <Select 
                      value={filters.testType || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, testType: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Tests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tests</SelectItem>
                        <SelectItem value="vertical_jump">Vertical Jump</SelectItem>
                        <SelectItem value="situps_60s">Sit-ups (60s)</SelectItem>
                        <SelectItem value="shuttle_5x10">Shuttle Run</SelectItem>
                        <SelectItem value="endurance_1_6k">Endurance Run</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Performance Leaderboard
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </CardTitle>
                <CardDescription>
                  Ranked by composite score across all tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : records.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                    <p className="text-muted-foreground">
                      No athlete records match the current filters
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Athlete ID</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Composite</TableHead>
                        <TableHead>Benchmark</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, index) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {record.athleteId.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="capitalize">
                            {record.test.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{record.score}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium">{record.composite}</span>
                              {record.composite >= 2.5 && (
                                <Star className="ml-1 h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                record.benchmarkLabel === "Exceeds" ? "default" :
                                record.benchmarkLabel === "Meets" ? "secondary" : "destructive"
                              }
                            >
                              {record.benchmarkLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.flagsSummary.length === 0 ? (
                              <Badge variant="outline" className="text-green-600">Clean</Badge>
                            ) : (
                              <Badge variant="destructive" title={record.flagsSummary.join(", ")}>
                                <Flag className="mr-1 h-3 w-3" />
                                {record.flagsSummary.length}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(record.receivedAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={record.shortlisted ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleShortlist(record.id)}
                              disabled={record.shortlisted}
                            >
                              {record.shortlisted ? (
                                <>
                                  <Star className="mr-1 h-3 w-3" />
                                  Listed
                                </>
                              ) : (
                                "Shortlist"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Benchmark Distribution Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="mr-2 h-5 w-5" />
                  Benchmark Distribution
                </CardTitle>
                <CardDescription>
                  Performance distribution across benchmark categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBenchmarkDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="metric-card">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getBenchmarkDistribution().map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="metric-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Clean Records</span>
                      <span className="font-medium">
                        {records.filter(r => r.flagsSummary.length === 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Flagged Records</span>
                      <span className="font-medium">
                        {records.filter(r => r.flagsSummary.length > 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Shortlisted</span>
                      <span className="font-medium">
                        {records.filter(r => r.shortlisted).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="metric-card">
                <CardHeader>
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Submissions</span>
                      <span className="font-medium">{records.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unique Athletes</span>
                      <span className="font-medium">
                        {new Set(records.map(r => r.athleteId)).size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Score</span>
                      <span className="font-medium">
                        {records.length > 0 
                          ? (records.reduce((sum, r) => sum + r.composite, 0) / records.length).toFixed(1)
                          : "0.0"
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}