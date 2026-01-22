import { useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface LyceumBuildingProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function LyceumBuilding({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: LyceumBuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position } = building;
  const wallColor = colors.walls;
  const roofColor = colors.roof;
  const accentColor = colors.accent || '#93c5fd';

  const outerRadius = dimensions.width / 2;
  const innerRadius = outerRadius * 0.6;
  const segments = 32;

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Ground floor - cream/beige */}
      <mesh
        position={[0, dimensions.height / 3 / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <cylinderGeometry args={[outerRadius, outerRadius, dimensions.height / 3, segments]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Inner courtyard cutout - ground floor */}
      <mesh position={[0, dimensions.height / 3 / 2, 0]}>
        <cylinderGeometry args={[innerRadius, innerRadius, dimensions.height / 3 + 0.1, segments]} />
        <meshStandardMaterial color="#90a955" roughness={0.9} /> {/* Grass courtyard */}
      </mesh>

      {/* Upper floors - light blue accent */}
      <mesh
        position={[0, dimensions.height / 3 + dimensions.height / 3, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <cylinderGeometry args={[outerRadius, outerRadius, dimensions.height * 2 / 3, segments]} />
        <meshStandardMaterial 
          color={accentColor} 
          roughness={0.6}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Inner courtyard cutout - upper floors */}
      <mesh position={[0, dimensions.height / 3 + dimensions.height / 3, 0]}>
        <cylinderGeometry args={[innerRadius, innerRadius, dimensions.height * 2 / 3 + 0.1, segments]} />
        <meshStandardMaterial color="#90a955" roughness={0.9} />
      </mesh>

      {/* Roof ring */}
      <mesh
        position={[0, dimensions.height + 0.3, 0]}
        castShadow
      >
        <cylinderGeometry args={[outerRadius + 0.5, outerRadius + 0.5, 0.6, segments]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Inner roof edge */}
      <mesh position={[0, dimensions.height + 0.3, 0]}>
        <cylinderGeometry args={[innerRadius - 0.5, innerRadius - 0.5, 0.6, segments]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Windows around the perimeter */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * (outerRadius + 0.1);
        const z = Math.sin(angle) * (outerRadius + 0.1);
        return (
          <mesh 
            key={i} 
            position={[x, dimensions.height * 0.5, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[3, 2, 0.1]} />
            <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
          </mesh>
        );
      })}

      {/* Entrance - south facing */}
      <mesh position={[0, 2, outerRadius + 1]}>
        <boxGeometry args={[6, 4, 2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>

      {/* Entrance roof */}
      <mesh position={[0, 4.2, outerRadius + 1]}>
        <boxGeometry args={[8, 0.4, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[outerRadius + 2, outerRadius + 3, 32]} />
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
