import { useRef, useMemo } from 'react';
import { Box, Plane, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface RestaurantFloorPlanProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeConfigs = {
  small: { width: 12, depth: 10, tables: 5, booths: 0, label: '30 seats' },
  medium: { width: 18, depth: 14, tables: 10, booths: 4, label: '60 seats' },
  large: { width: 25, depth: 18, tables: 16, booths: 8, label: '100 seats' },
};

const RestaurantFloorPlan = ({ size = 'medium' }: RestaurantFloorPlanProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const config = sizeConfigs[size];
  const { width, depth, tables, booths } = config;

  // Generate table positions dynamically
  const tablePositions = useMemo(() => {
    const positions: { x: number; z: number; type: 'round' | 'rect' }[] = [];
    const diningStartX = -width / 2 + 6;
    const diningEndX = width / 2 - 1;
    const diningStartZ = -depth / 2 + 2;
    const diningEndZ = depth / 2 - 3;
    
    const cols = Math.ceil(Math.sqrt(tables * 1.5));
    const rows = Math.ceil(tables / cols);
    const spacingX = (diningEndX - diningStartX) / Math.max(cols, 1);
    const spacingZ = (diningEndZ - diningStartZ) / Math.max(rows, 1);

    for (let i = 0; i < tables; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: diningStartX + col * spacingX + spacingX / 2,
        z: diningStartZ + row * spacingZ + spacingZ / 2,
        type: i % 3 === 0 ? 'round' : 'rect'
      });
    }
    return positions;
  }, [tables, width, depth]);

  // Booth positions along wall
  const boothPositions = useMemo(() => {
    const positions: number[] = [];
    const spacing = (depth - 4) / Math.max(booths, 1);
    for (let i = 0; i < booths; i++) {
      positions.push(-depth / 2 + 2 + i * spacing);
    }
    return positions;
  }, [booths, depth]);

  return (
    <group ref={groupRef}>
      {/* Main Floor */}
      <Plane args={[width, depth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f5f0e6" />
      </Plane>

      {/* Kitchen Floor (different color) */}
      <Plane args={[5, depth - 1]} rotation={[-Math.PI / 2, 0, 0]} position={[-width / 2 + 2.5, 0.01, 0]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* Exterior Walls */}
      <RoundedBox args={[width, 3.5, 0.3]} position={[0, 1.75, -depth / 2]} radius={0.05} castShadow>
        <meshStandardMaterial color="#f8f8f8" />
      </RoundedBox>
      <RoundedBox args={[width, 3.5, 0.3]} position={[0, 1.75, depth / 2]} radius={0.05} castShadow>
        <meshStandardMaterial color="#f8f8f8" />
      </RoundedBox>
      <RoundedBox args={[0.3, 3.5, depth]} position={[-width / 2, 1.75, 0]} radius={0.05} castShadow>
        <meshStandardMaterial color="#f8f8f8" />
      </RoundedBox>
      <RoundedBox args={[0.3, 3.5, depth]} position={[width / 2, 1.75, 0]} radius={0.05} castShadow>
        <meshStandardMaterial color="#f8f8f8" />
      </RoundedBox>

      {/* Kitchen Partition Wall */}
      <RoundedBox args={[0.2, 3.5, depth * 0.6]} position={[-width / 2 + 5, 1.75, -depth * 0.1]} radius={0.02} castShadow>
        <meshStandardMaterial color="#e0e0e0" />
      </RoundedBox>

      {/* Kitchen Service Window */}
      <RoundedBox args={[0.15, 1, 3]} position={[-width / 2 + 5, 1.3, depth * 0.25]} radius={0.02}>
        <meshStandardMaterial color="#2c3e50" />
      </RoundedBox>

      {/* Kitchen Equipment */}
      {/* Commercial Stove */}
      <RoundedBox args={[2.5, 1, 1.2]} position={[-width / 2 + 2, 0.5, -depth / 2 + 2]} radius={0.05} castShadow>
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      {/* Stove burners */}
      {[0, 0.6, -0.6].map((offset, i) => (
        <Cylinder key={i} args={[0.2, 0.2, 0.05, 16]} position={[-width / 2 + 2 + offset, 1.03, -depth / 2 + 2]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" />
        </Cylinder>
      ))}

      {/* Refrigeration Units */}
      <RoundedBox args={[1.2, 2.2, 1]} position={[-width / 2 + 1.2, 1.1, -depth / 2 + 4.5]} radius={0.05} castShadow>
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[1.2, 2.2, 1]} position={[-width / 2 + 1.2, 1.1, -depth / 2 + 5.8]} radius={0.05} castShadow>
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Prep Counter */}
      <RoundedBox args={[4, 0.9, 1]} position={[-width / 2 + 2.5, 0.45, 0]} radius={0.03} castShadow>
        <meshStandardMaterial color="#a0aec0" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Ventilation Hood */}
      <RoundedBox args={[3, 0.2, 1.5]} position={[-width / 2 + 2, 2.8, -depth / 2 + 2]} radius={0.02}>
        <meshStandardMaterial color="#718096" metalness={0.6} />
      </RoundedBox>

      {/* Service Counter / Bar */}
      <RoundedBox args={[0.4, 1.2, 5]} position={[-width / 2 + 5.5, 0.6, depth * 0.15]} radius={0.05} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </RoundedBox>
      {/* Counter Top */}
      <RoundedBox args={[0.8, 0.08, 5.2]} position={[-width / 2 + 5.7, 1.22, depth * 0.15]} radius={0.02}>
        <meshStandardMaterial color="#d4a574" />
      </RoundedBox>

      {/* Cash Register */}
      <RoundedBox args={[0.3, 0.3, 0.4]} position={[-width / 2 + 5.7, 1.4, depth * 0.35]} radius={0.02}>
        <meshStandardMaterial color="#2d3748" />
      </RoundedBox>

      {/* Dining Tables */}
      {tablePositions.map((pos, i) => (
        <group key={`table-${i}`} position={[pos.x, 0, pos.z]}>
          {pos.type === 'round' ? (
            <>
              {/* Round Table */}
              <Cylinder args={[0.6, 0.6, 0.05, 24]} position={[0, 0.75, 0]} castShadow>
                <meshStandardMaterial color="#8b4513" />
              </Cylinder>
              <Cylinder args={[0.08, 0.08, 0.75, 8]} position={[0, 0.375, 0]}>
                <meshStandardMaterial color="#5d3a1a" />
              </Cylinder>
              {/* Chairs around */}
              {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, j) => (
                <RoundedBox
                  key={j}
                  args={[0.4, 0.5, 0.4]}
                  position={[Math.sin(angle) * 0.9, 0.25, Math.cos(angle) * 0.9]}
                  radius={0.05}
                  castShadow
                >
                  <meshStandardMaterial color="#654321" />
                </RoundedBox>
              ))}
            </>
          ) : (
            <>
              {/* Rectangular Table */}
              <RoundedBox args={[1.4, 0.05, 0.8]} position={[0, 0.75, 0]} radius={0.02} castShadow>
                <meshStandardMaterial color="#8b4513" />
              </RoundedBox>
              <Box args={[0.06, 0.75, 0.06]} position={[-0.6, 0.375, -0.3]}>
                <meshStandardMaterial color="#5d3a1a" />
              </Box>
              <Box args={[0.06, 0.75, 0.06]} position={[0.6, 0.375, -0.3]}>
                <meshStandardMaterial color="#5d3a1a" />
              </Box>
              <Box args={[0.06, 0.75, 0.06]} position={[-0.6, 0.375, 0.3]}>
                <meshStandardMaterial color="#5d3a1a" />
              </Box>
              <Box args={[0.06, 0.75, 0.06]} position={[0.6, 0.375, 0.3]}>
                <meshStandardMaterial color="#5d3a1a" />
              </Box>
              {/* Chairs */}
              <RoundedBox args={[0.4, 0.5, 0.4]} position={[-0.9, 0.25, 0]} radius={0.05} castShadow>
                <meshStandardMaterial color="#654321" />
              </RoundedBox>
              <RoundedBox args={[0.4, 0.5, 0.4]} position={[0.9, 0.25, 0]} radius={0.05} castShadow>
                <meshStandardMaterial color="#654321" />
              </RoundedBox>
            </>
          )}
        </group>
      ))}

      {/* Booth Seating (medium/large only) */}
      {boothPositions.map((zPos, i) => (
        <group key={`booth-${i}`} position={[width / 2 - 1.2, 0, zPos]}>
          {/* Booth back */}
          <RoundedBox args={[0.15, 1.4, 1.5]} position={[0.5, 0.7, 0]} radius={0.03} castShadow>
            <meshStandardMaterial color="#8b0000" />
          </RoundedBox>
          {/* Booth seat */}
          <RoundedBox args={[0.6, 0.5, 1.4]} position={[0.15, 0.25, 0]} radius={0.05} castShadow>
            <meshStandardMaterial color="#a52a2a" />
          </RoundedBox>
          {/* Small table */}
          <RoundedBox args={[0.5, 0.05, 0.9]} position={[-0.4, 0.72, 0]} radius={0.02}>
            <meshStandardMaterial color="#8b4513" />
          </RoundedBox>
        </group>
      ))}

      {/* Windows */}
      {/* Back wall windows */}
      <Plane args={[2.5, 1.8]} position={[width / 4, 2, -depth / 2 + 0.16]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </Plane>
      {size !== 'small' && (
        <Plane args={[2.5, 1.8]} position={[-width / 8, 2, -depth / 2 + 0.16]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </Plane>
      )}
      
      {/* Right wall windows */}
      <Plane args={[2.5, 1.8]} position={[width / 2 - 0.16, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </Plane>
      {size === 'large' && (
        <Plane args={[2.5, 1.8]} position={[width / 2 - 0.16, 2, -depth / 3]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </Plane>
      )}

      {/* Entry Door */}
      <RoundedBox args={[1.2, 2.5, 0.12]} position={[2, 1.25, depth / 2 - 0.1]} radius={0.02}>
        <meshStandardMaterial color="#5d4037" />
      </RoundedBox>
      {/* Door handle */}
      <Cylinder args={[0.04, 0.04, 0.2, 8]} position={[1.6, 1.1, depth / 2 - 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </Cylinder>

      {/* Drink Station (medium/large) */}
      {size !== 'small' && (
        <group position={[-width / 2 + 6.5, 0, -depth / 2 + 2]}>
          <RoundedBox args={[1.5, 1.2, 0.8]} position={[0, 0.6, 0]} radius={0.03} castShadow>
            <meshStandardMaterial color="#4a5568" />
          </RoundedBox>
          {/* Dispensers */}
          <RoundedBox args={[0.25, 0.4, 0.3]} position={[-0.4, 1.4, 0]} radius={0.02}>
            <meshStandardMaterial color="#2d3748" />
          </RoundedBox>
          <RoundedBox args={[0.25, 0.4, 0.3]} position={[0, 1.4, 0]} radius={0.02}>
            <meshStandardMaterial color="#2d3748" />
          </RoundedBox>
          <RoundedBox args={[0.25, 0.4, 0.3]} position={[0.4, 1.4, 0]} radius={0.02}>
            <meshStandardMaterial color="#2d3748" />
          </RoundedBox>
        </group>
      )}

      {/* Ceiling Lights */}
      {tablePositions.slice(0, Math.min(6, tablePositions.length)).map((pos, i) => (
        <group key={`light-${i}`} position={[pos.x, 3, pos.z]}>
          <Cylinder args={[0.15, 0.25, 0.3, 12]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#2d3748" />
          </Cylinder>
          <pointLight intensity={0.3} distance={5} color="#fff5e6" />
        </group>
      ))}

      {/* Tray Return Station (large only) */}
      {size === 'large' && (
        <group position={[-width / 2 + 6, 0, depth / 2 - 2]}>
          <RoundedBox args={[2, 0.9, 1]} position={[0, 0.45, 0]} radius={0.03} castShadow>
            <meshStandardMaterial color="#718096" metalness={0.6} />
          </RoundedBox>
        </group>
      )}
    </group>
  );
};

export default RestaurantFloorPlan;
