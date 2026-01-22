import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ImmersiveDashboard from "./pages/ImmersiveDashboard";
import DigitalTwin from "./pages/DigitalTwin";
import Profile from "./pages/Profile";
import Architecture from "./pages/Architecture";
import Resources from "./pages/Resources";
import RequestAccess from "./pages/RequestAccess";
import AdminOverview from "./pages/AdminOverview";
import AdminRequests from "./pages/AdminRequests";
import AdminOrgs from "./pages/AdminOrgs";
import AdminUsers from "./pages/AdminUsers";
import AdminDigitalTwins from "./pages/AdminDigitalTwins";
import ClientDemo from "./pages/ClientDemo";
import Author from "./pages/Author";
import BookMeeting from "./pages/BookMeeting";
import SitemapNavigator from "./pages/SitemapNavigator";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="enterprise-theme">
      <LanguageProvider>
        <TooltipProvider>
          <AuthProvider>
            <OrganizationProvider>
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
                  <Route path="/case-study" element={<Resources />} />
                  <Route path="/architecture" element={<Architecture />} />
                  {/* Redirect old route */}
                  <Route path="/resources" element={<Navigate to="/case-study" replace />} />
                  <Route path="/request-access" element={<RequestAccess />} />
                  <Route path="/admin" element={<AdminOverview />} />
                  <Route path="/admin/requests" element={<AdminRequests />} />
                  <Route path="/admin/orgs" element={<AdminOrgs />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/digital-twins" element={<AdminDigitalTwins />} />
                  <Route path="/client-demo" element={<ClientDemo />} />
                  <Route path="/author" element={<Author />} />
                  <Route path="/book-meeting" element={<BookMeeting />} />
                  <Route path="/sensors" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/assets" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/rules" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/scenarios" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/playback" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/tutorials" element={<Navigate to="/case-study" replace />} />
                  <Route path="/status" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/sitemap" element={<SitemapNavigator />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </OrganizationProvider>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
