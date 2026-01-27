import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { BuildingInfoPanel } from './BuildingInfoPanel';

// Import specialized building components
import { KindergartenBuilding } from './buildings/KindergartenBuilding';
import { ChevronElementary } from './buildings/ChevronElementary';
import { LyceumBuilding } from './buildings/LyceumBuilding';
import { RectangleBuilding } from './buildings/RectangleBuilding';
import { ChapelBuilding } from './buildings/ChapelBuilding';
import type { CampusBuilding } from '@/data/platonCampusLayout';

/**
 * PLATON SCHOOLS CAMPUS - BOW AND ARROW DESIGN
 * 
 * Layout concept:
 * - KINDERGARTEN (North) = THE BOW - C-shape opening south
 * - ELEMENTARY (Center) = THE ARROW - Chevron (Λ) pointing south
 * - LYCEUM (South) = THE TARGET - C-shape opening north to "catch" the arrow
 */

// Building data matching the Bow and Arrow concept
const campusBuildingsData: CampusBuilding[] = [
  // KINDERGARTEN - THE BOW (North, C-shape opening SOUTH)
  {
    id: 'kindergarten-main',
    name: 'Νηπιαγωγείο',
    nameEn: 'Kindergarten',
    type: 'kindergarten',
    shape: 'horseshoe',
    position: [0, 0, -55], // North position
    rotation: 180, // Opening faces SOUTH
    dimensions: {
      width: 32,
      depth: 24,
      height: 5,
      floors: 1,
    },
    colors: {
      walls: '#ffffff',
      roof: '#64748b',
      accent: '#7dd3fc',
    },
    rooms: [
      { id: 'k-1', name: 'Τάξη Α', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
        { type: 'humidity', value: 45, unit: '%', status: 'online' },
        { type: 'occupancy', value: 18, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'k-2', name: 'Τάξη Β', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 23.1, unit: '°C', status: 'online' },
        { type: 'humidity', value: 48, unit: '%', status: 'online' },
        { type: 'occupancy', value: 15, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'k-3', name: 'Τάξη Γ', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 21.8, unit: '°C', status: 'warning' },
      ]},
    ],
  },
  // KINDERGARTEN INNER BUILDING - Blue 2-story rectangle inside the bow
  {
    id: 'kindergarten-inner',
    name: 'Κεντρικό Νηπιαγωγείο',
    nameEn: 'Kindergarten Main',
    type: 'kindergarten',
    shape: 'rectangle',
    position: [0, 0, -48], // Inside the C-curve, slightly south
    rotation: 0,
    dimensions: {
      width: 14,
      depth: 10,
      height: 8,
      floors: 2,
    },
    colors: {
      walls: '#60a5fa', // Light blue
      roof: '#475569',
    },
    rooms: [
      { id: 'ki-1', name: 'Αίθουσα Παιχνιδιού', floor: 1, type: 'other', sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'ki-2', name: 'Διοίκηση', floor: 2, type: 'office', sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // ELEMENTARY - THE ARROW (Center, Chevron/Λ pointing SOUTH)
  {
    id: 'elementary',
    name: 'Δημοτικό Σχολείο',
    nameEn: 'Elementary School',
    type: 'elementary',
    shape: 'zigzag', // Will render as chevron
    position: [0, 0, -10], // Center, between bow and target
    rotation: 0,
    dimensions: {
      width: 60, // Total span of both wings
      depth: 20,
      height: 6,
      floors: 2,
    },
    colors: {
      walls: '#fef3c7', // Cream/white
      roof: '#4b5563', // Grey pitched
      accent: '#7dd3fc', // Light blue stripe
    },
    rooms: [
      { id: 'e-1a', name: 'Α\' Τάξη - Τμήμα 1', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.3, unit: '°C', status: 'online' },
        { type: 'humidity', value: 44, unit: '%', status: 'online' },
        { type: 'occupancy', value: 22, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'e-1b', name: 'Α\' Τάξη - Τμήμα 2', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
      ]},
      { id: 'e-2a', name: 'Β\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.1, unit: '°C', status: 'online' },
      ]},
      { id: 'e-3', name: 'Γ\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.4, unit: '°C', status: 'online' },
      ]},
      { id: 'e-4', name: 'Δ\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'e-lab', name: 'Εργαστήριο Η/Υ', floor: 2, type: 'lab', sensors: [
        { type: 'temperature', value: 21.5, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // LYCEUM - THE TARGET (South, C-shape opening NORTH)
  {
    id: 'lyceum',
    name: 'Γυμνάσιο - Λύκειο',
    nameEn: 'Lyceum & Gymnasium',
    type: 'lyceum',
    shape: 'ring', // Horseshoe/C-shape
    position: [0, 0, 50], // South position
    rotation: 0, // Opening faces NORTH
    dimensions: {
      width: 55,
      depth: 55,
      height: 11,
      floors: 3,
    },
    colors: {
      walls: '#fef3c7', // Ground: cream
      roof: '#64748b',
      accent: '#7dd3fc', // Upper: light blue
    },
    rooms: [
      { id: 'l-reception', name: 'Υποδοχή', floor: 1, type: 'office', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
      ]},
      { id: 'l-cafeteria', name: 'Κυλικείο', floor: 1, type: 'cafeteria', sensors: [
        { type: 'temperature', value: 23.5, unit: '°C', status: 'online' },
      ]},
      { id: 'l-gym', name: 'Γυμναστήριο', floor: 1, type: 'gym', sensors: [
        { type: 'temperature', value: 24.0, unit: '°C', status: 'online' },
      ]},
      { id: 'l-1a', name: 'Α\' Γυμνασίου', floor: 2, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
      ]},
      { id: 'l-2a', name: 'Β\' Γυμνασίου', floor: 2, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
      ]},
      { id: 'l-1b', name: 'Α\' Λυκείου', floor: 3, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.6, unit: '°C', status: 'online' },
      ]},
      { id: 'l-library', name: 'Βιβλιοθήκη', floor: 3, type: 'library', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // CHAPEL - West side
  {
    id: 'chapel',
    name: 'Εκκλησάκι',
    nameEn: 'Chapel',
    type: 'chapel',
    shape: 'chapel',
    position: [-50, 0, 10],
    rotation: 0,
    dimensions: {
      width: 8,
      depth: 12,
      height: 7,
      floors: 1,
    },
    colors: {
      walls: '#ffffff',
      roof: '#b91c1c', // Red terracotta
    },
    rooms: [],
  },
];

// Campus environmental elements
const CampusEnvironment = () => {
  return (
    <>
      {/* BASKETBALL COURT - Between Elementary and Kindergarten */}
      <group position={[0, 0.05, -32]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 30]} />
          <meshStandardMaterial color="#5c5c5c" roughness={0.85} />
        </mesh>
        {/* Court lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[4, 4.2, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Hoops */}
        {[-12, 12].map((z, i) => (
          <group key={`hoop-${i}`} position={[0, 3, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 3, 0.15]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            <mesh position={[0, 1.2, z > 0 ? -0.5 : 0.5]}>
              <boxGeometry args={[1.2, 0.8, 0.05]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* SOLAR PANELS - East side */}
      <group position={[55, 0, -20]}>
        {Array.from({ length: 6 }).map((_, row) => (
          <group key={`solar-row-${row}`} position={[0, 0, row * 8]}>
            {Array.from({ length: 8 }).map((_, col) => (
              <mesh
                key={`solar-${row}-${col}`}
                position={[col * 3, 1.5 + col * 0.1, 0]}
                rotation={[-Math.PI / 4, 0, 0]}
                castShadow
              >
                <boxGeometry args={[2.5, 0.1, 3.5]} />
                <meshStandardMaterial color="#1e3a5f" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* PARKING LOT - South of Lyceum */}
      <group position={[0, 0.02, 95]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
        {/* Parking lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={`line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-27.5 + i * 5, 0.01, 0]}>
            <planeGeometry args={[0.15, 5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        {/* Parked cars */}
        {[
          [-20, 0], [-10, 0], [0, 0], [10, 0], [20, 0],
          [-15, 8], [-5, 8], [5, 8], [15, 8],
        ].map(([x, z], i) => (
          <mesh key={`car-${i}`} position={[x, 0.7, z]} castShadow>
            <boxGeometry args={[2.2, 1.4, 4.5]} />
            <meshStandardMaterial color={['#1e40af', '#dc2626', '#16a34a', '#f59e0b', '#6b7280'][i % 5]} />
          </mesh>
        ))}
      </group>

      {/* SCHOOL BUSES - West side along Elementary */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`bus-${i}`} position={[-35, 0, -25 + i * 8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[8, 2.4, 2.5]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Windows */}
          <mesh position={[0, 1.5, 1.26]}>
            <boxGeometry args={[7, 1, 0.1]} />
            <meshStandardMaterial color="#1e3a8a" transparent opacity={0.8} />
          </mesh>
          {/* Wheels */}
          {[-2.5, 2.5].map((x, wi) => (
            <mesh key={wi} position={[x, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.5, 0.5, 2.6, 16]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          ))}
        </group>
      ))}

      {/* PLAYGROUND - Near Kindergarten */}
      <group position={[-25, 0, -50]}>
        {/* Slide */}
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 0.1, 4]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Swing frame */}
        <mesh position={[5, 2, 0]} castShadow>
          <boxGeometry args={[4, 0.2, 0.2]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        {[3.5, 6.5].map((x, i) => (
          <mesh key={i} position={[x, 1, 0]} castShadow>
            <boxGeometry args={[0.2, 4, 0.2]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        ))}
      </group>

      {/* TREES - Scattered around perimeter */}
      {[
        // West perimeter
        [-60, -60], [-65, -40], [-60, -20], [-65, 0], [-60, 20], [-65, 40], [-55, 60],
        // East perimeter
        [85, -50], [90, -30], [85, -10], [90, 10], [85, 30], [90, 50],
        // North
        [-40, -75], [-20, -80], [0, -78], [20, -80], [40, -75],
        // South
        [-30, 115], [0, 118], [30, 115],
      ].map(([x, z], i) => (
        <group key={`tree-${i}`} position={[x, 0, z]}>
          {/* Trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 4, 8]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 5, 0]} castShadow>
            <sphereGeometry args={[2.5, 8, 8]} />
            <meshStandardMaterial color="#228b22" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* GROUND */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 20]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#4ade80" roughness={0.95} />
      </mesh>

      {/* Asphalt paths */}
      {/* Main north-south path (the arrow trajectory) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[6, 120]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} />
      </mesh>

      {/* Contact shadows for depth */}
      <ContactShadows
        position={[0, 0, 20]}
        opacity={0.4}
        scale={200}
        blur={2}
        far={80}
      />
    </>
  );
};

// Camera controller for smooth transitions
const CameraController = ({ selectedBuilding }: { selectedBuilding: string | null }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (selectedBuilding) {
      const building = campusBuildingsData.find(b => b.id === selectedBuilding);
      if (building) {
        const targetPosition = new THREE.Vector3(
          building.position[0] + 40,
          25,
          building.position[2] + 40
        );

        const startPosition = camera.position.clone();
        const duration = 800;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          camera.position.lerpVectors(startPosition, targetPosition, eased);
          camera.lookAt(building.position[0], 0, building.position[2]);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    }
  }, [selectedBuilding, camera]);

  return null;
};

// Building renderer - routes to appropriate component based on type
interface BuildingRendererProps {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

const BuildingRenderer = ({ building, isSelected, isHovered, onHover, onClick }: BuildingRendererProps) => {
  switch (building.type) {
    case 'kindergarten':
      if (building.shape === 'rectangle') {
        return (
          <RectangleBuilding
            building={building}
            isSelected={isSelected}
            isHovered={isHovered}
            onHover={onHover}
            onClick={onClick}
          />
        );
      }
      return (
        <KindergartenBuilding
          building={building}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={onHover}
          onClick={onClick}
        />
      );
    case 'elementary':
      return (
        <ChevronElementary
          building={building}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={onHover}
          onClick={onClick}
        />
      );
    case 'lyceum':
      return (
        <LyceumBuilding
          building={building}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={onHover}
          onClick={onClick}
        />
      );
    case 'chapel':
      return (
        <ChapelBuilding
          building={building}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={onHover}
          onClick={onClick}
        />
      );
    default:
      return (
        <RectangleBuilding
          building={building}
          isSelected={isSelected}
          isHovered={isHovered}
          onHover={onHover}
          onClick={onClick}
        />
      );
  }
};

export const CampusScene = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuilding(buildingId === selectedBuilding ? null : buildingId);
  };

  // Transform building data for info panel
  const selectedBuildingData = campusBuildingsData.find(b => b.id === selectedBuilding);
  const panelData = selectedBuildingData ? {
    id: selectedBuildingData.id,
    name: selectedBuildingData.name,
    floors: selectedBuildingData.dimensions.floors,
    rooms: selectedBuildingData.rooms.map(r => ({
      name: r.name,
      floor: r.floor,
      sensors: {
        temperature: r.sensors.find(s => s.type === 'temperature')?.value || 22,
        humidity: r.sensors.find(s => s.type === 'humidity')?.value || 45,
        occupancy: r.sensors.find(s => s.type === 'occupancy')?.value || 0,
      }
    }))
  } : null;

  return (
    <div className="w-full h-[700px] rounded-xl overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 relative shadow-xl border border-border">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-border">
        <h3 className="font-bold text-lg text-foreground">Εκπαιδευτήρια Πλάτων</h3>
        <p className="text-sm text-muted-foreground">Κάντε κλικ σε κτίριο για λεπτομέρειες</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-border">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
            <span className="text-muted-foreground">Νηπιαγωγείο (Τόξο)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
            <span className="text-muted-foreground">Δημοτικό (Βέλος)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-200 border border-sky-300" />
            <span className="text-muted-foreground">Λύκειο (Στόχος)</span>
          </div>
        </div>
      </div>

      {/* Building info panel */}
      <BuildingInfoPanel
        building={panelData}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* 3D Canvas */}
      <Canvas 
        shadows 
        camera={{ 
          position: [70, 50, 80], // Southeast looking northwest
          fov: 50 
        }}
      >
        <Suspense fallback={null}>
          <CameraController selectedBuilding={selectedBuilding} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={30}
            maxDistance={150}
            minPolarAngle={Math.PI / 12}
            maxPolarAngle={Math.PI * 0.45}
            target={[0, 0, 10]}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[60, 80, 40]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-120}
            shadow-camera-right={120}
            shadow-camera-top={120}
            shadow-camera-bottom={-120}
          />
          <hemisphereLight args={['#87ceeb', '#4ade80', 0.4]} />
          <Environment preset="sunset" />

          {/* Campus environment elements */}
          <CampusEnvironment />

          {/* Buildings */}
          {campusBuildingsData.map((building) => (
            <BuildingRenderer
              key={building.id}
              building={building}
              isSelected={selectedBuilding === building.id}
              isHovered={hoveredBuilding === building.id}
              onHover={(hovered) => setHoveredBuilding(hovered ? building.id : null)}
              onClick={() => handleBuildingClick(building.id)}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
