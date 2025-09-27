import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TwinViewer } from '@/components/twin/TwinViewer';
import { TwinSidePanel } from '@/components/twin/TwinSidePanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Settings, 
  RefreshCw, 
  Maximize2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Vector3 } from 'three';

// Mock data - in real app this would come from API
const mockSensorData = [
  {
    id: 'temp_room_a',
    name: 'Room A Temp',
    type: 'temperature',
    position: [-5, 0, -3] as [number, number, number],
    value: 22.5,
    unit: '°C',
    status: 'normal' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'temp_room_b', 
    name: 'Room B Temp',
    type: 'temperature',
    position: [5, 0, -3] as [number, number, number],
    value: 24.8,
    unit: '°C',
    status: 'warning' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'humidity_room_a',
    name: 'Room A Humidity',
    type: 'humidity',
    position: [-3, 0, -1] as [number, number, number],
    value: 45.2,
    unit: '%',
    status: 'normal' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'hvac_power',
    name: 'HVAC Power',
    type: 'power',
    position: [0, 1.5, 5] as [number, number, number],
    value: 3.4,
    unit: 'kW',
    status: 'normal' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'pressure_loop',
    name: 'Loop Pressure',
    type: 'pressure',
    position: [2, 0, 3] as [number, number, number],
    value: 157.2,
    unit: 'kPa',
    status: 'critical' as const,
    lastUpdated: new Date(),
  },
];

const mockHeatData = [
  { x: -5, y: -3, temperature: 22.5 },
  { x: 5, y: -3, temperature: 24.8 },
  { x: 0, y: 0, temperature: 23.1 },
  { x: -3, y: 2, temperature: 21.9 },
  { x: 3, y: 2, temperature: 25.2 },
];

const mockFlowPipes = [
  {
    id: 'chilled_water',
    path: [
      new Vector3(0, 1.5, 5),
      new Vector3(-5, 1, 0),
      new Vector3(5, 1, 0),
    ],
    flowRate: 12.5,
    pressure: 220,
    status: 'normal' as const,
  },
  {
    id: 'air_distribution',
    path: [
      new Vector3(0, 2.5, 5),
      new Vector3(-5, 2.5, -3),
      new Vector3(5, 2.5, -3),
    ],
    flowRate: 8.3,
    pressure: 180,
    status: 'warning' as const,
  },
];

// Generate 24h sparkline data
const generateSparklineData = (baseValue: number, variance: number = 2) => {
  return Array.from({ length: 24 * 4 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 * 60 * 60 * 1000) + (i * 15 * 60 * 1000)),
    value: baseValue + (Math.random() - 0.5) * variance,
  }));
};

const mockSensorMetrics = mockSensorData.map(sensor => ({
  id: sensor.id,
  name: sensor.name,
  type: sensor.type,
  currentValue: sensor.value,
  unit: sensor.unit,
  status: sensor.status,
  trend: (Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
  trendPercent: Math.random() * 10,
  sparklineData: generateSparklineData(sensor.value),
  thresholds: sensor.type === 'temperature' ? { warning: 25, critical: 28 } :
              sensor.type === 'pressure' ? { warning: 150, critical: 180 } :
              undefined,
}));

const mockSystemStatus = {
  overall: 'degraded' as 'healthy' | 'degraded' | 'critical',
  uptime: 156 * 3600, // 156 hours
  lastUpdated: new Date(),
  activeAlerts: 2,
  totalSensors: mockSensorData.length,
  onlineSensors: mockSensorData.filter(s => s.status !== 'critical').length,
};

export default function DigitalTwin() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [id]);

  const twinName = useMemo(() => {
    const twinNames = {
      '1': 'Demo Building',
      '2': 'Manufacturing Plant A',
      '3': 'Office Complex B',
    };
    return twinNames[id as keyof typeof twinNames] || `Twin ${id}`;
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 mx-auto" />
              <Skeleton className="h-3 w-32 mx-auto" />
            </div>
          </div>
        </div>
        
        {sidePanelOpen && (
          <div className="w-80 border-l p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Viewer */}
      <div className={cn(
        "flex-1 relative",
        isFullscreen && "fixed inset-0 z-50 bg-background"
      )}>
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {twinName}
              </Badge>
              {mockSystemStatus.overall === 'healthy' ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>
          </Card>
          
          <Card className="p-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSidePanelOpen(!sidePanelOpen)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* 3D Viewer */}
        <TwinViewer
          twinId={id!}
          sensors={mockSensorData}
          heatData={mockHeatData}
          flowPipes={mockFlowPipes}
          className="w-full h-full"
        />
      </div>

      {/* Side Panel */}
      {sidePanelOpen && !isFullscreen && (
        <div className="w-80 border-l bg-background">
          <TwinSidePanel
            twinId={id!}
            sensors={mockSensorMetrics}
            systemStatus={mockSystemStatus}
            onSensorSelect={(sensorId) => setSelectedSensor(sensorId)}
          />
        </div>
      )}
    </div>
  );
}