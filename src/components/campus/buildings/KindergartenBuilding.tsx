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

// Create a C-shape (horseshoe) opening SOUTH
function createCShape(outerRadius: number, innerRadius: number, openingAngle: number = Math.PI * 0.6) {
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

  const { dimensions, position } = building;

  // Color palette from reference photo
  const creamColor = '#F5F5DC'; // Cream/white outer ring
  const lightBlueColor = '#87CEEB'; // Light blue inner building
  const greyRoofColor = '#708090'; // Slate grey roof

  const outerRadius = dimensions.width / 2.5;
  const innerRadius = outerRadius * 0.5;

  // Create the C-shape geometry - opening faces SOUTH
  const cShape = useMemo(() => createCShape(outerRadius, innerRadius, Math.PI * 0.6), [outerRadius, innerRadius]);

  // Opening direction: 180 degrees = opening faces SOUTH
  const openingRotation = (building.rotation || 0) * Math.PI / 180;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, openingRotation, 0]}
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Outer C-ring - CREAM/WHITE single story */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, { depth: dimensions.height, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={creamColor}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Outer ring roof - GREY flat/slight pitch */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}
        castShadow
      >
        <extrudeGeometry args={[cShape, { depth: 0.5, bevelEnabled: false }]} />
        <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
      </mesh>

      {/* Windows around the outer ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const openingAngle = Math.PI * 0.6;
        const startAngle = openingAngle / 2;
        const endAngle = Math.PI * 2 - openingAngle / 2;
        const angle = startAngle + ((endAngle - startAngle) / 7) * i;
        const x = Math.cos(angle) * (outerRadius + 0.1);
        const z = Math.sin(angle) * (outerRadius + 0.1);

        return (
          <mesh
            key={i}
            position={[x, dimensions.height * 0.5, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[1.8, 1.5, 0.1]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* INNER BUILDING - 2-story rectangular LIGHT BLUE building in center */}
      <group position={[0, 0, 0]}>
        {/* Main structure - LIGHT BLUE */}
        <mesh
          position={[0, 4, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <boxGeometry args={[10, 8, 8]} />
          <meshStandardMaterial
            color={lightBlueColor}
            roughness={0.6}
            emissive={isSelected ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.1 : 0}
          />
        </mesh>

        {/* GREY PITCHED ROOF on inner building */}
        <group position={[0, 8, 0]}>
          {/* Left slope */}
          <mesh
            position={[0, 1.5, -2.5]}
            rotation={[Math.PI / 5, 0, 0]}
            castShadow
          >
            <boxGeometry args={[10.5, 0.3, 5.5]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Right slope */}
          <mesh
            position={[0, 1.5, 2.5]}
            rotation={[-Math.PI / 5, 0, 0]}
            castShadow
          >
            <boxGeometry args={[10.5, 0.3, 5.5]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
          {/* Ridge */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[10.5, 0.3, 0.3]} />
            <meshStandardMaterial color={greyRoofColor} roughness={0.4} />
          </mesh>
        </group>

        {/* Windows on inner building - grid pattern */}
        {[-3, 0, 3].map((x, i) => (
          <group key={`inner-win-${i}`}>
            {/* Front windows - floor 1 */}
            <mesh position={[x, 2, 4.1]}>
              <boxGeometry args={[1.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Front windows - floor 2 */}
            <mesh position={[x, 5.5, 4.1]}>
              <boxGeometry args={[1.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Back windows - floor 1 */}
            <mesh position={[x, 2, -4.1]}>
              <boxGeometry args={[1.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
            {/* Back windows - floor 2 */}
            <mesh position={[x, 5.5, -4.1]}>
              <boxGeometry args={[1.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

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
