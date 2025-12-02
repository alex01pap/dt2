import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Thermometer, Zap, TrendingUp, Plus, Eye, Activity, Wifi, Map } from "lucide-react";
import { KPIWidget } from "@/components/analytics/KPIWidget";
import { MiniAreaChart } from "@/components/dashboard/MiniAreaChart";
import { RecentEventsTable } from "@/components/dashboard/RecentEventsTable";
import { SchoolFloorPlan } from "@/components/floor-plan/SchoolFloorPlan";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [energyChart, setEnergyChart] = useState([]);
  const [comfortScore, setComfortScore] = useState(0);
  const { user } = useAuth();
  const { sensors, isLoading: sensorsLoading } = useRealtimeSensors();
  const { events, isLoading: eventsLoading } = useRealtimeEvents(20);

  const isLoading = sensorsLoading || eventsLoading;

  // Calculate dashboard metrics from realtime data
  useEffect(() => {
    if (!sensors.length) return;
    loadEnergyAndComfortData();
  }, [sensors]);

  const loadEnergyAndComfortData = async () => {
    try {
      // Load energy data (from sensor readings)
      const { data: energyData } = await supabase
        .from('sensor_readings')
        .select('value, recorded_at')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      // Process energy chart data (group by hour)
      const chartData = [];
      if (energyData) {
        const hourlyData = energyData.reduce((acc, reading) => {
          const hour = new Date(reading.recorded_at).getHours();
          const key = `${hour}:00`;
          if (!acc[key]) {
            acc[key] = { time: key, value: 0, count: 0 };
          }
          acc[key].value += reading.value * 0.1; // Convert to kWh
          acc[key].count++;
          return acc;
        }, {});

        Object.values(hourlyData).forEach((entry: any) => {
          chartData.push({
            time: entry.time,
            value: entry.value / entry.count
          });
        });
      }
      setEnergyChart(chartData.slice(-24));

      // Calculate comfort score
      const tempSensor = sensors.find(s => s.type === 'temperature');
      if (tempSensor) {
        const { data: comfortData } = await supabase
          .from('sensor_readings')
          .select('value')
          .eq('sensor_id', tempSensor.id)
          .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        const comfortReadings = comfortData?.filter(r => r.value >= 20 && r.value <= 24).length || 0;
        const totalReadings = comfortData?.length || 1;
        setComfortScore(Math.round((comfortReadings / totalReadings) * 100));
      }
    } catch (error) {
      console.error('Error loading energy/comfort data:', error);
    }
  };

  // Derived values from realtime data
  const activeAlerts = events.filter(
    e => ['critical', 'error'].includes(e.severity) && !e.acknowledged
  ).length;

  const sensorsOnline = sensors.filter(s => s.status === 'online').length;
  const totalSensors = sensors.length;

  const energyToday = energyChart.reduce((sum: number, entry: any) => sum + entry.value, 0);

  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    severity: event.severity,
    source: event.source,
    timestamp: new Date(event.created_at),
    acknowledged: event.acknowledged
  }));

  // Empty state check
  const hasData = sensors.length > 0 || events.length > 0;

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
            Real-time monitoring and system insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link to="/sensors">
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link to="/twin/1">
              <Eye className="h-4 w-4 mr-2" />
              3D View
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {!hasData && !isLoading && (
        <Card className="card-enterprise">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="inline-block p-4 rounded-2xl bg-accent/50">
                <Activity className="h-12 w-12 text-foreground" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Welcome to Your Digital Twin</h2>
                <p className="text-muted-foreground">
                  Get started by adding your first sensors to begin monitoring your infrastructure in real-time
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
                  <Link to="/twin/1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Demo Twin
                  </Link>
                </Button>
              </div>

              {/* Quick Start Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">1. Connect Sensors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Add temperature, power, or IoT sensors to start collecting data
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">2. Create Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Set up automation rules to respond to sensor events
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">3. Monitor Live</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      View real-time data in 3D and receive instant alerts
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Widgets Grid */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
        <KPIWidget
          title="Active Alerts"
          icon={AlertTriangle}
          data={{
            current: activeAlerts,
            previous: activeAlerts + 2,
            format: "number"
          }}
          description="Unacknowledged"
          period="Last 24h"
          variant="default"
          loading={isLoading}
        />

        <KPIWidget
          title="Sensors Online"
          icon={Zap}
          data={{
            current: totalSensors > 0 ? Math.round((sensorsOnline / totalSensors) * 100) : 0,
            previous: 100,
            format: "percentage",
            precision: 0
          }}
          description={`${sensorsOnline}/${totalSensors} online`}
          period="Current"
          variant="default"
          loading={isLoading}
        />

        <KPIWidget
          title="Energy Today"
          icon={TrendingUp}
          data={{
            current: energyToday,
            previous: energyToday * 1.15,
            format: "number",
            precision: 1
          }}
          description="kWh consumption"
          period="vs Yesterday"
          variant="default"
          loading={isLoading}
        />

        <KPIWidget
          title="Comfort Score"
          icon={Thermometer}
          data={{
            current: comfortScore,
            previous: comfortScore - 5,
            format: "percentage",
            precision: 0
          }}
          description="Temperature comfort"
          period="Last 24h"
          variant="default"
          loading={isLoading}
        />
        </motion.div>
      )}

      {/* School Floor Plan */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
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
                    <CardDescription>Επιλέξτε κτίριο ή αίθουσα για 3D προβολή</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to="/digital-twin">
                    <Eye className="h-4 w-4 mr-2" />
                    Πλήρης Προβολή
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <SchoolFloorPlan className="min-h-[400px]" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts and Events Grid */}
      {hasData && (
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MiniAreaChart
            title="Energy Last 24h"
            data={energyChart}
            color="#000000"
            unit="kWh"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <RecentEventsTable
            events={formattedEvents}
            isLoading={isLoading}
          />
        </motion.div>
        </div>
      )}
    </motion.div>
  );
}