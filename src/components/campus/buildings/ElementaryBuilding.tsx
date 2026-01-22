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
  const wallColor = colors.walls;
  const roofColor = colors.roof;
  const accentColor = colors.accent || '#3b82f6';

  // Zigzag/W shape - 4 connected segments at angles
  const segmentWidth = dimensions.width / 4;
  const segmentDepth = dimensions.depth;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Zigzag segments */}
      {[0, 1, 2, 3].map((i) => {
        const xOffset = (i - 1.5) * segmentWidth;
        const zOffset = i % 2 === 0 ? -3 : 3;
        const segRotation = i % 2 === 0 ? 0.15 : -0.15;
        
        return (
          <group key={i} position={[xOffset, 0, zOffset]} rotation={[0, segRotation, 0]}>
            {/* Wall */}
            <mesh
              position={[0, dimensions.height / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={() => onHover(true)}
              onPointerOut={() => onHover(false)}
              onClick={onClick}
            >
              <boxGeometry args={[segmentWidth * 1.1, dimensions.height, segmentDepth]} />
              <meshStandardMaterial 
                color={wallColor} 
                roughness={0.7}
                emissive={isSelected ? '#3b82f6' : '#000000'}
                emissiveIntensity={isSelected ? 0.2 : 0}
              />
            </mesh>

            {/* Pitched roof */}
            <mesh
              position={[0, dimensions.height + 1.5, 0]}
              rotation={[0, 0, 0]}
              castShadow
            >
              <boxGeometry args={[segmentWidth * 1.2, 0.4, segmentDepth + 1]} />
              <meshStandardMaterial color={roofColor} roughness={0.5} />
            </mesh>

            {/* Roof peak */}
            <mesh
              position={[0, dimensions.height + 2.2, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.3, segmentWidth * 0.6, segmentDepth + 0.5, 3]} />
              <meshStandardMaterial color={roofColor} roughness={0.5} />
            </mesh>

            {/* Blue mural accent on south-facing side */}
            <mesh position={[0, dimensions.height * 0.4, segmentDepth / 2 + 0.05]}>
              <boxGeometry args={[segmentWidth * 0.8, dimensions.height * 0.5, 0.1]} />
              <meshStandardMaterial color={accentColor} roughness={0.6} />
            </mesh>

            {/* Windows */}
            <mesh position={[0, dimensions.height * 0.6, segmentDepth / 2 + 0.1]}>
              <boxGeometry args={[segmentWidth * 0.5, 1.2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[dimensions.width * 0.55, dimensions.width * 0.6, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, dimensions.height + 5, 0]}
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
