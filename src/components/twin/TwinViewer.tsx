import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Html, 
  Billboard, 
  Environment, 
  ContactShadows, 
  Grid, 
  GizmoHelper, 
  GizmoViewport,
  Float,
  Sparkles,
  Stars
} from '@react-three/drei';
import { Suspense, useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';
import { SensorEditDialog } from './SensorEditDialog';
import SchoolClassroomFloorPlan from './SchoolClassroomFloorPlan';
import GymnasiumFloorPlan from './GymnasiumFloorPlan';
import LaboratoryFloorPlan from './LaboratoryFloorPlan';
import MusicRoomFloorPlan from './MusicRoomFloorPlan';
import ComputerLabFloorPlan from './ComputerLabFloorPlan';
import CafeteriaFloorPlan from './CafeteriaFloorPlan';
import { Settings } from 'lucide-react';

// Floor plan type mapping
export type FloorPlanType = 'classroom' | 'gymnasium' | 'laboratory' | 'music-room' | 'computer-lab' | 'cafeteria';

const FloorPlanComponents: Record<FloorPlanType, React.ComponentType> = {
  'classroom': SchoolClassroomFloorPlan,
  'gymnasium': GymnasiumFloorPlan,
  'laboratory': LaboratoryFloorPlan,
  'music-room': MusicRoomFloorPlan,
  'computer-lab': ComputerLabFloorPlan,
  'cafeteria': CafeteriaFloorPlan,
};

export interface SensorData {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated?: Date;
  thresholds?: { min?: number; max?: number; unit?: string };
}

export interface HeatData {
  position: [number, number, number];
  intensity: number;
  color: string;
}

export interface FlowPipeData {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  radius: number;
  color: string;
  status: 'normal' | 'warning' | 'critical' | 'active';
  type: string;
}

interface TwinViewerProps {
  twinId: string;
  floorPlanType?: FloorPlanType;
  floorplanData?: any;
  sensors?: SensorData[];
  heatData?: HeatData[];
  flowPipes?: FlowPipeData[];
  className?: string;
}

// Dynamic Floor Plan Component
function DynamicFloorPlan({ type }: { type: FloorPlanType }) {
  const Component = FloorPlanComponents[type] || SchoolClassroomFloorPlan;
  return <Component />;
}

// Heat Overlay Component with animation
function HeatOverlay({ heatData }: { heatData: HeatData[] }) {
  const heatPoints = useMemo(() => {
    return heatData.map((point, index) => (
      <mesh key={index} position={point.position}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 16]} />
        <meshBasicMaterial 
          color={point.color} 
          transparent 
          opacity={point.intensity * 0.6} 
        />
      </mesh>
    ));
  }, [heatData]);

  return <group>{heatPoints}</group>;
}

// Flow Pipes Component
function FlowPipes({ pipes }: { pipes: FlowPipeData[] }) {
  return (
    <group>
      {pipes.map((pipe) => {
        const start = new Vector3(...pipe.start);
        const end = new Vector3(...pipe.end);
        const distance = start.distanceTo(end);
        const midpoint = start.clone().lerp(end, 0.5);
        
        const direction = end.clone().sub(start).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0), 
          direction
        );
        
        return (
          <mesh 
            key={pipe.id} 
            position={midpoint.toArray()}
            quaternion={quaternion.toArray() as [number, number, number, number]}
          >
            <cylinderGeometry args={[pipe.radius, pipe.radius, distance, 8]} />
            <meshStandardMaterial color={pipe.color} transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// Animated Sensor Marker with Float and Sparkles
function SensorMarker({ sensor, onEdit }: { sensor: SensorData; onEdit: (sensor: SensorData) => void }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const statusColor = sensor.status === 'critical' ? '#ef4444' : 
                      sensor.status === 'warning' ? '#f59e0b' : '#10b981';
  
  const sensorIcon = {
    'sound': '🔊',
    'temperature': '🌡️',
    'humidity': '💧',
    'air_quality': '🌬️',
    'occupancy': '👥',
    'light': '💡',
  }[sensor.type] || '📡';

  // Animate pulse ring
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.15;
      ringRef.current.scale.set(scale, 1, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 
        0.3 + Math.sin(clock.elapsedTime * 2) * 0.2;
    }
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onEdit(sensor);
  };

  return (
    <group position={sensor.position}>
      {/* Sparkles for warning/critical sensors */}
      {sensor.status !== 'normal' && (
        <Sparkles
          count={20}
          scale={1}
          size={3}
          speed={0.4}
          color={statusColor}
        />
      )}
      
      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Floating main marker */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
          position={[0, 0.3, 0]}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshPhysicalMaterial 
            color={statusColor} 
            emissive={statusColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.5}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      {/* Vertical line to show height - glowing beam */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.03, 0.3, 8]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.7} />
      </mesh>
      
      {/* Info popup on hover */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center distanceFactor={15}>
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 min-w-[160px] animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{sensorIcon}</span>
              <span className="font-semibold text-sm text-foreground">{sensor.name}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {sensor.value} <span className="text-sm font-normal text-muted-foreground">{sensor.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge 
                variant={sensor.status === 'normal' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {sensor.status}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Settings className="h-3 w-3" /> Click to edit
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Label below marker */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.18}
          color="#374151"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {sensor.type === 'sound' ? `${sensor.value}dB` : sensor.name.split(' ')[0]}
        </Text>
      </Billboard>
    </group>
  );
}

// Loading Component
function LoadingScene() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={1} color="black">
        Loading Twin...
      </Text>
    </group>
  );
}

export function TwinViewer({ 
  twinId,
  floorPlanType = 'classroom',
  sensors: propSensors = [],
  heatData = [],
  flowPipes = [],
  className 
}: TwinViewerProps) {
  const [overlayMode, setOverlayMode] = useState<'none' | 'heat' | 'flow'>('none');
  const [editingSensor, setEditingSensor] = useState<SensorData | null>(null);
  
  // Filter sensors by twinId
  const { sensors: realtimeSensors, isConnected, refresh } = useRealtimeSensors(twinId);

  // Get unit for sensor type
  const getUnit = (type: string) => {
    const units: Record<string, string> = {
      temperature: '°C',
      humidity: '%',
      air_quality: 'ppm',
      pressure: 'hPa',
      flow: 'L/min',
      vibration: 'Hz'
    };
    return units[type] || '';
  };

  // Use realtime sensors if no sensors provided via props - prefer position_3d, fallback to location
  const sensors = propSensors.length > 0 ? propSensors : realtimeSensors
    .filter(s => s.position_3d || s.location) // Only show sensors with 3D positions
    .map(s => {
      const pos = s.position_3d || s.location!;
      const thresholds = s.thresholds as { min?: number; max?: number; unit?: string } | null;
      return {
        id: s.id,
        name: s.name,
        type: s.type,
        position: [pos.x, pos.y + 0.1, pos.z] as [number, number, number],
        value: s.last_reading || 0,
        unit: getUnit(s.type),
        status: s.status === 'online' ? 'normal' : s.status === 'warning' ? 'warning' : 'critical' as 'normal' | 'warning' | 'critical',
        thresholds: thresholds || undefined
      };
    });

  const handleEditSensor = (sensor: SensorData) => {
    setEditingSensor(sensor);
  };

  return (
    <div className={className}>
      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Card className="p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setOverlayMode(overlayMode === 'heat' ? 'none' : 'heat')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                overlayMode === 'heat' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              Heat Map
            </button>
            <button
              onClick={() => setOverlayMode(overlayMode === 'flow' ? 'none' : 'flow')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                overlayMode === 'flow' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              Flow Pipes
            </button>
          </div>
        </Card>
        
        {/* Connection Status */}
        <Card className="p-2">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        shadows
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingScene />}>
          {/* Environment & Sky */}
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[15, 20, 10]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight 
            position={[-10, 10, -10]} 
            intensity={0.5} 
            color="#b4c5e4"
          />
          <pointLight position={[0, 8, 0]} intensity={0.5} color="#fff5e6" />
          
          {/* Contact Shadows for realistic grounding */}
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={30} 
            blur={2} 
            far={10}
            color="#1a1a2e"
          />
          
          {/* Technical Grid - Digital Twin aesthetic */}
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
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
          
          {/* Scene Components */}
          <DynamicFloorPlan type={floorPlanType} />
          
          {/* Overlays */}
          {overlayMode === 'heat' && <HeatOverlay heatData={heatData} />}
          {overlayMode === 'flow' && <FlowPipes pipes={flowPipes} />}
          
          {/* Sensors */}
          {sensors.map((sensor) => (
            <SensorMarker key={sensor.id} sensor={sensor} onEdit={handleEditSensor} />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={50}
            enableDamping
            dampingFactor={0.05}
          />
          
          {/* Orientation Gizmo */}
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport 
              axisColors={['#ef4444', '#22c55e', '#3b82f6']} 
              labelColor="white"
            />
          </GizmoHelper>
        </Suspense>
      </Canvas>

      {/* Sensor Edit Dialog */}
      <SensorEditDialog
        open={!!editingSensor}
        onOpenChange={(open) => !open && setEditingSensor(null)}
        sensor={editingSensor}
        onSensorUpdated={refresh}
        onSensorDeleted={refresh}
      />
    </div>
  );
}