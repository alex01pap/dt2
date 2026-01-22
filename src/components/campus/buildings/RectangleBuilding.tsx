import { useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface RectangleBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function RectangleBuilding({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: RectangleBuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position, rotation = 0 } = building;
  const wallColor = colors.walls;
  const roofColor = colors.roof;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Main body */}
      <mesh
        position={[0, dimensions.height / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Flat roof */}
      <mesh
        position={[0, dimensions.height + 0.15, 0]}
        castShadow
      >
        <boxGeometry args={[dimensions.width + 0.5, 0.3, dimensions.depth + 0.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Windows - front */}
      {dimensions.floors > 1 && (
        <>
          {/* First floor windows */}
          {[-dimensions.width / 4, dimensions.width / 4].map((x, i) => (
            <mesh key={`f1-${i}`} position={[x, dimensions.height / 3, dimensions.depth / 2 + 0.05]}>
              <boxGeometry args={[2, 1.5, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
            </mesh>
          ))}
          {/* Second floor windows */}
          {[-dimensions.width / 4, dimensions.width / 4].map((x, i) => (
            <mesh key={`f2-${i}`} position={[x, dimensions.height * 2 / 3, dimensions.depth / 2 + 0.05]}>
              <boxGeometry args={[2, 1.5, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
            </mesh>
          ))}
        </>
      )}

      {/* Door */}
      <mesh position={[0, 1.2, dimensions.depth / 2 + 0.05]}>
        <boxGeometry args={[1.5, 2.4, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(dimensions.width, dimensions.depth) * 0.6, Math.max(dimensions.width, dimensions.depth) * 0.65, 32]} />
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
