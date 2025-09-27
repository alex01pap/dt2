import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DonutData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  title: string;
  data: DonutData[];
  centerText?: string;
  centerValue?: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  
  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium text-sm">{data.name}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Count: <span className="font-medium text-foreground">{data.value}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Percentage: <span className="font-medium text-foreground">{data.percentage?.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const AnimatedCell = ({ index, fill, isHovered, onHover, onLeave }: any) => {
  return (
    <Cell 
      key={`cell-${index}`}
      fill={fill}
      stroke={isHovered ? fill : 'transparent'}
      strokeWidth={isHovered ? 3 : 0}
      style={{
        filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    />
  );
};

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  centerText,
  centerValue,
  className = '',
  size = 'md'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedData, setAnimatedData] = useState<DonutData[]>([]);

  const sizeConfig = {
    sm: { outer: 50, inner: 25, height: 120 },
    md: { outer: 70, inner: 35, height: 160 },
    lg: { outer: 90, inner: 45, height: 200 },
  };

  const config = sizeConfig[size];
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Calculate percentages and animate data
  useEffect(() => {
    const dataWithPercentages = data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));

    // Animate values from 0 to actual values
    setAnimatedData(dataWithPercentages.map(item => ({ ...item, value: 0 })));
    
    const timer = setTimeout(() => {
      setAnimatedData(dataWithPercentages);
    }, 100);

    return () => clearTimeout(timer);
  }, [data, total]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          <Badge variant="outline" className="text-xs">
            {total}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={config.height}>
            <PieChart>
              <Pie
                data={animatedData}
                cx="50%"
                cy="50%"
                outerRadius={config.outer}
                innerRadius={config.inner}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {animatedData.map((entry, index) => (
                  <AnimatedCell
                    key={index}
                    index={index}
                    fill={entry.color}
                    isHovered={hoveredIndex === index}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text overlay */}
          {(centerText || centerValue) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {centerValue && (
                  <div className="text-lg font-bold text-foreground">
                    {centerValue}
                  </div>
                )}
                {centerText && (
                  <div className="text-xs text-muted-foreground">
                    {centerText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div 
              key={item.name}
              className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${
                hoveredIndex === index ? 'bg-muted/60' : 'hover:bg-muted/30'
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{item.value}</div>
                <div className="text-xs text-muted-foreground">
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};