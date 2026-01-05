import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowRight, Check, Database, LineChart, Zap, Box, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoTwinViewer } from "@/components/home/DemoTwinViewer";
import { TechnoEconomicAnalysis } from "@/components/home/TechnoEconomicAnalysis";

export default function Home() {
  const [activeTab, setActiveTab] = useState("monitoring");
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Platon Schools</span>
            <Badge variant="outline" className="ml-2 text-xs">Case Study</Badge>
          </div>
          <nav className="flex flex-1 items-center justify-end gap-6">
            <Link to="/tutorials" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </Link>
            <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/architecture" className="text-sm font-medium hover:text-primary transition-colors">
              Architecture
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Hub
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-screen-xl px-8 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="gap-2 py-2 px-4 mb-6">
            <Eye className="h-4 w-4" />
            Case Study: Digital Twin Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Smart School Infrastructure with{" "}
            <span className="text-primary">OpenHAB Integration</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A digital twin platform designed for educational facilities, connecting smart building 
            systems with real-time monitoring, analytics, and automated environmental control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge variant="secondary" className="gap-2 py-2 px-4">
              <Check className="h-4 w-4" />
              Educational Environment
            </Badge>
            <Badge variant="secondary" className="gap-2 py-2 px-4">
              <Check className="h-4 w-4" />
              Smart Building Technology
            </Badge>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="container max-w-screen-xl px-8 py-24 border-t">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="gap-2 py-2 px-4 mb-4">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore a classroom digital twin with real-time sensor data, heat maps, and HVAC visualization.
          </p>
        </div>
        <DemoTwinViewer />
      </section>

      {/* Techno-Economic Analysis */}
      <TechnoEconomicAnalysis />

      {/* Features Section */}
      <section className="container max-w-screen-xl px-8 py-24 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Challenge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating an intelligent building management system for Platon Schools that integrates 
            OpenHAB automation with real-time monitoring and 3D visualization of school facilities.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Real-time Infrastructure Monitoring</h3>
                <p className="text-muted-foreground mb-6">
                  Track every sensor, device, and system in real-time. Get instant alerts when something needs attention, 
                  and visualize your entire infrastructure in beautiful 3D digital twins.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Live data streaming from thousands of IoT sensors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>3D visualization of physical infrastructure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Instant alerts and automated responses</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-8 border">
                <div className="bg-background rounded-lg shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Building A - Floor 3</div>
                      <div className="text-sm text-muted-foreground">sensors@twinvision.io</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm">Hi there,</p>
                    <p className="text-sm">Your infrastructure is live! All systems are operational and data is flowing.</p>
                    <p className="text-sm">Click below to explore your digital twin workspace.</p>
                    <Button className="w-full mt-4">View Dashboard</Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Questions? Our support team is here to help.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Powerful Data Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Transform raw sensor data into actionable insights. Our AI-powered analytics help you 
                  optimize operations, reduce costs, and predict maintenance needs before issues arise.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>AI-driven predictive maintenance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Custom dashboards and reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Historical trend analysis</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-8 border flex items-center justify-center h-80">
                <LineChart className="h-32 w-32 text-muted-foreground/20" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Smart Automation Rules</h3>
                <p className="text-muted-foreground mb-6">
                  Create intelligent automation rules that respond to real-world conditions. 
                  Optimize energy usage, ensure safety compliance, and improve operational efficiency.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Visual rule builder - no coding required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Multi-system orchestration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Energy optimization algorithms</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg p-8 border flex items-center justify-center h-80">
                <Zap className="h-32 w-32 text-muted-foreground/20" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Platform Integration Section */}
      <section className="container max-w-screen-xl px-8 py-24 border-t">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built with Modern IoT Technologies
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Integrated with industry-leading platforms for reliable smart building management.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Supabase</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Box className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">OpenHAB</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Grafana</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">MQTT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container max-w-screen-xl px-8 py-32 border-t">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Results
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            A comprehensive smart school platform that optimizes energy usage, monitors environmental 
            conditions, and provides real-time insights for better facility management.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Real-time</div>
              <div className="text-muted-foreground">Data synchronization from OpenHAB</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">3D</div>
              <div className="text-muted-foreground">Interactive digital twin visualization</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Automated</div>
              <div className="text-muted-foreground">Rule-based control & monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container max-w-screen-xl px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Platon Schools</span>
              <Badge variant="outline" className="text-xs">Case Study</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart building digital twin platform for educational facilities
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link to="/architecture" className="text-muted-foreground hover:text-foreground transition-colors">
                Architecture
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Platon Schools Digital Twin Platform - Case Study
          </div>
        </div>
      </footer>
    </div>
  );
}
