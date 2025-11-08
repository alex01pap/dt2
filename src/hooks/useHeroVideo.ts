import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useHeroVideo() {
  return useQuery({
    queryKey: ['hero-video-url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_video_url')
        .single();
      
      if (error) {
        console.error('Error fetching hero video:', error);
        return null;
      }
      
      return data?.setting_value as string | null;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
