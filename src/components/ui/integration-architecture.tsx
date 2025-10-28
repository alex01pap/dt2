import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link as LinkIcon,
  Zap,
  Database,
  Cloud,
  Activity,
  Shield,
  Radio,
  Wifi,
  Smartphone,
  Server,
} from "lucide-react";

export function IntegrationArchitecture() {
  const integrations = [
    {
      category: "IoT Platforms",
      color: "#10b981",
      icon: LinkIcon,
      items: [
        { name: "OpenHAB", protocol: "REST API", status: "Active" },
        { name: "Home Assistant", protocol: "WebSocket", status: "Planned" },
        { name: "MQTT Broker", protocol: "MQTT v3.1", status: "Active" },
      ],
    },
    {
      category: "Cloud Services",
      color: "#3b82f6",
      icon: Cloud,
      items: [
        { name: "AWS IoT Core", protocol: "HTTPS", status: "Active" },
        { name: "Azure IoT Hub", protocol: "AMQP", status: "Planned" },
        { name: "InfluxDB Cloud", protocol: "HTTP API", status: "Active" },
      ],
    },
    {
      category: "Communication Protocols",
      color: "#f59e0b",
      icon: Radio,
      items: [
        { name: "WebSocket", protocol: "WSS", status: "Active" },
        { name: "MQTT", protocol: "TCP/IP", status: "Active" },
        { name: "REST API", protocol: "HTTPS", status: "Active" },
      ],
    },
    {
      category: "Third-party APIs",
      color: "#8b5cf6",
      icon: Zap,
      items: [
        { name: "Stripe Billing", protocol: "REST API", status: "Active" },
        { name: "SendGrid Email", protocol: "SMTP/API", status: "Active" },
        { name: "Twilio SMS", protocol: "REST API", status: "Planned" },
      ],
    },
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "TLS 1.3 for all data in transit",
    },
    {
      icon: Database,
      title: "Data Isolation",
      description: "Row-level security per organization",
    },
    {
      icon: Activity,
      title: "API Rate Limiting",
      description: "Protection against abuse",
    },
    {
      icon: Server,
      title: "Audit Logging",
      description: "Complete activity trail",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Integration Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 border-t-4 h-full" style={{ borderTopColor: integration.color }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${integration.color}20` }}
                  >
                    <integration.icon className="h-6 w-6" style={{ color: integration.color }} />
                  </div>
                  <h3 className="font-bold text-lg">{integration.category}</h3>
                </div>

                <div className="space-y-2">
                  {integration.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.protocol}</div>
                      </div>
                      <Badge
                        variant={item.status === "Active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security Features */}
      <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security & Compliance
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* OpenHAB Integration Highlight */}
      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <LinkIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">OpenHAB Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Seamless connection to your OpenHAB smart home platform with real-time bidirectional sync.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-background/50">
                <div className="font-semibold text-sm">Auto Discovery</div>
                <div className="text-xs text-muted-foreground">Detect all OpenHAB items</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <div className="font-semibold text-sm">Real-time Sync</div>
                <div className="text-xs text-muted-foreground">Instant state updates</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <div className="font-semibold text-sm">Rule Engine</div>
                <div className="text-xs text-muted-foreground">Automated responses</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
