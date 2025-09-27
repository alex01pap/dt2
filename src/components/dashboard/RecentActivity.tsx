import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
  type: "success" | "warning" | "info";
}

interface RecentActivityProps {
  isLoading?: boolean;
}

export function RecentActivity({ isLoading = false }: RecentActivityProps) {
  const activities: ActivityItem[] = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      action: "Created new user account",
      timestamp: "2 minutes ago",
      type: "success"
    },
    {
      id: "2", 
      user: {
        name: "Michael Chen",
        email: "michael.chen@company.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      action: "Updated system settings",
      timestamp: "1 hour ago", 
      type: "info"
    },
    {
      id: "3",
      user: {
        name: "Emma Davis",
        email: "emma.davis@company.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      action: "Security alert resolved",
      timestamp: "3 hours ago",
      type: "warning"
    },
    {
      id: "4",
      user: {
        name: "James Wilson",
        email: "james.wilson@company.com", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      action: "Generated monthly report",
      timestamp: "5 hours ago",
      type: "success"
    }
  ];

  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "success": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "info": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  if (isLoading) {
    return (
      <Card className="card-enterprise">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enterprise">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions from your team members
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.timestamp}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={getTypeColor(activity.type)}
            >
              {activity.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}