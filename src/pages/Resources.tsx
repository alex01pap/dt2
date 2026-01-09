import { motion } from "framer-motion";
import { FileText, ExternalLink, Github, BookOpen, Code, ArrowRight, ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import { ResearchFindings } from "@/components/research/ResearchFindings";
import { ProjectTimeline } from "@/components/research/ProjectTimeline";
import { ComparisonCharts } from "@/components/research/ComparisonCharts";
import { LessonsLearned } from "@/components/research/LessonsLearned";
import { FutureWork } from "@/components/research/FutureWork";
import { ThesisCredits } from "@/components/research/ThesisCredits";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import { StickyPillNav } from "@/components/layout/StickyPillNav";
import { CTABanner } from "@/components/enterprise/CTABanner";
import { Link } from "react-router-dom";

export default function Resources() {
  const researchPapers = [
    {
      title: "Digital Twin Technology in IoT",
      description: "Comprehensive overview of digital twin implementations in IoT infrastructure",
      type: "Research Paper",
      icon: FileText,
    },
    {
      title: "Real-time Data Synchronization Patterns",
      description: "Best practices for WebSocket-based real-time data streaming",
      type: "Technical Article",
      icon: BookOpen,
    },
    {
      title: "OpenHAB Integration Architecture",
      description: "Design patterns for integrating OpenHAB with external platforms",
      type: "Case Study",
      icon: Code,
    },
  ];

  const tools = [
    {
      name: "Supabase",
      description: "Open source Firebase alternative - Backend as a Service",
      url: "https://supabase.com",
      category: "Backend",
      color: "#34a853",
    },
    {
      name: "OpenHAB",
      description: "Open source smart home automation platform",
      url: "https://www.openhab.org",
      category: "IoT Platform",
      color: "#ea4335",
    },
    {
      name: "Three.js",
      description: "JavaScript 3D library for digital twin visualization",
      url: "https://threejs.org",
      category: "3D Graphics",
      color: "#1a73e8",
    },
    {
      name: "React Three Fiber",
      description: "React renderer for Three.js",
      url: "https://docs.pmnd.rs/react-three-fiber",
      category: "3D Framework",
      color: "#fbbc04",
    },
    {
      name: "TanStack Query",
      description: "Powerful data synchronization for React applications",
      url: "https://tanstack.com/query",
      category: "Data Fetching",
      color: "#9334ea",
    },
    {
      name: "Framer Motion",
      description: "Production-ready animation library for React",
      url: "https://www.framer.com/motion",
      category: "Animation",
      color: "#1a73e8",
    },
  ];

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
            <Link to="/resources" className="text-sm font-medium text-[#1a73e8] transition-colors">
              Case Study
            </Link>
            <Link to="/architecture" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
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
              <span className="text-[#202124]">Case Study</span>
            </nav>
          </FadeInView>

          {/* Title */}
          <FadeInView delay={0.1}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#202124] mb-6">
                Platon Schools <span className="text-[#1a73e8]">Digital Twin</span> Case Study
              </h1>
              <p className="text-lg md:text-xl text-[#5f6368]">
                A comprehensive implementation of IoT-based facility monitoring for educational environments
              </p>
            </div>
          </FadeInView>

        </div>
      </section>

      {/* Sticky Section Navigation */}
      <StickyPillNav
        items={[
          { label: "Research", sectionId: "research-findings" },
          { label: "Comparison", sectionId: "comparison" },
          { label: "Timeline", sectionId: "timeline" },
          { label: "Lessons", sectionId: "lessons" },
          { label: "Future", sectionId: "future-work" },
          { label: "Tech", sectionId: "technology" },
          { label: "References", sectionId: "references" },
          { label: "About", sectionId: "about" },
        ]}
      />

      {/* Research Findings Section */}
      <section id="research-findings" className="px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <ResearchFindings />
        </div>
      </section>

      {/* Comparison Charts Section */}
      <section id="comparison">
        <ComparisonCharts />
      </section>

      {/* Project Timeline Section */}
      <section id="timeline" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Project <span className="text-[#1a73e8]">Timeline</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                From research to implementation - the journey of building a digital twin platform
              </p>
            </div>
          </FadeInView>
          <ProjectTimeline />
        </div>
      </section>

      {/* Lessons Learned Section */}
      <LessonsLearned />

      {/* Future Work Section */}
      <FutureWork />

      {/* Technology Stack Section */}
      <section id="technology" className="px-6 py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Technology <span className="text-[#1a73e8]">Stack</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                Open source tools and frameworks powering the platform
              </p>
            </div>
          </FadeInView>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <StaggerItem key={tool.name}>
                <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  {/* Colored accent bar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: tool.color }}
                  />
                  
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#202124]">{tool.name}</h3>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-[#dadce0] text-[#5f6368]"
                    >
                      {tool.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-[#5f6368] mb-4">{tool.description}</p>
                  
                  <button
                    onClick={() => window.open(tool.url, "_blank")}
                    className="inline-flex items-center gap-1 text-sm text-[#1a73e8] hover:underline"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Research & References Section */}
      <section id="references" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
                Research & <span className="text-[#1a73e8]">References</span>
              </h2>
              <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
                Academic papers and technical articles that informed our architecture
              </p>
            </div>
          </FadeInView>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {researchPapers.map((paper) => (
              <StaggerItem key={paper.title}>
                <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center">
                      <paper.icon className="w-5 h-5 text-[#1a73e8]" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-[#f1f3f4] text-[#5f6368]">
                      {paper.type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-[#202124] mb-2">{paper.title}</h3>
                  <p className="text-sm text-[#5f6368] mb-4">{paper.description}</p>
                  
                  <button className="inline-flex items-center gap-1 text-sm text-[#1a73e8] hover:underline">
                    Read more
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About / Thesis Credits Section */}
      <ThesisCredits />

      {/* CTA Banner */}
      <CTABanner
        title="Explore the live platform"
        description="See the digital twin in action with real-time sensor data and interactive 3D visualization."
        primaryAction={{
          label: "View Dashboard",
          href: "/dashboard"
        }}
      />

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
}
