import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const LaboratoryFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <Plane
        args={[14, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* Ceiling */}
      <Plane
        args={[14, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.5, 0]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      {/* Walls */}
      <Box args={[14, 3.5, 0.15]} position={[0, 1.75, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[14, 3.5, 0.15]} position={[0, 1.75, 5]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.15, 3.5, 10]} position={[-7, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.15, 3.5, 10]} position={[7, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>

      {/* Lab Benches - 3 rows */}
      {[-2, 0, 2].map((z, rowIndex) => (
        <group key={rowIndex} position={[0, 0, z * 1.5]}>
          {/* Main Bench Surface */}
          <Box args={[10, 0.9, 0.8]} position={[0, 0.45, 0]} castShadow>
            <meshStandardMaterial color="#1a1a2e" />
          </Box>
          {/* White Lab Top */}
          <Box args={[10, 0.05, 0.8]} position={[0, 0.92, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          
          {/* Sink */}
          <Box args={[0.4, 0.08, 0.3]} position={[-3, 0.88, 0]}>
            <meshStandardMaterial color="#b0b0b0" />
          </Box>
          {/* Faucet */}
          <Cylinder args={[0.02, 0.02, 0.15, 8]} position={[-3, 1.05, -0.2]}>
            <meshStandardMaterial color="#c0c0c0" />
          </Cylinder>
          
          {/* Gas Tap */}
          <Box args={[0.08, 0.1, 0.05]} position={[0, 0.97, -0.35]}>
            <meshStandardMaterial color="#ffd700" />
          </Box>
          
          {/* Microscope */}
          <group position={[2, 0.95, 0]}>
            <Box args={[0.15, 0.3, 0.2]}>
              <meshStandardMaterial color="#2c3e50" />
            </Box>
            <Cylinder args={[0.03, 0.04, 0.15, 8]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#34495e" />
            </Cylinder>
          </group>
          
          {/* Beakers */}
          {[3.5, 4, 4.5].map((x, i) => (
            <Cylinder key={i} args={[0.06, 0.05, 0.15, 8]} position={[x, 1.02, 0]}>
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
            </Cylinder>
          ))}
          
          {/* Test Tube Rack */}
          <Box args={[0.3, 0.08, 0.1]} position={[-1, 0.98, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Box>
          {[-1.1, -1, -0.9].map((x, i) => (
            <Cylinder key={i} args={[0.015, 0.015, 0.12, 8]} position={[x, 1.08, 0]}>
              <meshStandardMaterial color={['#e74c3c', '#3498db', '#27ae60'][i]} transparent opacity={0.7} />
            </Cylinder>
          ))}
        </group>
      ))}

      {/* Stools */}
      {[-2, 0, 2].map((z, rowIndex) => (
        [-3.5, -1.5, 0.5, 2.5].map((x, seatIndex) => (
          <group key={`stool-${rowIndex}-${seatIndex}`} position={[x, 0, z * 1.5 + 0.7]}>
            <Cylinder args={[0.15, 0.18, 0.6, 12]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#34495e" />
            </Cylinder>
            <Cylinder args={[0.03, 0.03, 0.5, 8]} position={[0, 0.05, 0]}>
              <meshStandardMaterial color="#7f8c8d" />
            </Cylinder>
          </group>
        ))
      ))}

      {/* Teacher's Demo Bench */}
      <group position={[0, 0, -4]}>
        <Box args={[8, 0.9, 1]} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color="#1a1a2e" />
        </Box>
        <Box args={[8, 0.05, 1]} position={[0, 0.92, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        {/* Large Sink */}
        <Box args={[0.6, 0.1, 0.4]} position={[-2, 0.88, 0]}>
          <meshStandardMaterial color="#b0b0b0" />
        </Box>
        {/* Bunsen Burner */}
        <Cylinder args={[0.04, 0.06, 0.15, 8]} position={[1, 0.97, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
      </group>

      {/* Safety Shower */}
      <group position={[-6.5, 0, 3]}>
        <Cylinder args={[0.03, 0.03, 2.5, 8]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#c0c0c0" />
        </Cylinder>
        <Box args={[0.3, 0.05, 0.3]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#e74c3c" />
        </Box>
      </group>

      {/* Eye Wash Station */}
      <Box args={[0.4, 0.3, 0.2]} position={[-6.5, 1, -3]}>
        <meshStandardMaterial color="#27ae60" />
      </Box>

      {/* Chemical Storage Cabinet */}
      <Box args={[1.5, 2, 0.5]} position={[6.3, 1, -3]} castShadow>
        <meshStandardMaterial color="#7f8c8d" />
      </Box>
      {/* Hazard Symbol */}
      <Box args={[0.3, 0.3, 0.02]} position={[6.3, 1.5, -2.73]}>
        <meshStandardMaterial color="#ffd700" />
      </Box>

      {/* Fume Hood */}
      <group position={[6, 0, 2]}>
        <Box args={[1.2, 1.5, 1]} position={[0, 0.75, 0]} castShadow>
          <meshStandardMaterial color="#ecf0f1" />
        </Box>
        <Box args={[1, 1.3, 0.05]} position={[0, 0.8, -0.45]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
        </Box>
      </group>

      {/* Whiteboard */}
      <Box args={[5, 1.5, 0.05]} position={[0, 2, -4.9]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[5.2, 1.6, 0.02]} position={[0, 2, -4.88]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      {/* Periodic Table Poster */}
      <Box args={[2.5, 1.5, 0.02]} position={[-5.5, 2, -4.9]}>
        <meshStandardMaterial color="#3498db" />
      </Box>

      {/* Fire Extinguisher */}
      <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[6.8, 0.3, 4]}>
        <meshStandardMaterial color="#e74c3c" />
      </Cylinder>

      {/* Windows */}
      {[-3, 0, 3].map((x, i) => (
        <Box key={i} args={[1.8, 1.5, 0.1]} position={[x, 2, 4.95]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
        </Box>
      ))}

      {/* Ceiling Lights */}
      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x, 3.4, 0]}>
          <Box args={[1.5, 0.08, 0.4]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </Box>
        </group>
      ))}

      {/* Door */}
      <Box args={[1, 2.4, 0.12]} position={[6, 1.2, 4.95]}>
        <meshStandardMaterial color="#8b6f47" />
      </Box>
      {/* Door Window */}
      <Box args={[0.5, 0.8, 0.08]} position={[6, 1.8, 4.9]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </Box>

      {/* Clock */}
      <Cylinder args={[0.25, 0.25, 0.05, 32]} position={[5, 2.8, -4.9]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
    </group>
  );
};

export default LaboratoryFloorPlan;
