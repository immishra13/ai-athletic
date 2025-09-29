import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Save, Trophy, Flag, Calendar, Upload } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Athlete, AgeBand, Gender } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Profile() {
  const { toast } = useToast();
  const athlete = useStore(state => state.athlete);
  const setAthlete = useStore(state => state.setAthlete);
  const attempts = useStore(state => state.attempts);
  const updateAttempt = useStore(state => state.updateAttempt);
  const getBestAttemptForTest = useStore(state => state.getBestAttemptForTest);

  const [isEditing, setIsEditing] = useState(!athlete);
  const [formData, setFormData] = useState({
    fullName: athlete?.fullName || "",
    ageBand: athlete?.ageBand || "U18" as AgeBand,
    gender: athlete?.gender || "M" as Gender,
    location: athlete?.location || "",
    consent: athlete?.consent || false
  });

  const handleSave = () => {
    if (!formData.fullName || !formData.location || !formData.consent) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill all required fields and accept consent.",
        variant: "destructive"
      });
      return;
    }

    const updatedAthlete: Athlete = {
      id: athlete?.id || `athlete_${Date.now()}`,
      fullName: formData.fullName,
      ageBand: formData.ageBand,
      gender: formData.gender,
      location: formData.location,
      deviceId: athlete?.deviceId || `device_${Math.random().toString(36).substring(7)}`,
      consent: formData.consent,
      createdAt: athlete?.createdAt || Date.now()
    };

    setAthlete(updatedAthlete);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your athlete profile has been saved successfully."
    });
  };

  const handleSubmitToSAI = async (attemptId: string, shouldSubmit: boolean) => {
    updateAttempt(attemptId, { submitToSAI: shouldSubmit });
    
    const attempt = attempts.find(a => a.id === attemptId);
    if (shouldSubmit && attempt && athlete) {
      const result = await api.submitAttempt(attempt, athlete);
      if (result.ok) {
        toast({
          title: "Submitted to SAI",
          description: "Attempt has been submitted for official evaluation."
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Failed to submit attempt.",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getBenchmarkBadge = (label: string) => {
    switch (label) {
      case "Exceeds":
        return <Badge variant="default">Exceeds</Badge>;
      case "Meets":
        return <Badge variant="secondary">Meets</Badge>;
      case "Below":
        return <Badge variant="destructive">Below</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  const getFlagsBadge = (flags: any) => {
    const flagCount = Object.values(flags).filter(Boolean).length;
    if (flagCount === 0) return <Badge variant="outline" className="text-green-600">Clean</Badge>;
    return (
      <Badge variant="destructive" className="cursor-pointer" title={Object.keys(flags).filter(k => flags[k]).join(", ")}>
        <Flag className="mr-1 h-3 w-3" />
        {flagCount}
      </Badge>
    );
  };

  const bestAttempts = [
    "vertical_jump",
    "situps_60s", 
    "shuttle_5x10",
    "endurance_1_6k"
  ].map(testType => getBestAttemptForTest(testType)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Athlete Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile and track your performance history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Information
                  </span>
                  {athlete && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ageBand">Age Band</Label>
                    <Select 
                      value={formData.ageBand} 
                      onValueChange={(value: AgeBand) => setFormData(prev => ({ ...prev, ageBand: value }))}
                      disabled={!isEditing}
                    >
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
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value: Gender) => setFormData(prev => ({ ...prev, gender: value }))}
                      disabled={!isEditing}
                    >
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

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="City, State/Region"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked }))}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="consent" className="text-sm">
                    I consent to data collection and analysis for sports assessment
                  </Label>
                </div>

                {athlete && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div><strong>Device ID:</strong> {athlete.deviceId}</div>
                      <div><strong>Created:</strong> {formatDate(athlete.createdAt)}</div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Best Official Scores */}
            {bestAttempts.length > 0 && (
              <Card className="shadow-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Best Official Scores
                  </CardTitle>
                  <CardDescription>
                    Auto-selected by consistency rule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bestAttempts.map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium capitalize">
                            {attempt.test.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(attempt.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {attempt.score} {attempt.unit}
                          </div>
                          {getBenchmarkBadge(attempt.benchmarkLabel)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Attempts History */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Attempts History
                  </span>
                  <Badge variant="secondary">
                    {attempts.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attempts.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No attempts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by taking a test to see your performance history here
                    </p>
                    <Button variant="default" asChild>
                      <a href="/tests">Take First Test</a>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Benchmark</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead>Submit to SAI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-medium capitalize">
                            {attempt.test.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{formatDate(attempt.date)}</TableCell>
                          <TableCell>
                            {attempt.score} {attempt.unit}
                          </TableCell>
                          <TableCell>
                            {getBenchmarkBadge(attempt.benchmarkLabel)}
                          </TableCell>
                          <TableCell>
                            {getFlagsBadge(attempt.flags)}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={attempt.submitToSAI}
                              onCheckedChange={(checked) => handleSubmitToSAI(attempt.id, checked)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}