import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Brain, 
  Smartphone, 
  Globe2, 
  Cpu,
  BarChart3,
  ArrowRight
} from "lucide-react";

interface FutureItem {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium";
  timeline: string;
  icon: any;
  color: string;
  details: string[];
}

const futureItems: FutureItem[] = [
  {
    id: "ml-predictive",
    title: "Machine Learning Integration",
    description: "Predictive maintenance and anomaly detection using sensor data patterns",
    impact: "high",
    timeline: "6-12 months",
    icon: Brain,
    color: "#9334ea",
    details: [
      "Train ML models on historical sensor data",
      "Predict equipment failures before they occur",
      "Automated anomaly detection with configurable thresholds",
      "Integration with notification systems for proactive alerts",
    ],
  },
  {
    id: "mobile-app",
    title: "Mobile Application",
    description: "Native iOS/Android apps for on-the-go monitoring and alerts",
    impact: "high",
    timeline: "3-6 months",
    icon: Smartphone,
    color: "#1a73e8",
    details: [
      "Push notifications for critical events",
      "Offline-capable with data sync",
      "AR overlay for on-site sensor identification",
      "Quick actions for common maintenance tasks",
    ],
  },
  {
    id: "multi-site",
    title: "Multi-Site Federation",
    description: "Centralized management of digital twins across multiple campuses",
    impact: "high",
    timeline: "12-18 months",
    icon: Globe2,
    color: "#34a853",
    details: [
      "Hierarchical organization structure",
      "Cross-site analytics and benchmarking",
      "Unified dashboard for district-wide view",
      "Role-based access across multiple locations",
    ],
  },
  {
    id: "edge-computing",
    title: "Edge Computing Layer",
    description: "Local processing for reduced latency and improved reliability",
    impact: "medium",
    timeline: "6-9 months",
    icon: Cpu,
    color: "#ea4335",
    details: [
      "On-premise data processing for sensitive environments",
      "Reduced cloud dependency for critical operations",
      "Local caching for intermittent connectivity",
      "Hybrid cloud-edge architecture",
    ],
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics Dashboard",
    description: "Energy consumption forecasting and optimization recommendations",
    impact: "medium",
    timeline: "3-6 months",
    icon: BarChart3,
    color: "#fbbc04",
    details: [
      "Energy usage forecasting based on occupancy patterns",
      "Automated optimization recommendations",
      "Cost-benefit analysis for proposed changes",
      "Comparative benchmarking with similar facilities",
    ],
  },
];

const impactColors = {
  high: { bg: "bg-[#ea4335]/10", text: "text-[#ea4335]" },
  medium: { bg: "bg-[#fbbc04]/10", text: "text-[#fbbc04]" },
};

export function FutureWork() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} id="future-work" className="py-16 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#9334ea]/10 text-[#9334ea] hover:bg-[#9334ea]/20 border-0">
            Research Directions
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
            Future <span className="text-[#1a73e8]">Work</span>
          </h2>
          <p className="text-[#5f6368] max-w-2xl mx-auto">
            Potential extensions and improvements for continued research and development
          </p>
        </motion.div>

        {/* Future Work Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {futureItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card 
                className={`bg-white border border-[#dadce0] p-6 h-full transition-all duration-300 ${
                  hoveredId === item.id ? 'shadow-lg -translate-y-1' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="h-6 w-6" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[#202124]">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge 
                        className={`${impactColors[item.impact].bg} ${impactColors[item.impact].text} border-0`}
                      >
                        {item.impact} impact
                      </Badge>
                      <span className="text-[#5f6368]">{item.timeline}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#5f6368] mb-4">
                  {item.description}
                </p>

                {/* Details list */}
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#5f6368]">
                      <ArrowRight 
                        className="h-3 w-3 mt-0.5 flex-shrink-0" 
                        style={{ color: item.color }} 
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Research Implications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card className="bg-white border border-[#dadce0] p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-6 w-6 text-[#1a73e8]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#202124] mb-2">
                  Research Implications
                </h3>
                <p className="text-sm text-[#5f6368] mb-4">
                  These extensions represent significant opportunities for continued academic research, 
                  including publications on predictive maintenance algorithms, mobile HCI for facility management, 
                  and distributed systems for educational IoT infrastructure.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Machine Learning", "Mobile Computing", "Distributed Systems", "Edge Computing", "Energy Optimization"].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-[#dadce0] text-[#5f6368]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
