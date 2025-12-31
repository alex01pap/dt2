import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep?: number;
  completedSteps?: number[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep = 0,
  completedSteps = [],
  orientation = "vertical",
  className,
}: StepIndicatorProps) {
  return (
    <div 
      className={cn(
        orientation === "vertical" ? "space-y-4" : "flex items-start gap-4",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;
        
        return (
          <div 
            key={index}
            className={cn(
              "flex gap-3",
              orientation === "horizontal" && "flex-1"
            )}
          >
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  isCompleted 
                    ? "bg-success text-success-foreground" 
                    : isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {orientation === "vertical" && index < steps.length - 1 && (
                <div 
                  className={cn(
                    "w-px h-8 mt-2",
                    isCompleted ? "bg-success" : "bg-border"
                  )} 
                />
              )}
            </div>
            <div className="pt-0.5">
              <p className={cn(
                "text-sm font-medium",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
