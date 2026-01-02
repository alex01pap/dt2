import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeSensor {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  location: { x: number; y: number; z: number } | null;
  last_reading: number | null;
  last_reading_at: string | null;
  asset_id: string | null;
  twin_id: string | null;
  thresholds: any;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  value: number;
  recorded_at: string;
  quality_score: number;
  metadata: any;
}

export function useRealtimeSensors() {
  const [sensors, setSensors] = useState<RealtimeSensor[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    setupRealtimeSubscriptions();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load sensors
      const { data: sensorsData, error: sensorsError } = await supabase
        .from('sensors')
        .select('*')
        .order('name');

      if (sensorsError) throw sensorsError;
      
      // Transform the data to match our interface
      const transformedSensors = (sensorsData || []).map(sensor => ({
        ...sensor,
        location: sensor.location as { x: number; y: number; z: number } | null
      }));
      
      setSensors(transformedSensors);

      // Load recent readings (last hour)
      const { data: readingsData, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (readingsError) throw readingsError;
      setReadings(readingsData || []);

      setIsConnected(true);
    } catch (error) {
      console.error('Error loading sensor data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to sensor changes
    const sensorsChannel = supabase
      .channel('sensors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensors'
        },
        (payload) => {
          console.log('Sensor change:', payload);
          
          const transformSensor = (sensor: any): RealtimeSensor => ({
            ...sensor,
            location: sensor.location as { x: number; y: number; z: number } | null
          });
          
          if (payload.eventType === 'INSERT') {
            setSensors((prev) => [...prev, transformSensor(payload.new)]);
          } else if (payload.eventType === 'UPDATE') {
            setSensors((prev) =>
              prev.map((s) => (s.id === payload.new.id ? transformSensor(payload.new) : s))
            );
          } else if (payload.eventType === 'DELETE') {
            setSensors((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Sensors subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to new sensor readings
    const readingsChannel = supabase
      .channel('readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        (payload) => {
          console.log('New reading:', payload);
          const newReading = payload.new as SensorReading;
          
          setReadings((prev) => [newReading, ...prev.slice(0, 99)]);
          
          // Update sensor last_reading
          setSensors((prev) =>
            prev.map((s) =>
              s.id === newReading.sensor_id
                ? {
                    ...s,
                    last_reading: newReading.value,
                    last_reading_at: newReading.recorded_at
                  }
                : s
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sensorsChannel);
      supabase.removeChannel(readingsChannel);
    };
  };

  return {
    sensors,
    readings,
    isConnected,
    isLoading,
    refresh: loadInitialData
  };
}
