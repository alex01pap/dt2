import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CafeteriaFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Floor - Easy clean tiles */}
      <Plane
        args={[18, 12]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e8dcc8" />
      </Plane>

      {/* Ceiling */}
      <Plane
        args={[18, 12]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.5, 0]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      {/* Walls */}
      <Box args={[18, 3.5, 0.15]} position={[0, 1.75, -6]} castShadow receiveShadow>
        <meshStandardMaterial color="#fff8e7" />
      </Box>
      <Box args={[18, 3.5, 0.15]} position={[0, 1.75, 6]} castShadow receiveShadow>
        <meshStandardMaterial color="#fff8e7" />
      </Box>
      <Box args={[0.15, 3.5, 12]} position={[-9, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fff8e7" />
      </Box>
      <Box args={[0.15, 3.5, 12]} position={[9, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fff8e7" />
      </Box>

      {/* Serving Counter Area */}
      <group position={[-6, 0, -4.5]}>
        {/* Main Counter */}
        <Box args={[6, 1, 0.8]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#b0b0b0" />
        </Box>
        {/* Glass Shield */}
        <Box args={[5.5, 0.8, 0.05]} position={[0, 1.3, 0.3]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
        </Box>
        {/* Food Trays */}
        {[-2, -0.5, 1, 2.5].map((x, i) => (
          <Box key={i} args={[1, 0.1, 0.5]} position={[x, 1.05, 0]}>
            <meshStandardMaterial color="#c0c0c0" />
          </Box>
        ))}
        {/* Heat Lamps */}
        {[-1.5, 1].map((x, i) => (
          <Cylinder key={i} args={[0.15, 0.1, 0.3, 8]} position={[x, 1.5, 0]}>
            <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.3} />
          </Cylinder>
        ))}
      </group>

      {/* Cash Register Station */}
      <group position={[-2, 0, -4.5]}>
        <Box args={[1.2, 1, 0.6]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#b0b0b0" />
        </Box>
        {/* Register */}
        <Box args={[0.4, 0.15, 0.3]} position={[0, 1.1, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Box>
      </group>

      {/* Dining Tables - Round tables */}
      {[
        [-4, 0], [-4, 2.5], [-1, 0], [-1, 2.5],
        [2, 0], [2, 2.5], [5, 0], [5, 2.5]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Table Top */}
          <Cylinder args={[0.9, 0.9, 0.05, 16]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          {/* Table Leg */}
          <Cylinder args={[0.08, 0.1, 0.72, 8]} position={[0, 0.36, 0]}>
            <meshStandardMaterial color="#7f8c8d" />
          </Cylinder>
          <Cylinder args={[0.3, 0.3, 0.03, 16]} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#7f8c8d" />
          </Cylinder>
          
          {/* 4 Chairs around table */}
          {[0, 1, 2, 3].map((chairIndex) => {
            const angle = (chairIndex * Math.PI) / 2;
            const cx = Math.sin(angle) * 1.2;
            const cz = Math.cos(angle) * 1.2;
            return (
              <group key={chairIndex} position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
                <Box args={[0.4, 0.05, 0.4]} position={[0, 0.45, 0]} castShadow>
                  <meshStandardMaterial color="#3498db" />
                </Box>
                <Box args={[0.4, 0.35, 0.05]} position={[0, 0.6, -0.18]}>
                  <meshStandardMaterial color="#3498db" />
                </Box>
                {/* Chair Legs */}
                {[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([lx, lz], li) => (
                  <Cylinder key={li} args={[0.02, 0.02, 0.4, 6]} position={[lx, 0.2, lz]}>
                    <meshStandardMaterial color="#2c3e50" />
                  </Cylinder>
                ))}
              </group>
            );
          })}
        </group>
      ))}

      {/* Long tables at the sides */}
      {[-7, 7].map((x, i) => (
        <group key={i} position={[x, 0, 1]}>
          <Box args={[1.5, 0.75, 4]} position={[0, 0.375, 0]} castShadow>
            <meshStandardMaterial color="#f5f5f5" />
          </Box>
          {/* Bench seating */}
          <Box args={[0.5, 0.45, 3.5]} position={[i === 0 ? 0.8 : -0.8, 0.225, 0]} castShadow>
            <meshStandardMaterial color="#27ae60" />
          </Box>
        </group>
      ))}

      {/* Drink Station */}
      <group position={[7, 0, -4]}>
        <Box args={[2, 1, 0.6]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#b0b0b0" />
        </Box>
        {/* Drink Dispenser */}
        <Box args={[0.6, 0.8, 0.4]} position={[-0.4, 1.4, 0]}>
          <meshStandardMaterial color="#e74c3c" />
        </Box>
        <Box args={[0.6, 0.8, 0.4]} position={[0.4, 1.4, 0]}>
          <meshStandardMaterial color="#f39c12" />
        </Box>
      </group>

      {/* Trash and Recycling */}
      <group position={[3, 0, -4.5]}>
        <Cylinder args={[0.25, 0.2, 0.8, 8]} position={[-0.4, 0.4, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
        <Cylinder args={[0.25, 0.2, 0.8, 8]} position={[0.4, 0.4, 0]}>
          <meshStandardMaterial color="#27ae60" />
        </Cylinder>
      </group>

      {/* Kitchen Window/Pass */}
      <Box args={[3, 1, 0.2]} position={[-6, 1.5, -5.9]}>
        <meshStandardMaterial color="#b0b0b0" />
      </Box>
      {/* Kitchen visible through pass */}
      <Box args={[2.8, 0.8, 0.1]} position={[-6, 1.5, -5.85]}>
        <meshStandardMaterial color="#fffacd" />
      </Box>

      {/* Menu Board */}
      <Box args={[3, 1.5, 0.1]} position={[-2, 2.5, -5.9]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>

      {/* Decorative elements */}
      {/* Plants */}
      {[[6, 4], [-6, 4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cylinder args={[0.25, 0.2, 0.5, 8]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Cylinder args={[0.3, 0.15, 0.5, 8]} position={[0, 0.65, 0]}>
            <meshStandardMaterial color="#27ae60" />
          </Cylinder>
        </group>
      ))}

      {/* Windows - Large for natural light */}
      {[-5, -1.5, 2, 5.5].map((x, i) => (
        <Box key={i} args={[2.5, 2, 0.1]} position={[x, 2, 5.95]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} />
        </Box>
      ))}

      {/* Ceiling Lights */}
      {[-5, 0, 5].map((x) =>
        [-3, 1.5].map((z, i) => (
          <group key={`${x}-${i}`} position={[x, 3.4, z]}>
            <Box args={[1.5, 0.08, 0.5]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffee" emissiveIntensity={0.5} />
            </Box>
          </group>
        ))
      )}

      {/* Exit Doors */}
      <Box args={[1.5, 2.5, 0.12]} position={[8, 1.25, 5.95]}>
        <meshStandardMaterial color="#27ae60" />
      </Box>
      <Box args={[1.5, 2.5, 0.12]} position={[-8, 1.25, 5.95]}>
        <meshStandardMaterial color="#8b6f47" />
      </Box>

      {/* Hand Sanitizer Station */}
      <Box args={[0.15, 0.3, 0.1]} position={[8.85, 1.2, 3]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Clock */}
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[0, 2.8, -5.9]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>

      {/* Fire Extinguisher */}
      <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[8.8, 0.3, -4]}>
        <meshStandardMaterial color="#e74c3c" />
      </Cylinder>
    </group>
  );
};

export default CafeteriaFloorPlan;
