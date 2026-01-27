import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, ContactShadows, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  platonBuildings, 
  campusElements, 
  platonCampusConfig,
  type CampusBuilding 
} from '@/data/platonCampusLayout';
import { KindergartenBuilding } from './buildings/KindergartenBuilding';
import { ElementaryBuilding } from './buildings/ElementaryBuilding';
import { LyceumBuilding } from './buildings/LyceumBuilding';
import { ChapelBuilding } from './buildings/ChapelBuilding';
import { RectangleBuilding } from './buildings/RectangleBuilding';
import { CampusEnvironment } from './environment/CampusEnvironment';
import { CampusBuildingSidebar } from './CampusBuildingSidebar';

// Ground plane with grass texture
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[platonCampusConfig.groundSize[0], platonCampusConfig.groundSize[1]]} />
      <meshStandardMaterial 
        color="#90a955" 
        roughness={0.95}
      />
    </mesh>
  );
}

// Loading fallback
function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Φόρτωση campus...</span>
      </div>
    </Html>
  );
}

// Camera controller for smooth transitions
function CameraController({ 
  targetPosition, 
  targetLookAt,
  onReady
}: { 
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  onReady?: () => void;
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new Vector3(...platonCampusConfig.cameraTarget));

  useFrame((_, delta) => {
    if (targetPosition) {
      camera.position.lerp(new Vector3(...targetPosition), delta * 2);
    }
    if (targetLookAt) {
      currentLookAt.current.lerp(new Vector3(...targetLookAt), delta * 2);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

// Building renderer
function BuildingRenderer({
  building,
  isSelected,
  isHovered,
  onHover,
  onClick,
}: {
  building: CampusBuilding;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) {
  const props = { building, isSelected, isHovered, onHover, onClick };

  switch (building.shape) {
    case 'horseshoe':
      return <KindergartenBuilding {...props} />;
    case 'zigzag':
      return <ElementaryBuilding {...props} />;
    case 'ring':
      return <LyceumBuilding {...props} />;
    case 'chapel':
      return <ChapelBuilding {...props} />;
    case 'rectangle':
      return <RectangleBuilding {...props} />;
    default:
      return <RectangleBuilding {...props} />;
  }
}

// Main scene
function CampusScene({
  selectedBuilding,
  hoveredBuilding,
  onBuildingHover,
  onBuildingClick,
}: {
  selectedBuilding: CampusBuilding | null;
  hoveredBuilding: string | null;
  onBuildingHover: (id: string | null) => void;
  onBuildingClick: (building: CampusBuilding) => void;
}) {
  const cameraTarget = selectedBuilding 
    ? [
        selectedBuilding.position[0] + 30,
        40,
        selectedBuilding.position[2] + 30,
      ] as [number, number, number]
    : null;

  const lookAtTarget = selectedBuilding
    ? selectedBuilding.position
    : null;

  return (
    <>
      <CameraController 
        targetPosition={cameraTarget} 
        targetLookAt={lookAtTarget}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[50, 80, 50]} 
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <directionalLight position={[-30, 40, -30]} intensity={0.3} />

      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[100, 80, 100]}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Ground */}
      <Ground />

      {/* Contact shadows for soft AO effect */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={200}
        blur={2}
        far={100}
      />

      {/* Buildings */}
      {platonBuildings.map(building => (
        <BuildingRenderer
          key={building.id}
          building={building}
          isSelected={selectedBuilding?.id === building.id}
          isHovered={hoveredBuilding === building.id}
          onHover={(hovered) => onBuildingHover(hovered ? building.id : null)}
          onClick={() => onBuildingClick(building)}
        />
      ))}

      {/* Environment elements */}
      <CampusEnvironment elements={campusElements} />

      {/* Orbit controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={30}
        maxDistance={200}
        target={[0, 0, 20]}
      />
    </>
  );
}

interface PlatonCampusViewerProps {
  onBuildingSelect?: (building: CampusBuilding) => void;
}

export function PlatonCampusViewer({ onBuildingSelect }: PlatonCampusViewerProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const handleBuildingClick = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(prev => prev?.id === building.id ? null : building);
    onBuildingSelect?.(building);
  }, [onBuildingSelect]);

  const handleCloseSidebar = useCallback(() => {
    setSelectedBuilding(null);
  }, []);

  const handleEnterBuilding = useCallback((buildingId: string) => {
    navigate(`/twin/${buildingId}`);
  }, [navigate]);

  const handleResetView = useCallback(() => {
    setSelectedBuilding(null);
    // Reset will happen through CameraController
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border bg-background"
    >
      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
          <h2 className="text-lg font-semibold">{platonCampusConfig.name}</h2>
          <p className="text-xs text-muted-foreground">{platonCampusConfig.nameEn}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background/90 backdrop-blur-sm"
          onClick={handleResetView}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas */}
      <Canvas
        ref={canvasRef}
        shadows
        camera={{
          position: platonCampusConfig.cameraPosition,
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)' }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <CampusScene
            selectedBuilding={selectedBuilding}
            hoveredBuilding={hoveredBuilding}
            onBuildingHover={setHoveredBuilding}
            onBuildingClick={handleBuildingClick}
          />
        </Suspense>
      </Canvas>

      {/* Building details sidebar */}
      <CampusBuildingSidebar 
        building={selectedBuilding}
        onClose={handleCloseSidebar}
        onEnterBuilding={handleEnterBuilding}
      />

      {/* Instructions */}
      {!selectedBuilding && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border">
            <p className="text-xs text-muted-foreground">
              🖱️ Κάντε κλικ σε κτίριο για λεπτομέρειες • Σύρετε για περιστροφή • Κύλιση για zoom
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
