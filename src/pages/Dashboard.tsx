import { motion } from "framer-motion";
import { Activity, Wifi, Map, Eye, Plus } from "lucide-react";
import { SchoolFloorPlan } from "@/components/floor-plan/SchoolFloorPlan";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { sensors, isLoading } = useRealtimeSensors();

  const sensorsOnline = sensors.filter(s => s.status === 'online').length;
  const hasData = sensors.length > 0;

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
                  <Link to="/digital-twin">
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
    </motion.div>
  );
}
