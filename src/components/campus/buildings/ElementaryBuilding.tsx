import { useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface ElementaryBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function ElementaryBuilding({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: ElementaryBuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position, rotation } = building;
  const wallColor = '#fef3c7'; // Cream/beige walls
  const roofColor = colors.roof;
  const accentColor = colors.accent || '#7dd3fc'; // Light blue accents

  // Zigzag/chevron shape - matching reference with pitched roofs
  const segmentWidth = dimensions.width / 3.5;
  const segmentDepth = dimensions.depth * 0.8;
  const buildingHeight = dimensions.height;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Main zigzag segments - matching the chevron pattern from photos */}
      {[0, 1, 2].map((i) => {
        const xOffset = (i - 1) * segmentWidth * 1.1;
        const zOffset = i === 1 ? -5 : 3; // Center segment pushed back
        const segRotation = i === 1 ? 0 : (i === 0 ? 0.2 : -0.2);
        
        return (
          <group key={i} position={[xOffset, 0, zOffset]} rotation={[0, segRotation, 0]}>
            {/* Main wall structure - cream/beige */}
            <mesh
              position={[0, buildingHeight / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={() => onHover(true)}
              onPointerOut={() => onHover(false)}
              onClick={onClick}
            >
              <boxGeometry args={[segmentWidth, buildingHeight, segmentDepth]} />
              <meshStandardMaterial 
                color={wallColor} 
                roughness={0.7}
                emissive={isSelected ? '#3b82f6' : '#000000'}
                emissiveIntensity={isSelected ? 0.2 : 0}
              />
            </mesh>

            {/* Light blue accent strip at top */}
            <mesh position={[0, buildingHeight * 0.85, 0]}>
              <boxGeometry args={[segmentWidth + 0.1, buildingHeight * 0.2, segmentDepth + 0.1]} />
              <meshStandardMaterial color={accentColor} roughness={0.6} />
            </mesh>

            {/* Pitched roof - dark grey */}
            <mesh
              position={[0, buildingHeight + 2, 0]}
              rotation={[0, 0, 0]}
              castShadow
            >
              <boxGeometry args={[segmentWidth + 2, 0.4, segmentDepth + 2]} />
              <meshStandardMaterial color={roofColor} roughness={0.5} />
            </mesh>

            {/* Roof peak - triangular prism effect */}
            <mesh
              position={[0, buildingHeight + 2.8, 0]}
              rotation={[Math.PI / 2, 0, Math.PI / 4]}
              castShadow
            >
              <cylinderGeometry args={[0.2, segmentWidth * 0.5, segmentDepth, 4]} />
              <meshStandardMaterial color={roofColor} roughness={0.5} />
            </mesh>

            {/* Windows - multiple rows */}
            {[-1, 0, 1].map((wx, wi) => (
              <mesh 
                key={wi}
                position={[wx * (segmentWidth * 0.28), buildingHeight * 0.5, segmentDepth / 2 + 0.1]}
              >
                <boxGeometry args={[segmentWidth * 0.2, buildingHeight * 0.4, 0.1]} />
                <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
              </mesh>
            ))}

            {/* Back windows */}
            {[-1, 0, 1].map((wx, wi) => (
              <mesh 
                key={wi}
                position={[wx * (segmentWidth * 0.28), buildingHeight * 0.5, -segmentDepth / 2 - 0.1]}
              >
                <boxGeometry args={[segmentWidth * 0.2, buildingHeight * 0.4, 0.1]} />
                <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Connecting corridors between segments */}
      <mesh position={[-segmentWidth * 0.55, buildingHeight * 0.4, -1]} castShadow>
        <boxGeometry args={[segmentWidth * 0.3, buildingHeight * 0.7, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      <mesh position={[segmentWidth * 0.55, buildingHeight * 0.4, -1]} castShadow>
        <boxGeometry args={[segmentWidth * 0.3, buildingHeight * 0.7, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[dimensions.width * 0.45, dimensions.width * 0.5, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, buildingHeight + 6, 0]}
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
