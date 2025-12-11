import { motion } from 'framer-motion';
import { RoomTemplate, ROOM_TEMPLATES } from '../../templates/templateConfig';
import { cn } from '@/lib/utils';

interface ChooseTypeStepProps {
  selectedTemplate: RoomTemplate | null;
  onSelect: (template: RoomTemplate) => void;
}

export function ChooseTypeStep({ selectedTemplate, onSelect }: ChooseTypeStepProps) {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          What type of space is this?
        </h3>
        <p className="text-muted-foreground">
          Choose a template that best matches your room or area
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {ROOM_TEMPLATES.map((template, index) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(template)}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors"
                style={{ 
                  backgroundColor: `${template.previewColor}15`,
                  color: template.previewColor
                }}
              >
                <Icon className="w-7 h-7" />
              </div>

              {/* Text */}
              <h4 className="font-semibold text-foreground mb-1">{template.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              {/* Category badge */}
              <div className="mt-3">
                <span 
                  className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ 
                    backgroundColor: `${template.previewColor}15`,
                    color: template.previewColor
                  }}
                >
                  {template.category}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
