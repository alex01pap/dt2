import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { RoomTemplate, RoomSize } from '../templates/templateConfig';
import { ChooseTypeStep } from './steps/ChooseTypeStep';
import { SelectSizeStep } from './steps/SelectSizeStep';
import { ConfigureStep } from './steps/ConfigureStep';
import { PreviewStep } from './steps/PreviewStep';

interface TwinCreatorWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (config: TwinConfig) => void;
}

export interface TwinConfig {
  template: RoomTemplate;
  size: RoomSize;
  name: string;
  building?: string;
  tags: string[];
}

const STEPS = [
  { id: 'type', title: 'Choose Type', subtitle: 'What kind of space?' },
  { id: 'size', title: 'Select Size', subtitle: 'How big is it?' },
  { id: 'configure', title: 'Configure', subtitle: 'Name your space' },
  { id: 'preview', title: 'Preview', subtitle: 'Review & create' },
];

export function TwinCreatorWizard({ open, onOpenChange, onComplete }: TwinCreatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<RoomTemplate | null>(null);
  const [selectedSize, setSelectedSize] = useState<RoomSize>('medium');
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return selectedTemplate !== null;
      case 1: return selectedSize !== null;
      case 2: return name.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplate) return;
    
    setIsCreating(true);
    
    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const config: TwinConfig = {
      template: selectedTemplate,
      size: selectedSize,
      name,
      building: building || undefined,
      tags,
    };
    
    onComplete?.(config);
    setIsCreating(false);
    resetWizard();
    onOpenChange(false);
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setSelectedTemplate(null);
    setSelectedSize('medium');
    setName('');
    setBuilding('');
    setTags([]);
  };

  const handleTemplateSelect = (template: RoomTemplate) => {
    setSelectedTemplate(template);
    setSelectedSize(template.defaultSize);
    setName(template.name);
    // Auto-advance after selection
    setTimeout(() => setCurrentStep(1), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetWizard(); onOpenChange(o); }}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create Digital Twin</h2>
              <p className="text-sm text-muted-foreground">
                {STEPS[currentStep].subtitle}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${index < currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : index === currentStep 
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                          : 'bg-muted text-muted-foreground'}
                    `}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${index === currentStep ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentStep === 0 && (
                <ChooseTypeStep
                  selectedTemplate={selectedTemplate}
                  onSelect={handleTemplateSelect}
                />
              )}
              {currentStep === 1 && selectedTemplate && (
                <SelectSizeStep
                  template={selectedTemplate}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />
              )}
              {currentStep === 2 && selectedTemplate && (
                <ConfigureStep
                  template={selectedTemplate}
                  name={name}
                  onNameChange={setName}
                  building={building}
                  onBuildingChange={setBuilding}
                  tags={tags}
                  onTagsChange={setTags}
                />
              )}
              {currentStep === 3 && selectedTemplate && (
                <PreviewStep
                  template={selectedTemplate}
                  size={selectedSize}
                  name={name}
                  building={building}
                  tags={tags}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canGoNext() || isCreating}
              className="gap-2 min-w-[140px]"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Twin
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
