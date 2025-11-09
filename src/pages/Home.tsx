import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowRight, Check, Database, LineChart, Zap, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState("monitoring");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-8">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">TwinVision</span>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <Button>Get started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-screen-xl px-8 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Everything you need to start{" "}
            <span className="text-primary">monitoring your infrastructure</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            TwinVision runs real-time analytics, digital twins, and IoT monitoring for your infrastructure - 
            so it can start learning how to optimize.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge variant="secondary" className="gap-2 py-2 px-4">
              <Check className="h-4 w-4" />
              Built for Enterprise IoT
            </Badge>
            <Button size="lg" className="gap-2">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-screen-xl px-8 py-24 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            You built something people love. Now what?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From first sensor to complete infrastructure, TwinVision powers your digital transformation journey.
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
            TwinVision is designed for IoT builders.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Add TwinVision to your project with simple API integration across your favorite platforms.
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

      {/* Final CTA Section */}
      <section className="container max-w-screen-xl px-8 py-32 border-t">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Automate infrastructure monitoring<br />with TwinVision.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Start connecting sensors and optimizing operations in minutes.<br />
            Built for enterprise IoT infrastructure.
          </p>
          <Button size="lg" className="gap-2">
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container max-w-screen-xl px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              <span className="font-semibold">TwinVision</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Digital twin infrastructure for modern enterprises
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 TwinVision. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
