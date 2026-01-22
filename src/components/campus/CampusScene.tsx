import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Building } from './Building';
import { Ground } from './Ground';
import { BuildingInfoPanel } from './BuildingInfoPanel';

// Building data with mock sensor information
const buildingsData = [
    {
        id: 'kindergarten',
        name: 'Νηπιαγωγείο',
        floors: 1,
        position: [0, 0, -60] as [number, number, number],
        color: '#f5f5f5',
        shape: 'horseshoe' as const,
        dimensions: { width: 40, depth: 40, height: 4 },
        rooms: [
            { name: 'Αίθουσα Α', floor: 1, sensors: { temperature: 22, humidity: 45, occupancy: 15 } },
            { name: 'Αίθουσα Β', floor: 1, sensors: { temperature: 21, humidity: 48, occupancy: 18 } },
            { name: 'Παιδότοπος', floor: 1, sensors: { temperature: 23, humidity: 42, occupancy: 12 } },
        ],
    },
    {
        id: 'kindergarten-inner',
        name: 'Νηπιαγωγείο Κεντρικό',
        floors: 2,
        position: [0, 0, -60] as [number, number, number],
        color: '#87CEEB',
        shape: 'inner-building' as const,
        dimensions: { width: 8, depth: 12, height: 7 },
        rooms: [
            { name: 'Διοίκηση', floor: 1, sensors: { temperature: 22, humidity: 50, occupancy: 3 } },
            { name: 'Αποθήκη', floor: 2, sensors: { temperature: 20, humidity: 55, occupancy: 0 } },
        ],
    },
    {
        id: 'elementary',
        name: 'Δημοτικό',
        floors: 1,
        position: [0, 0, 0] as [number, number, number],
        color: '#f5f5f0',
        shape: 'zigzag' as const,
        dimensions: { width: 60, depth: 30, height: 5 },
        rooms: [
            { name: 'Τάξη Α1', floor: 1, sensors: { temperature: 22, humidity: 47, occupancy: 20 } },
            { name: 'Τάξη Α2', floor: 1, sensors: { temperature: 23, humidity: 45, occupancy: 22 } },
            { name: 'Τάξη Β1', floor: 1, sensors: { temperature: 21, humidity: 50, occupancy: 19 } },
            { name: 'Εργαστήριο', floor: 1, sensors: { temperature: 22, humidity: 48, occupancy: 15 } },
            { name: 'Βιβλιοθήκη', floor: 1, sensors: { temperature: 21, humidity: 52, occupancy: 8 } },
        ],
    },
    {
        id: 'lyceum',
        name: 'Γυμνάσιο-Λύκειο',
        floors: 3,
        position: [0, 0, 60] as [number, number, number],
        color: '#F5DEB3',
        shape: 'ring' as const,
        dimensions: { width: 55, depth: 55, height: 10 },
        rooms: [
            { name: 'Τάξη Α Γυμνασίου', floor: 1, sensors: { temperature: 22, humidity: 46, occupancy: 24 } },
            { name: 'Τάξη Β Γυμνασίου', floor: 1, sensors: { temperature: 23, humidity: 48, occupancy: 23 } },
            { name: 'Τάξη Γ Γυμνασίου', floor: 2, sensors: { temperature: 21, humidity: 50, occupancy: 25 } },
            { name: 'Α Λυκείου', floor: 2, sensors: { temperature: 22, humidity: 47, occupancy: 22 } },
            { name: 'Β Λυκείου', floor: 3, sensors: { temperature: 23, humidity: 45, occupancy: 20 } },
            { name: 'Γ Λυκείου', floor: 3, sensors: { temperature: 22, humidity: 49, occupancy: 18 } },
            { name: 'Γυμναστήριο', floor: 1, sensors: { temperature: 24, humidity: 55, occupancy: 30 } },
        ],
    },
];

// Campus elements
const CampusElements = () => {
    return (
        <>
            {/* Basketball court */}
            <mesh position={[0, 0.05, -30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[15, 28]} />
                <meshStandardMaterial color="#696969" roughness={0.8} />
            </mesh>

            {/* Solar panels */}
            {Array.from({ length: 6 }).map((_, rowIndex) =>
                Array.from({ length: 20 }).map((_, colIndex) => (
                    <mesh
                        key={`solar-${rowIndex}-${colIndex}`}
                        position={[50 + colIndex * 1.2, 0.5, -80 + rowIndex * 3]}
                        rotation={[-Math.PI / 3, 0, 0]}
                        castShadow
                    >
                        <planeGeometry args={[1, 1.5]} />
                        <meshStandardMaterial color="#1a1a3e" metalness={0.9} roughness={0.1} />
                    </mesh>
                ))
            )}

            {/* Parking lot */}
            <mesh position={[0, 0.05, 90]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 30]} />
                <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
            </mesh>

            {/* Chapel with red roof */}
            <group position={[-50, 0, 0]}>
                <mesh position={[0, 2, 0]} castShadow>
                    <boxGeometry args={[5, 4, 3]} />
                    <meshStandardMaterial color="#F5F5F5" />
                </mesh>
                <mesh position={[0, 4.5, 0]} rotation={[0, 0, 0]} castShadow>
                    <coneGeometry args={[3.5, 2, 4]} />
                    <meshStandardMaterial color="#B22222" />
                </mesh>
            </group>

            {/* Trees */}
            {[
                [-40, -40], [-40, 40], [40, -40], [40, 40],
                [-60, 0], [60, 0], [0, -90], [0, 90],
                [-30, -70], [30, -70], [-30, 70], [30, 70],
            ].map(([x, z], i) => (
                <group key={`tree-${i}`} position={[x, 0, z]}>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
                        <meshStandardMaterial color="#654321" />
                    </mesh>
                    <mesh position={[0, 3.5, 0]} castShadow>
                        <sphereGeometry args={[1.5, 8, 8]} />
                        <meshStandardMaterial color="#228B22" />
                    </mesh>
                </group>
            ))}

            {/* School buses */}
            {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={`bus-${i}`} position={[-15, 0.8, -10 + i * 6]} rotation={[0, Math.PI / 2, 0]} castShadow>
                    <boxGeometry args={[2.5, 1.6, 0.8]} />
                    <meshStandardMaterial color="#FFD700" />
                </mesh>
            ))}
        </>
    );
};

// Camera controller for smooth transitions
const CameraController = ({ selectedBuilding }: { selectedBuilding: string | null }) => {
    const { camera } = useThree();

    useEffect(() => {
        if (selectedBuilding) {
            const building = buildingsData.find(b => b.id === selectedBuilding);
            if (building) {
                const targetPosition = new THREE.Vector3(
                    building.position[0] + 30,
                    20,
                    building.position[2] + 30
                );

                // Smooth camera transition
                const startPosition = camera.position.clone();
                const duration = 1000;
                const startTime = Date.now();

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

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

export const CampusScene = () => {
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
    const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

    const handleBuildingClick = (buildingId: string) => {
        setSelectedBuilding(buildingId === selectedBuilding ? null : buildingId);
    };

    const selectedBuildingData = buildingsData.find(b => b.id === selectedBuilding) || null;

    return (
        <div className="w-full h-[700px] rounded-xl overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 relative shadow-xl border border-gray-200">
            {/* Header */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg text-gray-900">Εκπαιδευτήρια Πλάτων</h3>
                <p className="text-sm text-gray-600">Κάντε κλικ σε κτίριο για λεπτομέρειες</p>
            </div>

            {/* Building info panel */}
            <BuildingInfoPanel
                building={selectedBuildingData}
                onClose={() => setSelectedBuilding(null)}
            />

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [60, 40, 60], fov: 50 }}>
                <CameraController selectedBuilding={selectedBuilding} />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={20}
                    maxDistance={120}
                    minPolarAngle={Math.PI / 18} // 10 degrees
                    maxPolarAngle={Math.PI * 0.44} // 80 degrees
                    target={[0, 0, 0]}
                    enableDamping
                    dampingFactor={0.05}
                />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[50, 50, 30]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-100}
                    shadow-camera-right={100}
                    shadow-camera-top={100}
                    shadow-camera-bottom={-100}
                />
                <Environment preset="sunset" />

                {/* Ground */}
                <Ground />

                {/* Buildings */}
                {buildingsData.map((building) => (
                    <Building
                        key={building.id}
                        id={building.id}
                        name={building.name}
                        position={building.position}
                        color={building.color}
                        shape={building.shape}
                        dimensions={building.dimensions}
                        isSelected={selectedBuilding === building.id}
                        isHovered={hoveredBuilding === building.id}
                        onClick={() => handleBuildingClick(building.id)}
                        onHover={(hovering) => setHoveredBuilding(hovering ? building.id : null)}
                    />
                ))}

                {/* Campus elements */}
                <CampusElements />
            </Canvas>
        </div>
    );
};
