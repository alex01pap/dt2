import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Billboard } from '@react-three/drei';
import { Suspense, useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';
import SchoolClassroomFloorPlan from './SchoolClassroomFloorPlan';
import GymnasiumFloorPlan from './GymnasiumFloorPlan';
import LaboratoryFloorPlan from './LaboratoryFloorPlan';
import MusicRoomFloorPlan from './MusicRoomFloorPlan';
import ComputerLabFloorPlan from './ComputerLabFloorPlan';
import CafeteriaFloorPlan from './CafeteriaFloorPlan';

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

// Animated Sensor Marker
function SensorMarker({ sensor }: { sensor: SensorData }) {
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

  return (
    <group position={sensor.position}>
      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0.3, 0]}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={statusColor} 
          emissive={statusColor}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Vertical line to show height */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.5} />
      </mesh>
      
      {/* Info popup on hover */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center distanceFactor={15}>
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 min-w-[140px] animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{sensorIcon}</span>
              <span className="font-semibold text-sm text-foreground">{sensor.name}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {sensor.value} <span className="text-sm font-normal text-muted-foreground">{sensor.unit}</span>
            </div>
            <Badge 
              variant={sensor.status === 'normal' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {sensor.status}
            </Badge>
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
  const { sensors: realtimeSensors, isConnected } = useRealtimeSensors();

  // Use realtime sensors if no sensors provided via props
  const sensors = propSensors.length > 0 ? propSensors : realtimeSensors.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    position: s.location ? [s.location.x, s.location.y, s.location.z] as [number, number, number] : [0, 0, 0] as [number, number, number],
    value: s.last_reading || 0,
    unit: s.type === 'temperature' ? '°C' : s.type === 'power' ? 'W' : '',
    status: s.status === 'online' ? 'normal' : s.status === 'warning' ? 'warning' : 'critical' as 'normal' | 'warning' | 'critical'
  }));

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
      >
        <Suspense fallback={<LoadingScene />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Scene Components */}
          <DynamicFloorPlan type={floorPlanType} />
          
          {/* Overlays */}
          {overlayMode === 'heat' && <HeatOverlay heatData={heatData} />}
          {overlayMode === 'flow' && <FlowPipes pipes={flowPipes} />}
          
          {/* Sensors */}
          {sensors.map((sensor) => (
            <SensorMarker key={sensor.id} sensor={sensor} />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}