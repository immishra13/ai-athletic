import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Camera, 
  Play, 
  Square, 
  RotateCcw, 
  Brain, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { TEST_CATALOG } from "@/data/tests";
import { analyzeVideo, MockAnalysisResult, calculateBenchmarkLabel } from "@/lib/mockAI";
import { useStore } from "@/store/useStore";
import { AgeBand, Gender, Attempt } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function TestRunner() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const test = TEST_CATALOG.find(t => t.id === testId);
  const athlete = useStore(state => state.athlete);
  const addAttempt = useStore(state => state.addAttempt);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MockAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [comparisonAge, setComparisonAge] = useState<AgeBand>("U18");
  const [comparisonGender, setComparisonGender] = useState<Gender>("M");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!test) {
      navigate("/tests");
      return;
    }
  }, [test, navigate]);

  useEffect(() => {
    // Initialize comparison values from athlete if available
    if (athlete) {
      setComparisonAge(athlete.ageBand);
      setComparisonGender(athlete.gender);
    }
  }, [athlete]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `${testId}_${Date.now()}.webm`, { type: 'video/webm' });
        setVideoFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setRecordingTime(0); // Will be calculated from file
    }
  };

  const analyzePerformance = async () => {
    if (!videoFile || !test || !athlete) {
      toast({
        title: "Missing Information",
        description: "Please ensure video is recorded and athlete profile is complete.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 300);

    try {
      const result = await analyzeVideo(
        test.id as any,
        { 
          duration: recordingTime || 30, // Fallback duration
          filename: videoFile.name 
        },
        athlete.id
      );
      
      setAnalysisResult(result);
      setAnalysisProgress(100);
      
      toast({
        title: "Analysis Complete",
        description: `Performance analyzed with ${Math.round(result.confidence * 100)}% confidence`,
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  const saveAttempt = () => {
    if (!analysisResult || !test || !athlete) return;

    const benchmarkLabel = calculateBenchmarkLabel(
      analysisResult.score,
      test.id as any,
      comparisonAge,
      comparisonGender
    );

    const attempt: Attempt = {
      id: `attempt_${Date.now()}`,
      athleteId: athlete.id,
      test: test.id as any,
      date: Date.now(),
      raw: {
        durationSec: recordingTime,
        fps: 30, // Mock FPS
        cutsDetected: analysisResult.flags.cuts || false
      },
      score: analysisResult.score,
      unit: analysisResult.unit,
      flags: analysisResult.flags,
      benchmarkLabel,
      submitToSAI: true // Default to submit
    };

    addAttempt(attempt);
    
    toast({
      title: "Attempt Saved",
      description: `${test.name} performance saved successfully`,
    });

    // Reset for next attempt
    setVideoFile(null);
    setAnalysisResult(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBenchmarkLabel = () => {
    if (!analysisResult || !test) return null;
    
    return calculateBenchmarkLabel(
      analysisResult.score,
      test.id as any,
      comparisonAge,
      comparisonGender
    );
  };

  if (!test) return null;

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{test.name}</h1>
          <p className="text-lg text-muted-foreground">{test.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recording Panel */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Video Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Display */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white font-medium">
                      REC {formatTime(recordingTime)}
                    </span>
                  </div>
                )}
                {!isRecording && !videoFile && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Camera will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} variant="athletic">
                    <Play className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive">
                    <Square className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </span>
                  </Button>
                </label>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setVideoFile(null);
                    setAnalysisResult(null);
                    setRecordingTime(0);
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {videoFile && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Video ready: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Analysis Panel */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                AI Analysis
                <Badge variant="secondary" className="ml-2 text-xs">Mock</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analysis Button */}
              <Button 
                onClick={analyzePerformance}
                disabled={!videoFile || isAnalyzing}
                variant="default"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Performance
                  </>
                )}
              </Button>

              {/* Progress */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing video... {Math.round(analysisProgress)}%
                  </p>
                </div>
              )}

              {/* Results */}
              {analysisResult && (
                <div className="space-y-4">
                  <Separator />
                  
                  {/* Score */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {analysisResult.score} {analysisResult.unit}
                    </div>
                    <Badge 
                      variant={getBenchmarkLabel() === "Exceeds" ? "default" : getBenchmarkLabel() === "Meets" ? "secondary" : "destructive"}
                      className="text-sm"
                    >
                      {getBenchmarkLabel()} Standard
                    </Badge>
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium">{Math.round(analysisResult.confidence * 100)}%</span>
                  </div>

                  {/* Processing Time */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="font-medium">{analysisResult.processingTime}ms</span>
                  </div>

                  {/* Flags */}
                  {Object.entries(analysisResult.flags).some(([_, value]) => value) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <AlertTriangle className="mr-1 h-4 w-4 text-warning" />
                        Quality Flags
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(analysisResult.flags).map(([flag, value]) => 
                          value && (
                            <Badge key={flag} variant="outline" className="text-xs mr-2">
                              {flag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Benchmark Comparison */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Benchmark Comparison</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={comparisonAge} onValueChange={(value: AgeBand) => setComparisonAge(value)}>
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
                      
                      <Select value={comparisonGender} onValueChange={(value: Gender) => setComparisonGender(value)}>
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

                  {/* Save Button */}
                  <Button onClick={saveAttempt} variant="athletic" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Attempt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Setup Requirements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Clock className="mr-2 h-4 w-4 mt-0.5 text-primary" />
                    Minimum recording time: {test.minDuration} seconds
                  </li>
                  <li className="flex items-start">
                    <Camera className="mr-2 h-4 w-4 mt-0.5 text-primary" />
                    Ensure full body is visible in frame
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 mt-0.5 text-primary" />
                    Good lighting and stable camera position
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Performance Steps</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {test.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary font-medium">{index + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}