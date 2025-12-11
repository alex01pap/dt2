import { useState, useEffect } from "react";
import { Shield, Users, Settings, Database, Activity, Link as LinkIcon, Video, Box, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid, StatsCard, CardSkeleton } from "@/components/ui/card-grid";
import { RBACGuard } from "@/components/auth/RBACGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpenHABIntegration } from "@/components/admin/OpenHABIntegration";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { SecurityCenter } from "@/components/admin/SecurityCenter";
import { HeroVideoUpload } from "@/components/admin/HeroVideoUpload";
import { TwinCreatorWizard } from "@/components/twin/creator/TwinCreatorWizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Admin() {
  const [isLoading] = useState(false);
  const [twinWizardOpen, setTwinWizardOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSensors: 0,
    openhabConnected: false,
    totalAssets: 0,
    totalTwins: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load user count
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Load sensor count
      const { count: sensorCount } = await supabase
        .from("sensors")
        .select("*", { count: "exact", head: true })
        .eq("status", "online");

      // Load asset count
      const { count: assetCount } = await supabase
        .from("assets")
        .select("*", { count: "exact", head: true });

      // Check OpenHAB connection
      const { data: openhabConfig } = await supabase
        .from("openhab_config")
        .select("enabled")
        .single();

      setStats({
        totalUsers: userCount || 0,
        activeSensors: sensorCount || 0,
        openhabConnected: openhabConfig?.enabled || false,
        totalAssets: assetCount || 0,
        totalTwins: 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const systemStats = [
    { 
      title: "Total Users", 
      value: stats.totalUsers.toString(), 
      description: "Registered accounts", 
      icon: Users,
      trend: { value: 0, isPositive: true }
    },
    { 
      title: "Active Sensors", 
      value: stats.activeSensors.toString(), 
      description: "Currently online", 
      icon: Activity 
    },
    { 
      title: "OpenHAB Status", 
      value: stats.openhabConnected ? "Connected" : "Offline", 
      description: stats.openhabConnected ? "Integration active" : "Not configured", 
      icon: LinkIcon 
    },
    { 
      title: "Total Assets", 
      value: stats.totalAssets.toString(), 
      description: "Managed assets", 
      icon: Database 
    },
  ];

  const adminSections = [];

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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="twins">
              <Box className="h-4 w-4 mr-2" />
              Twins
            </TabsTrigger>
            <TabsTrigger value="content">
              <Video className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="openhab">
              <LinkIcon className="h-4 w-4 mr-2" />
              OpenHAB
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CardGrid className="lg:grid-cols-4">
              {systemStats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </CardGrid>

            {/* Recent Activity */}
            <Card className="card-enterprise">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col items-start"
                    onClick={() => {
                      document.querySelector('[value="users"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                    }}
                  >
                    <Users className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">Manage Users</div>
                      <div className="text-xs text-muted-foreground">
                        View and modify user accounts
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col items-start"
                    onClick={() => {
                      document.querySelector('[value="openhab"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                    }}
                  >
                    <LinkIcon className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">OpenHAB Setup</div>
                      <div className="text-xs text-muted-foreground">
                        Configure sensor integration
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col items-start"
                    onClick={() => {
                      document.querySelector('[value="system"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                    }}
                  >
                    <Settings className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">System Settings</div>
                      <div className="text-xs text-muted-foreground">
                        Configure platform settings
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col items-start"
                    onClick={() => {
                      document.querySelector('[value="security"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                    }}
                  >
                    <Shield className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">Security Center</div>
                      <div className="text-xs text-muted-foreground">
                        Monitor security & audit logs
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twins">
            <Card className="card-enterprise">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Digital Twins</CardTitle>
                    <CardDescription>Create and manage your 3D digital twin spaces</CardDescription>
                  </div>
                  <Button onClick={() => setTwinWizardOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Twin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Box className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No digital twins yet</p>
                  <p className="text-sm mb-6">Create your first digital twin to get started</p>
                  <Button onClick={() => setTwinWizardOpen(true)} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Twin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <HeroVideoUpload />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemConfiguration />
          </TabsContent>

          <TabsContent value="security">
            <SecurityCenter />
          </TabsContent>

          <TabsContent value="openhab">
            <OpenHABIntegration />
          </TabsContent>
        </Tabs>

        {/* Twin Creator Wizard */}
        <TwinCreatorWizard
          open={twinWizardOpen}
          onOpenChange={setTwinWizardOpen}
          onComplete={(config) => {
            toast.success(`Digital Twin "${config.name}" created successfully!`);
            // Here you would typically save to database
          }}
        />
      </div>
    </RBACGuard>
  );
}