import { Eye, Box, Settings, BarChart3, Bell, Cpu } from "lucide-react";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";

const features = [
  {
    icon: Eye,
    title: "Monitor",
    description: "Track real-time sensor data across your entire facility. Temperature, humidity, air quality, occupancy — all in one unified view.",
  },
  {
    icon: Box,
    title: "Visualize",
    description: "See your buildings in immersive 3D. Navigate floor plans, locate sensors spatially, and understand data in context.",
  },
  {
    icon: Settings,
    title: "Control",
    description: "Automate responses based on conditions. Set rules for HVAC, lighting, and alerts that react intelligently to sensor readings.",
  },
];

export function DigitalTwinExplainer() {
  return (
    <section className="container max-w-screen-xl px-6 py-24">
      <div className="text-center mb-16">
        <FadeInView>
          <p className="text-sm font-medium text-primary mb-3">THE CONCEPT</p>
        </FadeInView>
        <ScaleInView delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            What is a <span className="text-primary">Digital Twin</span>?
          </h2>
        </ScaleInView>
        <FadeInView delay={0.2}>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A digital twin is a virtual replica of your physical infrastructure, 
            connected to real-time data for smarter facility management.
          </p>
        </FadeInView>
      </div>

      <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
