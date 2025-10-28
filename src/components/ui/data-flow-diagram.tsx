import { motion } from "framer-motion";
import { ArrowRight, Database, Zap, Monitor, Activity, Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DataFlowDiagram() {
  const flows = [
    {
      step: "1",
      title: "Data Ingestion",
      icon: LinkIcon,
      color: "#10b981",
      description: "IoT sensors & OpenHAB push data via MQTT/WebSocket",
    },
    {
      step: "2",
      title: "Processing",
      icon: Zap,
      color: "#f59e0b",
      description: "Edge Functions validate, transform & apply rules",
    },
    {
      step: "3",
      title: "Storage",
      icon: Database,
      color: "#3b82f6",
      description: "Time-series data stored in PostgreSQL with indexing",
    },
    {
      step: "4",
      title: "Real-time Updates",
      icon: Activity,
      color: "#ef4444",
      description: "WebSocket broadcasts to connected clients",
    },
    {
      step: "5",
      title: "Visualization",
      icon: Monitor,
      color: "#8b5cf6",
      description: "React UI updates 3D twin and charts instantly",
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {flows.map((flow, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="relative"
          >
            <Card className="p-6 h-full border-t-4" style={{ borderTopColor: flow.color }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: flow.color }}
                  >
                    {flow.step}
                  </div>
                  <flow.icon className="h-6 w-6" style={{ color: flow.color }} />
                </div>
                <h4 className="font-bold text-sm">{flow.title}</h4>
                <p className="text-xs text-muted-foreground">{flow.description}</p>
              </div>
            </Card>
            
            {idx < flows.length - 1 && (
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10"
              >
                <ArrowRight className="h-6 w-6 text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Latency", value: "<100ms", color: "#10b981" },
          { label: "Throughput", value: "10K/sec", color: "#f59e0b" },
          { label: "Uptime", value: "99.9%", color: "#3b82f6" },
          { label: "Data Points", value: "1M+/day", color: "#8b5cf6" },
        ].map((metric, idx) => (
          <Card key={idx} className="p-4 text-center border-l-4" style={{ borderLeftColor: metric.color }}>
            <div className="text-2xl font-bold" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
