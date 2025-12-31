import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  type?: string;
  category?: string;
  isLive?: boolean;
  icon?: LucideIcon;
  variant?: "default" | "temperature" | "humidity" | "pressure" | "flow";
  className?: string;
  onClick?: () => void;
}

const variantGradients = {
  default: "from-primary/20 to-transparent",
  temperature: "from-orange-500/20 to-transparent",
  humidity: "from-blue-500/20 to-transparent",
  pressure: "from-purple-500/20 to-transparent",
  flow: "from-cyan-500/20 to-transparent",
};

export function MetricCard({
  title,
  value,
  unit,
  type,
  category,
  isLive = false,
  icon: Icon,
  variant = "default",
  className,
  onClick,
}: MetricCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "border-border/50 hover:border-primary/30 hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient accent */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-50",
          "bg-gradient-to-br",
          variantGradients[variant]
        )} 
      />
      
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={title}>
              {title}
            </p>
            {type && (
              <Badge variant="secondary" className="mt-1 text-xs font-normal">
                {type.replace("Number:", "")}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {isLive && <StatusIndicator status="live" pulse size="sm" />}
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        
        {category && (
          <p className="text-xs text-muted-foreground mt-2">{category}</p>
        )}
      </CardContent>
    </Card>
  );
}
