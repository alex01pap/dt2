import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ImmersiveDashboard from "./pages/ImmersiveDashboard";
import DigitalTwin from "./pages/DigitalTwin";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="enterprise-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ImmersiveDashboard />
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
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              {/* Redirects for removed pages */}
              <Route path="/admin" element={<Navigate to="/settings" replace />} />
              <Route path="/sensors" element={<Navigate to="/dashboard" replace />} />
              <Route path="/assets" element={<Navigate to="/dashboard" replace />} />
              <Route path="/rules" element={<Navigate to="/settings" replace />} />
              <Route path="/scenarios" element={<Navigate to="/settings" replace />} />
              <Route path="/playback" element={<Navigate to="/settings" replace />} />
              <Route path="/tutorials" element={<Navigate to="/settings" replace />} />
              <Route path="/status" element={<Navigate to="/settings" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
