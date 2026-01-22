import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingProps {
    id: string;
    name: string;
    position: [number, number, number];
    color: string;
    shape: 'box' | 'horseshoe' | 'zigzag' | 'ring' | 'inner-building';
    dimensions: { width: number; depth: number; height: number };
    isSelected: boolean;
    isHovered: boolean;
    onClick: () => void;
    onHover: (hovering: boolean) => void;
}

export const Building = ({
    id,
    name,
    position,
    color,
    shape,
    dimensions,
    isSelected,
    isHovered,
    onClick,
    onHover,
}: BuildingProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hoverHeight, setHoverHeight] = useState(0);

    // Smooth hover animation
    useFrame(() => {
        if (meshRef.current) {
            const targetHeight = isHovered || isSelected ? 0.5 : 0;
            setHoverHeight(prev => prev + (targetHeight - prev) * 0.1);
            meshRef.current.position.y = position[1] + hoverHeight;
        }
    });

    const renderGeometry = () => {
        switch (shape) {
            case 'box':
            default:
                return (
                    <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
                );
        }
    };

    const emissiveColor = isSelected ? color : isHovered ? color : '#000000';
    const emissiveIntensity = isSelected ? 0.4 : isHovered ? 0.2 : 0;

    return (
        <mesh
            ref={meshRef}
            position={[position[0], position[1] + dimensions.height / 2, position[2]]}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                onHover(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                onHover(false);
            }}
            castShadow
            receiveShadow
        >
            {renderGeometry()}
            <meshStandardMaterial
                color={color}
                roughness={0.7}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
            />
        </mesh>
    );
};
