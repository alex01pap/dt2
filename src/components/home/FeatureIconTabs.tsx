import { useState } from "react";
import { Eye, Box, Settings, BarChart3, Bell, Cpu } from "lucide-react";
import { 
  FadeInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "monitor",
    icon: Eye,
    label: "Real-time\nMonitoring",
    title: "Track everything in real-time",
    description: "Monitor temperature, humidity, air quality, and occupancy across all rooms with live sensor data streaming.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "visualize",
    icon: Box,
    label: "3D\nVisualization",
    title: "See your building in 3D",
    description: "Navigate through interactive floor plans and see sensor data overlaid on your actual building layout.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "automate",
    icon: Settings,
    label: "Smart\nAutomation",
    title: "Automate with intelligence",
    description: "Create rules that automatically adjust HVAC, lighting, and send alerts based on sensor conditions.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "analyze",
    icon: BarChart3,
    label: "Data\nAnalytics",
    title: "Gain actionable insights",
    description: "Analyze historical trends, predict maintenance needs, and optimize energy consumption patterns.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "alerts",
    icon: Bell,
    label: "Instant\nAlerts",
    title: "Never miss critical events",
    description: "Get notified instantly when conditions exceed thresholds or equipment needs attention.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "integrate",
    icon: Cpu,
    label: "OpenHAB\nIntegration",
    title: "Connect to OpenHAB",
    description: "Seamlessly integrate with your existing OpenHAB setup for unified smart building management.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
];

export function FeatureIconTabs() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container max-w-screen-xl px-6 py-16">
        {/* Icon Tabs */}
        <StaggerContainer className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12" staggerDelay={0.08}>
          {features.map((feature) => (
            <StaggerItem key={feature.id}>
              <button
                onClick={() => setActiveFeature(feature)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 min-w-[100px]",
                  activeFeature.id === feature.id
                    ? "bg-background border border-border shadow-md"
                    : "hover:bg-background/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  activeFeature.id === feature.id ? feature.bgColor : "bg-muted"
                )}>
                  <feature.icon className={cn(
                    "h-6 w-6 transition-colors",
                    activeFeature.id === feature.id ? feature.color : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-medium text-center whitespace-pre-line leading-tight",
                  activeFeature.id === feature.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {feature.label}
                </span>
                {activeFeature.id === feature.id && (
                  <div className="w-8 h-1 rounded-full bg-primary mt-1" />
                )}
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Active Feature Content */}
        <FadeInView key={activeFeature.id} className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {activeFeature.title}
          </h3>
          <p className="text-lg text-muted-foreground">
            {activeFeature.description}
          </p>
        </FadeInView>
      </div>
    </section>
  );
}
