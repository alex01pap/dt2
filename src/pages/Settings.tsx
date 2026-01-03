import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Box } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DigitalTwinsManager } from "@/components/admin/DigitalTwinsManager";
import { OpenHABIntegration } from "@/components/admin/OpenHABIntegration";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage twins, integrations, and preferences
        </p>
      </div>

      <Tabs defaultValue="twins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="twins">
            <Box className="h-4 w-4 mr-2" />
            Twins
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="h-4 w-4 mr-2" />
            OpenHAB
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </TabsTrigger>
        </TabsList>

        {/* Digital Twins Management */}
        <TabsContent value="twins" className="space-y-6">
          <DigitalTwinsManager />
        </TabsContent>

        {/* OpenHAB Integration */}
        <TabsContent value="integrations" className="space-y-6">
          <OpenHABIntegration />
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>
                Configure your general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh sensor data
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-alerts">Sound alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound for critical alerts
                  </p>
                </div>
                <Switch id="sound-alerts" />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>
                Choose which alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for important events
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="critical-alerts">Critical alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Immediate notifications for critical issues
                  </p>
                </div>
                <Switch id="critical-alerts" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sensor-alerts">Sensor alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when sensors go offline
                  </p>
                </div>
                <Switch id="sensor-alerts" defaultChecked />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Use the theme toggle in header to switch
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth animations
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
