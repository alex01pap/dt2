import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeEvent {
  id: string;
  title: string;
  description: string | null;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string | null;
  source_id: string | null;
  acknowledged: boolean | null;
  acknowledged_at: string | null;
  created_at: string;
  metadata: any;
}

export function useRealtimeEvents(limit: number = 50) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    setupRealtimeSubscription();
  }, [limit]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setEvents(data || []);
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading events:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Event change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setEvents((prev) => [payload.new as RealtimeEvent, ...prev.slice(0, limit - 1)]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents((prev) =>
              prev.map((e) => (e.id === payload.new.id ? payload.new as RealtimeEvent : e))
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Events subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const acknowledgeEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', eventId);

    if (error) {
      console.error('Error acknowledging event:', error);
      throw error;
    }
  };

  return {
    events,
    isConnected,
    isLoading,
    acknowledgeEvent,
    refresh: loadInitialData
  };
}
