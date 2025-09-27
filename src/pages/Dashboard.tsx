import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Thermometer, Zap, Shield, TrendingUp } from "lucide-react";
import { KPIWidget } from "@/components/analytics/KPIWidget";
import { MiniAreaChart } from "@/components/dashboard/MiniAreaChart";
import { RecentEventsTable } from "@/components/dashboard/RecentEventsTable";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeAlerts: 0,
    sensorsOnline: 0,
    totalSensors: 0,
    energyToday: 0,
    comfortScore: 0,
    energyChart: [],
    events: []
  });
  const { user } = useAuthStore();

  // Load dashboard data from database
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load alerts (critical and error events from last 24h)
      const { data: alertsData } = await supabase
        .from('events')
        .select('*')
        .in('severity', ['critical', 'error'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .eq('acknowledged', false);

      // Load sensor status
      const { data: sensorsData } = await supabase
        .from('sensors')
        .select('status');

      const onlineSensors = sensorsData?.filter(s => s.status === 'online').length || 0;
      const totalSensors = sensorsData?.length || 0;

      // Load energy data (from sensor readings - simulated)
      const { data: energyData } = await supabase
        .from('sensor_readings')
        .select('value, recorded_at')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      // Process energy chart data (group by hour)
      const energyChart = [];
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
          energyChart.push({
            time: entry.time,
            value: entry.value / entry.count
          });
        });
      }

      // Load recent events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      const events = eventsData?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        severity: event.severity,
        source: event.source,
        timestamp: new Date(event.created_at),
        acknowledged: event.acknowledged
      })) || [];

      // Calculate comfort score (based on temperature readings in comfort range)
      const { data: comfortData } = await supabase
        .from('sensor_readings')
        .select('value')
        .eq('sensor_id', (await supabase.from('sensors').select('id').eq('type', 'temperature').limit(1)).data?.[0]?.id)
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const comfortReadings = comfortData?.filter(r => r.value >= 20 && r.value <= 24).length || 0;
      const totalReadings = comfortData?.length || 1;
      const comfortScore = Math.round((comfortReadings / totalReadings) * 100);

      setDashboardData({
        activeAlerts: alertsData?.length || 0,
        sensorsOnline: onlineSensors,
        totalSensors,
        energyToday: energyChart.reduce((sum, entry) => sum + entry.value, 0),
        comfortScore,
        energyChart: energyChart.slice(-24), // Last 24 hours
        events
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            current: dashboardData.activeAlerts,
            previous: dashboardData.activeAlerts + 2,
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
            current: dashboardData.totalSensors > 0 ? Math.round((dashboardData.sensorsOnline / dashboardData.totalSensors) * 100) : 0,
            previous: 100,
            format: "percentage",
            precision: 0
          }}
          description={`${dashboardData.sensorsOnline}/${dashboardData.totalSensors} online`}
          period="Current"
          variant="default"
          loading={isLoading}
        />

        <KPIWidget
          title="Energy Today"
          icon={TrendingUp}
          data={{
            current: dashboardData.energyToday,
            previous: dashboardData.energyToday * 1.15,
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
            current: dashboardData.comfortScore,
            previous: dashboardData.comfortScore - 5,
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
            data={dashboardData.energyChart}
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
            events={dashboardData.events}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}