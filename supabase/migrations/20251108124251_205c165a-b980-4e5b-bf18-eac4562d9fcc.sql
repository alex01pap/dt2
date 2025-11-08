-- Create storage bucket for hero videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-videos',
  'hero-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create RLS policies for hero videos bucket
CREATE POLICY "Public can view hero videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-videos');

CREATE POLICY "Authenticated users can upload hero videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update hero videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hero-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero-videos' AND auth.role() = 'authenticated');

-- Create app settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for app_settings
CREATE POLICY "Everyone can view app settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage app settings"
ON public.app_settings FOR ALL
USING (auth.role() = 'authenticated');

-- Insert default hero video setting
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('hero_video_url', null)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();