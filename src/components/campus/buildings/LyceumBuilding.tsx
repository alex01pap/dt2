import { useRef, useState, useMemo } from 'react';
import { Group, Shape, ExtrudeGeometry, Vector2 } from 'three';
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

// Create a C-shape (horseshoe) matching the reference photos
function createCShape(outerRadius: number, innerRadius: number, openingAngle: number = Math.PI * 0.4) {
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

  const { dimensions, colors, position } = building;
  const wallColor = '#fef3c7'; // Cream/beige lower
  const accentColor = '#7dd3fc'; // Light blue upper
  const roofColor = colors.roof;

  const outerRadius = dimensions.width / 2;
  const innerRadius = outerRadius * 0.55;
  const wallThickness = outerRadius - innerRadius;
  
  // Floor heights
  const groundFloorHeight = dimensions.height * 0.35;
  const upperFloorsHeight = dimensions.height * 0.65;

  // Create the C-shape geometry - opening faces south
  const cShape = useMemo(() => createCShape(outerRadius, innerRadius, Math.PI * 0.5), [outerRadius, innerRadius]);
  
  const groundFloorExtrudeSettings = {
    depth: groundFloorHeight,
    bevelEnabled: false,
  };
  
  const upperFloorsExtrudeSettings = {
    depth: upperFloorsHeight,
    bevelEnabled: false,
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, Math.PI, 0]} // Rotate so opening faces south
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {/* Ground floor - cream/beige */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, groundFloorExtrudeSettings]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Upper floors - light blue */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, groundFloorHeight, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <extrudeGeometry args={[cShape, upperFloorsExtrudeSettings]} />
        <meshStandardMaterial 
          color={accentColor} 
          roughness={0.6}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Roof - sloped gray */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}
        castShadow
      >
        <extrudeGeometry args={[cShape, { depth: 0.8, bevelEnabled: false }]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Windows around the outer perimeter */}
      {Array.from({ length: 12 }).map((_, i) => {
        const openingAngle = Math.PI * 0.5;
        const startAngle = openingAngle / 2;
        const endAngle = Math.PI * 2 - openingAngle / 2;
        const angle = startAngle + ((endAngle - startAngle) / 11) * i;
        const x = Math.cos(angle) * (outerRadius + 0.15);
        const z = Math.sin(angle) * (outerRadius + 0.15);
        
        return (
          <group key={i}>
            {/* Lower floor windows */}
            <mesh 
              position={[x, groundFloorHeight * 0.6, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.5, 1.5, 0.15]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
            </mesh>
            {/* Upper floor windows */}
            <mesh 
              position={[x, groundFloorHeight + upperFloorsHeight * 0.35, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.5, 1.8, 0.15]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
            </mesh>
            <mesh 
              position={[x, groundFloorHeight + upperFloorsHeight * 0.7, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[2.5, 1.8, 0.15]} />
              <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
            </mesh>
          </group>
        );
      })}

      {/* Main entrance - south facing (at the opening) */}
      <mesh position={[0, 2.5, outerRadius - wallThickness / 2]}>
        <boxGeometry args={[8, 5, wallThickness + 2]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      
      {/* Entrance canopy */}
      <mesh position={[0, 5.2, outerRadius + 2]}>
        <boxGeometry args={[10, 0.4, 5]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>

      {/* Entrance columns */}
      {[-3, 3].map((x, i) => (
        <mesh key={i} position={[x, 2.5, outerRadius + 1.5]}>
          <cylinderGeometry args={[0.3, 0.4, 5, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      ))}

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
