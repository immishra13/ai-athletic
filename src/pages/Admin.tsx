import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  Database, 
  Download, 
  RotateCcw, 
  Save, 
  AlertTriangle,
  Users,
  Activity
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { BENCHMARKS } from "@/data/benchmarks";
import { AgeBand, Gender, TestType, SubmissionConfig } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Admin() {
  const { toast } = useToast();
  
  const submissionConfig = useStore(state => state.submissionConfig);
  const updateSubmissionConfig = useStore(state => state.updateSubmissionConfig);
  const benchmarks = useStore(state => state.benchmarks);
  const updateBenchmarks = useStore(state => state.updateBenchmarks);
  const attempts = useStore(state => state.attempts);
  const clearAllData = useStore(state => state.clearAllData);
  
  const [editingBenchmarks, setEditingBenchmarks] = useState(false);
  const [tempBenchmarks, setTempBenchmarks] = useState(benchmarks);
  const [selectedTest, setSelectedTest] = useState<TestType>("vertical_jump");
  const [selectedAge, setSelectedAge] = useState<AgeBand>("U18");
  const [selectedGender, setSelectedGender] = useState<Gender>("M");

  const handleSubmissionModeChange = (mode: SubmissionConfig['mode']) => {
    updateSubmissionConfig({ mode });
    toast({
      title: "Submission Mode Updated",
      description: `Changed to ${mode.replace('_', ' ')} mode.`
    });
  };

  const handleAutoSubmitToggle = (autoSubmit: boolean) => {
    updateSubmissionConfig({ autoSubmit });
    toast({
      title: "Auto Submit Updated",
      description: `Auto submission ${autoSubmit ? 'enabled' : 'disabled'}.`
    });
  };

  const handleBenchmarkChange = (value: string, type: 'meet' | 'exceed') => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setTempBenchmarks(prev => ({
      ...prev,
      [selectedTest]: {
        ...prev[selectedTest],
        [selectedAge]: {
          ...prev[selectedTest][selectedAge],
          [selectedGender]: {
            ...prev[selectedTest][selectedAge][selectedGender],
            [type]: numValue
          }
        }
      }
    }));
  };

  const saveBenchmarks = () => {
    updateBenchmarks(tempBenchmarks);
    setEditingBenchmarks(false);
    toast({
      title: "Benchmarks Updated",
      description: "Benchmark standards have been saved successfully."
    });
  };

  const resetBenchmarks = () => {
    setTempBenchmarks(BENCHMARKS);
    toast({
      title: "Benchmarks Reset",
      description: "Benchmark standards reset to defaults."
    });
  };

  const exportCSV = (type: 'athletes' | 'attempts') => {
    let csvContent = "";
    
    if (type === 'attempts') {
      csvContent = "ID,Athlete ID,Test,Date,Score,Unit,Benchmark,Submit to SAI\n";
      attempts.forEach(attempt => {
        csvContent += `${attempt.id},${attempt.athleteId},${attempt.test},${new Date(attempt.date).toISOString()},${attempt.score},${attempt.unit},${attempt.benchmarkLabel},${attempt.submitToSAI}\n`;
      });
    } else {
      // Athletes CSV would be implemented with athlete data
      csvContent = "Feature not implemented for demo\n";
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export Complete",
      description: `${type} data exported successfully.`
    });
  };

  const clearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData();
      api.clearSAIDatabase();
      toast({
        title: "Database Cleared",
        description: "All athlete and attempt data has been cleared.",
        variant: "destructive"
      });
    }
  };

  const currentBenchmark = tempBenchmarks[selectedTest][selectedAge][selectedGender];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Configuration
            <Badge variant="secondary" className="ml-3">Demo</Badge>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage system settings, benchmarks, and data exports
          </p>
        </div>

        <Tabs defaultValue="submission" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submission">Submission</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Submission Configuration */}
          <TabsContent value="submission" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Submission Configuration
                </CardTitle>
                <CardDescription>
                  Configure how athlete attempts are submitted to SAI system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Submission Mode</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      How attempts are selected for submission to SAI
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="manual"
                          name="submission_mode"
                          checked={submissionConfig.mode === "manual"}
                          onChange={() => handleSubmissionModeChange("manual")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="manual" className="flex-1">
                          <div className="font-medium">Manual</div>
                          <div className="text-sm text-muted-foreground">
                            User must toggle "Submit to SAI" per attempt
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="auto_best"
                          name="submission_mode"
                          checked={submissionConfig.mode === "auto_best"}
                          onChange={() => handleSubmissionModeChange("auto_best")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="auto_best" className="flex-1">
                          <div className="font-medium">Auto Best</div>
                          <div className="text-sm text-muted-foreground">
                            System selects highest score that is not flagged critical
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="random_eligible"
                          name="submission_mode"
                          checked={submissionConfig.mode === "random_eligible"}
                          onChange={() => handleSubmissionModeChange("random_eligible")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="random_eligible" className="flex-1">
                          <div className="font-medium">Random Eligible</div>
                          <div className="text-sm text-muted-foreground">
                            Picks a random non-critical flagged attempt from last 7 days
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Auto Submit</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically submit eligible attempts to SAI
                      </p>
                    </div>
                    <Switch
                      checked={submissionConfig.autoSubmit}
                      onCheckedChange={handleAutoSubmitToggle}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Configuration</h4>
                  <div className="text-sm space-y-1">
                    <div>Mode: <Badge variant="outline">{submissionConfig.mode.replace('_', ' ')}</Badge></div>
                    <div>Auto Submit: <Badge variant={submissionConfig.autoSubmit ? "default" : "secondary"}>
                      {submissionConfig.autoSubmit ? "Enabled" : "Disabled"}
                    </Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benchmark Editor */}
          <TabsContent value="benchmarks" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Benchmark Standards
                  </span>
                  <div className="space-x-2">
                    {editingBenchmarks ? (
                      <>
                        <Button variant="outline" onClick={() => {
                          setTempBenchmarks(benchmarks);
                          setEditingBenchmarks(false);
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={saveBenchmarks}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEditingBenchmarks(true)}>
                        Edit Benchmarks
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Configure performance benchmarks for different age groups and genders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selector */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Test Type</Label>
                    <Select value={selectedTest} onValueChange={(value: TestType) => setSelectedTest(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical_jump">Vertical Jump</SelectItem>
                        <SelectItem value="situps_60s">Sit-ups (60s)</SelectItem>
                        <SelectItem value="shuttle_5x10">Shuttle Run (5×10m)</SelectItem>
                        <SelectItem value="endurance_1_6k">Endurance Run (1.6km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Age Band</Label>
                    <Select value={selectedAge} onValueChange={(value: AgeBand) => setSelectedAge(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="U14">Under 14</SelectItem>
                        <SelectItem value="U16">Under 16</SelectItem>
                        <SelectItem value="U18">Under 18</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={selectedGender} onValueChange={(value: Gender) => setSelectedGender(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Benchmark Values */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Meets Standard</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={currentBenchmark.meet}
                      onChange={(e) => handleBenchmarkChange(e.target.value, 'meet')}
                      disabled={!editingBenchmarks}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Exceeds Standard</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={currentBenchmark.exceed}
                      onChange={(e) => handleBenchmarkChange(e.target.value, 'exceed')}
                      disabled={!editingBenchmarks}
                    />
                  </div>
                </div>

                {editingBenchmarks && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={resetBenchmarks}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                )}

                {/* Preview Table */}
                <div>
                  <Label className="text-base font-medium">All Standards for {selectedTest.replace('_', ' ')}</Label>
                  <div className="mt-3 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Age Band</TableHead>
                          <TableHead>Male (Meet)</TableHead>
                          <TableHead>Male (Exceed)</TableHead>
                          <TableHead>Female (Meet)</TableHead>
                          <TableHead>Female (Exceed)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(["U14", "U16", "U18", "Open"] as AgeBand[]).map((age) => (
                          <TableRow key={age}>
                            <TableCell className="font-medium">{age}</TableCell>
                            <TableCell>{tempBenchmarks[selectedTest][age]["M"].meet}</TableCell>
                            <TableCell>{tempBenchmarks[selectedTest][age]["M"].exceed}</TableCell>
                            <TableCell>{tempBenchmarks[selectedTest][age]["F"].meet}</TableCell>
                            <TableCell>{tempBenchmarks[selectedTest][age]["F"].exceed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Data Export
                  </CardTitle>
                  <CardDescription>
                    Export system data for analysis and backup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => exportCSV('attempts')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Attempts Data
                  </Button>
                  
                  <Button 
                    onClick={() => exportCSV('athletes')} 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Athletes Data
                    <Badge variant="secondary" className="ml-auto">Coming Soon</Badge>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage stored data and system state
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Attempts:</span>
                      <Badge variant="outline">{attempts.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SAI Records:</span>
                      <Badge variant="outline">{api.getSAIDatabase().length}</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    onClick={clearDatabase} 
                    variant="destructive" 
                    className="w-full"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Information */}
          <TabsContent value="system" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Current system status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Application Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Version:</span>
                        <Badge variant="outline">Demo v1.0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Mode:</span>
                        <Badge variant="secondary">Simulated</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <Badge variant="outline">localStorage</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend:</span>
                        <Badge variant="outline">Mock API</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Feature Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Video Recording:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Analysis:</span>
                        <Badge variant="secondary">Mock</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>SAI Integration:</span>
                        <Badge variant="secondary">Simulated</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Real-time Updates:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}