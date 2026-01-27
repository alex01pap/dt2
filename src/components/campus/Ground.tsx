import { ContactShadows } from '@react-three/drei';

export const Ground = () => {
    return (
        <>
            {/* Main grass ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#6B8E23" roughness={0.95} />
            </mesh>

            {/* Dirt patches in center */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <circleGeometry args={[15, 32]} />
                <meshStandardMaterial color="#8B7355" roughness={0.9} />
            </mesh>

            {/* Soft contact shadows */}
            <ContactShadows
                position={[0, 0.01, 0]}
                opacity={0.4}
                scale={150}
                blur={2}
                far={50}
            />
        </>
    );
};
