import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  Users, Building2, Box, FileText, RefreshCw, 
  ArrowRight, Clock, CheckCircle, XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  pendingRequests: number;
  totalRequests: number;
  totalOrgs: number;
  totalUsers: number;
  totalTwins: number;
}

export default function AdminOverview() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    pendingRequests: 0,
    totalRequests: 0,
    totalOrgs: 0,
    totalUsers: 0,
    totalTwins: 0,
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = hasRole("admin");

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [requestsRes, orgsRes, profilesRes, twinsRes] = await Promise.all([
        supabase.from("access_requests").select("status"),
        supabase.from("organizations").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("digital_twins").select("id", { count: "exact", head: true }),
      ]);

      const requests = requestsRes.data || [];
      const pendingCount = requests.filter((r) => r.status === "pending").length;

      setStats({
        pendingRequests: pendingCount,
        totalRequests: requests.length,
        totalOrgs: orgsRes.count || 0,
        totalUsers: profilesRes.count || 0,
        totalTwins: twinsRes.count || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Admin access required.</p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: "Access Requests",
      description: "Review and approve user access requests",
      href: "/admin/requests",
      icon: FileText,
      stat: stats.pendingRequests > 0 ? `${stats.pendingRequests} pending` : `${stats.totalRequests} total`,
      badge: stats.pendingRequests > 0 ? (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          {stats.pendingRequests} pending
        </Badge>
      ) : null,
    },
    {
      title: "Organizations",
      description: "Manage tenant organizations",
      href: "/admin/orgs",
      icon: Building2,
      stat: `${stats.totalOrgs} organizations`,
    },
    {
      title: "Users",
      description: "View and manage user accounts",
      href: "/admin/users",
      icon: Users,
      stat: `${stats.totalUsers} users`,
    },
    {
      title: "Digital Twins",
      description: "Overview of all digital twins",
      href: "/admin/digital-twins",
      icon: Box,
      stat: `${stats.totalTwins} twins`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Platform Admin
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Platform Management</h2>
          <p className="text-muted-foreground">
            Manage organizations, users, and platform settings
          </p>
        </div>

        {/* Admin Section Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Link key={section.href} to={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                  {section.badge}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">{section.stat}</span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-semibold">
                  {stats.totalRequests - stats.pendingRequests}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">{stats.pendingRequests}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organizations</p>
                <p className="text-xl font-semibold">{stats.totalOrgs}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Box className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Twins</p>
                <p className="text-xl font-semibold">{stats.totalTwins}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
