import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Sensor {
  id: string;
  name: string;
  type: string;
  status: string;
  twin_id: string | null;
}

interface DigitalTwin {
  id: string;
  name: string;
  template_id: string;
}

export function SensorAssignment() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [twins, setTwins] = useState<DigitalTwin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sensorsRes, twinsRes] = await Promise.all([
        supabase.from('sensors').select('id, name, type, status, twin_id').order('name'),
        supabase.from('digital_twins').select('id, name, template_id').order('name')
      ]);

      if (sensorsRes.error) throw sensorsRes.error;
      if (twinsRes.error) throw twinsRes.error;

      setSensors(sensorsRes.data || []);
      setTwins(twinsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const assignSensor = async (sensorId: string, twinId: string | null) => {
    setUpdating(sensorId);
    try {
      const { error } = await supabase
        .from('sensors')
        .update({ twin_id: twinId })
        .eq('id', sensorId);

      if (error) throw error;

      setSensors(prev => prev.map(s => 
        s.id === sensorId ? { ...s, twin_id: twinId } : s
      ));
      toast.success('Sensor assigned successfully');
    } catch (error) {
      console.error('Error assigning sensor:', error);
      toast.error('Failed to assign sensor');
    } finally {
      setUpdating(null);
    }
  };

  const unassignedSensors = sensors.filter(s => !s.twin_id);
  const assignedSensors = sensors.filter(s => s.twin_id);

  const getTwinName = (twinId: string) => {
    return twins.find(t => t.id === twinId)?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sensor Assignment</h3>
          <p className="text-sm text-muted-foreground">
            Assign sensors to digital twins to see them in the twin view
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{sensors.length}</div>
            <div className="text-sm text-muted-foreground">Total Sensors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{assignedSensors.length}</div>
            <div className="text-sm text-muted-foreground">Assigned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{unassignedSensors.length}</div>
            <div className="text-sm text-muted-foreground">Unassigned</div>
          </CardContent>
        </Card>
      </div>

      {/* Unassigned Sensors */}
      {unassignedSensors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              Unassigned Sensors ({unassignedSensors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {unassignedSensors.map(sensor => (
                  <div key={sensor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{sensor.type}</Badge>
                      <span className="font-medium">{sensor.name}</span>
                    </div>
                    <Select
                      value="_none"
                      onValueChange={(value) => assignSensor(sensor.id, value === '_none' ? null : value)}
                      disabled={updating === sensor.id}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Assign to twin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Not assigned</SelectItem>
                        {twins.map(twin => (
                          <SelectItem key={twin.id} value={twin.id}>
                            {twin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Assigned Sensors by Twin */}
      {twins.map(twin => {
        const twinSensors = sensors.filter(s => s.twin_id === twin.id);
        if (twinSensors.length === 0) return null;

        return (
          <Card key={twin.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {twin.name} ({twinSensors.length} sensors)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {twinSensors.map(sensor => (
                  <div key={sensor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{sensor.type}</Badge>
                      <span className="font-medium">{sensor.name}</span>
                    </div>
                    <Select
                      value={sensor.twin_id || '_none'}
                      onValueChange={(value) => assignSensor(sensor.id, value === '_none' ? null : value)}
                      disabled={updating === sensor.id}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Unassign</SelectItem>
                        {twins.map(t => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {sensors.length === 0 && (
        <Card className="p-8 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No Sensors Found</h3>
          <p className="text-sm text-muted-foreground">
            Connect OpenHAB or create sensors to assign them to twins
          </p>
        </Card>
      )}
    </div>
  );
}
