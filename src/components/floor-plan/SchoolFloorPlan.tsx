import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Dumbbell, FlaskConical, Monitor, Music, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface Room {
  id: string;
  name: string;
  sensors: number;
  status: "online" | "warning" | "offline";
}

interface Building {
  id: string;
  name: string;
  icon: React.ElementType;
  rooms: Room[];
  color: string;
  position: { x: number; y: number; width: number; height: number };
}

const schoolBuildings: Building[] = [
  {
    id: "building-a",
    name: "Κτίριο Α",
    icon: Building2,
    color: "hsl(var(--primary))",
    position: { x: 5, y: 10, width: 35, height: 35 },
    rooms: [
      { id: "a1", name: "Αίθουσα A1", sensors: 4, status: "online" },
      { id: "a2", name: "Αίθουσα A2", sensors: 3, status: "online" },
      { id: "a3", name: "Αίθουσα A3", sensors: 4, status: "warning" },
      { id: "a4", name: "Αίθουσα A4", sensors: 2, status: "online" },
    ],
  },
  {
    id: "building-b",
    name: "Κτίριο Β",
    icon: GraduationCap,
    color: "hsl(var(--accent))",
    position: { x: 45, y: 10, width: 35, height: 35 },
    rooms: [
      { id: "b1", name: "Αίθουσα B1", sensors: 3, status: "online" },
      { id: "b2", name: "Αίθουσα B2", sensors: 4, status: "online" },
      { id: "b3", name: "Αίθουσα B3", sensors: 2, status: "offline" },
    ],
  },
  {
    id: "gymnasium",
    name: "Γυμναστήριο",
    icon: Dumbbell,
    color: "hsl(var(--success))",
    position: { x: 5, y: 50, width: 25, height: 40 },
    rooms: [
      { id: "gym-main", name: "Κύρια Αίθουσα", sensors: 6, status: "online" },
      { id: "gym-storage", name: "Αποθήκη", sensors: 1, status: "online" },
    ],
  },
  {
    id: "lab",
    name: "Εργαστήρια",
    icon: FlaskConical,
    color: "hsl(var(--warning))",
    position: { x: 35, y: 50, width: 25, height: 25 },
    rooms: [
      { id: "lab-chemistry", name: "Χημείο", sensors: 5, status: "warning" },
      { id: "lab-physics", name: "Φυσική", sensors: 4, status: "online" },
      { id: "lab-biology", name: "Βιολογία", sensors: 3, status: "online" },
    ],
  },
  {
    id: "computer-lab",
    name: "Πληροφορική",
    icon: Monitor,
    color: "hsl(var(--secondary))",
    position: { x: 65, y: 50, width: 20, height: 25 },
    rooms: [
      { id: "pc-lab-1", name: "Εργαστήριο 1", sensors: 8, status: "online" },
      { id: "pc-lab-2", name: "Εργαστήριο 2", sensors: 6, status: "online" },
    ],
  },
  {
    id: "cafeteria",
    name: "Κυλικείο",
    icon: Utensils,
    color: "hsl(var(--destructive))",
    position: { x: 35, y: 80, width: 30, height: 15 },
    rooms: [
      { id: "cafeteria-main", name: "Κύριος Χώρος", sensors: 3, status: "online" },
      { id: "kitchen", name: "Κουζίνα", sensors: 4, status: "online" },
    ],
  },
  {
    id: "music-room",
    name: "Μουσική",
    icon: Music,
    color: "hsl(220 70% 50%)",
    position: { x: 70, y: 80, width: 15, height: 15 },
    rooms: [
      { id: "music-main", name: "Αίθουσα Μουσικής", sensors: 2, status: "online" },
    ],
  },
];

interface SchoolFloorPlanProps {
  className?: string;
}

export function SchoolFloorPlan({ className }: SchoolFloorPlanProps) {
  const navigate = useNavigate();
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building.id);
    // Navigate to digital twin with the selected building
    navigate(`/digital-twin?building=${building.id}`);
  };

  const handleRoomClick = (buildingId: string, roomId: string) => {
    navigate(`/digital-twin?building=${buildingId}&room=${roomId}`);
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "online": return "bg-success";
      case "warning": return "bg-warning";
      case "offline": return "bg-destructive";
    }
  };

  const getTotalSensors = (building: Building) => 
    building.rooms.reduce((acc, room) => acc + room.sensors, 0);

  const getOnlineRooms = (building: Building) =>
    building.rooms.filter(r => r.status === "online").length;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Floor Plan Container */}
      <div className="relative aspect-[4/3] bg-muted/30 rounded-xl border border-border overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        {/* Campus Label */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-sm font-semibold text-muted-foreground">Platon Schools Campus</h3>
        </div>

        {/* Buildings */}
        {schoolBuildings.map((building) => {
          const Icon = building.icon;
          const isHovered = hoveredBuilding === building.id;
          const isSelected = selectedBuilding === building.id;
          
          return (
            <motion.div
              key={building.id}
              className={cn(
                "absolute rounded-lg border-2 cursor-pointer transition-all duration-200",
                "flex flex-col items-center justify-center gap-1",
                isHovered || isSelected
                  ? "border-primary shadow-lg shadow-primary/20 z-20"
                  : "border-border/50 hover:border-border"
              )}
              style={{
                left: `${building.position.x}%`,
                top: `${building.position.y}%`,
                width: `${building.position.width}%`,
                height: `${building.position.height}%`,
                backgroundColor: isHovered || isSelected 
                  ? `color-mix(in srgb, ${building.color} 15%, transparent)`
                  : `color-mix(in srgb, ${building.color} 8%, transparent)`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredBuilding(building.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
              onClick={() => handleBuildingClick(building)}
            >
              <Icon 
                className="h-6 w-6 md:h-8 md:w-8" 
                style={{ color: building.color }}
              />
              <span className="text-xs md:text-sm font-medium text-foreground text-center px-1">
                {building.name}
              </span>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                <span>{building.rooms.length} αίθουσες</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{getTotalSensors(building)} sensors</span>
              </div>
              
              {/* Status indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  getOnlineRooms(building) === building.rooms.length 
                    ? "bg-success" 
                    : getOnlineRooms(building) === 0 
                      ? "bg-destructive"
                      : "bg-warning"
                )} />
              </div>
            </motion.div>
          );
        })}

        {/* Paths/Walkways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {/* Horizontal path */}
          <path
            d="M 5% 48% H 95%"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeDasharray="8 4"
            fill="none"
            opacity="0.2"
          />
          {/* Vertical path */}
          <path
            d="M 42% 10% V 95%"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeDasharray="8 4"
            fill="none"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Building Details Panel (on hover) */}
      {hoveredBuilding && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl z-30"
        >
          {(() => {
            const building = schoolBuildings.find(b => b.id === hoveredBuilding);
            if (!building) return null;
            const Icon = building.icon;
            
            return (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${building.color} 20%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: building.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{building.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {getOnlineRooms(building)}/{building.rooms.length} αίθουσες online
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Αίθουσες</p>
                  <div className="grid grid-cols-2 gap-2">
                    {building.rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomClick(building.id, room.id);
                        }}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-left"
                      >
                        <span className={cn("w-2 h-2 rounded-full", getStatusColor(room.status))} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{room.name}</p>
                          <p className="text-[10px] text-muted-foreground">{room.sensors} sensors</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  Κλικ για 3D προβολή
                </p>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
