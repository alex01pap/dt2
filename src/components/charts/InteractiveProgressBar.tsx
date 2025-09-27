import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProgressItem {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
}

interface InteractiveProgressBarProps {
  title: string;
  items: ProgressItem[];
  className?: string;
  animated?: boolean;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'critical': return 'text-destructive';
    case 'warning': return 'text-warning';
    default: return 'text-success';
  }
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'critical': return 'destructive';
    case 'warning': return 'secondary';
    default: return 'default';
  }
};

export const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({
  title,
  items,
  className = '',
  animated = true
}) => {
  const [animatedValues, setAnimatedValues] = useState<number[]>(items.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!animated) {
      setAnimatedValues(items.map(item => item.value));
      return;
    }

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    items.forEach((item, index) => {
      const targetValue = item.value;
      let currentStep = 0;

      const animate = () => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const newValue = targetValue * easeOutQuart;

        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = newValue;
          return newValues;
        });

        if (currentStep < steps) {
          setTimeout(animate, stepDuration);
        }
      };

      setTimeout(animate, index * 200); // Stagger animations
    });
  }, [items, animated]);

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const percentage = Math.min((animatedValues[index] / (item.maxValue || 100)) * 100, 100);
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={item.label}
                className={cn(
                  "group/item p-3 rounded-lg transition-all duration-200 cursor-pointer",
                  isHovered ? "bg-muted/60 shadow-sm" : "hover:bg-muted/30"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.status && (
                      <Badge variant={getStatusBadge(item.status)} className="text-xs px-1.5 py-0.5">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={cn("text-sm font-bold", getStatusColor(item.status))}>
                      {animatedValues[index].toFixed(0)}{item.unit || '%'}
                    </span>
                    {item.maxValue && (
                      <span className="text-xs text-muted-foreground">
                        /{item.maxValue}{item.unit || '%'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
                        isHovered && "shadow-lg"
                      )}
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                        background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      }}
                    >
                      {/* Animated shine effect */}
                      <div 
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
                          isHovered && "animate-shine"
                        )}
                        style={{
                          transform: 'translateX(-100%)',
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Percentage indicator */}
                  {percentage > 15 && (
                    <div 
                      className={cn(
                        "absolute top-0 h-3 flex items-center px-2 text-xs font-medium text-white/90 transition-opacity duration-200",
                        isHovered ? "opacity-100" : "opacity-0"
                      )}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage.toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};