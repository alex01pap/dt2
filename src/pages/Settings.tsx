import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Box,
  Cpu,
  Workflow,
  Play,
  Users,
  Server,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DigitalTwinsManager } from "@/components/admin/DigitalTwinsManager";
import { OpenHABIntegration } from "@/components/admin/OpenHABIntegration";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { SecurityCenter } from "@/components/admin/SecurityCenter";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("twins");

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
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage twins, sensors, integrations, and all system configurations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-auto p-1 w-max">
            <TabsTrigger value="twins" className="gap-2">
              <Box className="h-4 w-4" />
              Twins
            </TabsTrigger>
            <TabsTrigger value="sensors" className="gap-2">
              <Cpu className="h-4 w-4" />
              Sensors
            </TabsTrigger>
            <TabsTrigger value="openhab" className="gap-2">
              <Globe className="h-4 w-4" />
              OpenHAB
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Workflow className="h-4 w-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2">
              <Play className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Server className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Digital Twins Management */}
        <TabsContent value="twins" className="space-y-6">
          <DigitalTwinsManager />
        </TabsContent>

        {/* Sensors Management */}
        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Management</CardTitle>
              <CardDescription>
                View and manage all sensors. Use OpenHAB tab to sync sensors from your smart home system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sensors are managed through the OpenHAB integration.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("openhab")}
                >
                  Go to OpenHAB
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OpenHAB Integration */}
        <TabsContent value="openhab" className="space-y-6">
          <OpenHABIntegration />
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Create and manage automation rules for your digital twins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rule builder coming soon.</p>
                <p className="text-sm mt-2">Define conditions and actions for automated responses.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Scenarios</CardTitle>
              <CardDescription>
                Create and run simulation scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Scenario runner coming soon.</p>
                <p className="text-sm mt-2">Test your digital twins with simulated data.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-6">
          <SystemConfiguration />
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <SecurityCenter />
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh sensor data</p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-alerts">Sound alerts</Label>
                    <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
                  </div>
                  <Switch id="sound-alerts" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-alerts">Critical alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate notifications</p>
                  </div>
                  <Switch id="critical-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Use header toggle to switch</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable smooth animations</p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Help & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/architecture" target="_blank">
                    View Architecture Docs
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/resources" target="_blank">
                    View Resources
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save All Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
