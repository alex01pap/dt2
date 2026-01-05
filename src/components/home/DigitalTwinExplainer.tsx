import { motion } from "framer-motion";
import { Eye, Box, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Eye,
    title: "Monitor",
    description: "Track real-time sensor data across your entire facility. Temperature, humidity, air quality, occupancy — all in one unified view.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Box,
    title: "Visualize",
    description: "See your buildings in immersive 3D. Navigate floor plans, locate sensors spatially, and understand data in context.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Settings,
    title: "Control",
    description: "Automate responses based on conditions. Set rules for HVAC, lighting, and alerts that react intelligently to sensor readings.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export function DigitalTwinExplainer() {
  return (
    <section className="container max-w-screen-xl px-8 py-24 border-t">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="gap-2 py-2 px-4 mb-4">
            The Concept
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What is a Digital Twin?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A digital twin is a virtual replica of your physical infrastructure, 
            connected to real-time data for smarter facility management.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-8 rounded-2xl border bg-card hover:bg-muted/50 transition-all duration-300"
          >
            <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6`}>
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
              <div className={`absolute inset-0 rounded-2xl ${feature.bgColor} blur-xl opacity-30`} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
