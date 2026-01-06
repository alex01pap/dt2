import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ChevronDown, BookOpen, Pencil, Code, TestTube, BarChart3 } from "lucide-react";

interface TimelinePhase {
  id: string;
  title: string;
  period: string;
  icon: typeof BookOpen;
  color: string;
  completed: boolean;
  milestones: string[];
}

const phases: TimelinePhase[] = [
  {
    id: "research",
    title: "Research",
    period: "Month 1-2",
    icon: BookOpen,
    color: "#1a73e8",
    completed: true,
    milestones: [
      "Literature review on digital twin technology",
      "Requirements gathering with stakeholders",
      "Case study methodology selection",
      "Theoretical framework definition",
    ],
  },
  {
    id: "design",
    title: "Design",
    period: "Month 2-3",
    icon: Pencil,
    color: "#ea4335",
    completed: true,
    milestones: [
      "System architecture design",
      "Technology stack evaluation",
      "Security model design",
      "UI/UX prototype development",
    ],
  },
  {
    id: "implementation",
    title: "Implementation",
    period: "Month 3-5",
    icon: Code,
    color: "#fbbc04",
    completed: true,
    milestones: [
      "Frontend development (React, Three.js)",
      "Backend setup (Supabase, PostgreSQL)",
      "IoT integration (OpenHAB, MQTT)",
      "Sensor deployment at Platon Schools",
    ],
  },
  {
    id: "validation",
    title: "Validation",
    period: "Month 5-6",
    icon: TestTube,
    color: "#34a853",
    completed: true,
    milestones: [
      "System testing and debugging",
      "Performance benchmarking",
      "User acceptance testing",
      "Data quality validation",
    ],
  },
  {
    id: "results",
    title: "Results",
    period: "Month 6+",
    icon: BarChart3,
    color: "#9334ea",
    completed: false,
    milestones: [
      "Data analysis and visualization",
      "ROI and impact measurement",
      "Technical documentation",
      "Thesis preparation and defense",
    ],
  },
];

export function ProjectTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  return (
    <div ref={ref} className="py-12">
      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        {/* Animated Line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-[#dadce0]">
          <motion.div
            className="h-full bg-[#1a73e8]"
            initial={{ width: "0%" }}
            animate={isInView ? { width: "80%" } : { width: "0%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        {/* Milestones */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => (
            <TimelineMilestone
              key={phase.id}
              phase={phase}
              index={index}
              isInView={isInView}
              isExpanded={expandedPhase === phase.id}
              onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-4">
        {phases.map((phase, index) => (
          <MobileTimelineItem
            key={phase.id}
            phase={phase}
            index={index}
            isInView={isInView}
            isExpanded={expandedPhase === phase.id}
            onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineMilestoneProps {
  phase: TimelinePhase;
  index: number;
  isInView: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function TimelineMilestone({ phase, index, isInView, isExpanded, onToggle }: TimelineMilestoneProps) {
  const Icon = phase.icon;

  return (
    <motion.div
      className="flex flex-col items-center w-1/5"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
    >
      {/* Circle Marker */}
      <motion.button
        onClick={onToggle}
        className="relative z-10 w-24 h-24 rounded-full bg-white border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg"
        style={{ borderColor: phase.color }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {phase.completed ? (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: phase.color }}
          >
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : null}
        <Icon className="w-6 h-6 mb-1" style={{ color: phase.color }} />
        <span className="text-xs font-medium text-[#202124]">{phase.title}</span>
      </motion.button>

      {/* Period */}
      <span className="mt-3 text-xs text-muted-foreground">{phase.period}</span>

      {/* Expand Indicator */}
      <motion.div
        className="mt-2 text-muted-foreground"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 w-48 bg-white rounded-lg border border-[#dadce0] p-4 shadow-lg overflow-hidden"
          >
            <ul className="space-y-2">
              {phase.milestones.map((milestone, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start gap-2 text-xs text-[#5f6368]"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: phase.color }}
                  />
                  {milestone}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobileTimelineItem({ phase, index, isInView, isExpanded, onToggle }: TimelineMilestoneProps) {
  const Icon = phase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Vertical Line */}
      {index < phases.length - 1 && (
        <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-[#dadce0]" />
      )}

      {/* Circle */}
      <div
        className="absolute left-0 top-2 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: phase.color }}
      >
        {phase.completed ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Icon className="w-3 h-3 text-white" />
        )}
      </div>

      {/* Content */}
      <button
        onClick={onToggle}
        className="w-full text-left bg-white rounded-lg border border-[#dadce0] p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[#202124]">{phase.title}</h4>
            <span className="text-xs text-muted-foreground">{phase.period}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              {phase.milestones.map((milestone, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#5f6368]">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: phase.color }}
                  />
                  {milestone}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
