import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, User, BarChart3, CheckCircle, Upload, Brain, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sports-testing.jpg";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-black/10" />
        <img 
          src={heroImage} 
          alt="Athletes performing sports assessment tests" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
              Test. Verify. Get
              <span className="block gradient-performance bg-clip-text text-transparent">
                Discovered.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              AI-powered sports talent assessment platform. Record your performance, 
              get instant analysis, and connect with scouts and academies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/tests">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Start Test
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <User className="mr-2 h-5 w-5" />
                  View My Profile
                </Button>
              </Link>
              <Link to="/officials">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  SAI Dashboard
                  <Badge variant="secondary" className="ml-2">Demo</Badge>
                </Button>
              </Link>
            </div>

            {/* Demo Notice */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90">
              <Brain className="mr-2 h-4 w-4" />
              <span className="text-sm">This is a demo — AI analysis is simulated</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and accurate. Get your sports performance analyzed in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center p-6 shadow-card hover:shadow-performance transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Record</h3>
                <p className="text-sm text-muted-foreground">
                  Upload video or use live camera to record your performance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-card hover:shadow-performance transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  On-device AI analyzes technique, counts reps, and measures performance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-card hover:shadow-performance transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Score</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant scores with benchmark comparisons and quality flags
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-card hover:shadow-performance transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Submit</h3>
                <p className="text-sm text-muted-foreground">
                  Submit to Sports Assessment Institute for official evaluation
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/tests">
              <Button variant="default" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}