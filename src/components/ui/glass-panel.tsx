import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong";
  glow?: boolean;
  neonBorder?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", glow = false, neonBorder = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "backdrop-blur-xl border transition-all duration-300",
          // Variants
          variant === "default" && "bg-card/60 border-border/50",
          variant === "subtle" && "bg-card/30 border-border/30",
          variant === "strong" && "bg-card/80 border-border/60",
          // Glow effect
          glow && "shadow-glow-md",
          // Neon border
          neonBorder && "neon-border",
          className
        )}
        {...props}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
