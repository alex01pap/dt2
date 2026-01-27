import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Wifi, Map, Eye, Plus, LayoutGrid, Building2,
  ChevronDown, ChevronUp, Box, Cpu, Globe, Users, Server, Shield,
  Settings as SettingsIcon
} from "lucide-react";
import { SchoolFloorPlan } from "@/components/floor-plan/SchoolFloorPlan";
import { TwinsGridView } from "@/components/dashboard/TwinsGridView";
import { PlatonCampusViewer } from "@/components/campus/PlatonCampusViewer";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { DigitalTwinsManager } from "@/components/admin/DigitalTwinsManager";
import { OpenHABIntegration } from "@/components/admin/OpenHABIntegration";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { SecurityCenter } from "@/components/admin/SecurityCenter";
import { SensorAssignment } from "@/components/admin/SensorAssignment";

export default function Dashboard() {
  const { sensors, isLoading } = useRealtimeSensors();
  const [activeTab, setActiveTab] = useState("campus");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("twins");
  const navigate = useNavigate();

  const sensorsOnline = sensors.filter(s => s.status === 'online').length;
  const hasData = sensors.length > 0;

  const handleConfigureTwin = (twinId: string) => {
    navigate(`/admin?configure=${twinId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Digital Twin Dashboard
            </h1>
            {sensors.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
                <Wifi className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {sensorsOnline} of {sensors.length} sensors online
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link to="/sensors">
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campus" className="gap-2">
            <Building2 className="h-4 w-4" />
            Campus
          </TabsTrigger>
          <TabsTrigger value="twins" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            All Twins
          </TabsTrigger>
          <TabsTrigger value="floorplan" className="gap-2">
            <Map className="h-4 w-4" />
            Floor Plan
          </TabsTrigger>
        </TabsList>

        {/* Campus 3D View */}
        <TabsContent value="campus" className="mt-6">
          <PlatonCampusViewer 
            onBuildingSelect={(building) => navigate(`/twin/${building.id}`)}
          />
        </TabsContent>

        {/* Twins Grid View */}
        <TabsContent value="twins" className="mt-6">
          <TwinsGridView onConfigureTwin={handleConfigureTwin} />
        </TabsContent>

        {/* Floor Plan View */}
        <TabsContent value="floorplan" className="mt-6">
          {/* Empty State */}
          {!hasData && !isLoading && (
            <Card className="card-enterprise">
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-6 max-w-md mx-auto">
                  <div className="inline-block p-4 rounded-2xl bg-accent/50">
                    <Activity className="h-12 w-12 text-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Welcome to Your Digital Twin</h2>
                    <p className="text-muted-foreground">
                      Add sensors to start monitoring your infrastructure
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Button className="rounded-full" asChild>
                      <Link to="/sensors">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Sensor
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link to="/digital-twin">
                        <Eye className="h-4 w-4 mr-2" />
                        View 3D Twin
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* School Floor Plan */}
          {(hasData || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Map className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Κάτοψη Σχολείου</CardTitle>
                        <CardDescription>Επιλέξτε κτίριο για 3D προβολή</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <Link to="/twin/main-building">
                        <Eye className="h-4 w-4 mr-2" />
                        3D View
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <SchoolFloorPlan className="min-h-[500px]" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Settings & Configuration Section */}
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
    </motion.div>
  );
}
