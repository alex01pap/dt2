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
  BarChart3,
  Layers,
  Workflow,
  Eye,
  Lock,
  Globe,
  Server,
  Activity,
  Network,
  GitBranch,
  Code,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemArchitectureDiagram } from "@/components/ui/system-architecture-diagram";
import { DataFlowDiagram } from "@/components/ui/data-flow-diagram";
import { IntegrationArchitecture } from "@/components/ui/integration-architecture";
import { DeploymentArchitecture } from "@/components/ui/deployment-architecture";

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
      className="min-h-screen p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Digital Twin Platform
          </h1>
        </div>
        <h2 className="text-xl md:text-2xl text-muted-foreground">
          Enterprise-Grade IoT & Real-time Monitoring SaaS
        </h2>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge className="px-4 py-2 bg-primary">
            <Zap className="h-4 w-4 mr-2" />
            Real-time
          </Badge>
          <Badge className="px-4 py-2 bg-green-600">
            <LinkIcon className="h-4 w-4 mr-2" />
            OpenHAB Ready
          </Badge>
          <Badge className="px-4 py-2 bg-purple-600">
            <Shield className="h-4 w-4 mr-2" />
            Enterprise Security
          </Badge>
        </div>
      </motion.div>

      {/* Core Principles */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Modular Design</h3>
                <p className="text-sm text-muted-foreground">Microservices architecture with independent scaling</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Real-time First</h3>
                <p className="text-sm text-muted-foreground">WebSocket streams with {'<'}100ms latency</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Security-First</h3>
                <p className="text-sm text-muted-foreground">RBAC, encryption, audit logs, compliance</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Global Scale</h3>
                <p className="text-sm text-muted-foreground">Multi-region deployment, 100K+ concurrent users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Architecture Tabs */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers className="h-6 w-6 text-primary" />
              Technical Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="system">
                  <Layers className="h-4 w-4 mr-2" />
                  System Layers
                </TabsTrigger>
                <TabsTrigger value="dataflow">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Data Flow
                </TabsTrigger>
                <TabsTrigger value="integration">
                  <Network className="h-4 w-4 mr-2" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="deployment">
                  <Server className="h-4 w-4 mr-2" />
                  Deployment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-4">
                <SystemArchitectureDiagram />
              </TabsContent>

              <TabsContent value="dataflow" className="space-y-4">
                <DataFlowDiagram />
              </TabsContent>

              <TabsContent value="integration" className="space-y-4">
                <IntegrationArchitecture />
              </TabsContent>

              <TabsContent value="deployment" className="space-y-4">
                <DeploymentArchitecture />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technology Stack */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="h-6 w-6 text-primary" />
              Production Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-purple-600"></div>
                  <h3 className="font-bold text-lg">Frontend</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'React 18', desc: 'TypeScript' },
                    { name: 'Vite', desc: 'Build tool' },
                    { name: 'Tailwind CSS', desc: 'Styling' },
                    { name: 'Three.js', desc: '3D rendering' },
                    { name: 'Framer Motion', desc: 'Animations' },
                  ].map((tech, i) => (
                    <div key={i} className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  <h3 className="font-bold text-lg">Backend</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Supabase', desc: 'BaaS platform' },
                    { name: 'PostgreSQL 15', desc: 'Database' },
                    { name: 'Edge Functions', desc: 'Deno runtime' },
                    { name: 'Real-time API', desc: 'WebSocket' },
                    { name: 'Row Level Security', desc: 'Data isolation' },
                  ].map((tech, i) => (
                    <div key={i} className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <h3 className="font-bold text-lg">Infrastructure</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Kubernetes', desc: 'Orchestration' },
                    { name: 'Docker', desc: 'Containers' },
                    { name: 'AWS/Azure', desc: 'Cloud hosting' },
                    { name: 'CloudFlare CDN', desc: 'Global delivery' },
                    { name: 'Prometheus', desc: 'Monitoring' },
                  ].map((tech, i) => (
                    <div key={i} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600"></div>
                  <h3 className="font-bold text-lg">IoT & Integration</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'OpenHAB', desc: 'Smart home' },
                    { name: 'MQTT', desc: 'IoT protocol' },
                    { name: 'WebSocket', desc: 'Real-time' },
                    { name: 'REST API', desc: 'HTTP/S' },
                    { name: 'InfluxDB', desc: 'Time-series' },
                  ].map((tech, i) => (
                    <div key={i} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Differentiators */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-primary" />
              Why This Architecture?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Performance & Scale</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Real-time latency:</strong> Sub-100ms for sensor data updates via WebSocket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Horizontal scaling:</strong> Auto-scaling pods handle 100K+ concurrent users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Data throughput:</strong> 50K+ data points per second with time-series optimization</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Security & Compliance</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Multi-tenant isolation:</strong> RLS policies ensure complete data separation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>End-to-end encryption:</strong> TLS 1.3 for transit, AES-256 at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Audit compliance:</strong> Complete activity logs for SOC 2 / GDPR</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Developer Experience</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Type safety:</strong> Full TypeScript coverage from DB to UI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Hot reload:</strong> Instant feedback during development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>API-first:</strong> REST + GraphQL + WebSocket APIs</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Cost Optimization</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Serverless edge:</strong> Pay only for actual compute usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>Efficient caching:</strong> Redis layer reduces DB load by 70%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span><strong>CDN optimization:</strong> 95% of assets served from edge locations</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center py-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Digital Twin Platform - Enterprise Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>• Real-time IoT Monitoring</span>
            <span>• OpenHAB Integration</span>
            <span>• Multi-tenant SaaS</span>
            <span>• 99.95% Uptime SLA</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}