import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTwinViewer } from "@/components/home/DemoTwinViewer";
import { TechnoEconomicAnalysis } from "@/components/home/TechnoEconomicAnalysis";
import { DigitalTwinExplainer } from "@/components/home/DigitalTwinExplainer";
import { ROICalculator } from "@/components/home/ROICalculator";
import { FeatureIconTabs } from "@/components/home/FeatureIconTabs";
import { TrustSection } from "@/components/home/TrustSection";
import { ContactForm } from "@/components/home/ContactForm";
import { FadeInView } from "@/components/ui/scroll-animations";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import heroSmartSchool from "@/assets/hero-smart-school.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section - Google Style */}
      <section className="container max-w-screen-xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Digital Twin Technology
            </div>
            
            {/* Thesis Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground ml-3">
              <GraduationCap className="h-3.5 w-3.5" />
              Diploma Thesis – AUTH
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight">
              Transform your school with{" "}
              <span className="text-primary">Digital Twins</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Monitor, visualize, and control your school infrastructure in real-time. 
              Reduce energy costs by up to 30% with intelligent building automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/request-access">
                <Button size="lg" className="rounded-full px-8 h-12 text-base gap-2">
                  Request Access
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/case-study">
                <Button variant="ghost" size="lg" className="h-12 text-base gap-2 text-muted-foreground hover:text-foreground">
                  <Play className="h-4 w-4" />
                  Case Study
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <FadeInView direction="right" className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30">
              <img 
                src={heroSmartSchool}
                alt="Smart school campus with digital twin IoT sensors and data visualization overlays"
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
            <p className="text-sm font-medium text-primary mb-3">INTERACTIVE DEMO</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore a classroom digital twin with real-time sensor data, heat maps, and HVAC visualization.
            </p>
          </div>
          <DemoTwinViewer />
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Trust & Security */}
      <TrustSection />

      {/* Techno-Economic Analysis */}
      <TechnoEconomicAnalysis />

      {/* Contact Form 
      <ContactForm /> */}

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
}
