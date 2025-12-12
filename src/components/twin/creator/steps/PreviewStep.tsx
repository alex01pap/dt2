import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, Stars } from '@react-three/drei';
import { RoomTemplate, RoomSize } from '../../templates/templateConfig';
import { Badge } from '@/components/ui/badge';
import { Check, Users, Ruler, Building2, Tag } from 'lucide-react';
import { ScalableClassroom } from '../../templates/ScalableClassroom';
import { ITClassroomFloorPlan } from '../../templates/ITClassroomFloorPlan';
import { SoccerFieldFloorPlan } from '../../templates/SoccerFieldFloorPlan';
import { OutdoorAreaFloorPlan } from '../../templates/OutdoorAreaFloorPlan';
import { GymnasiumFloorPlan } from '../../templates/GymnasiumFloorPlan';

interface PreviewStepProps {
  template: RoomTemplate;
  size: RoomSize;
  name: string;
  building?: string;
  tags: string[];
}

const BUILDINGS: Record<string, string> = {
  main: 'Main Building',
  annex: 'Annex Building',
  sports: 'Sports Complex',
  outdoor: 'Outdoor Area',
};

function TemplatePreview({ templateId, size }: { templateId: string; size: RoomSize }) {
  const previewComponents: Record<string, React.ReactNode> = {
    'classroom': <ScalableClassroom size={size} />,
    'it-classroom': <ITClassroomFloorPlan size={size} />,
    'soccer-field': <SoccerFieldFloorPlan size={size} />,
    'outdoor-area': <OutdoorAreaFloorPlan size={size} />,
    'restaurant': <ScalableClassroom size={size} />,
    'gymnasium': <GymnasiumFloorPlan size={size} />,
  };

  return previewComponents[templateId] || <ScalableClassroom size={size} />;
}

export function PreviewStep({ template, size, name, building, tags }: PreviewStepProps) {
  const sizeConfig = template.sizes[size];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-success" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Looking good! ✨
        </h3>
        <p className="text-muted-foreground">
          Review your digital twin before creating
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
        {/* 3D Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-muted/30 rounded-2xl overflow-hidden border border-border min-h-[300px]"
        >
          <Canvas
            camera={{ position: [18, 14, 18], fov: 50 }}
            shadows
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <Environment preset="city" />
              <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
              
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
              <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#b4c5e4" />
              
              <ContactShadows 
                position={[0, -0.01, 0]} 
                opacity={0.4} 
                scale={40} 
                blur={2}
              />
              
              <Grid 
                position={[0, -0.02, 0]}
                args={[60, 60]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#3b82f6"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#6366f1"
                fadeDistance={35}
                infiniteGrid
              />
              
              <TemplatePreview templateId={template.id} size={size} />
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                minDistance={8}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Header Card */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${template.previewColor}15`, color: template.previewColor }}
              >
                <template.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-1">{name}</h4>
                <p className="text-muted-foreground">{template.name} • {sizeConfig.label}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Capacity</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {sizeConfig.capacity} {template.category === 'sport' ? 'players' : 'people'}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">Dimensions</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {sizeConfig.dimensions[0]}m × {sizeConfig.dimensions[1]}m
              </p>
            </div>
          </div>

          {/* Building */}
          {building && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Building</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {BUILDINGS[building] || building}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Tag className="w-4 h-4" />
                <span className="text-sm">Sensors</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mt-auto">
            <p className="text-sm text-muted-foreground mb-2">Features included:</p>
            <div className="flex flex-wrap gap-2">
              {template.features.map((feature) => (
                <Badge key={feature} variant="outline" className="capitalize">
                  {feature.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
