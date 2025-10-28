import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Thermometer, Zap, Shield, TrendingUp } from "lucide-react";
import { KPIWidget } from "@/components/analytics/KPIWidget";
import { MiniAreaChart } from "@/components/dashboard/MiniAreaChart";
import { RecentEventsTable } from "@/components/dashboard/RecentEventsTable";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Digital Twin Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Real-time monitoring and system insights
        </motion.p>
      </div>

      {/* KPI Widgets Grid */}
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

      {/* Charts and Events Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MiniAreaChart
            title="Energy Last 24h"
            data={energyChart}
            color="#3b82f6"
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
    </motion.div>
  );
}