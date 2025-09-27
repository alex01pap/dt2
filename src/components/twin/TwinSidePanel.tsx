import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap, 
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useMemo, useCallback, useEffect } from 'react';

interface SparklineData {
  timestamp: Date;
  value: number;
}

interface SensorMetrics {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  sparklineData: SparklineData[];
  thresholds?: {
    warning: number;
    critical: number;
  };
}

interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  lastUpdated: Date;
  activeAlerts: number;
  totalSensors: number;
  onlineSensors: number;
}

interface TwinSidePanelProps {
  twinId: string;
  sensors: SensorMetrics[];
  systemStatus: SystemStatus;
  className?: string;
  onSensorSelect?: (sensorId: string) => void;
}

const SENSOR_ICONS = {
  temperature: Thermometer,
  humidity: Droplets,
  power: Zap,
  airflow: Wind,
  pressure: Activity,
  default: Activity,
};

// Simple SVG Sparkline Component
function Sparkline({ 
  data, 
  width = 60, 
  height = 20, 
  color = "currentColor",
  className 
}: { 
  data: SparklineData[]; 
  width?: number; 
  height?: number; 
  color?: string;
  className?: string;
}) {
  const path = useMemo(() => {
    if (data.length < 2) return '';
    
    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - minVal) / range) * height;
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  }, [data, width, height]);

  if (data.length < 2) {
    return (
      <div 
        className={cn("flex items-center justify-center text-muted-foreground", className)}
        style={{ width, height }}
      >
        <span className="text-xs">No data</span>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className={className}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SensorCard({ sensor, onSelect }: { sensor: SensorMetrics; onSelect?: (id: string) => void }) {
  const IconComponent = SENSOR_ICONS[sensor.type as keyof typeof SENSOR_ICONS] || SENSOR_ICONS.default;
  
  const statusColor = {
    normal: "text-success",
    warning: "text-warning", 
    critical: "text-destructive"
  }[sensor.status];

  const trendIcon = sensor.trend === 'up' ? TrendingUp : 
                   sensor.trend === 'down' ? TrendingDown : 
                   null;

  const trendColor = sensor.trend === 'up' ? 'text-success' : 
                    sensor.trend === 'down' ? 'text-destructive' : 
                    'text-muted-foreground';

  return (
    <Card 
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(sensor.id)}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={cn("h-4 w-4", statusColor)} />
            <span className="font-medium text-sm truncate">{sensor.name}</span>
          </div>
          <Badge 
            variant={sensor.status === 'normal' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {sensor.status}
          </Badge>
        </div>

        {/* Value and Sparkline */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold">
              {sensor.currentValue.toFixed(1)} {sensor.unit}
            </div>
            {trendIcon && (
              <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                {React.createElement(trendIcon, { className: "h-3 w-3" })}
                <span>{Math.abs(sensor.trendPercent).toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          <Sparkline 
            data={sensor.sparklineData}
            color={sensor.status === 'normal' ? '#10b981' : 
                   sensor.status === 'warning' ? '#f59e0b' : '#ef4444'}
            className="flex-shrink-0"
          />
        </div>

        {/* Thresholds */}
        {sensor.thresholds && (
          <div className="text-xs text-muted-foreground">
            Warn: {sensor.thresholds.warning}, Critical: {sensor.thresholds.critical}
          </div>
        )}
      </div>
    </Card>
  );
}

function SystemStatusCard({ status }: { status: SystemStatus }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'degraded': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const StatusIcon = getStatusIcon(status.overall);
  const uptimeHours = Math.floor(status.uptime / 3600);
  const uptimeDays = Math.floor(uptimeHours / 24);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">System Status</h3>
          <StatusIcon className={cn("h-5 w-5", getStatusColor(status.overall))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Overall</div>
            <div className={cn("font-medium capitalize", getStatusColor(status.overall))}>
              {status.overall}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Uptime</div>
            <div className="font-medium">
              {uptimeDays > 0 ? `${uptimeDays}d ${uptimeHours % 24}h` : `${uptimeHours}h`}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Sensors</div>
            <div className="font-medium">
              {status.onlineSensors}/{status.totalSensors}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Alerts</div>
            <div className={cn("font-medium", status.activeAlerts > 0 ? 'text-destructive' : 'text-muted-foreground')}>
              {status.activeAlerts}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {status.lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
}

export function TwinSidePanel({ 
  twinId, 
  sensors, 
  systemStatus, 
  className,
  onSensorSelect 
}: TwinSidePanelProps) {
  const sensorsByType = useMemo(() => {
    const grouped = sensors.reduce((acc, sensor) => {
      if (!acc[sensor.type]) {
        acc[sensor.type] = [];
      }
      acc[sensor.type].push(sensor);
      return acc;
    }, {} as Record<string, SensorMetrics[]>);
    
    return grouped;
  }, [sensors]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Twin Dashboard</h2>
        <p className="text-sm text-muted-foreground">ID: {twinId}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* System Status */}
          <SystemStatusCard status={systemStatus} />

          {/* Sensors by Type */}
          {Object.entries(sensorsByType).map(([type, typeSensors]) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium capitalize">{type} Sensors</h3>
                <Badge variant="secondary" className="text-xs">
                  {typeSensors.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {typeSensors.map((sensor) => (
                  <SensorCard 
                    key={sensor.id}
                    sensor={sensor}
                    onSelect={onSensorSelect}
                  />
                ))}
              </div>
              
              {type !== Object.keys(sensorsByType)[Object.keys(sensorsByType).length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" size="sm">
          Export Data
        </Button>
      </div>
    </div>
  );
}