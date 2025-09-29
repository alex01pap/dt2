import { useRef } from 'react';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

const RestaurantFloorPlan = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main Floor */}
      <Plane
        args={[20, 16]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshLambertMaterial color="#e8f4f8" />
      </Plane>

      {/* Exterior Walls */}
      {/* Back wall */}
      <Box args={[20, 3, 0.2]} position={[0, 1.5, -8]}>
        <meshLambertMaterial color="#f0f0f0" />
      </Box>
      {/* Front wall */}
      <Box args={[20, 3, 0.2]} position={[0, 1.5, 8]}>
        <meshLambertMaterial color="#f0f0f0" />
      </Box>
      {/* Left wall */}
      <Box args={[0.2, 3, 16]} position={[-10, 1.5, 0]}>
        <meshLambertMaterial color="#f0f0f0" />
      </Box>
      {/* Right wall */}
      <Box args={[0.2, 3, 16]} position={[10, 1.5, 0]}>
        <meshLambertMaterial color="#f0f0f0" />
      </Box>

      {/* Kitchen Area (Left Side) */}
      {/* Kitchen partition wall */}
      <Box args={[0.2, 3, 8]} position={[-4, 1.5, -4]}>
        <meshLambertMaterial color="#e0e0e0" />
      </Box>

      {/* Kitchen Equipment */}
      {/* Stove/Range */}
      <Box args={[2, 0.8, 1.5]} position={[-7, 0.4, -6]}>
        <meshLambertMaterial color="#2c3e50" />
      </Box>
      {/* Refrigeration Units */}
      <Box args={[1.5, 2, 1]} position={[-8.5, 1, -4]}>
        <meshLambertMaterial color="#34495e" />
      </Box>
      <Box args={[1.5, 2, 1]} position={[-8.5, 1, -2]}>
        <meshLambertMaterial color="#34495e" />
      </Box>
      {/* Prep Counter */}
      <Box args={[6, 0.8, 1.5]} position={[-6.5, 0.4, -3]}>
        <meshLambertMaterial color="#95a5a6" />
      </Box>
      {/* Dish Washing Station */}
      <Box args={[2, 0.8, 1]} position={[-8, 0.4, 0]}>
        <meshLambertMaterial color="#7f8c8d" />
      </Box>

      {/* Service Counter/Bar (Middle) */}
      <Box args={[0.3, 1.2, 6]} position={[-2, 0.6, 1]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>
      {/* Counter Top */}
      <Box args={[0.8, 0.1, 6.2]} position={[-1.7, 1.25, 1]}>
        <meshLambertMaterial color="#d2691e" />
      </Box>

      {/* Dining Area Tables and Chairs */}
      {/* Round Table 1 */}
      <Box args={[1.2, 0.05, 1.2]} position={[2, 0.75, -5]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>
      {/* Chairs for Round Table 1 */}
      <Box args={[0.4, 0.4, 0.4]} position={[1.2, 0.2, -5.8]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[2.8, 0.2, -5.8]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[1.2, 0.2, -4.2]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[2.8, 0.2, -4.2]}>
        <meshLambertMaterial color="#654321" />
      </Box>

      {/* Rectangular Table 1 */}
      <Box args={[2.5, 0.05, 1]} position={[6, 0.75, -3]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>
      {/* Chairs for Rectangular Table 1 */}
      <Box args={[0.4, 0.4, 0.4]} position={[5.2, 0.2, -3.6]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[6.8, 0.2, -3.6]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[5.2, 0.2, -2.4]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[6.8, 0.2, -2.4]}>
        <meshLambertMaterial color="#654321" />
      </Box>

      {/* Rectangular Table 2 */}
      <Box args={[2.5, 0.05, 1]} position={[6, 0.75, 1]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>
      {/* Chairs for Rectangular Table 2 */}
      <Box args={[0.4, 0.4, 0.4]} position={[5.2, 0.2, 0.4]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[6.8, 0.2, 0.4]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[5.2, 0.2, 1.6]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[6.8, 0.2, 1.6]}>
        <meshLambertMaterial color="#654321" />
      </Box>

      {/* Round Table 2 */}
      <Box args={[1.2, 0.05, 1.2]} position={[2, 0.75, 4]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>
      {/* Chairs for Round Table 2 */}
      <Box args={[0.4, 0.4, 0.4]} position={[1.2, 0.2, 3.2]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[2.8, 0.2, 3.2]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[1.2, 0.2, 4.8]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[2.8, 0.2, 4.8]}>
        <meshLambertMaterial color="#654321" />
      </Box>

      {/* Windows */}
      {/* Back wall windows */}
      <Plane args={[3, 2]} position={[-6, 2, -7.9]} rotation={[0, 0, 0]}>
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} position={[6, 2, -7.9]} rotation={[0, 0, 0]}>
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.6} />
      </Plane>
      
      {/* Right wall windows */}
      <Plane args={[3, 2]} position={[9.9, 2, 3]} rotation={[0, Math.PI / 2, 0]}>
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} position={[9.9, 2, -3]} rotation={[0, Math.PI / 2, 0]}>
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.6} />
      </Plane>

      {/* Restroom Area (Bottom Right) */}
      {/* Restroom partition */}
      <Box args={[3, 3, 0.2]} position={[8, 1.5, 6]}>
        <meshLambertMaterial color="#e0e0e0" />
      </Box>
      <Box args={[0.2, 3, 2]} position={[6.5, 1.5, 7]}>
        <meshLambertMaterial color="#e0e0e0" />
      </Box>

      {/* Entry Door */}
      <Box args={[1, 2.5, 0.1]} position={[0, 1.25, 7.9]}>
        <meshLambertMaterial color="#8b4513" />
      </Box>

      {/* Kitchen Ventilation Hood */}
      <Box args={[3, 0.3, 2]} position={[-7, 2.8, -6]}>
        <meshLambertMaterial color="#95a5a6" />
      </Box>
    </group>
  );
};

export default RestaurantFloorPlan;