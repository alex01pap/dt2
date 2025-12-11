import { useMemo } from 'react';
import * as THREE from 'three';
import { RoomSize } from './templateConfig';

interface ITClassroomFloorPlanProps {
  size?: RoomSize;
}

const SIZE_CONFIG = {
  small: { width: 10, depth: 8, height: 3.2, workstations: 6 },
  medium: { width: 14, depth: 10, height: 3.2, workstations: 10 },
  large: { width: 18, depth: 12, height: 3.5, workstations: 15 },
};

export function ITClassroomFloorPlan({ size = 'medium' }: ITClassroomFloorPlanProps) {
  const config = SIZE_CONFIG[size];
  const { width, depth, height, workstations } = config;

  // Calculate rows and columns based on workstation count
  const cols = Math.ceil(Math.sqrt(workstations * 1.5));
  const rows = Math.ceil(workstations / cols);

  // Materials
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#2c3e50', 
    roughness: 0.3 
  }), []);
  
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#34495e', 
    roughness: 0.6 
  }), []);
  
  const deskMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#1a1a2e', 
    roughness: 0.3,
    metalness: 0.2
  }), []);
  
  const monitorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#0f0f23', 
    roughness: 0.1,
    metalness: 0.8
  }), []);
  
  const screenMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#3b82f6', 
    emissive: '#3b82f6',
    emissiveIntensity: 0.3
  }), []);

  // Generate workstation positions
  const workstationPositions = useMemo(() => {
    const positions: [number, number][] = [];
    const startX = -width / 2 + 2.5;
    const startZ = -depth / 2 + 3;
    const spacingX = (width - 5) / cols;
    const spacingZ = (depth - 5) / rows;

    let count = 0;
    for (let row = 0; row < rows && count < workstations; row++) {
      for (let col = 0; col < cols && count < workstations; col++) {
        positions.push([
          startX + col * spacingX + spacingX / 2,
          startZ + row * spacingZ + spacingZ / 2
        ]);
        count++;
      }
    }
    return positions;
  }, [width, depth, rows, cols, workstations]);

  return (
    <group>
      {/* Floor - darker tech style */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Floor tiles pattern */}
      {Array.from({ length: Math.floor(width / 2) }).map((_, i) =>
        Array.from({ length: Math.floor(depth / 2) }).map((_, j) => (
          <mesh 
            key={`${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[-width / 2 + 1 + i * 2, 0.001, -depth / 2 + 1 + j * 2]}
          >
            <planeGeometry args={[1.9, 1.9]} />
            <meshStandardMaterial color="#3d5a73" roughness={0.4} />
          </mesh>
        ))
      )}

      {/* Walls */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.15]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.15, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.15, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Projector screen */}
      <mesh position={[0, height / 2, -depth / 2 + 0.1]} castShadow>
        <boxGeometry args={[width * 0.5, 1.5, 0.03]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Teacher's desk with computer */}
      <group position={[width / 2 - 1.5, 0, -depth / 2 + 1.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <primitive object={deskMaterial} attach="material" />
        </mesh>
        {/* Teacher monitor */}
        <mesh position={[0, 1, -0.2]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <primitive object={monitorMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1, -0.19]}>
          <boxGeometry args={[0.55, 0.35, 0.01]} />
          <primitive object={screenMaterial} attach="material" />
        </mesh>
      </group>

      {/* Server rack */}
      <group position={[-width / 2 + 0.5, 0, depth / 2 - 1]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.8, 2, 0.6]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Blinking lights */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0.35, 0.3 + i * 0.2, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#22c55e' : '#3b82f6'} 
              emissive={i % 2 === 0 ? '#22c55e' : '#3b82f6'}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Computer workstations */}
      {workstationPositions.map((pos, index) => (
        <group key={index} position={[pos[0], 0, pos[1]]}>
          {/* Desk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.4, 0.05, 0.7]} />
            <primitive object={deskMaterial} attach="material" />
          </mesh>
          
          {/* Desk frame */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.3, 0.4, 0.6]} />
            <meshStandardMaterial color="#0a0a14" />
          </mesh>
          
          {/* Monitor */}
          <mesh position={[0, 0.65, -0.2]} castShadow>
            <boxGeometry args={[0.55, 0.35, 0.03]} />
            <primitive object={monitorMaterial} attach="material" />
          </mesh>
          
          {/* Screen glow */}
          <mesh position={[0, 0.65, -0.18]}>
            <boxGeometry args={[0.5, 0.3, 0.01]} />
            <primitive object={screenMaterial} attach="material" />
          </mesh>
          
          {/* Monitor stand */}
          <mesh position={[0, 0.5, -0.2]}>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <primitive object={monitorMaterial} attach="material" />
          </mesh>
          
          {/* Keyboard */}
          <mesh position={[0, 0.43, 0.1]}>
            <boxGeometry args={[0.4, 0.02, 0.15]} />
            <meshStandardMaterial color="#2a2a3a" />
          </mesh>
          
          {/* Mouse */}
          <mesh position={[0.3, 0.43, 0.1]}>
            <boxGeometry args={[0.06, 0.02, 0.1]} />
            <meshStandardMaterial color="#2a2a3a" />
          </mesh>
          
          {/* Chair */}
          <mesh position={[0, 0.3, 0.55]} castShadow>
            <boxGeometry args={[0.45, 0.08, 0.45]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <mesh position={[0, 0.6, 0.75]} castShadow>
            <boxGeometry args={[0.45, 0.55, 0.05]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        </group>
      ))}

      {/* Ceiling lights (LED strips) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0, height - 0.1, -depth / 2 + 2 + i * (depth / 3)]}>
          <boxGeometry args={[width * 0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Network cables tray */}
      <mesh position={[0, height - 0.3, 0]}>
        <boxGeometry args={[width * 0.9, 0.1, 0.3]} />
        <meshStandardMaterial color="#4a4a5a" />
      </mesh>
    </group>
  );
}
