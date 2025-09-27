import { useState } from "react";
import { Shield, Users, Settings, Database, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid, StatsCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const [isLoading] = useState(false);

  const systemStats = [
    { title: "System Health", value: "100%", description: "All systems operational", icon: Activity, trend: { value: 0, isPositive: true } },
    { title: "Active Users", value: "1", description: "Currently online", icon: Users },
    { title: "Database", value: "Healthy", description: "Connection stable", icon: Database },
    { title: "Alerts", value: "0", description: "Active issues", icon: AlertTriangle },
  ];

  const adminSections = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      actions: ["View Users", "Add User", "Role Settings"],
    },
    {
      title: "System Configuration",
      description: "Configure system-wide settings and preferences",
      icon: Settings,
      actions: ["General Settings", "Security", "Integrations"],
    },
    {
      title: "Security Center",
      description: "Monitor security events and manage access controls",
      icon: Shield,
      actions: ["Audit Logs", "Access Control", "Security Policies"],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">System administration and management</p>
          </div>
        </div>
        
        <CardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
        
        <CardGrid>
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} className="h-48" />
          ))}
        </CardGrid>
      </div>
    );
  }

  return (
    <RBACGuard permission="canViewAdmin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">System administration and management</p>
          </div>
          
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            System Healthy
          </Badge>
        </div>

        <CardGrid className="lg:grid-cols-4">
          {systemStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </CardGrid>

        <CardGrid className="lg:grid-cols-3">
          {adminSections.map((section) => (
            <Card key={section.title} className="card-enterprise">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.actions.map((action) => (
                    <Button
                      key={action}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 font-normal"
                      onClick={() => console.log(`${action} clicked`)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardGrid>

        {/* Recent Activity */}
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </RBACGuard>
  );
}