import { useState } from "react";
import { Settings, Save, RefreshCw, Database, Server, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function SystemConfiguration() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "Digital Twin Platform",
    siteUrl: window.location.origin,
    dataRetentionDays: 90,
    autoBackup: true,
    maintenanceMode: false,
    maxUploadSize: 10,
    sessionTimeout: 30,
    apiRateLimit: 1000,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "System configuration has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="card-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="api">API & Limits</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    value={settings.siteUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, siteUrl: e.target.value })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable access for maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, maintenanceMode: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup data daily
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoBackup: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-upload">Max Upload Size (MB)</Label>
                  <Input
                    id="max-upload"
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxUploadSize: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6 pt-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium text-green-600">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium">PostgreSQL 15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm font-medium">Supabase</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention (days)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={settings.dataRetentionDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        dataRetentionDays: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Sensor readings older than this will be archived
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6 pt-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Version</span>
                    <span className="text-sm font-medium">v1.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Endpoint</span>
                    <span className="text-sm font-medium font-mono">
                      /api/v1
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">
                    Rate Limit (requests/hour)
                  </Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apiRateLimit: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum API requests per hour per user
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>CORS Origins</Label>
                  <Input
                    placeholder="https://example.com, https://app.example.com"
                    defaultValue="*"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of allowed origins
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
