import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Lock, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTwinViewer } from "@/components/home/DemoTwinViewer";
import { TechnoEconomicAnalysis } from "@/components/home/TechnoEconomicAnalysis";
import { DigitalTwinExplainer } from "@/components/home/DigitalTwinExplainer";
import { ROICalculator } from "@/components/home/ROICalculator";
import { FeatureIconTabs } from "@/components/home/FeatureIconTabs";
import { TrustSection } from "@/components/home/TrustSection";
import { ContactForm } from "@/components/home/ContactForm";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Platon Schools</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/tutorials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link to="/resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
            <Link to="/architecture" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Architecture
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="rounded-full px-5">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Google Style */}
      <section className="container max-w-screen-xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <FadeInView>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Digital Twin Technology
              </div>
            </FadeInView>
            
            <ScaleInView delay={0.1} duration={0.8}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight">
                Transform your school with{" "}
                <span className="text-primary">Digital Twins</span>
              </h1>
            </ScaleInView>
            
            <FadeInView delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Monitor, visualize, and control your school infrastructure in real-time. 
                Reduce energy costs by up to 30% with intelligent building automation.
              </p>
            </FadeInView>
            
            <StaggerContainer className="flex flex-col sm:flex-row gap-4" staggerDelay={0.1}>
              <StaggerItem>
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base gap-2">
                    Contact sales
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Button variant="ghost" size="lg" className="h-12 text-base gap-2 text-primary hover:text-primary hover:bg-primary/5">
                  <Play className="h-4 w-4" />
                  Watch demo
                </Button>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Right: Visual */}
          <FadeInView direction="right" delay={0.3} className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80" 
                alt="Modern school building with smart technology"
                className="w-full h-[400px] object-cover"
              />
              {/* Floating stats cards */}
              <div className="absolute top-6 right-6 bg-background/95 backdrop-blur border border-border rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-semibold text-success">-28%</div>
                <div className="text-sm text-muted-foreground">Energy costs</div>
              </div>
              <div className="absolute bottom-6 left-6 bg-background/95 backdrop-blur border border-border rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-semibold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Real-time monitoring</div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Feature Icon Tabs */}
      <FeatureIconTabs />

      {/* What is a Digital Twin? */}
      <DigitalTwinExplainer />

      {/* Live Demo Section */}
      <section className="bg-muted/30">
        <div className="container max-w-screen-xl px-6 py-24">
          <div className="text-center mb-12">
            <FadeInView>
              <p className="text-sm font-medium text-primary mb-3">INTERACTIVE DEMO</p>
            </FadeInView>
            <ScaleInView delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                See it in action
              </h2>
            </ScaleInView>
            <FadeInView delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore a classroom digital twin with real-time sensor data, heat maps, and HVAC visualization.
              </p>
            </FadeInView>
          </div>
          <FadeInView delay={0.3} duration={0.9}>
            <DemoTwinViewer />
          </FadeInView>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Trust & Security */}
      <TrustSection />

      {/* Techno-Economic Analysis */}
      <TechnoEconomicAnalysis />

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container max-w-screen-xl px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Platon Schools</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link to="/architecture" className="text-muted-foreground hover:text-foreground transition-colors">
                Architecture
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Platon Schools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
