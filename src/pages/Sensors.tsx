import { useState, useMemo } from "react";
import { Plus, Search, Filter, Cpu, Activity, Thermometer, Zap, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardGrid, StatsCard, EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSensors } from "@/hooks/useRealtimeSensors";
import { SensorForm } from "@/components/sensors/SensorForm";
import { format } from "date-fns";

export default function Sensors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { sensors, isLoading, refresh } = useRealtimeSensors();

  const filteredSensors = useMemo(() => {
    if (!searchQuery) return sensors;
    const query = searchQuery.toLowerCase();
    return sensors.filter(
      s => s.name.toLowerCase().includes(query) || s.type.toLowerCase().includes(query)
    );
  }, [sensors, searchQuery]);

  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const avgTemp = sensors
    .filter(s => s.type === 'temperature' && s.last_reading !== null)
    .reduce((sum, s) => sum + (s.last_reading || 0), 0) / 
    sensors.filter(s => s.type === 'temperature' && s.last_reading !== null).length || 0;
  
  const avgPower = sensors
    .filter(s => s.type === 'power' && s.last_reading !== null)
    .reduce((sum, s) => sum + (s.last_reading || 0), 0) / 
    sensors.filter(s => s.type === 'power' && s.last_reading !== null).length || 0;

  const sensorStats = [
    { title: "Total Sensors", value: sensors.length.toString(), description: "Active sensors", icon: Cpu },
    { title: "Online", value: onlineSensors.toString(), description: "Connected", icon: Activity, trend: { value: Math.round((onlineSensors/sensors.length)*100) || 0, isPositive: true } },
    { title: "Temperature", value: avgTemp ? `${avgTemp.toFixed(1)}°C` : "N/A", description: "Average", icon: Thermometer },
    { title: "Power Usage", value: avgPower ? `${avgPower.toFixed(0)}W` : "N/A", description: "Current draw", icon: Zap },
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
        
        <Button className="btn-enterprise" onClick={() => setIsAddOpen(true)}>
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
        <Badge variant="outline">{filteredSensors.length} sensors</Badge>
      </div>

      {filteredSensors.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyStateCard
            icon={Cpu}
            title={searchQuery ? "No sensors found" : "No sensors configured"}
            description={searchQuery ? "Try adjusting your search query" : "Connect your first IoT sensor to start monitoring data streams"}
            action={!searchQuery ? {
              label: "Add Sensor",
              onClick: () => setIsAddOpen(true)
            } : undefined}
          />
        </div>
      ) : (
        <CardGrid>
          {filteredSensors.map((sensor) => (
            <Card key={sensor.id} className="card-enterprise hover:scale-[1.02] transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{sensor.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {sensor.type.toUpperCase()}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={sensor.status === 'online' ? 'default' : sensor.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {sensor.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">
                  {sensor.last_reading !== null ? sensor.last_reading.toFixed(2) : 'N/A'}
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  {sensor.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        ({sensor.location.x?.toFixed(1)}, {sensor.location.y?.toFixed(1)}, {sensor.location.z?.toFixed(1)})
                      </span>
                    </div>
                  )}
                  
                  {sensor.last_reading_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(sensor.last_reading_at), 'PPp')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
      )}

      <SensorForm 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen}
        onSuccess={refresh}
      />
    </div>
  );
}