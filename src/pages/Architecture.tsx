import { motion } from "framer-motion";
import { 
  Building2, 
  Database, 
  Cpu, 
  Cloud, 
  Monitor, 
  Zap, 
  Shield, 
  Users, 
  Settings,
  BarChart3,
  Layers,
  ArrowRight,
  ArrowDown,
  Workflow,
  Eye,
  Lock,
  Globe,
  Smartphone,
  Server,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Architecture() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-background via-background to-muted/20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Digital Twin SaaS Platform
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl text-muted-foreground">
          Conceptual Architecture
        </h2>
        <div className="flex items-center justify-center gap-2">
          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-primary to-purple-600">
            From Data to Decisions in Real Time
          </Badge>
        </div>
      </motion.div>

      {/* Vision & Philosophy */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Eye className="h-6 w-6 text-primary" />
              Vision & Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Layers className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Scalable & Modular</h3>
                <p className="text-sm text-muted-foreground">Reusable components, microservices architecture</p>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Enterprise-Grade SaaS</h3>
                <p className="text-sm text-muted-foreground">Multi-tenant, secure, role-based access control</p>
              </div>
              <div className="space-y-2">
                <Activity className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Real-time Digital Twin</h3>
                <p className="text-sm text-muted-foreground">Live monitoring, playback, scenarios & rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Layered Architecture */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers className="h-6 w-6 text-primary" />
              Layered Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Layer 1: Data Sources */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2 text-primary">Data Sources</h3>
                  <div className="h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-4"></div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Cpu, label: "IoT Devices" },
                    { icon: Activity, label: "Sensors" },
                    { icon: Building2, label: "Building Systems" },
                    { icon: Settings, label: "openHAB" },
                    { icon: Database, label: "CSV/Excel" },
                    { icon: Zap, label: "MQTT" },
                    { icon: BarChart3, label: "InfluxDB" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Layer 2: Data Processing */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2 text-purple-600">Data Ingestion & Processing</h3>
                  <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4"></div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Zap, label: "MQTT/SSE Connectors" },
                    { icon: Shield, label: "Validation (Zod)" },
                    { icon: Database, label: "Storage (Postgres)" },
                    { icon: BarChart3, label: "Timeseries Aggregation" },
                    { icon: Settings, label: "Rule Engine" },
                    { icon: Workflow, label: "Scenario Solver" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                    >
                      <item.icon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Layer 3: Application Layer */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2 text-blue-600">Application Layer</h3>
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4"></div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Server, label: "API (REST)" },
                    { icon: Lock, label: "Auth & RBAC" },
                    { icon: Users, label: "Multi-Tenancy" },
                    { icon: Eye, label: "Audit Logs" },
                    { icon: BarChart3, label: "Observability" },
                    { icon: Globe, label: "Billing (Stripe)" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                    >
                      <item.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Layer 4: User Experience */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2 text-green-600">User Experience</h3>
                  <div className="h-1 bg-gradient-to-r from-green-600 to-primary rounded-full mb-4"></div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Monitor, label: "Web App (React)" },
                    { icon: BarChart3, label: "Dashboard" },
                    { icon: Building2, label: "3D Twin Viewer" },
                    { icon: Cpu, label: "Sensors & Assets" },
                    { icon: Settings, label: "Rules & Scenarios" },
                    { icon: Activity, label: "Real-time Updates" },
                    { icon: Smartphone, label: "Mobile Responsive" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                    >
                      <item.icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flow Arrows */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-8">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                  <ArrowRight className="h-8 w-8 text-purple-600/30" />
                  <ArrowRight className="h-8 w-8 text-blue-600/30" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Flow Diagram */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Workflow className="h-6 w-6 text-primary" />
              Data Flow Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8">
              
              {/* Input Sources */}
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                    <Cpu className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">IoT Sensors</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                    <Building2 className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">openHAB</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">CSV/Excel</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">MQTT</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="h-8 w-8 text-primary hidden lg:block" />
              <ArrowDown className="h-8 w-8 text-primary lg:hidden" />

              {/* Processing Engine */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-600/30">
                  <div className="flex items-center gap-4 mb-4">
                    <Server className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-bold">Processing Engine</h4>
                      <p className="text-sm text-muted-foreground">Validation, Storage, Rules</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Data Validation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="h-4 w-4" />
                      <span>Postgres Storage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Settings className="h-4 w-4" />
                      <span>Rule Engine</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="h-8 w-8 text-primary hidden lg:block" />
              <ArrowDown className="h-8 w-8 text-primary lg:hidden" />

              {/* Output Applications */}
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-600/10 to-blue-600/10 border">
                    <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-600/10 to-blue-600/10 border">
                    <Building2 className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium">3D Twin</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-600/10 to-blue-600/10 border">
                    <Activity className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Monitoring</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-600/10 to-blue-600/10 border">
                    <Workflow className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Scenarios</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Components Philosophy */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers className="h-6 w-6 text-primary" />
              Component Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">Reusable Widgets</h3>
                <div className="space-y-3">
                  {[
                    "KPIWidget - Configurable metrics display",
                    "SensorCard - Real-time sensor monitoring",
                    "EventStream - Live event notifications",
                    "LiveChart - Dynamic data visualization",
                    "RuleBuilder - Visual automation creator",
                    "ScenarioRunner - Simulation controller"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 + i * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-purple-600">Composable Architecture</h3>
                <div className="space-y-3">
                  {[
                    "Modular UI components with consistent API",
                    "Shared design system (Tailwind + shadcn/ui)",
                    "Type-safe props and data contracts",
                    "Responsive design patterns",
                    "Theme-aware styling system",
                    "Accessibility-first implementation"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 + i * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SaaS Enterprise Features */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              SaaS Enterprise Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold">Multi-Tenant Organizations</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Isolated data per organization</li>
                  <li>• Role-based access control</li>
                  <li>• Custom branding options</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold">Enterprise Security</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• API keys & authentication</li>
                  <li>• Audit logs & compliance</li>
                  <li>• Data encryption & backups</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold">Scalable Infrastructure</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Subscription billing (Stripe)</li>
                  <li>• Auto-scaling connectors</li>
                  <li>• Global CDN & performance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center py-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Building2 className="h-5 w-5" />
          <span className="text-sm">Digital Twin SaaS Platform - Enterprise Architecture Overview</span>
        </div>
      </motion.div>
    </motion.div>
  );
}