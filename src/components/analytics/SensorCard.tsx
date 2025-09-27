import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Wifi, WifiOff } from "lucide-react";

export interface SensorReading {
  id: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface SensorCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  currentReading?: SensorReading;
  isOnline: boolean;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  thresholds?: {
    min?: number;
    max?: number;
    warning?: number;
    critical?: number;
  };
  className?: string;
  onClick?: (sensorId: string) => void;
}

export function SensorCard({ 
  id,
  name,
  type,
  location,
  currentReading,
  isOnline,
  trend,
  thresholds,
  className,
  onClick 
}: SensorCardProps) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-4 w-4" />;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    
    // Context-aware trend coloring
    if (currentReading?.status === 'critical') return "text-destructive";
    if (currentReading?.status === 'warning') return "text-warning";
    
    return trend.direction === 'up' ? "text-success" : 
           trend.direction === 'down' ? "text-destructive" : 
           "text-muted-foreground";
  };

  const getStatusColor = () => {
    if (!isOnline) return "bg-muted";
    if (!currentReading) return "bg-muted";
    
    switch (currentReading.status) {
      case 'critical':
        return "bg-destructive";
      case 'warning':
        return "bg-warning";
      default:
        return "bg-success";
    }
  };

  return (
    <Card 
      className={cn(
        "card-enterprise cursor-pointer transition-all duration-200 hover:shadow-lg",
        className
      )}
      onClick={() => onClick?.(id)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium truncate">{name}</CardTitle>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
          {currentReading?.status === 'critical' && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Current Reading */}
          <div className="flex items-baseline gap-2">
            {currentReading ? (
              <>
                <span className="text-2xl font-bold">
                  {currentReading.value.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentReading.unit}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">No data</span>
            )}
            
            {trend && (
              <div className={cn("flex items-center gap-1", getTrendColor())}>
                {getTrendIcon()}
                <span className="text-xs font-medium">
                  {trend.percentage.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Status and Meta */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">{type}</div>
              <div className="text-xs text-muted-foreground truncate">
                {location}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
              {currentReading && (
                <Badge variant="outline" className="text-xs">
                  {currentReading.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Last Updated */}
          {currentReading && (
            <div className="text-xs text-muted-foreground">
              Updated {new Date(currentReading.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}