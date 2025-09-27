import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardGridProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div className={cn(
      "grid gap-4 md:gap-6",
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("card-enterprise", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn(
                "font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface EmptyStateCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyStateCard({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateCardProps) {
  return (
    <Card className={cn("card-enterprise text-center py-12", className)}>
      <CardContent>
        <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription className="mb-4">{description}</CardDescription>
        {action && (
          <button
            onClick={action.onClick}
            className="btn-enterprise px-4 py-2 rounded-md text-sm"
          >
            {action.label}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("card-enterprise", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}