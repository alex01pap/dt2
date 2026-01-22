import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Droplets, Users, Wind, Lightbulb, Building2, DoorOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { CampusBuilding, CampusRoom, RoomSensor } from '@/data/platonCampusLayout';

interface CampusBuildingSidebarProps {
  building: CampusBuilding | null;
  onClose: () => void;
  onRoomClick?: (room: CampusRoom) => void;
}

const sensorIcons: Record<RoomSensor['type'], React.ComponentType<{ className?: string }>> = {
  temperature: Thermometer,
  humidity: Droplets,
  occupancy: Users,
  air_quality: Wind,
  light: Lightbulb,
};

const statusColors: Record<RoomSensor['status'], string> = {
  online: 'bg-green-500',
  warning: 'bg-yellow-500',
  offline: 'bg-red-500',
};

function SensorBadge({ sensor }: { sensor: RoomSensor }) {
  const Icon = sensorIcons[sensor.type];
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-1.5 h-1.5 rounded-full ${statusColors[sensor.status]}`} />
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">{sensor.value}{sensor.unit}</span>
    </div>
  );
}

function RoomCard({ room, onClick }: { room: CampusRoom; onClick?: () => void }) {
  const onlineSensors = room.sensors.filter(s => s.status === 'online').length;
  const totalSensors = room.sensors.length;
  const hasWarning = room.sensors.some(s => s.status === 'warning');
  const hasOffline = room.sensors.some(s => s.status === 'offline');

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium text-sm truncate">{room.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Όροφος {room.floor}
            </Badge>
            {room.capacity && (
              <span className="text-[10px] text-muted-foreground">
                {room.capacity} θέσεις
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasOffline && <div className="w-2 h-2 rounded-full bg-red-500" />}
          {hasWarning && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
          {!hasWarning && !hasOffline && totalSensors > 0 && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {room.sensors.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {room.sensors.map((sensor, i) => (
            <SensorBadge key={i} sensor={sensor} />
          ))}
        </div>
      )}
    </button>
  );
}

export function CampusBuildingSidebar({ building, onClose, onRoomClick }: CampusBuildingSidebarProps) {
  if (!building) return null;

  const roomsByFloor = building.rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, CampusRoom[]>);

  const floors = Object.keys(roomsByFloor).map(Number).sort((a, b) => b - a);
  
  const totalSensors = building.rooms.reduce((acc, room) => acc + room.sensors.length, 0);
  const onlineSensors = building.rooms.reduce(
    (acc, room) => acc + room.sensors.filter(s => s.status === 'online').length, 
    0
  );
  const warningSensors = building.rooms.reduce(
    (acc, room) => acc + room.sensors.filter(s => s.status === 'warning').length, 
    0
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{building.name}</h2>
                <p className="text-xs text-muted-foreground">{building.nameEn}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-lg font-bold">{building.dimensions.floors}</p>
              <p className="text-[10px] text-muted-foreground">Όροφοι</p>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-lg font-bold">{building.rooms.length}</p>
              <p className="text-[10px] text-muted-foreground">Αίθουσες</p>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-bold">{onlineSensors}</span>
                <span className="text-xs text-muted-foreground">/{totalSensors}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Αισθητήρες</p>
            </div>
          </div>
          
          {warningSensors > 0 && (
            <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ {warningSensors} αισθητήρ{warningSensors === 1 ? 'ας' : 'ες'} χρειάζ{warningSensors === 1 ? 'εται' : 'ονται'} προσοχή
              </p>
            </div>
          )}
        </div>

        {/* Rooms by floor */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {floors.map(floor => (
              <div key={floor}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {floor === 1 ? 'Ισόγειο' : `${floor}ος Όροφος`}
                  </Badge>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-2">
                  {roomsByFloor[floor].map(room => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      onClick={() => onRoomClick?.(room)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button className="w-full" size="sm">
            <DoorOpen className="h-4 w-4 mr-2" />
            Είσοδος στο κτίριο
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
