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
import Auth from "./pages/Auth";
import ImmersiveDashboard from "./pages/ImmersiveDashboard";
import DigitalTwin from "./pages/DigitalTwin";
import Profile from "./pages/Profile";
import Architecture from "./pages/Architecture";
import Resources from "./pages/Resources";
import ClientDemo from "./pages/ClientDemo";
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
              <Route path="/" element={<Home />} />
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
              <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/client-demo" element={<ClientDemo />} />
              {/* Redirects for old routes */}
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/sensors" element={<Navigate to="/dashboard" replace />} />
              <Route path="/assets" element={<Navigate to="/dashboard" replace />} />
              <Route path="/rules" element={<Navigate to="/dashboard" replace />} />
              <Route path="/scenarios" element={<Navigate to="/dashboard" replace />} />
              <Route path="/playback" element={<Navigate to="/dashboard" replace />} />
              <Route path="/tutorials" element={<Navigate to="/resources" replace />} />
              <Route path="/status" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
