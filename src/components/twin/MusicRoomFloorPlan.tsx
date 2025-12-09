import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const MusicRoomFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Floor - Wooden for acoustics */}
      <Plane
        args={[12, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#8b7355" />
      </Plane>

      {/* Acoustic Ceiling */}
      <Plane
        args={[12, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.5, 0]}
      >
        <meshStandardMaterial color="#2c2c2c" />
      </Plane>

      {/* Walls with acoustic panels */}
      <Box args={[12, 3.5, 0.15]} position={[0, 1.75, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d3d3d" />
      </Box>
      <Box args={[12, 3.5, 0.15]} position={[0, 1.75, 5]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d3d3d" />
      </Box>
      <Box args={[0.15, 3.5, 10]} position={[-6, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d3d3d" />
      </Box>
      <Box args={[0.15, 3.5, 10]} position={[6, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d3d3d" />
      </Box>

      {/* Acoustic Foam Panels on walls */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <Box key={`front-${i}`} args={[1.5, 2, 0.1]} position={[x, 2, -4.9]}>
          <meshStandardMaterial color="#4a4a4a" />
        </Box>
      ))}
      {[-3, 0, 3].map((z, i) => (
        <Box key={`side-${i}`} args={[0.1, 2, 1.5]} position={[-5.9, 2, z]}>
          <meshStandardMaterial color="#4a4a4a" />
        </Box>
      ))}

      {/* Grand Piano */}
      <group position={[-3, 0, -2]}>
        {/* Piano Body */}
        <Box args={[2.5, 0.2, 1.8]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Piano Lid */}
        <Box args={[2.3, 0.05, 1.6]} position={[0.1, 0.92, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Piano Legs */}
        {[[-1, -0.6], [1, -0.6], [0, 0.6]].map(([x, z], i) => (
          <Cylinder key={i} args={[0.06, 0.08, 0.7, 8]} position={[x, 0.35, z]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Cylinder>
        ))}
        {/* Keyboard */}
        <Box args={[1.8, 0.08, 0.15]} position={[0.3, 0.75, 0.85]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Box>
        {/* Piano Bench */}
        <Box args={[1, 0.08, 0.35]} position={[0.3, 0.5, 1.3]} castShadow>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      </group>

      {/* Drum Kit */}
      <group position={[3, 0, -3]}>
        {/* Bass Drum */}
        <Cylinder args={[0.5, 0.5, 0.4, 16]} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#8b0000" />
        </Cylinder>
        {/* Snare */}
        <Cylinder args={[0.2, 0.2, 0.15, 16]} position={[-0.5, 0.8, 0.5]}>
          <meshStandardMaterial color="#c0c0c0" />
        </Cylinder>
        {/* Hi-Hat */}
        <Cylinder args={[0.18, 0.18, 0.02, 16]} position={[-0.8, 1, 0]}>
          <meshStandardMaterial color="#ffd700" />
        </Cylinder>
        <Cylinder args={[0.18, 0.18, 0.02, 16]} position={[-0.8, 1.05, 0]}>
          <meshStandardMaterial color="#ffd700" />
        </Cylinder>
        {/* Cymbal */}
        <Cylinder args={[0.25, 0.25, 0.02, 16]} position={[0.7, 1.2, 0]}>
          <meshStandardMaterial color="#ffd700" />
        </Cylinder>
        {/* Drum Stool */}
        <Cylinder args={[0.15, 0.18, 0.5, 12]} position={[0, 0.25, 0.8]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
      </group>

      {/* Music Stands */}
      {[
        [-1, 1], [0.5, 1], [2, 1],
        [-1, 2.5], [0.5, 2.5], [2, 2.5]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Stand Pole */}
          <Cylinder args={[0.015, 0.02, 1.2, 8]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Sheet Holder */}
          <Box args={[0.35, 0.45, 0.02]} position={[0, 1.15, 0.05]} rotation={[0.3, 0, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          {/* Tripod Base */}
          {[0, 2.1, 4.2].map((angle, j) => (
            <Cylinder 
              key={j} 
              args={[0.01, 0.01, 0.3, 8]} 
              position={[Math.sin(angle) * 0.12, 0.05, Math.cos(angle) * 0.12]}
              rotation={[0.3 * Math.cos(angle), 0, -0.3 * Math.sin(angle)]}
            >
              <meshStandardMaterial color="#2c3e50" />
            </Cylinder>
          ))}
        </group>
      ))}

      {/* Chairs for musicians */}
      {[
        [-1, 1.3], [0.5, 1.3], [2, 1.3],
        [-1, 2.8], [0.5, 2.8], [2, 2.8]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Box args={[0.4, 0.05, 0.4]} position={[0, 0.45, 0]} castShadow>
            <meshStandardMaterial color="#2c3e50" />
          </Box>
          <Box args={[0.4, 0.35, 0.05]} position={[0, 0.6, -0.18]}>
            <meshStandardMaterial color="#2c3e50" />
          </Box>
        </group>
      ))}

      {/* Guitar Stands with Guitars */}
      {[-4, -3.5].map((x, i) => (
        <group key={i} position={[x, 0, 2]}>
          {/* Stand */}
          <Box args={[0.02, 1, 0.02]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Box>
          {/* Guitar Body */}
          <Box args={[0.3, 0.08, 0.4]} position={[0, 0.8, 0]} rotation={[0, 0, 0.1]}>
            <meshStandardMaterial color={i === 0 ? '#8b4513' : '#2c3e50'} />
          </Box>
          {/* Guitar Neck */}
          <Box args={[0.06, 0.6, 0.02]} position={[0.05, 1.2, 0]} rotation={[0, 0, 0.1]}>
            <meshStandardMaterial color="#8b4513" />
          </Box>
        </group>
      ))}

      {/* Amplifiers */}
      <Box args={[0.6, 0.5, 0.35]} position={[5, 0.25, -3]} castShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.4, 0.35, 0.25]} position={[5, 0.175, 2]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      {/* Instrument Storage Cabinet */}
      <Box args={[2, 2.5, 0.6]} position={[5, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#5d4e37" />
      </Box>

      {/* Conductor's Podium */}
      <Box args={[1.2, 0.15, 0.8]} position={[0, 0.075, -3.5]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      {/* Whiteboard/Music Board */}
      <Box args={[4, 1.5, 0.05]} position={[0, 2, -4.9]}>
        <meshStandardMaterial color="#f5f5f0" />
      </Box>
      {/* Staff Lines */}
      {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => (
        <Box key={i} args={[3.8, 0.01, 0.02]} position={[0, 2 + y, -4.87]}>
          <meshStandardMaterial color="#2c3e50" />
        </Box>
      ))}

      {/* Sound System Speakers */}
      {[-5, 5].map((x, i) => (
        <Box key={i} args={[0.4, 0.6, 0.35]} position={[x, 2.5, -4]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      ))}

      {/* Metronome on shelf */}
      <group position={[-5.5, 1.5, 0]}>
        <Box args={[0.8, 0.1, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#5d4e37" />
        </Box>
        <Box args={[0.1, 0.2, 0.1]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Box>
      </group>

      {/* Ceiling Lights */}
      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x, 3.4, 0]}>
          <Cylinder args={[0.3, 0.3, 0.1, 16]}>
            <meshStandardMaterial color="#2c2c2c" />
          </Cylinder>
          <Cylinder args={[0.25, 0.25, 0.05, 16]} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#ffffee" emissive="#ffffee" emissiveIntensity={0.6} />
          </Cylinder>
        </group>
      ))}

      {/* Door */}
      <Box args={[1, 2.4, 0.12]} position={[5, 1.2, 4.95]}>
        <meshStandardMaterial color="#5d4e37" />
      </Box>

      {/* Small window (soundproofed) */}
      <Box args={[1.5, 1, 0.15]} position={[-3, 2.2, 4.95]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      <Box args={[1.3, 0.8, 0.05]} position={[-3, 2.2, 4.88]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
      </Box>
    </group>
  );
};

export default MusicRoomFloorPlan;
