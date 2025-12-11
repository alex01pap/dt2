import { useMemo } from 'react';
import * as THREE from 'three';
import { RoomSize } from './templateConfig';

interface ScalableClassroomProps {
  size?: RoomSize;
}

const SIZE_CONFIG = {
  small: { width: 8, depth: 6, height: 3.2, desks: { rows: 3, cols: 2 } },
  medium: { width: 12, depth: 10, height: 3.2, desks: { rows: 4, cols: 3 } },
  large: { width: 16, depth: 12, height: 3.5, desks: { rows: 5, cols: 4 } },
};

export function ScalableClassroom({ size = 'medium' }: ScalableClassroomProps) {
  const config = SIZE_CONFIG[size];
  const { width, depth, height, desks } = config;

  // Materials
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#e8dcc8', 
    roughness: 0.8 
  }), []);
  
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#f5f0e8', 
    roughness: 0.6 
  }), []);
  
  const deskMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#c4a77d', 
    roughness: 0.5 
  }), []);
  
  const chairMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#3b82f6', 
    roughness: 0.4 
  }), []);
  
  const whiteboardMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ffffff', 
    roughness: 0.1 
  }), []);

  // Generate desks
  const deskPositions = useMemo(() => {
    const positions: [number, number][] = [];
    const startX = -width / 2 + 2;
    const startZ = -depth / 2 + 2.5;
    const spacingX = (width - 4) / desks.cols;
    const spacingZ = (depth - 4) / desks.rows;

    for (let row = 0; row < desks.rows; row++) {
      for (let col = 0; col < desks.cols; col++) {
        positions.push([
          startX + col * spacingX + spacingX / 2,
          startZ + row * spacingZ + spacingZ / 2
        ]);
      }
    }
    return positions;
  }, [width, depth, desks]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.15]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.15, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.15, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Whiteboard */}
      <mesh position={[0, height / 2, -depth / 2 + 0.1]} castShadow>
        <boxGeometry args={[width * 0.6, 1.2, 0.05]} />
        <primitive object={whiteboardMaterial} attach="material" />
      </mesh>
      
      {/* Whiteboard frame */}
      <mesh position={[0, height / 2, -depth / 2 + 0.08]}>
        <boxGeometry args={[width * 0.6 + 0.1, 1.3, 0.02]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Teacher's desk */}
      <mesh position={[0, 0.4, -depth / 2 + 1.5]} castShadow>
        <boxGeometry args={[1.8, 0.8, 0.8]} />
        <primitive object={deskMaterial} attach="material" />
      </mesh>

      {/* Student desks and chairs */}
      {deskPositions.map((pos, index) => (
        <group key={index} position={[pos[0], 0, pos[1]]}>
          {/* Desk */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.2, 0.05, 0.6]} />
            <primitive object={deskMaterial} attach="material" />
          </mesh>
          
          {/* Desk legs */}
          {[[-0.5, 0.15, -0.25], [0.5, 0.15, -0.25], [-0.5, 0.15, 0.25], [0.5, 0.15, 0.25]].map((legPos, i) => (
            <mesh key={i} position={legPos as [number, number, number]} castShadow>
              <boxGeometry args={[0.04, 0.3, 0.04]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
          ))}
          
          {/* Chair */}
          <mesh position={[0, 0.25, 0.5]} castShadow>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <primitive object={chairMaterial} attach="material" />
          </mesh>
          
          {/* Chair back */}
          <mesh position={[0, 0.5, 0.7]} castShadow>
            <boxGeometry args={[0.4, 0.5, 0.05]} />
            <primitive object={chairMaterial} attach="material" />
          </mesh>
          
          {/* Chair legs */}
          {[[-0.15, 0.1, 0.35], [0.15, 0.1, 0.35], [-0.15, 0.1, 0.65], [0.15, 0.1, 0.65]].map((legPos, i) => (
            <mesh key={i} position={legPos as [number, number, number]}>
              <boxGeometry args={[0.03, 0.2, 0.03]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Windows on left wall */}
      {Array.from({ length: Math.floor(depth / 3) }).map((_, i) => (
        <mesh 
          key={i} 
          position={[-width / 2 + 0.1, height / 2, -depth / 2 + 2 + i * 3]}
          castShadow
        >
          <boxGeometry args={[0.05, 1.5, 1.8]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Ceiling light */}
      <mesh position={[0, height - 0.1, 0]}>
        <boxGeometry args={[width * 0.7, 0.1, 0.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>

      {/* AC unit */}
      <mesh position={[width / 2 - 0.3, height - 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
}
