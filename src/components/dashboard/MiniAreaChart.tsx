import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataPoint {
  time: string;
  value: number;
}

interface MiniAreaChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  isLoading?: boolean;
  className?: string;
  unit?: string;
  showTrend?: boolean;
  animated?: boolean;
}

const CustomTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: payload[0].color }}
        />
        <p className="text-sm font-medium">
          {payload[0].value.toFixed(1)} {unit}
        </p>
      </div>
    </div>
  );
};

export const MiniAreaChart: React.FC<MiniAreaChartProps> = ({
  title,
  data,
  color = 'hsl(var(--primary))',
  isLoading = false,
  className = '',
  unit = '',
  showTrend = true,
  animated = true
}) => {
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!animated || data.length === 0) {
      setAnimatedData(data);
      return;
    }

    // Start with zero values
    const initialData = data.map(point => ({ ...point, value: 0 }));
    setAnimatedData(initialData);

    // Animate to actual values
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const animate = () => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const newData = data.map(point => ({
        ...point,
        value: point.value * easeOutCubic
      }));

      setAnimatedData(newData);

      if (currentStep < steps) {
        setTimeout(animate, stepDuration);
      }
    };

    setTimeout(animate, 100);
  }, [data, animated]);

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-1 h-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="flex-1 animate-pulse" 
                style={{ 
                  height: `${Math.random() * 60 + 20}px`,
                  animationDelay: `${i * 100}ms`
                }} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (animatedData.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            <p className="text-sm">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestValue = animatedData[animatedData.length - 1]?.value || 0;
  const previousValue = animatedData[animatedData.length - 2]?.value || latestValue;
  const percentChange = previousValue > 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  
  const getTrendIcon = () => {
    if (Math.abs(percentChange) < 0.1) return <Minus className="h-3 w-3" />;
    return percentChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (Math.abs(percentChange) < 0.1) return "text-muted-foreground";
    return percentChange > 0 ? "text-success" : "text-destructive";
  };

  // Create gradient ID
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer",
        isHovered && "shadow-lg scale-105",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {showTrend && (
            <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(percentChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">
            {latestValue.toFixed(1)} {unit}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="relative">
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={animatedData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
                fill={`url(#${gradientId})`}
                style={{
                  filter: isHovered ? 'url(#glow)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <Tooltip 
                content={<CustomTooltip unit={unit} />}
                cursor={{
                  stroke: color,
                  strokeWidth: 1,
                  strokeDasharray: '4 4'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Sparkle effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-4 w-1 h-1 bg-primary rounded-full animate-ping" />
              <div className="absolute bottom-4 left-6 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-6 left-1/3 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};