import { useMemo } from 'react';
import * as THREE from 'three';
import { RoomSize } from './templateConfig';

interface OutdoorAreaFloorPlanProps {
  size?: RoomSize;
}

const SIZE_CONFIG = {
  small: { width: 15, depth: 12, trees: 4, benches: 2 },
  medium: { width: 25, depth: 20, trees: 8, benches: 4 },
  large: { width: 40, depth: 30, trees: 15, benches: 8 },
};

export function OutdoorAreaFloorPlan({ size = 'medium' }: OutdoorAreaFloorPlanProps) {
  const config = SIZE_CONFIG[size];
  const { width, depth, trees, benches } = config;

  // Generate random tree positions
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const margin = 2;
    
    for (let i = 0; i < trees; i++) {
      const x = (Math.random() - 0.5) * (width - margin * 2);
      const z = (Math.random() - 0.5) * (depth - margin * 2);
      // Avoid center area for paths
      if (Math.abs(x) > 2 || Math.abs(z) > 2) {
        positions.push([x, 0, z]);
      } else {
        positions.push([
          x + (x >= 0 ? 3 : -3),
          0,
          z + (z >= 0 ? 3 : -3)
        ]);
      }
    }
    return positions;
  }, [width, depth, trees]);

  // Generate bench positions along paths
  const benchPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; rotation: number }[] = [];
    const pathLength = Math.max(width, depth) / 2;
    
    for (let i = 0; i < benches; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const along = (i / benches) * pathLength - pathLength / 2;
      
      if (i % 2 === 0) {
        positions.push({ pos: [along, 0, side * 1.5], rotation: side === 1 ? 0 : Math.PI });
      } else {
        positions.push({ pos: [side * 1.5, 0, along], rotation: side === 1 ? Math.PI / 2 : -Math.PI / 2 });
      }
    }
    return positions;
  }, [benches, width, depth]);

  return (
    <group>
      {/* Ground - grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#3ca852" roughness={0.9} />
      </mesh>

      {/* Outer border/fence area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[Math.max(width, depth) / 2 - 1, Math.max(width, depth) / 2, 64]} />
        <meshStandardMaterial color="#7c4a03" roughness={0.8} />
      </mesh>

      {/* Main path - cross pattern */}
      {/* Horizontal path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width * 0.8, 2]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      
      {/* Vertical path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2, depth * 0.8]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>

      {/* Center plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#c9b896" roughness={0.6} />
      </mesh>

      {/* Fountain in center */}
      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
          <meshStandardMaterial color="#8b8b8b" roughness={0.4} />
        </mesh>
        {/* Water */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
          <meshStandardMaterial color="#4a90d9" transparent opacity={0.7} />
        </mesh>
        {/* Center pillar */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 1, 16]} />
          <meshStandardMaterial color="#9b9b9b" roughness={0.3} />
        </mesh>
        {/* Top basin */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.3, 0.3, 16]} />
          <meshStandardMaterial color="#8b8b8b" roughness={0.4} />
        </mesh>
      </group>

      {/* Trees */}
      {treePositions.map((pos, i) => {
        const treeHeight = 3 + Math.random() * 2;
        const crownSize = 1.5 + Math.random() * 0.5;
        
        return (
          <group key={`tree-${i}`} position={pos}>
            {/* Trunk */}
            <mesh position={[0, treeHeight / 2, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, treeHeight, 8]} />
              <meshStandardMaterial color="#5d4037" roughness={0.8} />
            </mesh>
            {/* Crown - multiple layers */}
            <mesh position={[0, treeHeight, 0]} castShadow>
              <coneGeometry args={[crownSize, crownSize * 1.5, 8]} />
              <meshStandardMaterial color="#228b22" roughness={0.8} />
            </mesh>
            <mesh position={[0, treeHeight + crownSize * 0.8, 0]} castShadow>
              <coneGeometry args={[crownSize * 0.7, crownSize * 1.2, 8]} />
              <meshStandardMaterial color="#2e8b2e" roughness={0.8} />
            </mesh>
            {/* Shadow on ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <circleGeometry args={[crownSize * 0.8, 16]} />
              <meshStandardMaterial color="#1a4d1a" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Benches */}
      {benchPositions.map(({ pos, rotation }, i) => (
        <group key={`bench-${i}`} position={pos} rotation={[0, rotation, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.5, 0.08, 0.4]} />
            <meshStandardMaterial color="#8b4513" roughness={0.6} />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0.7, -0.15]} castShadow>
            <boxGeometry args={[1.5, 0.4, 0.05]} />
            <meshStandardMaterial color="#8b4513" roughness={0.6} />
          </mesh>
          {/* Legs */}
          {[-0.6, 0.6].map((x, j) => (
            <mesh key={j} position={[x, 0.22, 0]}>
              <boxGeometry args={[0.08, 0.45, 0.35]} />
              <meshStandardMaterial color="#4a4a4a" />
            </mesh>
          ))}
          {/* Arm rests */}
          {[-0.7, 0.7].map((x, j) => (
            <mesh key={`arm-${j}`} position={[x, 0.55, -0.05]}>
              <boxGeometry args={[0.05, 0.1, 0.3]} />
              <meshStandardMaterial color="#4a4a4a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Lamp posts */}
      {[
        [width / 4, depth / 4],
        [-width / 4, depth / 4],
        [width / 4, -depth / 4],
        [-width / 4, -depth / 4],
      ].map(([x, z], i) => (
        <group key={`lamp-${i}`} position={[x, 0, z]}>
          {/* Pole */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          {/* Lamp head */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#fffaf0" 
              emissive="#fffaf0" 
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Light */}
          <pointLight position={[0, 3, 0]} intensity={0.2} distance={8} color="#fffaf0" />
        </group>
      ))}

      {/* Flower beds */}
      {[
        [width / 3, 0],
        [-width / 3, 0],
        [0, depth / 3],
        [0, -depth / 3],
      ].map(([x, z], i) => (
        <group key={`flowers-${i}`} position={[x, 0, z]}>
          {/* Bed border */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[0.8, 1, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.8} />
          </mesh>
          {/* Soil */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <circleGeometry args={[0.8, 16]} />
            <meshStandardMaterial color="#3d2817" roughness={0.9} />
          </mesh>
          {/* Flowers */}
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (j / 5) * Math.PI * 2;
            const r = 0.4;
            const flowerColors = ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
            return (
              <mesh 
                key={j} 
                position={[Math.cos(angle) * r, 0.15, Math.sin(angle) * r]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={flowerColors[j % flowerColors.length]} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Playground equipment for school context */}
      {size !== 'small' && (
        <group position={[width / 3, 0, -depth / 3]}>
          {/* Swing set frame */}
          <mesh position={[-1, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[1, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          {/* Top bar */}
          <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          {/* Swing seat */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.2]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        </group>
      )}
    </group>
  );
}
