import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Activity, Zap, Timer, Clock, Users, Ruler, Scale, Move, ArrowRight, Circle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { TEST_CATALOG } from "@/data/tests";

const iconMap = {
  ArrowUp,
  Activity,
  Zap,
  Timer,
  Ruler,
  Scale,
  Move,
  ArrowRight,
  Circle,
  RotateCcw
};

export default function TestCatalog() {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Test Catalog</h1>
          <p className="text-lg text-muted-foreground">
            Choose a test to begin your performance assessment
          </p>
        </div>

        {/* Test Categories */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-card/30 rounded-lg border">
              <div className="text-2xl font-bold text-primary">{TEST_CATALOG.length}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-card/30 rounded-lg border">
              <div className="text-2xl font-bold text-success">10</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-4 bg-card/30 rounded-lg border">
              <div className="text-2xl font-bold text-warning">5-60</div>
              <div className="text-sm text-muted-foreground">Sec Duration</div>
            </div>
            <div className="text-center p-4 bg-card/30 rounded-lg border">
              <div className="text-2xl font-bold text-accent">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
            </div>
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEST_CATALOG.map((test) => {
            const IconComponent = iconMap[test.icon as keyof typeof iconMap];
            
            return (
              <Card key={test.id} className="test-card group hover-scale relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
                      {test.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {test.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground/80">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    {/* Instructions Preview */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground flex items-center">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        Quick Guide
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                          {test.instructions.slice(0, 2).map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary font-bold">•</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                          {test.instructions.length > 2 && (
                            <li className="text-primary font-medium text-center pt-1">
                              +{test.instructions.length - 2} more steps inside...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Test Details */}
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1.5 h-3 w-3 text-primary" />
                        <span className="font-medium">{test.minDuration}s min</span>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {test.unit}
                      </Badge>
                    </div>

                    {/* Start Button */}
                    <Link to={`/tests/${test.id}`} className="block">
                      <Button 
                        variant="athletic" 
                        className="w-full font-semibold shadow-elegant group-hover:shadow-glow transition-all"
                      >
                        Start Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Info Section */}
        <div className="mt-16 space-y-8">
          <div className="bg-gradient-primary/5 rounded-xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold mb-6 text-center">Assessment Guidelines</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Preparation</h4>
                <p className="text-sm text-muted-foreground">Ensure proper warm-up, comfortable clothing, and clear recording space</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Recording</h4>
                <p className="text-sm text-muted-foreground">Stable camera, good lighting, full body visible throughout the test</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">Advanced motion detection provides instant performance feedback</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-6 border text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Demo Mode:</strong> AI analysis is simulated for demonstration purposes. 
              Real AI processing would analyze movement patterns, form, and accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}