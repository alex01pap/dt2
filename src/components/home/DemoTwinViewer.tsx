import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Html, 
  Billboard, 
  Environment, 
  ContactShadows, 
  Grid, 
  Float
} from '@react-three/drei';
import { Suspense, useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import SchoolClassroomFloorPlan from '@/components/twin/SchoolClassroomFloorPlan';
import { classroomSensorData, classroomHeatData, classroomFlowData } from '@/data/schoolMockData';
import type { SensorData, HeatData, FlowPipeData } from '@/components/twin/TwinViewer';
import { Vector3 } from 'three';

// Heat Overlay Component
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

// Demo Sensor Marker (read-only, no edit functionality)
function DemoSensorMarker({ sensor }: { sensor: SensorData }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const statusColor = sensor.status === 'critical' ? '#ef4444' : 
                      sensor.status === 'warning' ? '#f59e0b' : '#22c55e';
  
  const sensorIcon = {
    'sound': '🔊',
    'temperature': '🌡️',
    'humidity': '💧',
    'air_quality': '🌬️',
    'occupancy': '👥',
    'light': '💡',
  }[sensor.type] || '📡';

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
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          position={[0, 0.3, 0]}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshPhysicalMaterial 
            color={statusColor} 
            emissive={statusColor}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.3}
            roughness={0.4}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </Float>

      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.03, 0.3, 8]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.7} />
      </mesh>
      
      {hovered && (
        <Html 
          position={[0, 0.8, 0]} 
          center 
          distanceFactor={8}
          occlude
          style={{
            transition: 'all 0.2s ease-out',
            transform: 'scale(1)',
            pointerEvents: 'none',
          }}
        >
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-3 min-w-[140px] animate-scale-in pointer-events-none">
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

      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.18}
          color="#64748b"
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
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={0.5} color="#64748b">
        Loading...
      </Text>
    </group>
  );
}

export function DemoTwinViewer() {
  const [overlayMode, setOverlayMode] = useState<'none' | 'heat' | 'flow'>('none');

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-border bg-card">
      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-background border border-border rounded-xl p-2 flex gap-2 shadow-md">
          <button
            onClick={() => setOverlayMode(overlayMode === 'heat' ? 'none' : 'heat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              overlayMode === 'heat' 
                ? 'bg-destructive text-destructive-foreground' 
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            Heat Map
          </button>
          <button
            onClick={() => setOverlayMode(overlayMode === 'flow' ? 'none' : 'flow')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              overlayMode === 'flow' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            HVAC Flow
          </button>
        </div>
        
        <div className="bg-background border border-border rounded-xl px-4 py-2 shadow-md">
          <Badge variant="secondary" className="text-xs">
            Demo Mode
          </Badge>
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background border border-border rounded-full px-4 py-2 text-xs text-muted-foreground shadow-md">
          Click and drag to explore • Scroll to zoom • Hover sensors for data
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [12, 10, 12], fov: 50 }}
        shadows
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={<LoadingScene />}>
          <Environment preset="city" />
          <color attach="background" args={['#f8fafc']} />
          
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[15, 20, 10]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#e2e8f0" />
          <pointLight position={[0, 8, 0]} intensity={0.3} color="#fff5e6" />
          
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.3} 
            scale={30} 
            blur={2} 
            far={10}
            color="#1e293b"
          />
          
          <Grid 
            position={[0, -0.02, 0]}
            args={[50, 50]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#e2e8f0"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#cbd5e1"
            fadeDistance={40}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
          
          <SchoolClassroomFloorPlan />
          
          {overlayMode === 'heat' && <HeatOverlay heatData={classroomHeatData} />}
          {overlayMode === 'flow' && <FlowPipes pipes={classroomFlowData} />}
          
          {classroomSensorData.map((sensor) => (
            <DemoSensorMarker key={sensor.id} sensor={sensor} />
          ))}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={30}
            autoRotate
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
