import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const SchoolClassroomFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main Floor */}
      <Plane
        args={[12, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#f5f0e6" />
      </Plane>

      {/* Ceiling */}
      <Plane
        args={[12, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.2, 0]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      {/* Walls */}
      {/* Back wall (with whiteboard) */}
      <Box args={[12, 3.2, 0.15]} position={[0, 1.6, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4dc" />
      </Box>
      
      {/* Whiteboard */}
      <Box args={[5, 1.5, 0.05]} position={[0, 1.8, -4.9]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[5.2, 1.6, 0.02]} position={[0, 1.8, -4.88]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      {/* Front wall */}
      <Box args={[12, 3.2, 0.15]} position={[0, 1.6, 5]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4dc" />
      </Box>
      
      {/* Door */}
      <Box args={[1, 2.3, 0.12]} position={[4, 1.15, 4.95]}>
        <meshStandardMaterial color="#8b6f47" />
      </Box>
      
      {/* Left wall */}
      <Box args={[0.15, 3.2, 10]} position={[-6, 1.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4dc" />
      </Box>
      
      {/* Right wall (with windows) */}
      <Box args={[0.15, 3.2, 10]} position={[6, 1.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4dc" />
      </Box>

      {/* Windows on right wall */}
      {[-3, 0, 3].map((z, i) => (
        <group key={i} position={[5.95, 1.8, z]}>
          <Box args={[0.05, 1.4, 1.8]}>
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
          </Box>
          {/* Window frame */}
          <Box args={[0.08, 1.5, 0.08]} position={[0, 0, -0.9]}>
            <meshStandardMaterial color="#d4cfc5" />
          </Box>
          <Box args={[0.08, 1.5, 0.08]} position={[0, 0, 0.9]}>
            <meshStandardMaterial color="#d4cfc5" />
          </Box>
        </group>
      ))}

      {/* Teacher's Desk */}
      <Box args={[2, 0.75, 0.8]} position={[-3, 0.375, -3.5]} castShadow>
        <meshStandardMaterial color="#6b4423" />
      </Box>
      {/* Teacher's Chair */}
      <Box args={[0.5, 0.45, 0.5]} position={[-3, 0.45, -2.8]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[0.5, 0.5, 0.08]} position={[-3, 0.7, -2.55]}>
        <meshStandardMaterial color="#34495e" />
      </Box>

      {/* Student Desks - 4 rows x 3 columns */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <group key={`desk-${row}-${col}`} position={[-2 + col * 3, 0, -1.5 + row * 1.8]}>
            {/* Desk */}
            <Box args={[1.2, 0.65, 0.6]} position={[0, 0.325, 0]} castShadow>
              <meshStandardMaterial color="#d4a574" />
            </Box>
            {/* Chair */}
            <Box args={[0.4, 0.4, 0.4]} position={[0, 0.2, 0.6]} castShadow>
              <meshStandardMaterial color="#2980b9" />
            </Box>
            <Box args={[0.4, 0.3, 0.05]} position={[0, 0.5, 0.8]}>
              <meshStandardMaterial color="#2980b9" />
            </Box>
          </group>
        ))
      )}

      {/* Ceiling Lights */}
      {[-2, 2].map((x) =>
        [-2, 2].map((z, i) => (
          <group key={`light-${x}-${i}`} position={[x, 3.1, z]}>
            <Box args={[1.5, 0.08, 0.3]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffee" emissiveIntensity={0.5} />
            </Box>
          </group>
        ))
      )}

      {/* Bookshelf */}
      <Box args={[0.4, 1.8, 2]} position={[-5.7, 0.9, 2]} castShadow>
        <meshStandardMaterial color="#8b6f47" />
      </Box>
      {/* Books */}
      <Box args={[0.3, 0.25, 1.8]} position={[-5.5, 1.5, 2]}>
        <meshStandardMaterial color="#e74c3c" />
      </Box>
      <Box args={[0.3, 0.25, 1.8]} position={[-5.5, 1.1, 2]}>
        <meshStandardMaterial color="#3498db" />
      </Box>
      <Box args={[0.3, 0.25, 1.8]} position={[-5.5, 0.7, 2]}>
        <meshStandardMaterial color="#27ae60" />
      </Box>

      {/* Clock on back wall */}
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[4, 2.5, -4.9]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      <Cylinder args={[0.32, 0.32, 0.03, 32]} position={[4, 2.5, -4.92]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Cylinder>

      {/* AC Unit on left wall */}
      <Box args={[0.2, 0.3, 0.8]} position={[-5.85, 2.6, 0]}>
        <meshStandardMaterial color="#ecf0f1" />
      </Box>
    </group>
  );
};

export default SchoolClassroomFloorPlan;
