import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Zap, 
  Wrench, 
  Clock, 
  Target, 
  Server, 
  Gauge,
  TrendingUp,
  Activity
} from "lucide-react";
import { RadialProgressChart } from "./RadialProgressChart";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

const savingsData = [
  { month: "Jan", savings: 5 },
  { month: "Feb", savings: 12 },
  { month: "Mar", savings: 15 },
  { month: "Apr", savings: 18 },
  { month: "May", savings: 20 },
  { month: "Jun", savings: 22 },
];

const responseTimeData = [
  { name: "Sensors", value: 45 },
  { name: "Database", value: 23 },
  { name: "UI Update", value: 19 },
];

const metrics = [
  {
    icon: Zap,
    title: "Energy Savings",
    value: 22,
    unit: "%",
    description: "Reduction vs. traditional monitoring",
    color: "#34a853",
    chart: "radial",
  },
  {
    icon: Wrench,
    title: "Maintenance Reduction",
    value: 25,
    unit: "%",
    description: "Annual maintenance cost decrease",
    color: "#ea4335",
    chart: "radial",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: 87,
    unit: "ms",
    description: "Average sensor-to-UI latency",
    color: "#1a73e8",
    chart: "bar",
  },
  {
    icon: Target,
    title: "Data Accuracy",
    value: 98.5,
    unit: "%",
    description: "Sensor reading validation rate",
    color: "#fbbc04",
    chart: "radial",
  },
  {
    icon: Server,
    title: "System Uptime",
    value: 99.95,
    unit: "%",
    description: "Over 6-month validation period",
    color: "#9334ea",
    chart: "radial",
  },
  {
    icon: Gauge,
    title: "Sensors Deployed",
    value: 15,
    unit: "",
    description: "Across 5 monitoring zones",
    color: "#1a73e8",
    chart: "none",
  },
];

export function ResearchFindings() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
          Research <span className="text-[#1a73e8]">Findings</span>
        </h2>
        <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
          Measured outcomes from the 6-month case study implementation at Platon Schools
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            metric={metric}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Cost Savings Chart */}
      <motion.div
        className="mt-12 bg-white rounded-xl border border-[#dadce0] p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#34a853]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#34a853]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#202124]">Cumulative Energy Savings</h3>
            <p className="text-sm text-[#5f6368]">Monthly progression over validation period</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34a853" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34a853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#5f6368', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#5f6368', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Savings']}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#34a853"
                strokeWidth={2}
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}

interface MetricCardProps {
  metric: typeof metrics[0];
  index: number;
  isInView: boolean;
}

function MetricCard({ metric, index, isInView }: MetricCardProps) {
  const Icon = metric.icon;

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${metric.color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: metric.color }} />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {metric.title}
        </span>
      </div>

      <div className="flex items-center justify-center py-4">
        {metric.chart === "radial" ? (
          <RadialProgressChart
            value={metric.value}
            maxValue={100}
            size={100}
            strokeWidth={8}
            color={metric.color}
            unit={metric.unit}
          />
        ) : metric.chart === "bar" ? (
          <div className="w-full h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#5f6368', fontSize: 10 }}
                  width={60}
                />
                <Bar 
                  dataKey="value" 
                  fill={metric.color} 
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8" style={{ color: metric.color }} />
            <CountUpNumber value={metric.value} isInView={isInView} />
            <span className="text-2xl font-semibold">{metric.unit}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-[#5f6368] text-center">{metric.description}</p>
    </motion.div>
  );
}

function CountUpNumber({ value, isInView }: { value: number; isInView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value]);

  return <span ref={ref} className="text-4xl font-semibold text-[#202124]">{count}</span>;
}

import { useState, useEffect } from "react";
