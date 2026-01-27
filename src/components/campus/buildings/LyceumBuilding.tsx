import { useRef, useState, useMemo } from 'react';
import { Group, Shape } from 'three';
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

// Create a C-shape (horseshoe) opening NORTH toward Elementary
function createCShape(outerRadius: number, innerRadius: number, openingAngle: number = Math.PI * 0.5) {
  const shape = new Shape();
  const startAngle = openingAngle / 2;
  const endAngle = Math.PI * 2 - openingAngle / 2;
  const segments = 32;

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

  const { dimensions, position } = building;

  // Color palette from reference photo
  const creamColor = '#F5F5DC'; // Cream/beige walls
  const lightBlueColor = '#87CEEB'; // Light sky blue accents
  const greyRoofColor = '#708090'; // Slate grey tiles

  const outerRadius = dimensions.width / 2;
  const innerRadius = outerRadius * 0.60;
  const wallThickness = outerRadius - innerRadius;

  // Floor heights - 2-3 stories
  const groundFloorHeight = dimensions.height * 0.30;
  const upperFloorsHeight = dimensions.height * 0.70;

  // Create the C-shape geometry - opening faces NORTH
  const cShape = useMemo(() => createCShape(outerRadius, innerRadius, Math.PI * 0.5), [outerRadius, innerRadius]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, Math.PI, 0]} // Rotate so opening faces NORTH toward Elementary
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Ground floor - CREAM/BEIGE all around */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, { depth: groundFloorHeight, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={creamColor}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Upper floors - CREAM base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, groundFloorHeight, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, { depth: upperFloorsHeight, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={creamColor}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* LIGHT BLUE vertical sections on upper floors - alternating pattern */}
      {Array.from({ length: 8 }).map((_, i) => {
        const openingAngle = Math.PI * 0.5;
        const startAngle = openingAngle / 2;
        const endAngle = Math.PI * 2 - openingAngle / 2;
        const angle = startAngle + ((endAngle - startAngle) / 8) * (i + 0.5);
        const x = Math.cos(angle) * (outerRadius + 0.2);
        const z = Math.sin(angle) * (outerRadius + 0.2);

        return (
          <mesh
            key={i}
            position={[x, groundFloorHeight + upperFloorsHeight / 2, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
            castShadow
          >
            <boxGeometry args={[3, upperFloorsHeight, 0.3]} />
            <meshStandardMaterial color={lightBlueColor} roughness={0.6} />
          </mesh>
        );
      })}

      {/* Roof - GREY with slight TILED texture appearance */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}
        castShadow
      >
        <extrudeGeometry args={[cShape, { depth: 0.6, bevelEnabled: false }]} />
        <meshStandardMaterial color={greyRoofColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Windows grid pattern - more visible */}
      {Array.from({ length: 12 }).map((_, i) => {
        const openingAngle = Math.PI * 0.5;
        const startAngle = openingAngle / 2;
        const endAngle = Math.PI * 2 - openingAngle / 2;
        const angle = startAngle + ((endAngle - startAngle) / 11) * i;
        const x = Math.cos(angle) * (outerRadius + 0.15);
        const z = Math.sin(angle) * (outerRadius + 0.15);

        return (
          <group key={i}>
            {/* Ground floor windows */}
            <mesh
              position={[x, groundFloorHeight * 0.5, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.2, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Upper floor windows - 2 rows */}
            <mesh
              position={[x, groundFloorHeight + upperFloorsHeight * 0.35, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.2, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            <mesh
              position={[x, groundFloorHeight + upperFloorsHeight * 0.70, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.2, 2, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* INNER COURTYARD BUILDING - small rectangular building inside */}
      <group position={[0, 0, -innerRadius * 0.3]}>
        {/* 2-story cream building */}
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 6, 8]} />
          <meshStandardMaterial color={creamColor} roughness={0.7} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 6.3, 0]} castShadow>
          <boxGeometry args={[11, 0.6, 9]} />
          <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
        </mesh>
        {/* Windows */}
        {[-3, 0, 3].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 2, 4.1]}>
              <boxGeometry args={[1.5, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            <mesh position={[x, 4.5, 4.1]}>
              <boxGeometry args={[1.5, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

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
