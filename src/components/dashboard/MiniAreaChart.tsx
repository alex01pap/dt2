import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">
        {payload[0].value.toFixed(1)} kWh
      </p>
    </div>
  );
};

export const MiniAreaChart: React.FC<MiniAreaChartProps> = ({
  title,
  data,
  color = '#3b82f6',
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <Card className={`card-enterprise ${className}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-1 h-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-full" style={{ height: `${Math.random() * 100}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={`card-enterprise ${className}`}>
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

  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const percentChange = previousValue > 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;

  return (
    <Card className={`card-enterprise hover:scale-[1.02] transition-all duration-300 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold">{latestValue.toFixed(1)} kWh</div>
            <div className={`text-xs ${percentChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.1}
            />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};