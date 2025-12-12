import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Settings2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// Import all floor plan templates
import { ScalableClassroom } from '@/components/twin/templates/ScalableClassroom';
import { ITClassroomFloorPlan } from '@/components/twin/templates/ITClassroomFloorPlan';
import { SoccerFieldFloorPlan } from '@/components/twin/templates/SoccerFieldFloorPlan';
import { OutdoorAreaFloorPlan } from '@/components/twin/templates/OutdoorAreaFloorPlan';
import GymnasiumFloorPlan from '@/components/twin/templates/GymnasiumFloorPlan';
import RestaurantFloorPlan from '@/components/twin/templates/RestaurantFloorPlan';

interface TwinGridCardProps {
  twin: {
    id: string;
    name: string;
    template_id: string;
    size: string;
    building?: string | null;
    tags?: string[] | null;
  };
  sensorCount?: number;
  onConfigure?: () => void;
}

const templateComponents: Record<string, React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>> = {
  'classroom': ScalableClassroom,
  'it-lab': ITClassroomFloorPlan,
  'soccer-field': SoccerFieldFloorPlan,
  'outdoor-area': OutdoorAreaFloorPlan,
  'gymnasium': GymnasiumFloorPlan,
  'restaurant': RestaurantFloorPlan,
};

const templateLabels: Record<string, string> = {
  'classroom': 'Classroom',
  'it-lab': 'IT Lab',
  'soccer-field': 'Soccer Field',
  'outdoor-area': 'Outdoor Area',
  'gymnasium': 'Gymnasium',
  'restaurant': 'Restaurant',
};

function MiniPreview({ templateId, size }: { templateId: string; size: string }) {
  const Component = templateComponents[templateId] || ScalableClassroom;
  const sizeValue = size as 'small' | 'medium' | 'large';

  return (
    <Canvas
      camera={{ position: [12, 10, 12], fov: 50 }}
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={20} blur={2} />
        <Component size={sizeValue} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 4}
        />
      </Suspense>
    </Canvas>
  );
}

export function TwinGridCard({ twin, sensorCount = 0, onConfigure }: TwinGridCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Preview */}
        <div className="h-40 bg-gradient-to-b from-muted/50 to-muted relative">
          <MiniPreview templateId={twin.template_id} size={twin.size} />
          
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Link
              to={`/twin/${twin.id}`}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-5 w-5" />
            </Link>
            {onConfigure && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onConfigure();
                }}
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <Settings2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{twin.name}</h3>
              <p className="text-sm text-muted-foreground">
                {templateLabels[twin.template_id] || twin.template_id} • {twin.size}
              </p>
            </div>
            {sensorCount > 0 && (
              <Badge variant="secondary" className="shrink-0">
                {sensorCount} sensors
              </Badge>
            )}
          </div>
          
          {twin.building && (
            <p className="text-xs text-muted-foreground mt-2 truncate">
              📍 {twin.building}
            </p>
          )}
          
          {twin.tags && twin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {twin.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
