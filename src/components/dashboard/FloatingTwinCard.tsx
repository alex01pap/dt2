import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { Eye, Settings, Activity, MapPin } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/utils";

interface FloatingTwinCardProps {
  twin: {
    id: string;
    name: string;
    template_id: string;
    size: string;
    building?: string | null;
    tags?: string[] | null;
  };
  sensorCount?: number;
  onView?: () => void;
  onConfigure?: () => void;
  isLarge?: boolean;
}

const templateLabels: Record<string, string> = {
  classroom: "Classroom",
  it_classroom: "IT Lab",
  soccer_field: "Soccer Field",
  outdoor: "Outdoor Area",
  gymnasium: "Gymnasium",
  restaurant: "Restaurant",
};

function MiniPreview({ templateId }: { templateId: string }) {
  // Simple 3D preview based on template type
  const getColor = () => {
    switch (templateId) {
      case "classroom": return "#22d3ee";
      case "it_classroom": return "#a855f7";
      case "soccer_field": return "#22c55e";
      case "outdoor": return "#f59e0b";
      case "gymnasium": return "#ef4444";
      case "restaurant": return "#ec4899";
      default: return "#22d3ee";
    }
  };

  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -10]} intensity={0.3} color={getColor()} />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group>
          {/* Simple building representation */}
          <RoundedBox args={[4, 2, 3]} radius={0.2} smoothness={4} position={[0, 1, 0]}>
            <meshStandardMaterial color={getColor()} transparent opacity={0.8} />
          </RoundedBox>
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[6, 5]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        </group>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
      />
      <Environment preset="night" />
    </Canvas>
  );
}

export function FloatingTwinCard({ 
  twin, 
  sensorCount = 0, 
  onView, 
  onConfigure,
  isLarge = false 
}: FloatingTwinCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <GlassPanel
        className={cn(
          "overflow-hidden group cursor-pointer h-full",
          "transition-all duration-500",
          isHovered && "shadow-glow-md border-primary/30"
        )}
        glow={isHovered}
      >
        {/* 3D Preview */}
        <div className={cn(
          "relative bg-gradient-to-b from-card/50 to-card",
          isLarge ? "h-72" : "h-48"
        )}>
          <MiniPreview templateId={twin.template_id} />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
          
          {/* Scan line effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-x-0 h-[2px] bg-primary/50 animate-scan-line" />
            </div>
          )}

          {/* Action buttons on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onView?.(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/90 text-primary-foreground text-sm font-medium hover:bg-primary transition-all"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onConfigure?.(); }}
              className="flex items-center justify-center p-2 rounded-lg bg-card/80 backdrop-blur text-foreground hover:bg-card transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {twin.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {templateLabels[twin.template_id] || twin.template_id}
              </p>
            </div>
            <span className={cn(
              "px-2 py-1 rounded-lg text-xs font-medium",
              "bg-primary/10 text-primary"
            )}>
              {twin.size}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {twin.building && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{twin.building}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-success" />
              <span>{sensorCount} sensors</span>
            </div>
          </div>

          {/* Tags */}
          {twin.tags && twin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {twin.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-secondary/20 text-secondary"
                >
                  {tag}
                </span>
              ))}
              {twin.tags.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                  +{twin.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
