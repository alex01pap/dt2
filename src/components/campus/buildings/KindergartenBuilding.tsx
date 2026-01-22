import { useRef, useState } from 'react';
import { Mesh, Group } from 'three';
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

  // Horseshoe shape - three connected segments
  const segmentWidth = dimensions.width / 3;
  const segmentDepth = dimensions.depth * 0.6;
  const armLength = dimensions.depth;

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Left arm */}
      <mesh
        position={[-segmentWidth, dimensions.height / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[segmentWidth * 0.8, dimensions.height, armLength]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Back segment (curved represented as box) */}
      <mesh
        position={[0, dimensions.height / 2, -armLength / 2 + segmentDepth / 2]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[dimensions.width * 0.9, dimensions.height, segmentDepth]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Right arm */}
      <mesh
        position={[segmentWidth, dimensions.height / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[segmentWidth * 0.8, dimensions.height, armLength]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Roof - flat */}
      <mesh
        position={[0, dimensions.height + 0.15, -2]}
        castShadow
      >
        <boxGeometry args={[dimensions.width + 1, 0.3, dimensions.depth + 1]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>

      {/* Windows */}
      {[-segmentWidth, 0, segmentWidth].map((x, i) => (
        <mesh key={i} position={[x, dimensions.height * 0.6, armLength / 2 + 0.1]}>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[dimensions.width * 0.7, dimensions.width * 0.75, 32]} />
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
