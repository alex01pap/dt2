import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, TrendingUp } from 'lucide-react';

interface DataPoint {
  timestamp: number | Date;
  value: number;
  quality?: number; // 0-1 quality score
  [key: string]: any;
}

interface Series {
  key: string;
  name: string;
  color: string;
  data: DataPoint[];
  unit?: string;
  aggregation?: 'avg' | 'min' | 'max' | 'sum';
}

interface LiveChartProps {
  series: Series[];
  title?: string;
  height?: number;
  showBrush?: boolean;
  showZoom?: boolean;
  showAggregation?: boolean;
  autoUpdate?: boolean;
  updateInterval?: number;
  onDataPointClick?: (point: DataPoint, seriesKey: string) => void;
  className?: string;
}

interface AggregatedData {
  timestamp: number;
  [key: string]: number;
}

const aggregateData = (data: DataPoint[], aggregation: 'avg' | 'min' | 'max' | 'sum', windowSize: number): DataPoint[] => {
  if (windowSize <= 1) return data;

  const result: DataPoint[] = [];
  for (let i = 0; i < data.length; i += windowSize) {
    const chunk = data.slice(i, i + windowSize);
    
    let aggregatedValue: number;
    switch (aggregation) {
      case 'min':
        aggregatedValue = Math.min(...chunk.map(d => d.value));
        break;
      case 'max':
        aggregatedValue = Math.max(...chunk.map(d => d.value));
        break;
      case 'sum':
        aggregatedValue = chunk.reduce((sum, d) => sum + d.value, 0);
        break;
      case 'avg':
      default:
        aggregatedValue = chunk.reduce((sum, d) => sum + d.value, 0) / chunk.length;
        break;
    }

    result.push({
      timestamp: chunk[0].timestamp,
      value: aggregatedValue,
      quality: chunk.reduce((sum, d) => sum + (d.quality || 1), 0) / chunk.length
    });
  }

  return result;
};

const formatTimestamp = (timestamp: number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium mb-2">
        {formatTimestamp(label)}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium">{entry.name}:</span>
          <span>{entry.value.toFixed(2)}</span>
          {entry.payload.quality !== undefined && (
            <Badge variant="outline" className="text-xs">
              Q: {(entry.payload.quality * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export const LiveChart: React.FC<LiveChartProps> = ({
  series,
  title,
  height = 400,
  showBrush = false,
  showZoom = true,
  showAggregation = true,
  autoUpdate = false,
  updateInterval = 5000,
  onDataPointClick,
  className = ''
}) => {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoUpdate);
  const [aggregation, setAggregation] = useState<'avg' | 'min' | 'max' | 'sum'>('avg');
  const [windowSize, setWindowSize] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Combine all series data into a single dataset
  const chartData = useMemo(() => {
    if (series.length === 0) return [];

    // Get all unique timestamps
    const allTimestamps = new Set<number>();
    series.forEach(s => {
      const processedData = aggregation !== 'avg' || windowSize > 1 
        ? aggregateData(s.data, s.aggregation || aggregation, windowSize)
        : s.data;
      
      processedData.forEach(d => {
        const timestamp = typeof d.timestamp === 'number' ? d.timestamp : d.timestamp.getTime();
        allTimestamps.add(timestamp);
      });
    });

    const timestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Build combined data
    const combined: AggregatedData[] = timestamps.map(timestamp => {
      const dataPoint: AggregatedData = { timestamp };
      
      series.forEach(s => {
        const processedData = aggregation !== 'avg' || windowSize > 1 
          ? aggregateData(s.data, s.aggregation || aggregation, windowSize)
          : s.data;
        
        const point = processedData.find(d => {
          const pointTimestamp = typeof d.timestamp === 'number' ? d.timestamp : d.timestamp.getTime();
          return pointTimestamp === timestamp;
        });
        
        dataPoint[s.key] = point?.value || null;
      });
      
      return dataPoint;
    });

    // Apply zoom domain if set
    if (zoomDomain) {
      return combined.filter(d => d.timestamp >= zoomDomain[0] && d.timestamp <= zoomDomain[1]);
    }

    return combined;
  }, [series, zoomDomain, aggregation, windowSize]);

  const handleZoomIn = useCallback(() => {
    if (chartData.length === 0) return;
    
    const dataLength = chartData.length;
    const start = Math.floor(dataLength * 0.25);
    const end = Math.floor(dataLength * 0.75);
    
    setZoomDomain([chartData[start].timestamp, chartData[end].timestamp]);
  }, [chartData]);

  const handleZoomOut = useCallback(() => {
    setZoomDomain(null);
  }, []);

  const handleReset = useCallback(() => {
    setZoomDomain(null);
    setAggregation('avg');
    setWindowSize(1);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto-update effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        // Trigger data refresh - this would typically call a prop function
        console.log('Auto-updating chart data...');
      }, updateInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, updateInterval]);

  const handleDataPointClick = useCallback((data: any) => {
    if (onDataPointClick && data && data.activePayload) {
      const payload = data.activePayload[0];
      if (payload) {
        const point: DataPoint = {
          timestamp: payload.payload.timestamp,
          value: payload.value
        };
        onDataPointClick(point, payload.dataKey);
      }
    }
  }, [onDataPointClick]);

  if (series.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No Data</h3>
            <p className="text-sm text-muted-foreground">
              Add data series to display charts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title || 'Live Chart'}</CardTitle>
          
          <div className="flex items-center gap-2">
            {showAggregation && (
              <>
                <Select value={aggregation} onValueChange={(value: any) => setAggregation(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avg">Avg</SelectItem>
                    <SelectItem value="min">Min</SelectItem>
                    <SelectItem value="max">Max</SelectItem>
                    <SelectItem value="sum">Sum</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={windowSize.toString()} onValueChange={(value) => setWindowSize(parseInt(value))}>
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {showZoom && (
              <>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" onClick={togglePlayback}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {series.map(s => (
            <div key={s.key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm font-medium">{s.name}</span>
              {s.unit && (
                <Badge variant="outline" className="text-xs">
                  {s.unit}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} onClick={handleDataPointClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTimestamp}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            
            {series.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            ))}

            {showBrush && (
              <Brush 
                dataKey="timestamp"
                height={30}
                stroke="hsl(var(--primary))"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LiveChart;