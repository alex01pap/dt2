import { useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { CampusBuilding } from '@/data/platonCampusLayout';

interface ChevronElementaryProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

/**
 * Elementary School - THE ARROW (βέλος)
 * Shape: Chevron / Lambda (Λ) - two wings meeting at an angle pointing SOUTH
 * The point faces the Lyceum (target), tips point toward Kindergarten (bow)
 */
export function ChevronElementary({ 
  building, 
  isSelected, 
  isHovered, 
  onHover, 
  onClick 
}: ChevronElementaryProps) {
  const groupRef = useRef<Group>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isSelected ? 1.02 : 1;
    setHoverScale(prev => prev + (targetScale - prev) * delta * 8);
  });

  const { dimensions, colors, position } = building;
  const wallColor = colors.walls; // Cream/white
  const roofColor = colors.roof; // Grey pitched
  const accentColor = colors.accent || '#7dd3fc'; // Light blue stripe

  // Wing dimensions
  const wingLength = dimensions.width / 2; // Each wing ~30m
  const wingWidth = 8; // Building depth
  const buildingHeight = dimensions.height * 1.5; // 2 stories
  const roofHeight = 3;

  // Chevron angle - wings meet at ~120 degrees (60 degrees from center each side)
  const wingAngle = Math.PI / 5; // ~36 degrees from center line

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* LEFT WING - pointing northwest */}
      <group position={[0, 0, 0]} rotation={[0, wingAngle, 0]}>
        {/* Main wall structure */}
        <mesh
          position={[-wingLength / 2, buildingHeight / 2, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <boxGeometry args={[wingLength, buildingHeight, wingWidth]} />
          <meshStandardMaterial 
            color={wallColor} 
            roughness={0.7}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* Blue accent stripe at ground level */}
        <mesh position={[-wingLength / 2, buildingHeight * 0.15, 0]}>
          <boxGeometry args={[wingLength + 0.2, buildingHeight * 0.2, wingWidth + 0.2]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>

        {/* Pitched roof */}
        <mesh
          position={[-wingLength / 2, buildingHeight + roofHeight / 2, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <boxGeometry args={[wingLength + 1, 0.5, wingWidth + 2]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Roof ridge (triangular peak effect) */}
        <mesh
          position={[-wingLength / 2, buildingHeight + roofHeight * 0.8, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.5, wingLength * 0.08, wingWidth * 0.9, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Windows - two rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`left-win-${i}`}>
            {/* Lower floor windows */}
            <mesh 
              position={[-wingLength * 0.9 + i * (wingLength / 6), buildingHeight * 0.35, wingWidth / 2 + 0.1]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
            </mesh>
            {/* Upper floor windows */}
            <mesh 
              position={[-wingLength * 0.9 + i * (wingLength / 6), buildingHeight * 0.7, wingWidth / 2 + 0.1]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* RIGHT WING - pointing northeast */}
      <group position={[0, 0, 0]} rotation={[0, -wingAngle, 0]}>
        {/* Main wall structure */}
        <mesh
          position={[wingLength / 2, buildingHeight / 2, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <boxGeometry args={[wingLength, buildingHeight, wingWidth]} />
          <meshStandardMaterial 
            color={wallColor} 
            roughness={0.7}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* Blue accent stripe at ground level */}
        <mesh position={[wingLength / 2, buildingHeight * 0.15, 0]}>
          <boxGeometry args={[wingLength + 0.2, buildingHeight * 0.2, wingWidth + 0.2]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>

        {/* Pitched roof */}
        <mesh
          position={[wingLength / 2, buildingHeight + roofHeight / 2, 0]}
          castShadow
        >
          <boxGeometry args={[wingLength + 1, 0.5, wingWidth + 2]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Roof ridge */}
        <mesh
          position={[wingLength / 2, buildingHeight + roofHeight * 0.8, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.5, wingLength * 0.08, wingWidth * 0.9, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.5} />
        </mesh>

        {/* Windows - two rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`right-win-${i}`}>
            {/* Lower floor windows */}
            <mesh 
              position={[wingLength * 0.1 + i * (wingLength / 6), buildingHeight * 0.35, wingWidth / 2 + 0.1]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
            </mesh>
            {/* Upper floor windows */}
            <mesh 
              position={[wingLength * 0.1 + i * (wingLength / 6), buildingHeight * 0.7, wingWidth / 2 + 0.1]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* CENTER CONNECTION - where wings meet (the arrow point) */}
      <mesh
        position={[0, buildingHeight / 2, wingWidth * 0.3]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[wingWidth * 1.2, buildingHeight, wingWidth * 1.2]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Center roof peak */}
      <mesh
        position={[0, buildingHeight + roofHeight * 0.6, wingWidth * 0.3]}
        castShadow
      >
        <coneGeometry args={[wingWidth * 0.9, roofHeight, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[wingLength * 0.8, wingLength * 0.85, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, buildingHeight + roofHeight + 3, 0]}
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
