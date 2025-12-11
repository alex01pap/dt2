import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import { RoomTemplate, RoomSize } from '../../templates/templateConfig';
import { cn } from '@/lib/utils';
import { Users, Ruler } from 'lucide-react';
import { ScalableClassroom } from '../../templates/ScalableClassroom';
import { ITClassroomFloorPlan } from '../../templates/ITClassroomFloorPlan';
import { SoccerFieldFloorPlan } from '../../templates/SoccerFieldFloorPlan';
import { OutdoorAreaFloorPlan } from '../../templates/OutdoorAreaFloorPlan';

interface SelectSizeStepProps {
  template: RoomTemplate;
  selectedSize: RoomSize;
  onSizeChange: (size: RoomSize) => void;
}

function TemplatePreview({ templateId, size }: { templateId: string; size: RoomSize }) {
  const previewComponents: Record<string, React.ReactNode> = {
    'classroom': <ScalableClassroom size={size} />,
    'it-classroom': <ITClassroomFloorPlan size={size} />,
    'soccer-field': <SoccerFieldFloorPlan size={size} />,
    'outdoor-area': <OutdoorAreaFloorPlan size={size} />,
    'restaurant': <ScalableClassroom size={size} />, // Fallback for now
    'gymnasium': <ScalableClassroom size={size} />, // Fallback for now
  };

  return previewComponents[templateId] || <ScalableClassroom size={size} />;
}

export function SelectSizeStep({ template, selectedSize, onSizeChange }: SelectSizeStepProps) {
  const sizes: RoomSize[] = ['small', 'medium', 'large'];
  const selectedConfig = template.sizes[selectedSize];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          How big is this {template.name.toLowerCase()}?
        </h3>
        <p className="text-muted-foreground">
          Select a size and see the preview update in real-time
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
        {/* 3D Preview */}
        <div className="bg-muted/30 rounded-2xl overflow-hidden border border-border min-h-[300px]">
          <Canvas
            camera={{ position: [15, 12, 15], fov: 50 }}
            shadows
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
              
              <ContactShadows 
                position={[0, -0.01, 0]} 
                opacity={0.3} 
                scale={30} 
                blur={2}
              />
              
              <Grid 
                position={[0, -0.02, 0]}
                args={[50, 50]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#3b82f6"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#6366f1"
                fadeDistance={30}
                infiniteGrid
              />
              
              <TemplatePreview templateId={template.id} size={selectedSize} />
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={8}
                maxDistance={40}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Size Selection */}
        <div className="flex flex-col gap-4">
          {sizes.map((size) => {
            const config = template.sizes[size];
            const isSelected = selectedSize === size;
            
            return (
              <motion.button
                key={size}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSizeChange(size)}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary-foreground rounded-full"
                          />
                        )}
                      </span>
                      <h4 className="text-lg font-semibold text-foreground">
                        {config.label}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-8">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {config.capacity} {template.category === 'sport' ? 'players' : 'people'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4" />
                        {config.dimensions[0]}m × {config.dimensions[1]}m
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Selected Summary */}
          <div className="mt-auto p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${template.previewColor}15`, color: template.previewColor }}
              >
                <template.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {template.name} - {selectedConfig.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedConfig.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
