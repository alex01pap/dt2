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
import { ArchitectureDiagram } from "@/components/ui/architecture-diagram";

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
        className="min-h-screen p-6 space-y-12 bg-gradient-to-br from-slate-50 via-white to-slate-100"
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
          <Badge className="text-lg px-4 py-2 bg-primary text-white">
            <Zap className="h-5 w-5 mr-2" />
            From Data to Decisions in Real Time
          </Badge>
        </div>
      </motion.div>

      {/* Vision & Philosophy */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-white">
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

      {/* System Architecture Diagram */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers className="h-6 w-6 text-primary" />
              System Architecture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ArchitectureDiagram />
          </CardContent>
        </Card>
      </motion.div>

      {/* Technical Stack */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              Technical Stack & Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-primary">Frontend</h3>
                <div className="space-y-2">
                  {['React + TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-purple-600">Backend</h3>
                <div className="space-y-2">
                  {['Supabase', 'PostgreSQL', 'Edge Functions', 'Real-time API'].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-blue-600">Infrastructure</h3>
                <div className="space-y-2">
                  {['Docker', 'Kubernetes', 'AWS/Azure', 'CDN'].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-green-600">IoT Integration</h3>
                <div className="space-y-2">
                  {['MQTT Protocol', 'openHAB', 'InfluxDB', 'WebSocket'].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enterprise Features */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Enterprise Features & Scalability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Multi-Tenant SaaS</h3>
                <p className="text-sm text-muted-foreground">Isolated data per organization with role-based access control</p>
              </div>
              
              <div className="text-center">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Global Scalability</h3>
                <p className="text-sm text-muted-foreground">Horizontally scalable architecture supporting millions of users</p>
              </div>
              
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">SOC 2 compliance with comprehensive audit trails</p>
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