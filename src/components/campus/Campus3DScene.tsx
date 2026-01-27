import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

// Simple ground
function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial color="#4a7c23" />
        </mesh>
    );
}

// KINDERGARTEN - Small C-shape with blue building inside (NORTH)
function Kindergarten({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
    return (
        <group position={[0, 0, -40]} onClick={onClick}>
            {/* Outer C-curve */}
            <mesh position={[0, 2, 0]}>
                <torusGeometry args={[12, 4, 8, 32, Math.PI * 1.5]} />
                <meshStandardMaterial color={isSelected ? "#FFD700" : "#F5F5DC"} />
            </mesh>
            {/* Inner blue building */}
            <mesh position={[0, 3, 0]}>
                <boxGeometry args={[8, 6, 8]} />
                <meshStandardMaterial color="#87CEEB" />
            </mesh>
        </group>
    );
}

// ELEMENTARY - Chevron/Λ shape (CENTER)
function Elementary({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
    const wingLength = 20;
    const wingWidth = 6;
    const wingHeight = 8;
    const spreadAngle = 70 * (Math.PI / 180); // 70 degrees from center = 140 total

    return (
        <group position={[0, 0, 0]} onClick={onClick}>
            {/* Left wing */}
            <mesh
                position={[-Math.sin(spreadAngle) * wingLength / 2, wingHeight / 2, -Math.cos(spreadAngle) * wingLength / 2]}
                rotation={[0, spreadAngle, 0]}
            >
                <boxGeometry args={[wingWidth, wingHeight, wingLength]} />
                <meshStandardMaterial color={isSelected ? "#FFD700" : "#F5F5DC"} />
            </mesh>
            {/* Left roof */}
            <mesh
                position={[-Math.sin(spreadAngle) * wingLength / 2, wingHeight + 2, -Math.cos(spreadAngle) * wingLength / 2]}
                rotation={[0, spreadAngle, 0]}
            >
                <boxGeometry args={[wingWidth + 1, 2, wingLength + 1]} />
                <meshStandardMaterial color="#708090" />
            </mesh>

            {/* Right wing */}
            <mesh
                position={[Math.sin(spreadAngle) * wingLength / 2, wingHeight / 2, -Math.cos(spreadAngle) * wingLength / 2]}
                rotation={[0, -spreadAngle, 0]}
            >
                <boxGeometry args={[wingWidth, wingHeight, wingLength]} />
                <meshStandardMaterial color={isSelected ? "#FFD700" : "#F5F5DC"} />
            </mesh>
            {/* Right roof */}
            <mesh
                position={[Math.sin(spreadAngle) * wingLength / 2, wingHeight + 2, -Math.cos(spreadAngle) * wingLength / 2]}
                rotation={[0, -spreadAngle, 0]}
            >
                <boxGeometry args={[wingWidth + 1, 2, wingLength + 1]} />
                <meshStandardMaterial color="#708090" />
            </mesh>
        </group>
    );
}

// LYCEUM - Large C-shape (SOUTH)
function Lyceum({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) {
    return (
        <group position={[0, 0, 45]} onClick={onClick}>
            {/* C-curve building - using torus geometry */}
            <mesh position={[0, 5, 0]} rotation={[0, Math.PI, 0]}>
                <torusGeometry args={[20, 6, 8, 32, Math.PI * 1.5]} />
                <meshStandardMaterial color={isSelected ? "#FFD700" : "#F5F5DC"} />
            </mesh>
            {/* Blue upper section accent */}
            <mesh position={[0, 9, 0]} rotation={[0, Math.PI, 0]}>
                <torusGeometry args={[20, 2, 8, 32, Math.PI * 1.5]} />
                <meshStandardMaterial color="#87CEEB" />
            </mesh>
        </group>
    );
}

// Main Scene
export default function Campus3DScene() {
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

    return (
        <div className="w-full h-[600px] relative">
            <Canvas camera={{ position: [80, 60, 80], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[50, 50, 25]} intensity={1} castShadow />

                <Ground />

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
                    minDistance={30}
                    maxDistance={200}
                    maxPolarAngle={Math.PI / 2.2}
                />
            </Canvas>

            {selectedBuilding && (
                <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg">
                    <p className="font-bold">
                        {selectedBuilding === 'kindergarten' && 'Νηπιαγωγείο'}
                        {selectedBuilding === 'elementary' && 'Δημοτικό'}
                        {selectedBuilding === 'lyceum' && 'Γυμνάσιο-Λύκειο'}
                    </p>
                    <button
                        onClick={() => setSelectedBuilding(null)}
                        className="text-sm text-gray-500 mt-2"
                    >
                        ✕ Close
                    </button>
                </div>
            )}
        </div>
    );
}
