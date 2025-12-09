import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const GymnasiumFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main Floor - Basketball Court */}
      <Plane
        args={[28, 15]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#c4a574" />
      </Plane>

      {/* Court Lines */}
      <Box args={[26, 0.02, 0.1]} position={[0, 0.01, -6.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[26, 0.02, 0.1]} position={[0, 0.01, 6.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.02, 13]} position={[-13, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.02, 13]} position={[13, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      {/* Center Line */}
      <Box args={[0.1, 0.02, 13]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      {/* Center Circle */}
      <Cylinder args={[2, 2, 0.02, 32]} position={[0, 0.01, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </Cylinder>

      {/* High Ceiling */}
      <Plane
        args={[28, 15]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 8, 0]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Walls */}
      <Box args={[28, 8, 0.2]} position={[0, 4, -7.6]} castShadow receiveShadow>
        <meshStandardMaterial color="#e0d8cc" />
      </Box>
      <Box args={[28, 8, 0.2]} position={[0, 4, 7.6]} castShadow receiveShadow>
        <meshStandardMaterial color="#e0d8cc" />
      </Box>
      <Box args={[0.2, 8, 15]} position={[-14, 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e0d8cc" />
      </Box>
      <Box args={[0.2, 8, 15]} position={[14, 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e0d8cc" />
      </Box>

      {/* Basketball Hoops */}
      {[-12, 12].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Backboard */}
          <Box args={[0.1, 1.2, 1.8]} position={[x > 0 ? -0.5 : 0.5, 3.5, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Rim */}
          <Cylinder 
            args={[0.45, 0.45, 0.05, 16]} 
            position={[x > 0 ? -0.9 : 0.9, 3.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#ff6b35" />
          </Cylinder>
          {/* Pole */}
          <Cylinder args={[0.1, 0.1, 4, 8]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
        </group>
      ))}

      {/* Bleachers/Seats on one side */}
      {[0, 1, 2].map((row) => (
        <Box 
          key={row} 
          args={[20, 0.4, 1.2]} 
          position={[0, 0.5 + row * 0.5, -6 - row * 0.6]}
          castShadow
        >
          <meshStandardMaterial color="#3498db" />
        </Box>
      ))}

      {/* Gym Equipment Area */}
      <group position={[-10, 0, 5]}>
        {/* Exercise Mats */}
        {[0, 1, 2].map((i) => (
          <Box key={i} args={[2, 0.1, 1]} position={[i * 2.5, 0.05, 0]}>
            <meshStandardMaterial color="#27ae60" />
          </Box>
        ))}
      </group>

      {/* Volleyball Net Posts */}
      <Cylinder args={[0.05, 0.05, 2.5, 8]} position={[0, 1.25, -5]}>
        <meshStandardMaterial color="#34495e" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 2.5, 8]} position={[0, 1.25, 5]}>
        <meshStandardMaterial color="#34495e" />
      </Cylinder>

      {/* Windows high on walls */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <group key={i}>
          <Box args={[2, 1.5, 0.1]} position={[x, 6.5, -7.5]}>
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
          </Box>
          <Box args={[2, 1.5, 0.1]} position={[x, 6.5, 7.5]}>
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
          </Box>
        </group>
      ))}

      {/* Ceiling Lights */}
      {[-6, 0, 6].map((x) => (
        <group key={x} position={[x, 7.9, 0]}>
          <Box args={[3, 0.1, 0.5]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffee" emissiveIntensity={0.8} />
          </Box>
        </group>
      ))}

      {/* Scoreboard */}
      <Box args={[3, 1.5, 0.2]} position={[0, 6, -7.4]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      <Box args={[2.8, 1.3, 0.1]} position={[0, 6, -7.3]}>
        <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={0.3} />
      </Box>

      {/* Emergency Exit Door */}
      <Box args={[1.5, 2.5, 0.15]} position={[13.9, 1.25, -5]}>
        <meshStandardMaterial color="#27ae60" />
      </Box>
    </group>
  );
};

export default GymnasiumFloorPlan;
