import { useMemo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Activity, Plus, ChevronDown, ChevronUp,
  Globe, Users, Server, Shield, Settings as SettingsIcon, Cpu
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDigitalTwins } from "@/hooks/useDigitalTwins";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { cn } from "@/lib/utils";
import { DigitalTwinsManager } from "@/components/admin/DigitalTwinsManager";
import { OpenHABIntegration } from "@/components/admin/OpenHABIntegration";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { SecurityCenter } from "@/components/admin/SecurityCenter";
import { SensorAssignment } from "@/components/admin/SensorAssignment";

const templateIcons: Record<string, string> = {
  classroom: "📚",
  it_classroom: "💻",
  soccer_field: "⚽",
  outdoor: "🌳",
  gymnasium: "🏀",
  restaurant: "🍽️",
};

// Predefined twins to seed if only 1 exists
const defaultTwins = [
  { name: "Gymnasium", template_id: "gymnasium", size: "large", building: "Athletics", tags: ["sports"] },
  { name: "Cafeteria", template_id: "restaurant", size: "large", building: "Main Building", tags: ["dining"] },
  { name: "Computer Lab A", template_id: "it_classroom", size: "medium", building: "Technology Wing", tags: ["IT"] },
  { name: "Science Lab", template_id: "classroom", size: "medium", building: "Science Wing", tags: ["science"] },
  { name: "Outdoor Courtyard", template_id: "outdoor", size: "large", building: "Campus", tags: ["outdoor"] },
];

export default function ImmersiveDashboard() {
  const navigate = useNavigate();
  const { twins, isLoading, createTwin } = useDigitalTwins();
  const { sensors } = useRealtimeSensors();
  const seededRef = useRef(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("twins");

  // Seed default twins if only 1 exists
  useEffect(() => {
    if (!isLoading && twins.length === 1 && !seededRef.current) {
      seededRef.current = true;
      defaultTwins.forEach((twin) => createTwin(twin));
    }
  }, [twins, isLoading, createTwin]);

  // Group sensors by twin_id
  const sensorsByTwin = useMemo(() => {
    const grouped: Record<string, number> = {};
    sensors.forEach((sensor) => {
      if (sensor.twin_id) {
        grouped[sensor.twin_id] = (grouped[sensor.twin_id] || 0) + 1;
      }
    });
    return grouped;
  }, [sensors]);

  const onlineSensors = sensors.filter(s => s.status === "online").length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground">
              {twins.length} twins · {onlineSensors} active sensors
            </p>
          </div>
          <Button onClick={() => setSettingsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Twin
          </Button>
        </div>

        {/* Twins Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-28" />
              </Card>
            ))}
          </div>
        ) : twins.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Box className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Digital Twins Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first twin to get started</p>
            <Button onClick={() => setSettingsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Twin
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {twins.map((twin) => {
              const sensorCount = sensorsByTwin[twin.id] || 0;
              return (
                <Card
                  key={twin.id}
                  className={cn(
                    "group hover:border-primary/50 transition-all cursor-pointer",
                    "hover:shadow-md"
                  )}
                  onClick={() => navigate(`/twin/${twin.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {templateIcons[twin.template_id] || "📦"}
                      </span>
                      <span className="font-medium truncate">{twin.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Activity className="h-3.5 w-3.5 text-green-500" />
                      {sensorCount} sensor{sensorCount !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add New Card */}
            <Card
              className="flex items-center justify-center border-dashed hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer min-h-[100px]"
              onClick={() => setSettingsOpen(true)}
            >
              <CardContent className="p-4 text-center">
                <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                <span className="text-sm text-muted-foreground">Add Twin</span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings & Configuration
              </span>
              {settingsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="space-y-6">
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
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <TabsContent value="twins" className="space-y-6">
                    <DigitalTwinsManager />
                  </TabsContent>

                  <TabsContent value="sensors" className="space-y-6">
                    <SensorAssignment />
                  </TabsContent>

                  <TabsContent value="openhab" className="space-y-6">
                    <OpenHABIntegration />
                  </TabsContent>

                  <TabsContent value="users" className="space-y-6">
                    <UserManagement />
                  </TabsContent>

                  <TabsContent value="system" className="space-y-6">
                    <SystemConfiguration />
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <SecurityCenter />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
}
