import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const ComputerLabFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Floor - Anti-static tiles */}
      <Plane
        args={[14, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#d0d0d0" />
      </Plane>

      {/* Ceiling with cable trays */}
      <Plane
        args={[14, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3, 0]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Walls */}
      <Box args={[14, 3, 0.15]} position={[0, 1.5, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box args={[14, 3, 0.15]} position={[0, 1.5, 5]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box args={[0.15, 3, 10]} position={[-7, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      <Box args={[0.15, 3, 10]} position={[7, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>

      {/* Computer Workstations - 4 rows of 5 */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <group key={`desk-${row}-${col}`} position={[-5 + col * 2.5, 0, -2.5 + row * 2]}>
            {/* Desk */}
            <Box args={[1.4, 0.72, 0.7]} position={[0, 0.36, 0]} castShadow>
              <meshStandardMaterial color="#f5f5f5" />
            </Box>
            
            {/* Monitor */}
            <group position={[0, 0.72, -0.1]}>
              {/* Screen */}
              <Box args={[0.6, 0.4, 0.03]} position={[0, 0.25, 0]}>
                <meshStandardMaterial color="#1a1a1a" />
              </Box>
              {/* Screen Display */}
              <Box args={[0.55, 0.35, 0.01]} position={[0, 0.25, 0.02]}>
                <meshStandardMaterial color="#0066cc" emissive="#0066cc" emissiveIntensity={0.2} />
              </Box>
              {/* Monitor Stand */}
              <Box args={[0.08, 0.15, 0.08]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#2c2c2c" />
              </Box>
              <Box args={[0.2, 0.02, 0.15]} position={[0, -0.05, 0]}>
                <meshStandardMaterial color="#2c2c2c" />
              </Box>
            </group>

            {/* Keyboard */}
            <Box args={[0.45, 0.02, 0.15]} position={[0, 0.74, 0.2]}>
              <meshStandardMaterial color="#2c2c2c" />
            </Box>
            
            {/* Mouse */}
            <Box args={[0.06, 0.02, 0.1]} position={[0.35, 0.74, 0.2]}>
              <meshStandardMaterial color="#2c2c2c" />
            </Box>

            {/* PC Tower */}
            <Box args={[0.18, 0.4, 0.4]} position={[0.5, 0.2, 0]} castShadow>
              <meshStandardMaterial color="#1a1a1a" />
            </Box>
            {/* Power LED */}
            <Box args={[0.02, 0.02, 0.01]} position={[0.5, 0.35, 0.21]}>
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
            </Box>

            {/* Chair */}
            <group position={[0, 0, 0.7]}>
              <Box args={[0.45, 0.08, 0.45]} position={[0, 0.45, 0]} castShadow>
                <meshStandardMaterial color="#2c3e50" />
              </Box>
              <Box args={[0.45, 0.5, 0.08]} position={[0, 0.7, -0.2]}>
                <meshStandardMaterial color="#2c3e50" />
              </Box>
              {/* Chair base */}
              <Cylinder args={[0.25, 0.25, 0.03, 16]} position={[0, 0.05, 0]}>
                <meshStandardMaterial color="#1a1a1a" />
              </Cylinder>
              <Cylinder args={[0.03, 0.03, 0.35, 8]} position={[0, 0.22, 0]}>
                <meshStandardMaterial color="#7f8c8d" />
              </Cylinder>
            </group>
          </group>
        ))
      )}

      {/* Teacher's Station */}
      <group position={[0, 0, -4]}>
        {/* Large Desk */}
        <Box args={[3, 0.72, 0.9]} position={[0, 0.36, 0]} castShadow>
          <meshStandardMaterial color="#5d4e37" />
        </Box>
        
        {/* Two Monitors */}
        {[-0.5, 0.5].map((x, i) => (
          <group key={i} position={[x, 0.72, -0.2]}>
            <Box args={[0.7, 0.45, 0.03]} position={[0, 0.28, 0]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Box args={[0.65, 0.4, 0.01]} position={[0, 0.28, 0.02]}>
              <meshStandardMaterial color="#0066cc" emissive="#0066cc" emissiveIntensity={0.2} />
            </Box>
            <Box args={[0.1, 0.18, 0.1]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#2c2c2c" />
            </Box>
          </group>
        ))}

        {/* Teacher's Chair */}
        <group position={[0, 0, 0.8]}>
          <Box args={[0.55, 0.1, 0.55]} position={[0, 0.5, 0]} castShadow>
            <meshStandardMaterial color="#1a1a2e" />
          </Box>
          <Box args={[0.55, 0.6, 0.1]} position={[0, 0.8, -0.25]}>
            <meshStandardMaterial color="#1a1a2e" />
          </Box>
        </group>
      </group>

      {/* Projector */}
      <Box args={[0.4, 0.15, 0.3]} position={[0, 2.8, -2]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      {/* Projector Lens */}
      <Cylinder args={[0.05, 0.05, 0.05, 8]} position={[0, 2.72, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Cylinder>

      {/* Projection Screen */}
      <Box args={[5, 3, 0.05]} position={[0, 1.5, -4.9]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Network Switch Cabinet */}
      <Box args={[0.6, 1.5, 0.5]} position={[6.5, 0.75, -3]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      {/* Blinking lights */}
      {[0, 0.1, 0.2, 0.3].map((y, i) => (
        <Box key={i} args={[0.03, 0.03, 0.01]} position={[6.5, 0.9 + y, -2.74]}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </Box>
      ))}

      {/* Printer Station */}
      <group position={[-6, 0, 3]}>
        <Box args={[1, 0.72, 0.6]} position={[0, 0.36, 0]} castShadow>
          <meshStandardMaterial color="#e8e8e8" />
        </Box>
        {/* Printer */}
        <Box args={[0.5, 0.25, 0.4]} position={[0, 0.85, 0]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Box>
      </group>

      {/* Whiteboard */}
      <Box args={[3, 1.2, 0.05]} position={[-4, 1.8, -4.9]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Cable management - floor channels */}
      {[-3, 0, 3].map((x) => (
        <Box key={x} args={[0.1, 0.05, 8]} position={[x, 0.025, 0]}>
          <meshStandardMaterial color="#7f8c8d" />
        </Box>
      ))}

      {/* AC Unit */}
      <Box args={[1.2, 0.25, 0.25]} position={[0, 2.7, 4.85]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>

      {/* Fire Extinguisher */}
      <Cylinder args={[0.07, 0.07, 0.45, 8]} position={[6.8, 0.25, 4]}>
        <meshStandardMaterial color="#e74c3c" />
      </Cylinder>

      {/* Windows with blinds */}
      {[-3, 0, 3].map((x, i) => (
        <group key={i} position={[x, 1.8, 4.95]}>
          <Box args={[1.8, 1.4, 0.1]}>
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
          </Box>
          {/* Blinds */}
          <Box args={[1.7, 1.3, 0.02]} position={[0, 0, -0.05]}>
            <meshStandardMaterial color="#f0f0f0" transparent opacity={0.7} />
          </Box>
        </group>
      ))}

      {/* Ceiling Lights - LED panels */}
      {[-4, 0, 4].map((x) =>
        [-2, 2].map((z, i) => (
          <Box key={`${x}-${i}`} args={[1.2, 0.05, 0.6]} position={[x, 2.95, z]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
          </Box>
        ))
      )}

      {/* Door */}
      <Box args={[1, 2.3, 0.12]} position={[6, 1.15, 4.95]}>
        <meshStandardMaterial color="#5d4e37" />
      </Box>

      {/* Clock */}
      <Cylinder args={[0.2, 0.2, 0.04, 32]} position={[5, 2.5, -4.9]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>

      {/* Emergency Exit Sign */}
      <Box args={[0.4, 0.15, 0.03]} position={[6, 2.6, 4.85]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
      </Box>
    </group>
  );
};

export default ComputerLabFloorPlan;
