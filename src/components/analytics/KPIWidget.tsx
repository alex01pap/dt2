import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle } from "lucide-react";
import { useMemo } from "react";

export interface KPITarget {
  value: number;
  label: string;
  type: 'minimum' | 'maximum' | 'exact';
}

export interface KPIData {
  current: number;
  previous?: number;
  target?: KPITarget;
  format: 'number' | 'percentage' | 'currency' | 'bytes' | 'duration';
  precision?: number;
}

export interface KPIWidgetProps {
  title: string;
  data: KPIData;
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  period?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function KPIWidget({
  title,
  data,
  icon: Icon,
  loading = false,
  period = "vs last period",
  description,
  size = 'md',
  variant = 'default',
  className,
  onClick
}: KPIWidgetProps) {
  const trend = useMemo(() => {
    if (!data.previous || data.previous === 0) return null;
    
    const change = ((data.current - data.previous) / data.previous) * 100;
    const direction = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
    
    return {
      direction,
      percentage: Math.abs(change),
      isImprovement: getImprovementStatus(change, data.target),
    };
  }, [data.current, data.previous, data.target]);

  const targetStatus = useMemo(() => {
    if (!data.target) return null;
    
    const { value, type } = data.target;
    let isMet = false;
    
    switch (type) {
      case 'minimum':
        isMet = data.current >= value;
        break;
      case 'maximum':
        isMet = data.current <= value;
        break;
      case 'exact':
        isMet = Math.abs(data.current - value) <= (value * 0.05); // 5% tolerance
        break;
    }
    
    return { isMet, value, type, label: data.target.label };
  }, [data.current, data.target]);

  function getImprovementStatus(change: number, target?: KPITarget): boolean {
    if (!target) return change > 0;
    
    switch (target.type) {
      case 'minimum':
        return change > 0;
      case 'maximum':
        return change < 0;
      case 'exact':
        return Math.abs(change) < 5; // Moving closer to target
      default:
        return change > 0;
    }
  }

  function formatValue(value: number, format: KPIData['format'], precision = 1): string {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(precision)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: precision,
        }).format(value);
      case 'bytes':
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = value;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        return `${size.toFixed(precision)} ${units[unitIndex]}`;
      case 'duration':
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      default:
        return new Intl.NumberFormat().format(Number(value.toFixed(precision)));
    }
  }

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
    
    return trend.isImprovement ? "text-success" : "text-destructive";
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const titleSizes = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base",
  };

  const valueSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  if (loading) {
    return (
      <Card className={cn("card-enterprise", className)}>
        <CardHeader className={cn(sizeClasses[size], "pb-2")}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className={cn(sizeClasses[size], "pt-0")}>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "card-enterprise",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn(sizeClasses[size], variant === 'compact' && "pb-1")}>
        <CardTitle className={cn("font-medium flex items-center justify-between", titleSizes[size])}>
          <span className="truncate">{title}</span>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            {targetStatus && (
              <div className="flex items-center gap-1">
                <Target className={cn(
                  "h-3 w-3",
                  targetStatus.isMet ? "text-success" : "text-warning"
                )} />
                {!targetStatus.isMet && (
                  <AlertCircle className="h-3 w-3 text-warning" />
                )}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={cn(sizeClasses[size], "pt-0")}>
        <div className="space-y-2">
          {/* Main Value */}
          <div className="flex items-baseline gap-2">
            <span className={cn("font-bold", valueSizes[size])}>
              {formatValue(data.current, data.format, data.precision)}
            </span>
            
            {trend && variant !== 'compact' && (
              <div className={cn("flex items-center gap-1", getTrendColor())}>
                {getTrendIcon()}
                <span className="text-xs font-medium">
                  {trend.percentage.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Trend and Description */}
          {variant !== 'compact' && (
            <div className="space-y-1">
              {trend && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{period}</span>
                  {targetStatus && (
                    <Badge 
                      variant={targetStatus.isMet ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {targetStatus.label}
                    </Badge>
                  )}
                </div>
              )}
              
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}