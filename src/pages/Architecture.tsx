import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
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
  ChevronRight,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemArchitectureDiagram } from "@/components/ui/system-architecture-diagram";
import { DataFlowDiagram } from "@/components/ui/data-flow-diagram";
import { IntegrationArchitecture } from "@/components/ui/integration-architecture";
import { DeploymentArchitecture } from "@/components/ui/deployment-architecture";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import { StickyPillNav } from "@/components/layout/StickyPillNav";

const principles = [
  {
    icon: Layers,
    title: "Modular Design",
    description: "Microservices architecture with independent scaling and deployment",
    color: "#1a73e8",
  },
  {
    icon: Activity,
    title: "Real-time First",
    description: "WebSocket streams with <100ms latency for instant updates",
    color: "#34a853",
  },
  {
    icon: Shield,
    title: "Security-First",
    description: "RBAC, encryption, audit logs, and compliance-ready",
    color: "#ea4335",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Multi-region deployment supporting 100K+ concurrent users",
    color: "#fbbc04",
  },
];

const techStack = {
  frontend: {
    color: "#1a73e8",
    items: [
      { name: "React 18", desc: "TypeScript" },
      { name: "Vite", desc: "Build tool" },
      { name: "Tailwind CSS", desc: "Styling" },
      { name: "Three.js", desc: "3D rendering" },
      { name: "Framer Motion", desc: "Animations" },
    ],
  },
  backend: {
    color: "#34a853",
    items: [
      { name: "Supabase", desc: "BaaS platform" },
      { name: "PostgreSQL 15", desc: "Database" },
      { name: "Edge Functions", desc: "Deno runtime" },
      { name: "Real-time API", desc: "WebSocket" },
      { name: "Row Level Security", desc: "Data isolation" },
    ],
  },
  infrastructure: {
    color: "#fbbc04",
    items: [
      { name: "Kubernetes", desc: "Orchestration" },
      { name: "Docker", desc: "Containers" },
      { name: "AWS/Azure", desc: "Cloud hosting" },
      { name: "CloudFlare CDN", desc: "Global delivery" },
      { name: "Prometheus", desc: "Monitoring" },
    ],
  },
  iot: {
    color: "#ea4335",
    items: [
      { name: "OpenHAB", desc: "Smart home" },
      { name: "MQTT", desc: "IoT protocol" },
      { name: "WebSocket", desc: "Real-time" },
      { name: "REST API", desc: "HTTP/S" },
      { name: "InfluxDB", desc: "Time-series" },
    ],
  },
};

const contributions = [
  {
    title: "Novel IoT Integration Pattern",
    description: "Unified middleware approach using OpenHAB for heterogeneous sensor ecosystems",
  },
  {
    title: "Real-time 3D Visualization",
    description: "Performant digital twin rendering with React Three Fiber and LOD optimization",
  },
  {
    title: "Scalable Multi-tenant Architecture",
    description: "Row-level security patterns for educational institution data isolation",
  },
  {
    title: "Predictive Maintenance Framework",
    description: "ML-ready data pipeline for sensor anomaly detection and maintenance forecasting",
  },
];

export default function Architecture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0]">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-[#202124]">Platon Schools</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/resources" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
              Case Study
            </Link>
            <Link to="/architecture" className="text-sm font-medium text-[#1a73e8] transition-colors">
              Architecture
            </Link>
          </nav>
          <Link to="/dashboard">
            <Button size="sm" className="rounded-full px-5 bg-[#1a73e8] hover:bg-[#1557b0]">
              View Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-6 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#1a73e8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#34a853]/10 rounded-full blur-2xl" />

        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <FadeInView>
            <nav className="flex items-center gap-2 text-sm text-[#5f6368] mb-8">
              <Link to="/" className="hover:text-[#1a73e8] transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#202124]">Architecture</span>
            </nav>
          </FadeInView>

          {/* Title */}
          <FadeInView delay={0.1}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#202124] mb-6">
                System <span className="text-[#1a73e8]">Architecture</span>
              </h1>
              <p className="text-lg md:text-xl text-[#5f6368]">
                Enterprise-grade IoT platform built for real-time monitoring, scalability, and security
              </p>
            </div>
          </FadeInView>

          {/* Feature Badges */}
          <FadeInView delay={0.2}>
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              <Badge className="px-4 py-2 bg-[#1a73e8]/10 text-[#1a73e8] hover:bg-[#1a73e8]/20 border-0">
                <Zap className="h-4 w-4 mr-2" />
                Real-time
              </Badge>
              <Badge className="px-4 py-2 bg-[#34a853]/10 text-[#34a853] hover:bg-[#34a853]/20 border-0">
                <LinkIcon className="h-4 w-4 mr-2" />
                OpenHAB Ready
              </Badge>
              <Badge className="px-4 py-2 bg-[#9334ea]/10 text-[#9334ea] hover:bg-[#9334ea]/20 border-0">
                <Shield className="h-4 w-4 mr-2" />
                Enterprise Security
              </Badge>
            </div>
          </FadeInView>

        </div>
      </section>

      {/* Sticky Section Navigation */}
      <StickyPillNav
        items={[
          { label: "Principles", sectionId: "principles" },
          { label: "Technical", sectionId: "technical" },
          { label: "Technology", sectionId: "technology" },
          { label: "Contributions", sectionId: "contributions" },
        ]}
      />

      {/* Core Principles */}
      <section id="principles" className="px-6 py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Core <span className="text-[#1a73e8]">Principles</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                The foundational design principles that guide our architecture decisions
              </p>
            </div>
          </FadeInView>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => (
              <StaggerItem key={principle.title}>
                <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full hover:shadow-lg transition-shadow duration-300 text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${principle.color}15` }}
                  >
                    <principle.icon className="h-8 w-8" style={{ color: principle.color }} />
                  </div>
                  <h3 className="font-semibold text-lg text-[#202124] mb-2">{principle.title}</h3>
                  <p className="text-sm text-[#5f6368]">{principle.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Technical Architecture Tabs */}
      <section id="technical" className="px-6 py-16" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Technical <span className="text-[#1a73e8]">Architecture</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                Explore the system layers, data flow, and integration patterns
              </p>
            </div>
          </FadeInView>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border border-[#dadce0]">
              <CardContent className="p-6">
                <Tabs defaultValue="system" className="space-y-6">
                  <TabsList className="w-full bg-[#f8f9fa] p-1 rounded-lg border border-[#dadce0]">
                    <TabsTrigger 
                      value="system"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      System Layers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="dataflow"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      Data Flow
                    </TabsTrigger>
                    <TabsTrigger 
                      value="integration"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
                      <Network className="h-4 w-4 mr-2" />
                      Integrations
                    </TabsTrigger>
                    <TabsTrigger 
                      value="deployment"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    >
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
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="px-6 py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Technology <span className="text-[#1a73e8]">Stack</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                Production-grade technologies powering the platform
              </p>
            </div>
          </FadeInView>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(techStack).map(([key, category]) => (
              <StaggerItem key={key}>
                <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full relative overflow-hidden">
                  {/* Colored accent bar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: category.color }}
                  />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold text-lg text-[#202124] capitalize">{key}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.items.map((tech, i) => (
                      <div 
                        key={i} 
                        className="p-2 rounded-lg bg-[#f8f9fa] hover:bg-[#f1f3f4] transition-colors"
                      >
                        <div className="font-medium text-sm text-[#202124]">{tech.name}</div>
                        <div className="text-xs text-[#5f6368]">{tech.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Research Contributions */}
      <section id="contributions" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#9334ea]/10 text-[#9334ea] hover:bg-[#9334ea]/20 border-0">
                Academic Value
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Research <span className="text-[#1a73e8]">Contributions</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                Novel approaches and innovations developed during this implementation
              </p>
            </div>
          </FadeInView>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contributions.map((contribution, idx) => (
              <StaggerItem key={contribution.title}>
                <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-[#1a73e8]">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#202124] mb-2">
                        {contribution.title}
                      </h3>
                      <p className="text-sm text-[#5f6368]">{contribution.description}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto">
          <FadeInView>
            <div className="bg-[#1a73e8] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-8 w-16 h-16 border-2 border-white/20 rounded-full" />
              <div className="absolute bottom-4 right-8 w-12 h-12 bg-white/10 rounded-lg rotate-12" />
              
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Explore the case study
              </h3>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                See the research findings, project timeline, and lessons learned from this implementation
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/resources">
                  <Button 
                    size="lg" 
                    className="bg-white text-[#1a73e8] hover:bg-white/90"
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
}
