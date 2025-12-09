import { useMemo } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Activity,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Sensor {
  id: string;
  name: string;
  type: string;
  status: string;
  last_reading: number | null;
  last_reading_at: string | null;
}

interface SensorPanelProps {
  sensors: Sensor[];
  isLoading?: boolean;
  onSensorClick?: (sensorId: string) => void;
  selectedSensorId?: string | null;
}

const SENSOR_ICONS: Record<string, React.ElementType> = {
  temperature: Thermometer,
  humidity: Droplets,
  air_quality: Wind,
  pressure: Gauge,
  vibration: Activity,
  flow: Waves,
};

const SENSOR_UNITS: Record<string, string> = {
  temperature: '°C',
  humidity: '%',
  air_quality: 'AQI',
  pressure: 'kPa',
  vibration: 'mm/s',
  flow: 'L/min',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
    case 'offline': return 'bg-muted';
    default: return 'bg-muted';
  }
};

export function SensorPanel({ 
  sensors, 
  isLoading, 
  onSensorClick,
  selectedSensorId 
}: SensorPanelProps) {
  const groupedSensors = useMemo(() => {
    return sensors.reduce((acc, sensor) => {
      const type = sensor.type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(sensor);
      return acc;
    }, {} as Record<string, Sensor[]>);
  }, [sensors]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (sensors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No sensors configured</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Add sensors to see real-time data
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {Object.entries(groupedSensors).map(([type, typeSensors]) => {
          const Icon = SENSOR_ICONS[type] || Activity;
          const unit = SENSOR_UNITS[type] || '';
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Icon className="h-3 w-3" />
                {type.replace('_', ' ')}
              </div>
              
              {typeSensors.map((sensor) => (
                <button
                  key={sensor.id}
                  onClick={() => onSensorClick?.(sensor.id)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-all",
                    "bg-card hover:bg-accent border border-border",
                    selectedSensorId === sensor.id && "ring-2 ring-primary bg-accent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{sensor.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sensor.last_reading_at 
                          ? new Date(sensor.last_reading_at).toLocaleTimeString()
                          : 'No data'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold tabular-nums">
                        {sensor.last_reading !== null 
                          ? `${sensor.last_reading.toFixed(1)}${unit}`
                          : '--'}
                      </span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        getStatusColor(sensor.status)
                      )} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
