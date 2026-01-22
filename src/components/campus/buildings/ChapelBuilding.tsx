import { useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface ChapelBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function ChapelBuilding({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: ChapelBuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position } = building;
  const wallColor = colors.walls;
  const roofColor = colors.roof;

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Main body */}
      <mesh
        position={[0, dimensions.height / 2 - 1, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[dimensions.width, dimensions.height - 2, dimensions.depth]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Pitched roof */}
      <mesh
        position={[0, dimensions.height - 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.5, dimensions.width / 1.5, dimensions.depth + 0.5, 3]} />
        <meshStandardMaterial color={roofColor} roughness={0.4} />
      </mesh>

      {/* Bell tower */}
      <mesh position={[0, dimensions.height + 2, -dimensions.depth / 3]} castShadow>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Bell tower roof - dome shape */}
      <mesh position={[0, dimensions.height + 4.5, -dimensions.depth / 3]} castShadow>
        <sphereGeometry args={[1.3, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={roofColor} roughness={0.4} />
      </mesh>

      {/* Cross */}
      <group position={[0, dimensions.height + 6, -dimensions.depth / 3]}>
        <mesh>
          <boxGeometry args={[0.15, 1, 0.15]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.15]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Door */}
      <mesh position={[0, 1.5, dimensions.depth / 2 + 0.05]}>
        <boxGeometry args={[1.5, 3, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Arched window */}
      <mesh position={[0, dimensions.height - 2, dimensions.depth / 2 + 0.05]}>
        <circleGeometry args={[0.8, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={0.8} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[dimensions.depth * 0.8, dimensions.depth * 0.9, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, dimensions.height + 8, 0]}
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
