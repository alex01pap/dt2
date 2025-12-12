import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium rounded-full",
          "transition-all duration-300 active:scale-95",
          "disabled:opacity-50 disabled:pointer-events-none",
          // Size variants
          size === "sm" && "px-4 py-2 text-sm min-h-[36px]",
          size === "md" && "px-6 py-3 text-base min-h-[44px]",
          size === "lg" && "px-8 py-4 text-lg min-h-[52px]",
          // Style variants
          variant === "primary" && [
            "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
            glow && "shadow-glow-md hover:shadow-glow-lg",
            "hover:-translate-y-0.5",
          ],
          variant === "secondary" && [
            "bg-card/60 backdrop-blur-lg border border-border/50 text-foreground",
            "hover:bg-card/80 hover:border-primary/30",
            glow && "hover:shadow-glow-sm",
          ],
          variant === "ghost" && [
            "bg-transparent text-foreground",
            "hover:bg-primary/10 hover:text-primary",
          ],
          className
        )}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
