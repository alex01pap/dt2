import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "info" | "offline" | "live";
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  success: { color: "bg-success", label: "Connected" },
  warning: { color: "bg-warning", label: "Warning" },
  error: { color: "bg-destructive", label: "Error" },
  info: { color: "bg-primary", label: "Info" },
  offline: { color: "bg-muted-foreground", label: "Offline" },
  live: { color: "bg-success", label: "Live" },
};

const sizeConfig = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function StatusIndicator({ 
  status, 
  label, 
  pulse = false, 
  size = "md",
  className 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div 
          className={cn(
            "rounded-full",
            config.color,
            sizeConfig[size],
            pulse && "animate-pulse"
          )} 
        />
        {pulse && (
          <div 
            className={cn(
              "absolute inset-0 rounded-full opacity-40",
              config.color,
              "animate-ping"
            )} 
          />
        )}
      </div>
      {label !== undefined && (
        <span className="text-sm text-muted-foreground">{label || config.label}</span>
      )}
    </div>
  );
}
