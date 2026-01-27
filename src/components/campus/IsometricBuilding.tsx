import { motion } from "framer-motion";
import { Building2, Cpu, Dumbbell, Coffee, Music, GraduationCap, FlaskConical, Users } from "lucide-react";
import { CampusBuilding, getBuildingSensorCount } from "@/data/campusLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IsometricBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  cellSize: number;
}

const buildingIcons: Record<string, React.ElementType> = {
  'building-a': GraduationCap,
  'building-b': FlaskConical,
  'it-building': Cpu,
  'gymnasium': Dumbbell,
  'cafeteria': Coffee,
  'music-room': Music,
  'admin-building': Users,
};

export function IsometricBuilding({
  building,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  cellSize,
}: IsometricBuildingProps) {
  const Icon = buildingIcons[building.id] || Building2;
  const sensorCount = getBuildingSensorCount(building);
  
  // Calculate pixel dimensions
  const width = building.size.width * cellSize;
  const depth = building.size.depth * cellSize;
  const height = building.size.height * cellSize;
  
  // Position in pixels
  const left = building.position.x * cellSize;
  const top = building.position.y * cellSize;

  return (
    <motion.div
      className={cn(
        "absolute cursor-pointer select-none",
        "transition-all duration-300 ease-out"
      )}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        zIndex: isHovered || isSelected ? 100 : Math.floor(building.position.y + building.position.x),
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.4, delay: building.position.x * 0.05 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* 3D Building Container */}
      <div 
        className="relative preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg)',
        }}
      >
        {/* Top face (roof) */}
        <div
          className={cn(
            "absolute transition-all duration-300",
            isSelected && "ring-2 ring-primary ring-offset-2"
          )}
          style={{
            width: `${width}px`,
            height: `${depth}px`,
            backgroundColor: building.accentColor,
            transform: `translateZ(${height}px)`,
            boxShadow: isHovered 
              ? `0 0 20px ${building.color}80` 
              : 'none',
          }}
        >
          {/* Building icon on roof */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon 
              className="text-white/90 drop-shadow-lg" 
              style={{ 
                width: Math.min(width, depth) * 0.4,
                height: Math.min(width, depth) * 0.4,
              }} 
            />
          </div>
        </div>

        {/* Front face */}
        <div
          className="absolute origin-bottom"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: building.color,
            transform: `rotateX(-90deg) translateZ(${depth}px)`,
            background: `linear-gradient(180deg, ${building.color} 0%, ${building.accentColor} 100%)`,
          }}
        >
          {/* Windows */}
          <div className="absolute inset-2 grid gap-1" style={{
            gridTemplateColumns: `repeat(${Math.max(2, Math.floor(building.size.width))}, 1fr)`,
            gridTemplateRows: `repeat(${building.floors}, 1fr)`,
          }}>
            {Array.from({ length: building.floors * Math.max(2, Math.floor(building.size.width)) }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white/30 rounded-sm"
                style={{ minHeight: '8px' }}
              />
            ))}
          </div>
        </div>

        {/* Right side face */}
        <div
          className="absolute origin-left"
          style={{
            width: `${depth}px`,
            height: `${height}px`,
            backgroundColor: building.color,
            transform: `rotateY(90deg) rotateX(-90deg) translateZ(${width}px) translateX(0px)`,
            background: `linear-gradient(180deg, ${building.color}cc 0%, ${building.accentColor}cc 100%)`,
          }}
        >
          {/* Windows */}
          <div className="absolute inset-2 grid gap-1" style={{
            gridTemplateColumns: `repeat(${Math.max(2, Math.floor(building.size.depth))}, 1fr)`,
            gridTemplateRows: `repeat(${building.floors}, 1fr)`,
          }}>
            {Array.from({ length: building.floors * Math.max(2, Math.floor(building.size.depth)) }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white/20 rounded-sm"
                style={{ minHeight: '8px' }}
              />
            ))}
          </div>
        </div>

        {/* Base/Ground shadow */}
        <div
          className="absolute"
          style={{
            width: `${width}px`,
            height: `${depth}px`,
            backgroundColor: 'rgba(0,0,0,0.15)',
            transform: 'translateZ(-2px)',
          }}
        />
      </div>

      {/* Label (outside 3D transform) */}
      <motion.div 
        className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
          "text-xs font-medium text-foreground/80 text-center",
          "pointer-events-none z-50"
        )}
        animate={{
          opacity: isHovered || isSelected ? 1 : 0.7,
          y: isHovered ? -4 : 0,
        }}
      >
        <span className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border">
          {building.name}
        </span>
      </motion.div>

      {/* Sensor count badge (on hover) */}
      {(isHovered || isSelected) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Badge variant="secondary" className="shadow-lg">
            {sensorCount} sensors
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
}
