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
 * Based on reference photo: cream walls, blue base stripe, grey pitched roofs
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

  const { dimensions, position } = building;

  // Color palette from reference photo
  const creamColor = '#F5F5DC'; // Cream/white walls
  const lightBlueColor = '#87CEEB'; // Light blue base stripe
  const greyRoofColor = '#708090'; // Slate grey pitched roof

  // Wing dimensions
  const wingLength = dimensions.width / 2; // Each wing ~30m
  const wingWidth = 8; // Building depth
  const buildingHeight = dimensions.height; // 2 stories
  const roofHeight = 3; // Pitched roof height

  // Chevron angle - wings meet at 140 degrees (70 degrees from center each side)
  const wingAngle = (70 * Math.PI) / 180; // 70 degrees from center line

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* LEFT WING - pointing northwest */}
      <group position={[0, 0, 0]} rotation={[0, wingAngle, 0]}>
        {/* Main wall structure - CREAM */}
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
            color={creamColor}
            roughness={0.7}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* LIGHT BLUE horizontal stripe at BASE */}
        <mesh position={[-wingLength / 2, buildingHeight * 0.15, wingWidth / 2 + 0.05]}>
          <boxGeometry args={[wingLength + 0.2, buildingHeight * 0.25, 0.1]} />
          <meshStandardMaterial color={lightBlueColor} roughness={0.6} />
        </mesh>

        {/* PITCHED ROOF - Grey with ridge line */}
        <group position={[-wingLength / 2, buildingHeight, 0]}>
          {/* Left slope */}
          <mesh
            position={[0, roofHeight / 2, -wingWidth / 4]}
            rotation={[Math.PI / 6, 0, 0]}
            castShadow
          >
            <boxGeometry args={[wingLength + 1, 0.4, wingWidth / 2 + 1]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Right slope */}
          <mesh
            position={[0, roofHeight / 2, wingWidth / 4]}
            rotation={[-Math.PI / 6, 0, 0]}
            castShadow
          >
            <boxGeometry args={[wingLength + 1, 0.4, wingWidth / 2 + 1]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Ridge line */}
          <mesh position={[0, roofHeight, 0]} castShadow>
            <boxGeometry args={[wingLength + 1, 0.3, 0.3]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
        </group>

        {/* Windows - two rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`left-win-${i}`}>
            {/* Lower floor windows */}
            <mesh
              position={[-wingLength * 0.9 + i * (wingLength / 6), buildingHeight * 0.35, wingWidth / 2 + 0.06]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Upper floor windows */}
            <mesh
              position={[-wingLength * 0.9 + i * (wingLength / 6), buildingHeight * 0.7, wingWidth / 2 + 0.06]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* RIGHT WING - pointing northeast */}
      <group position={[0, 0, 0]} rotation={[0, -wingAngle, 0]}>
        {/* Main wall structure - CREAM */}
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
            color={creamColor}
            roughness={0.7}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* LIGHT BLUE horizontal stripe at BASE */}
        <mesh position={[wingLength / 2, buildingHeight * 0.15, wingWidth / 2 + 0.05]}>
          <boxGeometry args={[wingLength + 0.2, buildingHeight * 0.25, 0.1]} />
          <meshStandardMaterial color={lightBlueColor} roughness={0.6} />
        </mesh>

        {/* PITCHED ROOF - Grey with ridge line */}
        <group position={[wingLength / 2, buildingHeight, 0]}>
          {/* Left slope */}
          <mesh
            position={[0, roofHeight / 2, -wingWidth / 4]}
            rotation={[Math.PI / 6, 0, 0]}
            castShadow
          >
            <boxGeometry args={[wingLength + 1, 0.4, wingWidth / 2 + 1]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Right slope */}
          <mesh
            position={[0, roofHeight / 2, wingWidth / 4]}
            rotation={[-Math.PI / 6, 0, 0]}
            castShadow
          >
            <boxGeometry args={[wingLength + 1, 0.4, wingWidth / 2 + 1]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Ridge line */}
          <mesh position={[0, roofHeight, 0]} castShadow>
            <boxGeometry args={[wingLength + 1, 0.3, 0.3]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
        </group>

        {/* Windows - two rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`right-win-${i}`}>
            {/* Lower floor windows */}
            <mesh
              position={[wingLength * 0.1 + i * (wingLength / 6), buildingHeight * 0.35, wingWidth / 2 + 0.06]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Upper floor windows */}
            <mesh
              position={[wingLength * 0.1 + i * (wingLength / 6), buildingHeight * 0.7, wingWidth / 2 + 0.06]}
            >
              <boxGeometry args={[2.5, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
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
          color={creamColor}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Center roof peak - pyramidal grey roof */}
      <mesh
        position={[0, buildingHeight + roofHeight * 0.7, wingWidth * 0.3]}
        castShadow
      >
        <coneGeometry args={[wingWidth * 0.8, roofHeight * 1.2, 4]} />
        <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
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
