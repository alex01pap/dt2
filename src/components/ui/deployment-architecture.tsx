import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Globe,
  Server,
  Database,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Activity,
  Lock,
  HardDrive,
  Cpu,
} from "lucide-react";

export function DeploymentArchitecture() {
  const deploymentLayers = [
    {
      layer: "Edge Layer",
      color: "#10b981",
      components: [
        { name: "Global CDN", icon: Globe, description: "Cloudflare/AWS CloudFront" },
        { name: "Load Balancer", icon: Activity, description: "Geographic distribution" },
        { name: "API Gateway", icon: Shield, description: "Rate limiting & security" },
      ],
    },
    {
      layer: "Application Layer",
      color: "#3b82f6",
      components: [
        { name: "Web Servers", icon: Server, description: "React SPA hosting" },
        { name: "Edge Functions", icon: Zap, description: "Serverless compute" },
        { name: "WebSocket Servers", icon: Activity, description: "Real-time connections" },
      ],
    },
    {
      layer: "Data Layer",
      color: "#8b5cf6",
      components: [
        { name: "Primary DB", icon: Database, description: "PostgreSQL cluster" },
        { name: "Cache Layer", icon: Cpu, description: "Redis/Memcached" },
        { name: "Object Storage", icon: HardDrive, description: "S3-compatible" },
      ],
    },
  ];

  const scalabilityMetrics = [
    {
      icon: Users,
      title: "Concurrent Users",
      value: "100K+",
      description: "Simultaneous connections",
      color: "#10b981",
    },
    {
      icon: Activity,
      title: "Data Points/sec",
      value: "50K+",
      description: "Real-time ingestion",
      color: "#f59e0b",
    },
    {
      icon: Globe,
      title: "Global Regions",
      value: "15+",
      description: "Worldwide coverage",
      color: "#3b82f6",
    },
    {
      icon: TrendingUp,
      title: "Uptime SLA",
      value: "99.95%",
      description: "Enterprise reliability",
      color: "#8b5cf6",
    },
  ];

  const infrastructureFeatures = [
    {
      title: "Auto-scaling",
      description: "Kubernetes HPA scales pods based on CPU/memory",
      icon: TrendingUp,
    },
    {
      title: "High Availability",
      description: "Multi-AZ deployment with automatic failover",
      icon: Shield,
    },
    {
      title: "Disaster Recovery",
      description: "Daily backups with point-in-time recovery",
      icon: Database,
    },
    {
      title: "Monitoring & Alerts",
      description: "Prometheus + Grafana for observability",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Deployment Layers */}
      <div className="space-y-6">
        {deploymentLayers.map((layer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <Card className="p-6 border-l-4" style={{ borderLeftColor: layer.color }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-1 rounded-full text-white font-semibold text-sm"
                    style={{ backgroundColor: layer.color }}
                  >
                    {layer.layer}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {layer.components.map((component, compIdx) => (
                    <div
                      key={compIdx}
                      className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${layer.color}20` }}
                        >
                          <component.icon className="h-5 w-5" style={{ color: layer.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{component.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {component.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scalability Metrics */}
      <Card className="p-6 bg-gradient-to-br from-background to-primary/5">
        <h3 className="font-bold text-lg mb-6">Scalability & Performance</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {scalabilityMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="text-center space-y-3"
            >
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                <metric.icon className="h-8 w-8" style={{ color: metric.color }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="font-semibold text-sm mt-1">{metric.title}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Infrastructure Features */}
      <div className="grid md:grid-cols-2 gap-4">
        {infrastructureFeatures.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + idx * 0.1 }}
          >
            <Card className="p-5 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Technology Stack Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <h3 className="font-bold text-lg mb-4">Production Technology Stack</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="font-semibold text-sm text-primary">Container Orchestration</div>
            <div className="text-sm space-y-1">
              <div>• Kubernetes v1.28+</div>
              <div>• Docker containers</div>
              <div>• Helm charts for deployment</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm text-primary">Database</div>
            <div className="text-sm space-y-1">
              <div>• PostgreSQL 15 (RDS/managed)</div>
              <div>• Read replicas for scaling</div>
              <div>• Automated backups</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm text-primary">Monitoring</div>
            <div className="text-sm space-y-1">
              <div>• Prometheus + Grafana</div>
              <div>• ELK stack for logs</div>
              <div>• Sentry for error tracking</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
