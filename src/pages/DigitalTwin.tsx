import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { TwinViewer, FloorPlanType } from '@/components/twin/TwinViewer';
import { SensorPanel } from '@/components/twin/SensorPanel';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Maximize2,
  CheckCircle,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Building name mappings
const buildingNames: Record<string, string> = {
  'building-a': 'Κτίριο Α',
  'building-b': 'Κτίριο Β',
  'gymnasium': 'Γυμναστήριο',
  'lab': 'Εργαστήρια',
  'computer-lab': 'Πληροφορική',
  'cafeteria': 'Κυλικείο',
  'music-room': 'Μουσική',
};

const roomNames: Record<string, string> = {
  'a1': 'Αίθουσα A1',
  'a2': 'Αίθουσα A2',
  'a3': 'Αίθουσα A3',
  'a4': 'Αίθουσα A4',
  'b1': 'Αίθουσα B1',
  'b2': 'Αίθουσα B2',
  'b3': 'Αίθουσα B3',
  'gym-main': 'Κύρια Αίθουσα',
  'gym-storage': 'Αποθήκη',
  'lab-chemistry': 'Χημείο',
  'lab-physics': 'Φυσική',
  'lab-biology': 'Βιολογία',
  'pc-lab-1': 'Εργαστήριο 1',
  'pc-lab-2': 'Εργαστήριο 2',
  'cafeteria-main': 'Κύριος Χώρος',
  'kitchen': 'Κουζίνα',
  'music-main': 'Αίθουσα Μουσικής',
};

export default function DigitalTwin() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  
  // Filter sensors by twinId for the sidebar panel
  const { sensors, isConnected, isLoading, refresh } = useRealtimeSensors(id);

  const selectedBuilding = searchParams.get('building');
  const selectedRoom = searchParams.get('room');

  const twinName = useMemo(() => {
    if (selectedBuilding) {
      const buildingName = buildingNames[selectedBuilding] || selectedBuilding;
      if (selectedRoom) {
        const roomName = roomNames[selectedRoom] || selectedRoom;
        return `${buildingName} - ${roomName}`;
      }
      return buildingName;
    }
    return 'Platon Schools';
  }, [selectedBuilding, selectedRoom]);

  const floorPlanType: FloorPlanType = useMemo(() => {
    if (selectedBuilding === 'gymnasium') return 'gymnasium';
    if (selectedBuilding === 'lab') return 'laboratory';
    if (selectedBuilding === 'computer-lab') return 'computer-lab';
    if (selectedBuilding === 'music-room') return 'music-room';
    if (selectedBuilding === 'cafeteria') return 'cafeteria';
    return 'classroom';
  }, [selectedBuilding]);

  const sensorsOnline = sensors.filter(s => s.status === 'online').length;

  return (
    <div className={cn(
      "h-full flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{twinName}</h1>
          <Badge 
            variant={isConnected ? "secondary" : "destructive"} 
            className="flex items-center gap-1.5"
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                {sensorsOnline}/{sensors.length} Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refresh}>
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

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* 3D Viewer */}
        <div className="flex-1 min-w-0">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <TwinViewer
                twinId={id || '1'}
                floorPlanType={floorPlanType}
                className="w-full h-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sensor Panel */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time Sensors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <SensorPanel 
              sensors={sensors}
              isLoading={isLoading}
              onSensorClick={setSelectedSensorId}
              selectedSensorId={selectedSensorId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
