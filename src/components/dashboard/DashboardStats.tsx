import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

function StatCard({ title, value, description, trend, icon: Icon, isLoading = false }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="card-enterprise">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend > 0;

  return (
    <Card className="card-enterprise hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-success mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive mr-1" />
          )}
          <span className={isPositive ? "text-success" : "text-destructive"}>
            {Math.abs(trend)}%
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  isLoading?: boolean;
}

export function DashboardStats({ isLoading = false }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: "$124,563",
      description: "from last month",
      trend: 12.5,
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: "2,847",
      description: "from last month", 
      trend: 8.2,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      description: "from last month",
      trend: -2.1,
      icon: Target,
    },
    {
      title: "System Health",
      value: "99.2%",
      description: "uptime this month",
      trend: 0.5,
      icon: Activity,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}