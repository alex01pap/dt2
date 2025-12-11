import { useRef } from 'react';
import { Box, Plane, Cylinder, RoundedBox, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

const SchoolClassroomFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main Floor with reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={0.8}
          mixStrength={0.5}
          roughness={0.8}
          depthScale={0.5}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#e8e4dc"
          metalness={0.2}
          mirror={0.3}
        />
      </mesh>

      {/* Ceiling */}
      <Plane
        args={[12, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.2, 0]}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </Plane>

      {/* Walls with improved materials */}
      {/* Back wall (with whiteboard) */}
      <RoundedBox args={[12, 3.2, 0.15]} position={[0, 1.6, -5]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ece4" roughness={0.7} />
      </RoundedBox>
      
      {/* Whiteboard - glossy */}
      <RoundedBox args={[5, 1.5, 0.05]} position={[0, 1.8, -4.9]} radius={0.02} smoothness={4}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[5.2, 1.6, 0.02]} position={[0, 1.8, -4.88]} radius={0.01} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.5} />
      </RoundedBox>

      {/* Front wall */}
      <RoundedBox args={[12, 3.2, 0.15]} position={[0, 1.6, 5]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ece4" roughness={0.7} />
      </RoundedBox>
      
      {/* Door - wooden texture */}
      <RoundedBox args={[1, 2.3, 0.12]} position={[4, 1.15, 4.95]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color="#6b4423" roughness={0.4} metalness={0.1} />
      </RoundedBox>
      {/* Door handle */}
      <Cylinder args={[0.03, 0.03, 0.15, 16]} position={[4.35, 1.1, 5.02]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
      </Cylinder>
      
      {/* Left wall */}
      <RoundedBox args={[0.15, 3.2, 10]} position={[-6, 1.6, 0]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ece4" roughness={0.7} />
      </RoundedBox>
      
      {/* Right wall (with windows) */}
      <RoundedBox args={[0.15, 3.2, 10]} position={[6, 1.6, 0]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f0ece4" roughness={0.7} />
      </RoundedBox>

      {/* Windows on right wall - glass effect */}
      {[-3, 0, 3].map((z, i) => (
        <group key={i} position={[5.95, 1.8, z]}>
          <Box args={[0.05, 1.4, 1.8]}>
            <meshPhysicalMaterial 
              color="#a8d8ea" 
              transparent 
              opacity={0.3} 
              roughness={0}
              metalness={0.1}
              transmission={0.9}
              thickness={0.5}
            />
          </Box>
          {/* Window frame - metallic */}
          <RoundedBox args={[0.08, 1.5, 0.08]} position={[0, 0, -0.9]} radius={0.01} smoothness={4}>
            <meshStandardMaterial color="#8b8b8b" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.08, 1.5, 0.08]} position={[0, 0, 0.9]} radius={0.01} smoothness={4}>
            <meshStandardMaterial color="#8b8b8b" metalness={0.8} roughness={0.3} />
          </RoundedBox>
        </group>
      ))}

      {/* Teacher's Desk - polished wood */}
      <RoundedBox args={[2, 0.75, 0.8]} position={[-3, 0.375, -3.5]} radius={0.03} smoothness={4} castShadow>
        <meshStandardMaterial color="#5c3d2e" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* Desk legs */}
      {[[-3.8, -3.15], [-3.8, -3.85], [-2.2, -3.15], [-2.2, -3.85]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.04, 0.04, 0.75, 8]} position={[x, 0.375, z]}>
          <meshStandardMaterial color="#3d3d3d" metalness={0.9} roughness={0.3} />
        </Cylinder>
      ))}
      
      {/* Teacher's Chair - modern */}
      <RoundedBox args={[0.5, 0.08, 0.5]} position={[-3, 0.45, -2.8]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.5, 0.08]} position={[-3, 0.7, -2.55]} radius={0.02} smoothness={4}>
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </RoundedBox>
      {/* Chair base */}
      <Cylinder args={[0.25, 0.25, 0.04, 16]} position={[-3, 0.02, -2.8]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.4, 8]} position={[-3, 0.22, -2.8]}>
        <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
      </Cylinder>

      {/* Student Desks - 4 rows x 3 columns */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <group key={`desk-${row}-${col}`} position={[-2 + col * 3, 0, -1.5 + row * 1.8]}>
            {/* Desk */}
            <RoundedBox args={[1.2, 0.05, 0.6]} position={[0, 0.65, 0]} radius={0.02} smoothness={4} castShadow>
              <meshStandardMaterial color="#d4a574" roughness={0.4} />
            </RoundedBox>
            {/* Desk legs */}
            {[[-0.5, -0.25], [-0.5, 0.25], [0.5, -0.25], [0.5, 0.25]].map(([dx, dz], i) => (
              <Cylinder key={i} args={[0.02, 0.02, 0.65, 8]} position={[dx, 0.325, dz]}>
                <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.3} />
              </Cylinder>
            ))}
            {/* Chair - modern plastic */}
            <RoundedBox args={[0.4, 0.05, 0.4]} position={[0, 0.45, 0.6]} radius={0.02} smoothness={4} castShadow>
              <meshStandardMaterial color="#3498db" roughness={0.6} />
            </RoundedBox>
            <RoundedBox args={[0.4, 0.35, 0.03]} position={[0, 0.65, 0.8]} radius={0.02} smoothness={4}>
              <meshStandardMaterial color="#3498db" roughness={0.6} />
            </RoundedBox>
            {/* Chair legs */}
            {[[-0.15, 0.45], [-0.15, 0.75], [0.15, 0.45], [0.15, 0.75]].map(([dx, dz], i) => (
              <Cylinder key={i} args={[0.015, 0.015, 0.45, 8]} position={[dx, 0.225, dz]}>
                <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
              </Cylinder>
            ))}
          </group>
        ))
      )}

      {/* Ceiling Lights - LED panels */}
      {[-2, 2].map((x) =>
        [-2, 2].map((z, i) => (
          <group key={`light-${x}-${i}`} position={[x, 3.1, z]}>
            <RoundedBox args={[1.5, 0.06, 0.4]} radius={0.02} smoothness={4}>
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#fff8e7" 
                emissiveIntensity={1} 
                roughness={0.5}
              />
            </RoundedBox>
            {/* Light frame */}
            <RoundedBox args={[1.55, 0.08, 0.45]} position={[0, 0.01, 0]} radius={0.02} smoothness={4}>
              <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.4} />
            </RoundedBox>
          </group>
        ))
      )}

      {/* Bookshelf - modern */}
      <RoundedBox args={[0.4, 1.8, 2]} position={[-5.7, 0.9, 2]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.5} />
      </RoundedBox>
      {/* Books - varied colors */}
      {[
        { y: 1.5, color: '#c0392b' },
        { y: 1.1, color: '#2980b9' },
        { y: 0.7, color: '#27ae60' },
      ].map((book, i) => (
        <RoundedBox key={i} args={[0.28, 0.22, 1.75]} position={[-5.5, book.y, 2]} radius={0.01} smoothness={4}>
          <meshStandardMaterial color={book.color} roughness={0.7} />
        </RoundedBox>
      ))}

      {/* Clock on back wall - modern design */}
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[4, 2.5, -4.9]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={0.5} />
      </Cylinder>
      <Cylinder args={[0.32, 0.32, 0.03, 32]} position={[4, 2.5, -4.92]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.5} />
      </Cylinder>
      {/* Clock hands */}
      <Box args={[0.02, 0.15, 0.01]} position={[4, 2.55, -4.88]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.015, 0.2, 0.01]} position={[4, 2.5, -4.88]} rotation={[0, 0, -Math.PI / 3]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      {/* AC Unit on left wall - modern */}
      <RoundedBox args={[0.18, 0.28, 0.8]} position={[-5.85, 2.6, 0]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color="#f8f8f8" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* AC vents */}
      {[-0.25, 0, 0.25].map((offset, i) => (
        <Box key={i} args={[0.02, 0.02, 0.6]} position={[-5.76, 2.55 + offset * 0.15, 0]}>
          <meshStandardMaterial color="#e0e0e0" />
        </Box>
      ))}
    </group>
  );
};

export default SchoolClassroomFloorPlan;
