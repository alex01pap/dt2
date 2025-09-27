import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Sensors from "./pages/Sensors";
import Rules from "./pages/Rules";
import Scenarios from "./pages/Scenarios";
import Playbook from "./pages/Playback";
import Tutorials from "./pages/Tutorials";
import Admin from "./pages/Admin";
import DigitalTwin from "./pages/DigitalTwin";
import PlatformStatus from "./pages/PlatformStatus";
import Architecture from "./pages/Architecture";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="enterprise-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
            <Route 
              path="/assets" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Assets />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/twin/:id" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DigitalTwin />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sensors" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Sensors />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rules" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Rules />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scenarios" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Scenarios />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/playback" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Playbook />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutorials" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Tutorials />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Admin />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/status" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PlatformStatus />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/architecture" 
                element={
                  <Architecture />
                } 
              />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
