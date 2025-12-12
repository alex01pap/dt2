import { useState, useCallback } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, Html, Float } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Plus, MousePointer } from 'lucide-react';
import { SensorPlacementDialog } from './SensorPlacementDialog';

// Import templates
import { ScalableClassroom } from '@/components/twin/templates/ScalableClassroom';
import { ITClassroomFloorPlan } from '@/components/twin/templates/ITClassroomFloorPlan';
import { SoccerFieldFloorPlan } from '@/components/twin/templates/SoccerFieldFloorPlan';
import { OutdoorAreaFloorPlan } from '@/components/twin/templates/OutdoorAreaFloorPlan';
import GymnasiumFloorPlan from '@/components/twin/templates/GymnasiumFloorPlan';
import RestaurantFloorPlan from '@/components/twin/templates/RestaurantFloorPlan';

interface SensorPlacementModeProps {
  twinId: string;
  templateId: string;
  size: string;
  onClose: () => void;
  onSensorPlaced?: () => void;
}

const templateComponents: Record<string, React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>> = {
  'classroom': ScalableClassroom,
  'it-lab': ITClassroomFloorPlan,
  'soccer-field': SoccerFieldFloorPlan,
  'outdoor-area': OutdoorAreaFloorPlan,
  'gymnasium': GymnasiumFloorPlan,
  'restaurant': RestaurantFloorPlan,
};

interface GhostMarkerProps {
  position: THREE.Vector3 | null;
}

function GhostMarker({ position }: GhostMarkerProps) {
  if (!position) return null;

  return (
    <Float speed={3} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.7}
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.2, 0.35, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

interface ClickablePlaneProps {
  onPlaceClick: (position: THREE.Vector3) => void;
  setGhostPosition: (pos: THREE.Vector3 | null) => void;
}

function ClickablePlane({ onPlaceClick, setGhostPosition }: ClickablePlaneProps) {
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const point = e.point.clone();
    point.y = 0.1; // Slightly above floor
    setGhostPosition(point);
  }, [setGhostPosition]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const point = e.point.clone();
    point.y = 0.1;
    onPlaceClick(point);
  }, [onPlaceClick]);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0.001, 0]}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setGhostPosition(null)}
      onClick={handleClick}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

interface SceneContentProps {
  templateId: string;
  size: string;
  onPlaceClick: (position: THREE.Vector3) => void;
  ghostPosition: THREE.Vector3 | null;
  setGhostPosition: (pos: THREE.Vector3 | null) => void;
}

function SceneContent({ templateId, size, onPlaceClick, ghostPosition, setGhostPosition }: SceneContentProps) {
  const Component = templateComponents[templateId] || ScalableClassroom;
  const sizeValue = size as 'small' | 'medium' | 'large';

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={30} blur={2} />
      
      <Grid 
        position={[0, -0.02, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3b82f6"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6366f1"
        fadeDistance={40}
      />

      <Component size={sizeValue} />
      
      <ClickablePlane onPlaceClick={onPlaceClick} setGhostPosition={setGhostPosition} />
      <GhostMarker position={ghostPosition} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

export function SensorPlacementMode({ 
  twinId, 
  templateId, 
  size, 
  onClose,
  onSensorPlaced
}: SensorPlacementModeProps) {
  const [ghostPosition, setGhostPosition] = useState<THREE.Vector3 | null>(null);
  const [placementPosition, setPlacementPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePlaceClick = useCallback((position: THREE.Vector3) => {
    setPlacementPosition({ x: position.x, y: position.y, z: position.z });
    setDialogOpen(true);
  }, []);

  const handleSensorCreated = useCallback(() => {
    setPlacementPosition(null);
    onSensorPlaced?.();
  }, [onSensorPlaced]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Exit Edit Mode
          </Button>
          <Badge variant="secondary" className="animate-pulse">
            <MousePointer className="h-3 w-3 mr-1" />
            Click to place sensor
          </Badge>
        </div>

        <Card className="p-2 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4 text-primary" />
            <span>Click anywhere on the floor to add a sensor</span>
          </div>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        shadows
        className="w-full h-full cursor-crosshair"
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent
            templateId={templateId}
            size={size}
            onPlaceClick={handlePlaceClick}
            ghostPosition={ghostPosition}
            setGhostPosition={setGhostPosition}
          />
        </Suspense>
      </Canvas>

      {/* Placement Dialog */}
      {placementPosition && (
        <SensorPlacementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          position={placementPosition}
          twinId={twinId}
          onSensorCreated={handleSensorCreated}
        />
      )}
    </div>
  );
}
