import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  unit?: string;
  description: string;
  color?: string;
  delay?: number;
  children?: ReactNode;
}

export function MetricCard({
  icon: Icon,
  title,
  value,
  unit = "",
  description,
  color = "#1a73e8",
  delay = 0,
  children,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="bg-white rounded-xl border border-[#dadce0] p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>

      <div className="mb-4">
        {children}
      </div>

      <div className="space-y-1">
        <motion.div
          className="text-3xl font-semibold text-[#202124]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          <CountUpValue value={value} isInView={isInView} />
          <span className="text-xl ml-1">{unit}</span>
        </motion.div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function CountUpValue({ value, isInView }: { value: number; isInView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Handle decimal values
      if (value % 1 !== 0) {
        setCount(Number((easeOut * value).toFixed(1)));
      } else {
        setCount(Math.floor(easeOut * value));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

import { useState, useEffect } from "react";
