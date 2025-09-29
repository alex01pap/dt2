import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Suspense, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Vector3, Color } from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLiveSocket } from '@/hooks/useLiveSocket';

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
  floorplanData?: any;
  sensors?: SensorData[];
  heatData?: HeatData[];
  flowPipes?: FlowPipeData[];
  className?: string;
}

import RestaurantFloorPlan from './RestaurantFloorPlan';

// Floor Plan Component - Keep for backward compatibility
const FloorPlan = RestaurantFloorPlan;

// Heat Overlay Component
function HeatOverlay({ heatData }: { heatData: HeatData[] }) {
  const heatPoints = useMemo(() => {
    return heatData.map((point, index) => {
      return (
        <mesh key={index} position={point.position}>
          <cylinderGeometry args={[1, 1, 0.1, 8]} />
          <meshBasicMaterial color={point.color} transparent opacity={point.intensity} />
        </mesh>
      );
    });
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
        
        // Calculate rotation to align cylinder with pipe direction
        const direction = end.clone().sub(start).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0), 
          direction
        );
        
        return (
          <mesh 
            key={pipe.id} 
            position={midpoint.toArray()}
            quaternion={quaternion.toArray()}
          >
            <cylinderGeometry args={[pipe.radius, pipe.radius, distance, 8]} />
            <meshStandardMaterial color={pipe.color} />
          </mesh>
        );
      })}
    </group>
  );
}

// Sensor Badge Component
function SensorBadge({ sensor }: { sensor: SensorData }) {
  const [hovered, setHovered] = useState(false);
  
  const badgeColor = sensor.status === 'critical' ? '#ef4444' : 
                    sensor.status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <group position={sensor.position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0.5, 0]}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={badgeColor} 
          emissive={hovered ? badgeColor : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <TooltipProvider>
            <Tooltip open={true}>
              <TooltipTrigger asChild>
                <div />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-background border shadow-lg">
                <div className="p-2 space-y-1">
                  <div className="font-semibold">{sensor.name}</div>
                  <div className="text-sm text-muted-foreground">{sensor.type}</div>
                  <div className="font-mono text-lg">
                    {sensor.value.toFixed(1)} {sensor.unit}
                  </div>
                  <Badge variant={sensor.status === 'normal' ? 'default' : 'destructive'}>
                    {sensor.status}
                  </Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Html>
      )}
      
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {sensor.name}
      </Text>
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
  sensors = [],
  heatData = [],
  flowPipes = [],
  className 
}: TwinViewerProps) {
  const [overlayMode, setOverlayMode] = useState<'none' | 'heat' | 'flow'>('none');
  const { isConnected, lastMessage, sendMessage } = useLiveSocket();

  // Mock live data updates
  useEffect(() => {
    if (!isConnected) return;

    const handleSensorUpdate = (data: any) => {
      console.log('Received sensor update:', data);
      // Update sensor data in real-time
    };

    // In a real implementation, you would listen to socket events
    // socket.on('sensor-update', handleSensorUpdate);
    // socket.on('twin-data', handleSensorUpdate);

    // For now, we'll simulate updates based on lastMessage
    if (lastMessage?.type === 'data_update') {
      handleSensorUpdate(lastMessage.payload);
    }

    // Cleanup would be:
    // return () => {
    //   socket.off('sensor-update', handleSensorUpdate);
    //   socket.off('twin-data', handleSensorUpdate);
    // };
  }, [isConnected, lastMessage]);

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
          <FloorPlan />
          
          {/* Overlays */}
          {overlayMode === 'heat' && <HeatOverlay heatData={heatData} />}
          {overlayMode === 'flow' && <FlowPipes pipes={flowPipes} />}
          
          {/* Sensors */}
          {sensors.map((sensor) => (
            <SensorBadge key={sensor.id} sensor={sensor} />
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