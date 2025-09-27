import { useState } from "react";
import { Plus, Search, Filter, Cpu, Activity, Thermometer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardGrid, StatsCard, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sensors() {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sensorStats = [
    { title: "Total Sensors", value: "0", description: "Active sensors", icon: Cpu },
    { title: "Online", value: "0", description: "Connected", icon: Activity, trend: { value: 0, isPositive: true } },
    { title: "Temperature", value: "0°C", description: "Average", icon: Thermometer },
    { title: "Power Usage", value: "0W", description: "Current draw", icon: Zap },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sensors</h1>
            <p className="text-muted-foreground">Monitor and manage IoT sensors</p>
          </div>
        </div>
        
        <CardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
        
        <CardGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sensors</h1>
          <p className="text-muted-foreground">Monitor and manage IoT sensors</p>
        </div>
        
        <Button className="btn-enterprise">
          <Plus className="h-4 w-4 mr-2" />
          Add Sensor
        </Button>
      </div>

      <CardGrid className="lg:grid-cols-4">
        {sensorStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </CardGrid>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sensors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Badge variant="outline">0 sensors</Badge>
      </div>

      <div className="flex justify-center items-center min-h-[400px]">
        <EmptyStateCard
          icon={Cpu}
          title="No sensors configured"
          description="Connect your first IoT sensor to start monitoring data streams"
          action={{
            label: "Add Sensor",
            onClick: () => console.log("Add sensor clicked")
          }}
        />
      </div>
    </div>
  );
}