import { motion } from "framer-motion";
import {
  Database,
  Cloud,
  Monitor,
  Zap,
  Shield,
  Users,
  Server,
  Globe,
  Lock,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Link as LinkIcon,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface LayerProps {
  title: string;
  items: {
    icon: any;
    name: string;
    description: string;
    color: string;
  }[];
  delay?: number;
}

const Layer = ({ title, items, delay = 0 }: LayerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-3"
    >
      <h3 className="text-lg font-bold text-center mb-4 text-primary">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + idx * 0.1 }}
            className="relative"
          >
            <Card className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 h-full"
              style={{ borderLeftColor: item.color }}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const FlowArrow = ({ direction = "down" }: { direction?: "down" | "right" }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        animate={{
          y: direction === "down" ? [0, 10, 0] : 0,
          x: direction === "right" ? [0, 10, 0] : 0,
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-primary"
      >
        {direction === "down" ? (
          <ArrowDown className="h-8 w-8" />
        ) : (
          <ArrowRight className="h-8 w-8" />
        )}
      </motion.div>
    </div>
  );
};

export function SystemArchitectureDiagram() {
  const presentationLayer = {
    title: "Presentation Layer",
    items: [
      {
        icon: Monitor,
        name: "Web Dashboard",
        description: "React SPA with TypeScript",
        color: "#0ea5e9",
      },
      {
        icon: Globe,
        name: "3D Viewer",
        description: "Three.js Digital Twin",
        color: "#06b6d4",
      },
      {
        icon: Activity,
        name: "Real-time Charts",
        description: "Live data visualization",
        color: "#8b5cf6",
      },
      {
        icon: Users,
        name: "User Management",
        description: "RBAC & Auth UI",
        color: "#ec4899",
      },
    ],
  };

  const applicationLayer = {
    title: "Application Layer",
    items: [
      {
        icon: Zap,
        name: "Rule Engine",
        description: "Event-driven automation",
        color: "#f59e0b",
      },
      {
        icon: Server,
        name: "Edge Functions",
        description: "Serverless compute",
        color: "#10b981",
      },
      {
        icon: LinkIcon,
        name: "OpenHAB Sync",
        description: "IoT integration service",
        color: "#6366f1",
      },
      {
        icon: Activity,
        name: "Analytics Engine",
        description: "Data processing & ML",
        color: "#f97316",
      },
    ],
  };

  const dataLayer = {
    title: "Data Layer",
    items: [
      {
        icon: Database,
        name: "PostgreSQL",
        description: "Primary data store",
        color: "#3b82f6",
      },
      {
        icon: HardDrive,
        name: "Time-series DB",
        description: "Sensor readings",
        color: "#14b8a6",
      },
      {
        icon: Cloud,
        name: "Object Storage",
        description: "File & media storage",
        color: "#8b5cf6",
      },
      {
        icon: Network,
        name: "Real-time API",
        description: "WebSocket streams",
        color: "#ef4444",
      },
    ],
  };

  const infrastructureLayer = {
    title: "Infrastructure & Security Layer",
    items: [
      {
        icon: Shield,
        name: "Auth & RBAC",
        description: "Supabase Auth",
        color: "#22c55e",
      },
      {
        icon: Lock,
        name: "API Gateway",
        description: "Rate limiting & security",
        color: "#dc2626",
      },
      {
        icon: Globe,
        name: "CDN & Load Balancer",
        description: "Global distribution",
        color: "#0891b2",
      },
      {
        icon: Cpu,
        name: "Container Orchestration",
        description: "Kubernetes/Docker",
        color: "#7c3aed",
      },
    ],
  };

  return (
    <div className="space-y-2">
      <Layer {...presentationLayer} delay={0} />
      <FlowArrow />
      <Layer {...applicationLayer} delay={0.2} />
      <FlowArrow />
      <Layer {...dataLayer} delay={0.4} />
      <FlowArrow />
      <Layer {...infrastructureLayer} delay={0.6} />

      {/* Data Flow Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-primary" />
          <span>Bidirectional data flow with real-time updates</span>
        </div>
      </motion.div>
    </div>
  );
}
