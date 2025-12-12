import { useMemo } from 'react';
import * as THREE from 'three';
import { RoomSize } from './templateConfig';

interface GymnasiumFloorPlanProps {
  size: RoomSize;
}

const SIZE_CONFIG = {
  small: { width: 20, depth: 15, height: 6, courtWidth: 14, courtDepth: 10, bleacherRows: 2 },
  medium: { width: 30, depth: 20, height: 8, courtWidth: 22, courtDepth: 14, bleacherRows: 3 },
  large: { width: 45, depth: 30, height: 10, courtWidth: 28, courtDepth: 18, bleacherRows: 4 },
};

export function GymnasiumFloorPlan({ size }: GymnasiumFloorPlanProps) {
  const config = SIZE_CONFIG[size];
  const { width, depth, height, courtWidth, courtDepth, bleacherRows } = config;

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8e4de' }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c4a574' }), []);
  const lineMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff' }), []);
  const bleacherMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3b82f6' }), []);
  const hoopMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff6b35' }), []);
  const poleMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#374151' }), []);
  const equipmentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#27ae60' }), []);
  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#87ceeb', 
    transparent: true, 
    opacity: 0.5 
  }), []);

  return (
    <group>
      {/* Main Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
        material={floorMaterial}
      >
        <planeGeometry args={[width, depth]} />
      </mesh>

      {/* Basketball Court Lines */}
      <group position={[0, 0.01, 0]}>
        {/* Outer boundary */}
        <mesh position={[0, 0, -courtDepth / 2]} material={lineMaterial}>
          <boxGeometry args={[courtWidth, 0.02, 0.1]} />
        </mesh>
        <mesh position={[0, 0, courtDepth / 2]} material={lineMaterial}>
          <boxGeometry args={[courtWidth, 0.02, 0.1]} />
        </mesh>
        <mesh position={[-courtWidth / 2, 0, 0]} material={lineMaterial}>
          <boxGeometry args={[0.1, 0.02, courtDepth]} />
        </mesh>
        <mesh position={[courtWidth / 2, 0, 0]} material={lineMaterial}>
          <boxGeometry args={[0.1, 0.02, courtDepth]} />
        </mesh>
        
        {/* Center line */}
        <mesh position={[0, 0, 0]} material={lineMaterial}>
          <boxGeometry args={[0.1, 0.02, courtDepth]} />
        </mesh>
        
        {/* Center circle */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, height / 2, -depth / 2]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.2]} />
      </mesh>
      <mesh position={[0, height / 2, depth / 2]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.2]} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
      </mesh>

      {/* Basketball Hoops */}
      {[-1, 1].map((side) => (
        <group key={side} position={[(courtWidth / 2 - 1) * side, 0, 0]}>
          {/* Backboard */}
          <mesh position={[0.3 * side, 3.5, 0]}>
            <boxGeometry args={[0.1, 1.2, 1.8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Rim */}
          <mesh position={[0.8 * side, 3.05, 0]} rotation={[0, 0, Math.PI / 2]} material={hoopMaterial}>
            <torusGeometry args={[0.45, 0.03, 8, 16]} />
          </mesh>
          {/* Pole */}
          <mesh position={[-0.2 * side, 2, 0]} material={poleMaterial}>
            <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
          </mesh>
        </group>
      ))}

      {/* Bleachers */}
      {Array.from({ length: bleacherRows }).map((_, row) => (
        <mesh 
          key={row} 
          position={[0, 0.5 + row * 0.5, -depth / 2 + 1 + row * 0.6]}
          material={bleacherMaterial}
          castShadow
        >
          <boxGeometry args={[width * 0.7, 0.4, 1.2]} />
        </mesh>
      ))}

      {/* Gym Equipment Area */}
      <group position={[-width / 2 + 3, 0, depth / 2 - 3]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} position={[i * 2.5, 0.05, 0]} material={equipmentMaterial}>
            <boxGeometry args={[2, 0.1, 1]} />
          </mesh>
        ))}
      </group>

      {/* Volleyball Net Posts (if medium or large) */}
      {size !== 'small' && (
        <>
          <mesh position={[0, 1.25, -courtDepth / 2 + 2]} material={poleMaterial}>
            <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
          </mesh>
          <mesh position={[0, 1.25, courtDepth / 2 - 2]} material={poleMaterial}>
            <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
          </mesh>
        </>
      )}

      {/* Windows */}
      {Array.from({ length: Math.floor(width / 6) }).map((_, i) => {
        const xPos = -width / 2 + 4 + i * 6;
        return (
          <group key={i}>
            <mesh position={[xPos, height * 0.75, -depth / 2 + 0.05]} material={windowMaterial}>
              <boxGeometry args={[2, 1.5, 0.1]} />
            </mesh>
            <mesh position={[xPos, height * 0.75, depth / 2 - 0.05]} material={windowMaterial}>
              <boxGeometry args={[2, 1.5, 0.1]} />
            </mesh>
          </group>
        );
      })}

      {/* Ceiling Lights */}
      {Array.from({ length: Math.ceil(width / 12) }).map((_, i) => (
        <mesh key={i} position={[-width / 4 + i * (width / 2), height - 0.1, 0]}>
          <boxGeometry args={[3, 0.1, 0.5]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffee" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Scoreboard */}
      <group position={[0, height * 0.75, -depth / 2 + 0.1]}>
        <mesh>
          <boxGeometry args={[3, 1.5, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.8, 1.3, 0.1]} />
          <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Emergency Exit */}
      <mesh position={[width / 2 - 0.1, 1.25, -depth / 4]}>
        <boxGeometry args={[0.15, 2.5, 1.5]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

export default GymnasiumFloorPlan;
