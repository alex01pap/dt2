import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb,
  ChevronDown,
  Zap,
  Database,
  Shield,
  Gauge,
  Link as LinkIcon
} from "lucide-react";

interface Lesson {
  id: string;
  challenge: string;
  impact: "high" | "medium" | "low";
  description: string;
  resolution: string;
  keyInsight: string;
  icon: any;
  color: string;
}

const lessons: Lesson[] = [
  {
    id: "realtime-sync",
    challenge: "Real-time Data Synchronization",
    impact: "high",
    description: "Initial architecture caused high latency (>500ms) when syncing sensor data to the frontend, resulting in delayed visualizations.",
    resolution: "Implemented WebSocket connections using Supabase Realtime with optimistic updates. Reduced latency to <100ms by using connection pooling and message batching.",
    keyInsight: "Choose real-time infrastructure from day one. Retrofitting real-time capabilities is significantly more complex than building with them initially.",
    icon: Zap,
    color: "#ea4335",
  },
  {
    id: "3d-performance",
    challenge: "3D Visualization Performance",
    impact: "high",
    description: "Complex 3D models caused browser memory issues and frame rate drops below 30fps on mid-range devices, affecting user experience.",
    resolution: "Implemented Level of Detail (LOD) switching, lazy loading of 3D assets, and React Three Fiber performance optimizations including instanced meshes and object pooling.",
    keyInsight: "Always test 3D applications on low-end devices early. Performance optimization is exponentially harder after the architecture is established.",
    icon: Gauge,
    color: "#1a73e8",
  },
  {
    id: "sensor-integration",
    challenge: "Multi-Protocol Sensor Integration",
    impact: "high",
    description: "Different sensors used incompatible protocols (MQTT, Modbus, HTTP), making unified data collection extremely complex.",
    resolution: "Adopted OpenHAB as a middleware abstraction layer. All sensors connect to OpenHAB, which provides a unified REST API for our platform.",
    keyInsight: "A middleware abstraction layer is critical for IoT projects. Direct sensor integration creates unmaintainable spaghetti connections.",
    icon: LinkIcon,
    color: "#34a853",
  },
  {
    id: "data-accuracy",
    challenge: "Sensor Data Drift and Accuracy",
    impact: "medium",
    description: "Temperature and humidity sensors showed gradual drift over time, causing silent data accuracy degradation without any alerts.",
    resolution: "Implemented automated calibration routines with reference sensors, data validation pipelines, and anomaly detection for out-of-range values.",
    keyInsight: "Automated validation prevents silent failures. Never trust sensor data without continuous verification against known baselines.",
    icon: Database,
    color: "#fbbc04",
  },
  {
    id: "security-design",
    challenge: "Multi-Tenant Data Isolation",
    impact: "high",
    description: "Designing secure data isolation for multiple organizations while maintaining query performance was architecturally challenging.",
    resolution: "Leveraged Supabase Row Level Security (RLS) policies with organization-based scoping. All queries automatically filter by user context.",
    keyInsight: "Database-level security (RLS) simplifies application code significantly. Security should be enforced at the data layer, not just the API layer.",
    icon: Shield,
    color: "#9334ea",
  },
];

const impactColors = {
  high: { bg: "bg-[#ea4335]/10", text: "text-[#ea4335]" },
  medium: { bg: "bg-[#fbbc04]/10", text: "text-[#fbbc04]" },
  low: { bg: "bg-[#34a853]/10", text: "text-[#34a853]" },
};

export function LessonsLearned() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section ref={ref} id="lessons" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#fbbc04]/10 text-[#fbbc04] hover:bg-[#fbbc04]/20 border-0">
            Implementation Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lessons <span className="text-[#1a73e8]">Learned</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Challenges faced during implementation and the insights gained—valuable for academic discussion and future projects
          </p>
        </motion.div>

        {/* Lessons Cards */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {lessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card 
                className={`bg-white border border-[#dadce0] overflow-hidden transition-shadow ${
                  expandedId === lesson.id ? 'shadow-md' : 'hover:shadow-sm'
                }`}
              >
                {/* Header - Always visible */}
                <button
                  onClick={() => toggleExpand(lesson.id)}
                  className="w-full p-5 flex items-start gap-4 text-left"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${lesson.color}15` }}
                  >
                    <lesson.icon className="h-6 w-6" style={{ color: lesson.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-base">{lesson.challenge}</h3>
                      <Badge 
                        className={`${impactColors[lesson.impact].bg} ${impactColors[lesson.impact].text} border-0 text-xs`}
                      >
                        {lesson.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedId === lesson.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 mt-1"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence>
                  {expandedId === lesson.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[#dadce0]">
                        {/* Resolution */}
                        <div className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-[#34a853]" />
                            <span className="font-semibold text-sm text-[#34a853]">Resolution</span>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">
                            {lesson.resolution}
                          </p>
                        </div>

                        {/* Key Insight */}
                        <div 
                          className="p-4 rounded-lg border-l-4"
                          style={{ 
                            borderLeftColor: lesson.color,
                            backgroundColor: `${lesson.color}08`
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4" style={{ color: lesson.color }} />
                            <span className="font-semibold text-sm" style={{ color: lesson.color }}>
                              Key Insight
                            </span>
                          </div>
                          <p className="text-sm">
                            {lesson.keyInsight}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <Card className="p-5 bg-[#f8f9fa] border border-[#dadce0] text-center">
            <div className="text-3xl font-bold text-[#ea4335] mb-1">5</div>
            <div className="text-sm text-muted-foreground">Major Challenges</div>
          </Card>
          <Card className="p-5 bg-[#f8f9fa] border border-[#dadce0] text-center">
            <div className="text-3xl font-bold text-[#34a853] mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Successfully Resolved</div>
          </Card>
          <Card className="p-5 bg-[#f8f9fa] border border-[#dadce0] text-center">
            <div className="text-3xl font-bold text-[#1a73e8] mb-1">5</div>
            <div className="text-sm text-muted-foreground">Actionable Insights</div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
