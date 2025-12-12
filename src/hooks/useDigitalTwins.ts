import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface DigitalTwin {
  id: string;
  name: string;
  template_id: string;
  size: string;
  building: string | null;
  tags: string[];
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface CreateTwinData {
  name: string;
  template_id: string;
  size: string;
  building?: string;
  tags?: string[];
  metadata?: Json;
}

export function useDigitalTwins() {
  const [twins, setTwins] = useState<DigitalTwin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTwins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('digital_twins')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setTwins((data || []) as DigitalTwin[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch digital twins';
      setError(message);
      console.error('Error fetching twins:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTwin = async (data: CreateTwinData): Promise<DigitalTwin | null> => {
    try {
      const { data: newTwin, error: createError } = await supabase
        .from('digital_twins')
        .insert({
          name: data.name,
          template_id: data.template_id,
          size: data.size,
          building: data.building || null,
          tags: data.tags || [],
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (createError) throw createError;

      const typedTwin = newTwin as DigitalTwin;
      setTwins(prev => [typedTwin, ...prev]);
      toast.success(`Digital Twin "${data.name}" created successfully!`);
      return typedTwin;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create digital twin';
      toast.error(message);
      console.error('Error creating twin:', err);
      return null;
    }
  };

  const updateTwin = async (id: string, data: Partial<CreateTwinData>): Promise<DigitalTwin | null> => {
    try {
      const { data: updatedTwin, error: updateError } = await supabase
        .from('digital_twins')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const typedTwin = updatedTwin as DigitalTwin;
      setTwins(prev => prev.map(t => t.id === id ? typedTwin : t));
      toast.success('Digital Twin updated successfully!');
      return typedTwin;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update digital twin';
      toast.error(message);
      console.error('Error updating twin:', err);
      return null;
    }
  };

  const deleteTwin = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('digital_twins')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTwins(prev => prev.filter(t => t.id !== id));
      toast.success('Digital Twin deleted successfully!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete digital twin';
      toast.error(message);
      console.error('Error deleting twin:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchTwins();
  }, [fetchTwins]);

  return {
    twins,
    isLoading,
    error,
    fetchTwins,
    createTwin,
    updateTwin,
    deleteTwin,
  };
}
