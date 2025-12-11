import { useMemo } from 'react';
import * as THREE from 'three';
import { RoomSize } from './templateConfig';
import { Line } from '@react-three/drei';

interface SoccerFieldFloorPlanProps {
  size?: RoomSize;
}

const SIZE_CONFIG = {
  small: { width: 25, depth: 15, goalWidth: 3, goalHeight: 2, penaltyArea: 4 },
  medium: { width: 50, depth: 30, goalWidth: 5, goalHeight: 2.4, penaltyArea: 8 },
  large: { width: 90, depth: 60, goalWidth: 7.3, goalHeight: 2.4, penaltyArea: 16.5 },
};

export function SoccerFieldFloorPlan({ size = 'medium' }: SoccerFieldFloorPlanProps) {
  const config = SIZE_CONFIG[size];
  const { width, depth, goalWidth, goalHeight, penaltyArea } = config;
  const centerCircleRadius = depth * 0.15;

  // Materials
  const grassMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#2d8a3e', 
    roughness: 0.9 
  }), []);
  
  const grassLightMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#3ca852', 
    roughness: 0.9 
  }), []);

  // Stripe pattern for grass
  const stripeWidth = width / 10;

  return (
    <group>
      {/* Base grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width + 4, depth + 4]} />
        <primitive object={grassMaterial} attach="material" />
      </mesh>

      {/* Grass stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[-width / 2 + stripeWidth / 2 + i * stripeWidth, 0.001, 0]}
          receiveShadow
        >
          <planeGeometry args={[stripeWidth - 0.1, depth]} />
          <primitive object={i % 2 === 0 ? grassMaterial : grassLightMaterial} attach="material" />
        </mesh>
      ))}

      {/* Field lines */}
      {/* Outer boundary */}
      <Line
        points={[
          [-width / 2, 0.02, -depth / 2],
          [width / 2, 0.02, -depth / 2],
          [width / 2, 0.02, depth / 2],
          [-width / 2, 0.02, depth / 2],
          [-width / 2, 0.02, -depth / 2],
        ]}
        color="white"
        lineWidth={2}
      />

      {/* Center line */}
      <Line
        points={[
          [0, 0.02, -depth / 2],
          [0, 0.02, depth / 2],
        ]}
        color="white"
        lineWidth={2}
      />

      {/* Center circle */}
      <Line
        points={Array.from({ length: 33 }, (_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          return [
            Math.cos(angle) * centerCircleRadius,
            0.02,
            Math.sin(angle) * centerCircleRadius,
          ] as [number, number, number];
        })}
        color="white"
        lineWidth={2}
      />

      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Penalty areas */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Penalty box */}
          <Line
            points={[
              [side * width / 2, 0.02, -penaltyArea],
              [side * (width / 2 - penaltyArea * 0.7), 0.02, -penaltyArea],
              [side * (width / 2 - penaltyArea * 0.7), 0.02, penaltyArea],
              [side * width / 2, 0.02, penaltyArea],
            ]}
            color="white"
            lineWidth={2}
          />
          
          {/* Goal area (smaller box) */}
          <Line
            points={[
              [side * width / 2, 0.02, -goalWidth],
              [side * (width / 2 - penaltyArea * 0.3), 0.02, -goalWidth],
              [side * (width / 2 - penaltyArea * 0.3), 0.02, goalWidth],
              [side * width / 2, 0.02, goalWidth],
            ]}
            color="white"
            lineWidth={2}
          />
          
          {/* Penalty spot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * (width / 2 - penaltyArea * 0.5), 0.02, 0]}>
            <circleGeometry args={[0.2, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      ))}

      {/* Goals */}
      {[-1, 1].map((side) => (
        <group key={`goal-${side}`} position={[side * width / 2, 0, 0]}>
          {/* Goal posts */}
          <mesh position={[side * 0.05, goalHeight / 2, -goalWidth / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, goalHeight, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[side * 0.05, goalHeight / 2, goalWidth / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, goalHeight, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Crossbar */}
          <mesh position={[side * 0.05, goalHeight, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, goalWidth, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Net (simplified) */}
          <mesh position={[side * -0.5, goalHeight / 2, 0]}>
            <boxGeometry args={[1, goalHeight, goalWidth]} />
            <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
          </mesh>
        </group>
      ))}

      {/* Corner arcs */}
      {[
        [-width / 2, -depth / 2],
        [-width / 2, depth / 2],
        [width / 2, -depth / 2],
        [width / 2, depth / 2],
      ].map(([x, z], i) => (
        <Line
          key={`corner-${i}`}
          points={Array.from({ length: 9 }, (_, j) => {
            const startAngle = (i === 0 ? 0 : i === 1 ? -Math.PI / 2 : i === 2 ? Math.PI / 2 : Math.PI);
            const angle = startAngle + (j / 8) * (Math.PI / 2);
            const radius = 1;
            return [
              x + Math.cos(angle) * radius * (x > 0 ? -1 : 1),
              0.02,
              z + Math.sin(angle) * radius * (z > 0 ? -1 : 1),
            ] as [number, number, number];
          })}
          color="white"
          lineWidth={2}
        />
      ))}

      {/* Benches */}
      {[-1, 1].map((side) => (
        <group key={`bench-${side}`} position={[0, 0, side * (depth / 2 + 2)]}>
          {/* Bench structure */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[6, 0.1, 1]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          {/* Bench legs */}
          {[-2.5, 0, 2.5].map((x, i) => (
            <mesh key={i} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.8]} />
              <meshStandardMaterial color="#4a4a4a" />
            </mesh>
          ))}
          {/* Roof */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[6.5, 0.1, 1.5]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          {/* Roof supports */}
          {[-2.8, 2.8].map((x, i) => (
            <mesh key={i} position={[x, 1, 0]}>
              <boxGeometry args={[0.1, 1.2, 0.1]} />
              <meshStandardMaterial color="#4a4a4a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Light poles for larger fields */}
      {size === 'large' && [
        [-width / 2 - 3, -depth / 2 - 3],
        [-width / 2 - 3, depth / 2 + 3],
        [width / 2 + 3, -depth / 2 - 3],
        [width / 2 + 3, depth / 2 + 3],
      ].map(([x, z], i) => (
        <group key={`light-${i}`} position={[x, 0, z]}>
          {/* Pole */}
          <mesh position={[0, 8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 16, 8]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          {/* Light fixture */}
          <mesh position={[0, 16, 0]}>
            <boxGeometry args={[2, 0.5, 2]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <pointLight position={[0, 15.5, 0]} intensity={0.5} distance={50} color="#fffaf0" />
        </group>
      ))}

      {/* Scoreboard */}
      <group position={[0, 0, -depth / 2 - 3]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[4, 1.5, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Score displays */}
        <mesh position={[-1, 2, 0.11]}>
          <boxGeometry args={[1.2, 0.8, 0.02]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[1, 2, 0.11]}>
          <boxGeometry args={[1.2, 0.8, 0.02]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
        {/* Support pole */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>
    </group>
  );
}
