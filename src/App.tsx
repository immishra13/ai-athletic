import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import TestCatalog from "./pages/TestCatalog";
import TestRunner from "./pages/TestRunner";
import Profile from "./pages/Profile";
import Officials from "./pages/Officials";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const initializeDemoData = useStore(state => state.initializeDemoData);
  const updateFlaggedCount = useStore(state => state.updateFlaggedCount);

  useEffect(() => {
    initializeDemoData();
    updateFlaggedCount();
  }, [initializeDemoData, updateFlaggedCount]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/tests" 
                element={
                  <>
                    <TopBar />
                    <TestCatalog />
                  </>
                } 
              />
              <Route 
                path="/tests/:testId" 
                element={
                  <>
                    <TopBar />
                    <TestRunner />
                  </>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <>
                    <TopBar />
                    <Profile />
                  </>
                } 
              />
              <Route 
                path="/officials" 
                element={
                  <>
                    <TopBar />
                    <Officials />
                  </>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <>
                    <TopBar />
                    <Admin />
                  </>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
