import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TwinViewer } from '@/components/twin/TwinViewer';
import { KPIWidget } from '@/components/analytics/KPIWidget';
import { MiniAreaChart } from '@/components/dashboard/MiniAreaChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  RefreshCw, 
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Wifi,
  ClipboardList,
  PieChart,
  BarChart3,
  TrendingUp,
  Clock
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

// Mock data for enterprise dashboard
const mockKPIData = {
  activeAlerts: {
    current: 3,
    previous: 5,
    format: 'number' as const,
  },
  energyToday: {
    current: 245.8,
    previous: 230.4,
    format: 'number' as const,
    precision: 1,
  },
  sensorsOnline: {
    current: 14,
    previous: 12,
    format: 'number' as const,
  },
  workOrders: {
    current: 2,
    previous: 4,
    format: 'number' as const,
  },
};

const mockEventsData = Array.from({ length: 7 }, (_, i) => ({
  time: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
  value: Math.floor(Math.random() * 15) + 5,
}));

const mockResponseTimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.random() * 800 + 200,
}));

const mockIncidents = [
  {
    id: '1',
    title: 'HVAC System B - High Temperature Alert',
    severity: 'critical' as const,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    source: 'Room B Temp Sensor',
    status: 'active' as const,
  },
  {
    id: '2', 
    title: 'Loop Pressure Exceeds Threshold',
    severity: 'critical' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    source: 'Pressure Loop',
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Sensor Calibration Required',
    severity: 'medium' as const,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    source: 'Humidity Sensor A',
    status: 'acknowledged' as const,
  },
  {
    id: '4',
    title: 'Energy Consumption Above Baseline',
    severity: 'low' as const,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    source: 'HVAC Power Monitor',
    status: 'resolved' as const,
  },
];

const alarmStatusData = [
  { name: 'Critical', value: 2, color: '#dc2626' },
  { name: 'Warning', value: 1, color: '#ea580c' },
  { name: 'Normal', value: 11, color: '#16a34a' },
];

export default function DigitalTwin() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="h-full p-6 space-y-6">
        {/* Top KPIs Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        {/* Main content skeleton */}
        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-2">
            <Skeleton className="h-full min-h-96" />
          </div>
          <div className="col-span-8">
            <Skeleton className="h-full min-h-96" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-full min-h-96" />
          </div>
        </div>

        {/* Bottom table skeleton */}
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-background p-6"
    )}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{twinName}</h1>
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            System Online
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPIWidget
          title="Active Alerts"
          data={mockKPIData.activeAlerts}
          icon={AlertTriangle}
          description="Critical system alerts requiring attention"
          size="md"
        />
        <KPIWidget
          title="Energy Today"
          data={mockKPIData.energyToday}
          icon={Zap}
          description="kWh consumed in last 24 hours"
          size="md"
        />
        <KPIWidget
          title="Sensors Online"
          data={mockKPIData.sensorsOnline}
          icon={Wifi}
          description="Active monitoring points"
          size="md"
        />
        <KPIWidget
          title="Open Work Orders"
          data={mockKPIData.workOrders}
          icon={ClipboardList}
          description="Pending maintenance tasks"
          size="md"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 mb-6">
        {/* Left Column - Alarm Status */}
        <div className="col-span-12 lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Alarm Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alarmStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockSensorData.slice(0, 5).map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between text-xs">
                    <span className="truncate">{sensor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {sensor.value} {sensor.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - 3D Viewer */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <TwinViewer
                twinId={id!}
                sensors={mockSensorData}
                heatData={mockHeatData}
                flowPipes={mockFlowPipes}
                className="w-full h-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Charts */}
        <div className="col-span-12 lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Events/Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniAreaChart
                title="Events"
                data={mockEventsData}
                color="hsl(var(--primary))"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniAreaChart
                title="Response"
                data={mockResponseTimeData}
                color="hsl(var(--chart-2))"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Avg: 456ms
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">CPU</span>
                  <span className="text-xs font-medium">34%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '34%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs">Memory</span>
                  <span className="text-xs font-medium">67%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-chart-2 h-2 rounded-full" style={{ width: '67%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs">Storage</span>
                  <span className="text-xs font-medium">23%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-chart-3 h-2 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom - Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Incidents & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.title}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{incident.source}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTimestamp(incident.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={incident.status === 'resolved' ? 'default' : 'outline'}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}