import { useMemo } from 'react';
import type { CampusElement } from '@/data/platonCampusLayout';

interface CampusEnvironmentProps {
  elements: CampusElement[];
}

// Tree component - olive tree style
function OliveTree({ position }: { position: [number, number, number] }) {
  const randomScale = useMemo(() => 0.8 + Math.random() * 0.4, []);
  const randomRotation = useMemo(() => Math.random() * Math.PI * 2, []);
  
  return (
    <group position={position} scale={randomScale} rotation={[0, randomRotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage - multiple spheres for olive tree look */}
      <mesh position={[0, 5, 0]} castShadow>
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 4.5, 0.5]} castShadow>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshStandardMaterial color="#65a30d" roughness={0.8} />
      </mesh>
      <mesh position={[-1.2, 4.8, -0.8]} castShadow>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
      </mesh>
    </group>
  );
}

// School bus
function SchoolBus({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      {/* Bus body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3, 2.2, 7]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[2.8, 0.3, 6.5]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      {/* Windows */}
      {[-2, 0, 2].map((z, i) => (
        <mesh key={i} position={[1.51, 1.5, z]}>
          <boxGeometry args={[0.1, 1, 1.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-1, 0.4, 2.5], [-1, 0.4, -2.5], [1, 0.4, 2.5], [1, 0.4, -2.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
    </group>
  );
}

// Basketball court
function BasketballCourt({ position, dimensions }: { position: [number, number, number]; dimensions: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions[0], dimensions[2]]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      {/* Court lines */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 3.2, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Hoops */}
      {[-dimensions[2] / 2 + 2, dimensions[2] / 2 - 2].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* Pole */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          {/* Backboard */}
          <mesh position={[0, 3.5, i === 0 ? 0.3 : -0.3]} castShadow>
            <boxGeometry args={[1.8, 1.2, 0.05]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          {/* Rim */}
          <mesh position={[0, 3, i === 0 ? 0.6 : -0.6]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.23, 0.02, 8, 16]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Solar panel array
function SolarPanels({ position, rotation = 0, dimensions }: { position: [number, number, number]; rotation?: number; dimensions: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Panel frame */}
      <mesh position={[0, 0, 0]} rotation={[(rotation * Math.PI) / 180, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[dimensions[0], dimensions[1], dimensions[2]]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Support legs */}
      <mesh position={[-dimensions[0] / 3, -0.8, 0]}>
        <boxGeometry args={[0.2, 1.6, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[dimensions[0] / 3, -0.8, 0]}>
        <boxGeometry args={[0.2, 1.6, 0.2]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </group>
  );
}

// Parking lot
function ParkingLot({ position, dimensions }: { position: [number, number, number]; dimensions: [number, number, number] }) {
  const parkingSpots = useMemo(() => {
    const spots: [number, number][] = [];
    const cols = Math.floor(dimensions[0] / 3);
    const rows = 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        spots.push([
          (c - cols / 2) * 3 + 1.5,
          (r - 0.5) * 6
        ]);
      }
    }
    return spots;
  }, [dimensions]);

  return (
    <group position={position}>
      {/* Asphalt surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions[0], dimensions[2]]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      {/* Parking lines */}
      {parkingSpots.map((spot, i) => (
        <mesh key={i} position={[spot[0], 0.01, spot[1]]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 5]} />
          <meshStandardMaterial color="#4b5563" roughness={0.8} />
        </mesh>
      ))}
      {/* Random parked cars */}
      {parkingSpots.slice(0, Math.floor(parkingSpots.length * 0.6)).map((spot, i) => (
        <mesh key={`car-${i}`} position={[spot[0], 0.6, spot[1]]} castShadow>
          <boxGeometry args={[1.8, 1.2, 4]} />
          <meshStandardMaterial 
            color={['#dc2626', '#2563eb', '#16a34a', '#7c3aed', '#374151', '#ffffff'][i % 6]} 
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Field/grass area
function GrassField({ position, dimensions }: { position: [number, number, number]; dimensions: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[dimensions[0], dimensions[2]]} />
      <meshStandardMaterial color="#84cc16" roughness={0.9} />
    </mesh>
  );
}

export function CampusEnvironment({ elements }: CampusEnvironmentProps) {
  return (
    <group>
      {elements.map((element) => {
        switch (element.type) {
          case 'tree':
            return <OliveTree key={element.id} position={element.position} />;
          case 'bus':
            return <SchoolBus key={element.id} position={element.position} rotation={element.rotation} />;
          case 'basketball_court':
            return <BasketballCourt key={element.id} position={element.position} dimensions={element.dimensions!} />;
          case 'solar_panels':
            return <SolarPanels key={element.id} position={element.position} rotation={element.rotation} dimensions={element.dimensions!} />;
          case 'parking':
            return <ParkingLot key={element.id} position={element.position} dimensions={element.dimensions!} />;
          case 'field':
            return <GrassField key={element.id} position={element.position} dimensions={element.dimensions!} />;
          default:
            return null;
        }
      })}
    </group>
  );
}
