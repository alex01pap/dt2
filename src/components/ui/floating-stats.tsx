import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatPillProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  color?: "cyan" | "purple" | "pink" | "green";
  className?: string;
}

export function StatPill({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = "cyan",
  className 
}: StatPillProps) {
  const colorClasses = {
    cyan: "text-primary border-primary/20 shadow-glow-sm",
    purple: "text-secondary border-secondary/20 shadow-glow-purple",
    pink: "text-neon-pink border-neon-pink/20 shadow-glow-pink",
    green: "text-success border-success/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel px-4 py-2 flex items-center gap-3",
        "border",
        colorClasses[color],
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      {trend && (
        <div className={cn(
          "text-xs",
          trend === "up" && "text-success",
          trend === "down" && "text-destructive",
          trend === "neutral" && "text-muted-foreground"
        )}>
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
        </div>
      )}
    </motion.div>
  );
}

interface FloatingStatsProps {
  stats: Array<{
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    color?: "cyan" | "purple" | "pink" | "green";
  }>;
  className?: string;
}

export function FloatingStats({ stats, className }: FloatingStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className={cn(
        "flex flex-wrap items-center gap-3",
        className
      )}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatPill {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
