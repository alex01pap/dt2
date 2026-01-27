import { useRef, useState, useMemo } from 'react';
import { Group, Shape } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface KindergartenBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

// Create a C-shape (smaller horseshoe) matching the reference photos
function createCShape(outerRadius: number, innerRadius: number, openingAngle: number = Math.PI * 0.5) {
  const shape = new Shape();
  const startAngle = openingAngle / 2;
  const endAngle = Math.PI * 2 - openingAngle / 2;
  const segments = 24;
  
  // Outer arc
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / segments);
    const x = Math.cos(angle) * outerRadius;
    const y = Math.sin(angle) * outerRadius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  
  // Connect to inner arc
  const endX = Math.cos(endAngle) * innerRadius;
  const endY = Math.sin(endAngle) * innerRadius;
  shape.lineTo(endX, endY);
  
  // Inner arc (reverse direction)
  for (let i = segments; i >= 0; i--) {
    const angle = startAngle + (endAngle - startAngle) * (i / segments);
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    shape.lineTo(x, y);
  }
  
  shape.closePath();
  return shape;
}

export function KindergartenBuilding({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: KindergartenBuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position } = building;
  const wallColor = colors.walls;
  const roofColor = colors.roof;
  const accentColor = colors.accent || '#7dd3fc';

  const outerRadius = dimensions.width / 2.5;
  const innerRadius = outerRadius * 0.5;
  
  // Create the C-shape geometry - opening faces south
  const cShape = useMemo(() => createCShape(outerRadius, innerRadius, Math.PI * 0.6), [outerRadius, innerRadius]);
  
  const extrudeSettings = {
    depth: dimensions.height,
    bevelEnabled: false,
  };

  // For 2-story buildings, split into lower cream and upper blue
  const isTwoStory = dimensions.floors >= 2;
  const lowerHeight = isTwoStory ? dimensions.height * 0.45 : dimensions.height;
  const upperHeight = isTwoStory ? dimensions.height * 0.55 : 0;

  // Opening direction based on rotation (180 = opening faces south for the BOW)
  const openingRotation = (building.rotation || 0) * Math.PI / 180;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, openingRotation, 0]} // Opening faces south (for the BOW)
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Lower floor - white/cream */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, { depth: lowerHeight, bevelEnabled: false }]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Upper floor - light blue (if 2 story) */}
      {isTwoStory && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, lowerHeight, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <extrudeGeometry args={[cShape, { depth: upperHeight, bevelEnabled: false }]} />
          <meshStandardMaterial 
            color={accentColor} 
            roughness={0.7}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>
      )}

      {/* Curved roof - grey flat */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}
        castShadow
      >
        <extrudeGeometry args={[cShape, { depth: 0.6, bevelEnabled: false }]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>

      {/* Windows around the outer perimeter */}
      {Array.from({ length: 8 }).map((_, i) => {
        const openingAngle = Math.PI * 0.6;
        const startAngle = openingAngle / 2;
        const endAngle = Math.PI * 2 - openingAngle / 2;
        const angle = startAngle + ((endAngle - startAngle) / 7) * i;
        const x = Math.cos(angle) * (outerRadius + 0.1);
        const z = Math.sin(angle) * (outerRadius + 0.1);
        
        return (
          <group key={i}>
            <mesh 
              position={[x, dimensions.height * 0.5, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[1.8, 1.2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
            </mesh>
            {isTwoStory && (
              <mesh 
                position={[x, lowerHeight + upperHeight * 0.5, z]}
                rotation={[0, -angle + Math.PI / 2, 0]}
              >
                <boxGeometry args={[1.8, 1.2, 0.1]} />
                <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[outerRadius + 2, outerRadius + 2.5, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, dimensions.height + 3, 0]}
          center
          distanceFactor={100}
        >
          <div className="bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border whitespace-nowrap">
            <span className="text-sm font-medium">{building.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
