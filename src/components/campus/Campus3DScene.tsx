import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useMemo } from 'react';
import * as THREE from 'three';

// Dark ground with subtle grid pattern
function DarkGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0a14" />
      </mesh>
      
      {/* Grid overlay */}
      <gridHelper 
        args={[200, 40, '#1a1a2e', '#12121c']} 
        position={[0, 0.01, 0]} 
      />
      
      {/* Subtle crosses pattern like reference */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 180;
        const z = (Math.random() - 0.5) * 180;
        return (
          <group key={i} position={[x, 0.02, z]}>
            {/* Horizontal line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.5, 0.15]} />
              <meshBasicMaterial color="#1f1f30" transparent opacity={0.5} />
            </mesh>
            {/* Vertical line */}
            <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[1.5, 0.15]} />
              <meshBasicMaterial color="#1f1f30" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// KINDERGARTEN - Small C-shape with blue building inside (positioned east)
function Kindergarten({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
  return (
    <group position={[35, 0, -25]} onClick={onClick}>
      {/* Outer C-curve using extruded shape */}
      <mesh position={[0, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[10, 3, 8, 24, Math.PI * 1.4]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffd700" : "#f5f0e6"} 
          emissive={isSelected ? "#ffd700" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Roof accent line */}
      <mesh position={[0, 5.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[10, 0.5, 8, 24, Math.PI * 1.4]} />
        <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Inner blue building */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[7, 8, 7]} />
        <meshStandardMaterial 
          color="#5b9bd5" 
          emissive="#5b9bd5" 
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Blue building roof accent */}
      <mesh position={[0, 8.2, 0]}>
        <boxGeometry args={[7.5, 0.4, 7.5]} />
        <meshStandardMaterial color="#3a7bc8" emissive="#3a7bc8" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// ELEMENTARY - Arrow shape pointing toward Lyceum (south)
function Elementary({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
  // Create arrow shape pointing south (toward Lyceum)
  const arrowShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Arrow dimensions
    const arrowLength = 24;  // Total length of arrow
    const arrowWidth = 16;   // Width at the back
    const shaftWidth = 8;    // Width of shaft
    const headLength = 10;   // Length of arrowhead portion
    
    // Start from back-left, go clockwise
    // Back left corner
    shape.moveTo(-arrowWidth / 2, 0);
    
    // Back edge (flat back)
    shape.lineTo(arrowWidth / 2, 0);
    
    // Right side going down to shaft
    shape.lineTo(shaftWidth / 2, 0);
    shape.lineTo(shaftWidth / 2, arrowLength - headLength);
    
    // Right wing of arrowhead
    shape.lineTo(arrowWidth / 2, arrowLength - headLength);
    
    // Arrow point
    shape.lineTo(0, arrowLength);
    
    // Left wing of arrowhead
    shape.lineTo(-arrowWidth / 2, arrowLength - headLength);
    
    // Left side going back up
    shape.lineTo(-shaftWidth / 2, arrowLength - headLength);
    shape.lineTo(-shaftWidth / 2, 0);
    
    shape.lineTo(-arrowWidth / 2, 0);
    
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 8,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.2,
    bevelOffset: 0,
    bevelSegments: 2
  };

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Main building body */}
      <mesh 
        rotation={[-Math.PI / 2, 0, Math.PI]} 
        position={[0, 4, 12]}
      >
        <extrudeGeometry args={[arrowShape, extrudeSettings]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffd700" : "#f5f0e6"} 
          emissive={isSelected ? "#ffd700" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Blue accent stripe on top */}
      <mesh 
        rotation={[-Math.PI / 2, 0, Math.PI]} 
        position={[0, 8.2, 12]}
      >
        <extrudeGeometry args={[arrowShape, { ...extrudeSettings, depth: 1.5 }]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          emissive="#87ceeb" 
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Roof ridge line following arrow */}
      <mesh 
        rotation={[-Math.PI / 2, 0, Math.PI]} 
        position={[0, 9.5, 12]}
      >
        <extrudeGeometry args={[arrowShape, { ...extrudeSettings, depth: 0.3, bevelEnabled: false }]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </group>
  );
}

// LYCEUM - Large C-shape opening north (to "catch" the arrow)
function Lyceum({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
  // Create C-shape using extruded arc
  const cShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 25;
    const innerRadius = 18;
    const arcAngle = Math.PI * 1.3; // About 234 degrees
    const startAngle = Math.PI * 0.85; // Start from upper left
    
    // Outer arc
    shape.absarc(0, 0, outerRadius, startAngle, startAngle + arcAngle, false);
    
    // Line to inner arc
    const endInnerX = Math.cos(startAngle + arcAngle) * innerRadius;
    const endInnerY = Math.sin(startAngle + arcAngle) * innerRadius;
    shape.lineTo(endInnerX, endInnerY);
    
    // Inner arc (reverse direction)
    shape.absarc(0, 0, innerRadius, startAngle + arcAngle, startAngle, true);
    
    // Close the shape
    shape.closePath();
    
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 12,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.2,
    bevelOffset: 0,
    bevelSegments: 2
  };

  return (
    <group position={[0, 0, 50]} onClick={onClick}>
      {/* Ground floor - cream/beige */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <extrudeGeometry args={[cShape, { ...extrudeSettings, depth: 4 }]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffd700" : "#f5f0e6"} 
          emissive={isSelected ? "#ffd700" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Upper floors - light blue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <extrudeGeometry args={[cShape, { ...extrudeSettings, depth: 6 }]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffd700" : "#87ceeb"} 
          emissive={isSelected ? "#ffd700" : "#87ceeb"}
          emissiveIntensity={isSelected ? 0.3 : 0.15}
        />
      </mesh>
      
      {/* Roof accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 14.2, 0]}>
        <extrudeGeometry args={[cShape, { ...extrudeSettings, depth: 0.5 }]} />
        <meshStandardMaterial color="#3a7bc8" emissive="#3a7bc8" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Dark premium lighting setup
function PremiumLighting() {
  return (
    <>
      {/* Soft ambient - very low for dark feel */}
      <ambientLight intensity={0.15} color="#a0a8c0" />
      
      {/* Main directional light - slight blue tint */}
      <directionalLight 
        position={[40, 60, -30]} 
        intensity={0.8} 
        color="#c0d0ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight 
        position={[-40, 40, 30]} 
        intensity={0.3} 
        color="#8090b0"
      />
      
      {/* Subtle rim light from behind */}
      <directionalLight 
        position={[0, 30, -60]} 
        intensity={0.4} 
        color="#6080ff"
      />
      
      {/* Point lights for building glow effect */}
      <pointLight position={[0, 15, 50]} intensity={0.5} color="#87ceeb" distance={60} />
      <pointLight position={[35, 10, -25]} intensity={0.3} color="#5b9bd5" distance={40} />
      <pointLight position={[0, 12, 0]} intensity={0.4} color="#87ceeb" distance={50} />
    </>
  );
}

// Main Scene
export default function Campus3DScene() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  return (
    <div className="w-full h-[600px] relative rounded-xl overflow-hidden">
      {/* Dark gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0f0f1a 0%, #0a0a14 50%, #050508 100%)',
          zIndex: 0
        }}
      />
      
      <Canvas 
        camera={{ position: [80, 50, 80], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Dark background color */}
        <color attach="background" args={['#0a0a14']} />
        
        <PremiumLighting />
        <DarkGround />

        <Kindergarten
          onClick={() => setSelectedBuilding('kindergarten')}
          isSelected={selectedBuilding === 'kindergarten'}
        />
        <Elementary
          onClick={() => setSelectedBuilding('elementary')}
          isSelected={selectedBuilding === 'elementary'}
        />
        <Lyceum
          onClick={() => setSelectedBuilding('lyceum')}
          isSelected={selectedBuilding === 'lyceum'}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={40}
          maxDistance={180}
          maxPolarAngle={Math.PI / 2.1}
          target={[10, 0, 15]}
        />
      </Canvas>

      {/* Selected building info panel */}
      {selectedBuilding && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="font-semibold text-white text-lg">
            {selectedBuilding === 'kindergarten' && 'Νηπιαγωγείο'}
            {selectedBuilding === 'elementary' && 'Δημοτικό'}
            {selectedBuilding === 'lyceum' && 'Γυμνάσιο-Λύκειο'}
          </p>
          <p className="text-sm text-white/60 mt-1">
            {selectedBuilding === 'kindergarten' && 'Kindergarten'}
            {selectedBuilding === 'elementary' && 'Elementary School'}
            {selectedBuilding === 'lyceum' && 'Gymnasium & Lyceum'}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBuilding(null);
            }}
            className="text-xs text-white/40 hover:text-white/80 mt-3 transition-colors"
          >
            ✕ Close
          </button>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-lg">
        <p className="text-xs text-white/50 mb-2">Click building to select</p>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f5f0e6]" />
            <span className="text-white/70">Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#87ceeb]" />
            <span className="text-white/70">Blue Accent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
