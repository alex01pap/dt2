import { useNavigate } from "react-router-dom";
import { Box, Activity, AlertTriangle, Wifi, Plus, Eye, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDigitalTwins } from "@/hooks/useDigitalTwins";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { SectionHeader, EmptyState } from "@/components/enterprise";
import { cn } from "@/lib/utils";

const templateLabels: Record<string, string> = {
  classroom: "Classroom",
  it_classroom: "IT Lab",
  soccer_field: "Soccer Field",
  outdoor: "Outdoor Area",
  gymnasium: "Gymnasium",
  restaurant: "Restaurant",
};

const templateIcons: Record<string, string> = {
  classroom: "📚",
  it_classroom: "💻",
  soccer_field: "⚽",
  outdoor: "🌳",
  gymnasium: "🏀",
  restaurant: "🍽️",
};

export default function ImmersiveDashboard() {
  const navigate = useNavigate();
  const { twins, isLoading } = useDigitalTwins();
  const { sensors } = useRealtimeSensors();

  const onlineSensors = sensors.filter(s => s.status === "online").length;
  const alertSensors = sensors.filter(s => s.status === "warning" || s.status === "critical").length;

  const stats = [
    { icon: Box, label: "Digital Twins", value: twins.length, color: "text-primary" },
    { icon: Activity, label: "Active Sensors", value: onlineSensors, color: "text-green-500" },
    { icon: AlertTriangle, label: "Alerts", value: alertSensors, color: alertSensors > 0 ? "text-destructive" : "text-muted-foreground" },
    { icon: Wifi, label: "Connected", value: sensors.length, color: "text-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <SectionHeader
          title="Digital Twin Dashboard"
          description="Monitor and manage your digital twin ecosystem"
          icon={Box}
          actions={
            <Button onClick={() => navigate("/admin")}>
              <Plus className="h-4 w-4 mr-2" />
              New Twin
            </Button>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Twins Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-40" />
              </Card>
            ))}
          </div>
        ) : twins.length === 0 ? (
          <EmptyState
            icon={Box}
            title="No Digital Twins Yet"
            description="Create your first digital twin to start monitoring your spaces"
            action={
              <Button onClick={() => navigate("/admin")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Digital Twin
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {twins.map((twin) => (
              <Card
                key={twin.id}
                className="group hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/twin/${twin.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {templateIcons[twin.template_id] || "📦"}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{twin.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {templateLabels[twin.template_id] || twin.template_id}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{twin.size}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {twin.building && (
                        <span>{twin.building}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-green-500" />
                        {sensors.length} sensors
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/twin/${twin.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin");
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  {twin.tags && twin.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {twin.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {twin.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{twin.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add New Card */}
            <Card
              className="flex items-center justify-center min-h-[180px] border-dashed hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              <CardContent className="text-center py-8">
                <div className="inline-flex p-3 rounded-full bg-muted mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">Create New Twin</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
