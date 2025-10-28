-- Create OpenHAB configuration table
CREATE TABLE IF NOT EXISTS public.openhab_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  openhab_url TEXT NOT NULL,
  api_token TEXT,
  sync_interval INTEGER DEFAULT 30,
  enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create OpenHAB items mapping table
CREATE TABLE IF NOT EXISTS public.openhab_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES public.openhab_config(id) ON DELETE CASCADE,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  openhab_item_name TEXT NOT NULL,
  openhab_item_type TEXT NOT NULL,
  openhab_item_label TEXT,
  mapping_type TEXT DEFAULT 'auto',
  sync_enabled BOOLEAN DEFAULT true,
  last_value TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(config_id, openhab_item_name)
);

-- Create OpenHAB sync logs table
CREATE TABLE IF NOT EXISTS public.openhab_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES public.openhab_config(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  items_synced INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.openhab_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openhab_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openhab_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for openhab_config
CREATE POLICY "Users can view their own OpenHAB config"
  ON public.openhab_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OpenHAB config"
  ON public.openhab_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OpenHAB config"
  ON public.openhab_config FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OpenHAB config"
  ON public.openhab_config FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for openhab_items
CREATE POLICY "Users can view their own OpenHAB items"
  ON public.openhab_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.openhab_config
      WHERE openhab_config.id = openhab_items.config_id
      AND openhab_config.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own OpenHAB items"
  ON public.openhab_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.openhab_config
      WHERE openhab_config.id = openhab_items.config_id
      AND openhab_config.user_id = auth.uid()
    )
  );

-- RLS Policies for openhab_sync_log
CREATE POLICY "Users can view their own sync logs"
  ON public.openhab_sync_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.openhab_config
      WHERE openhab_config.id = openhab_sync_log.config_id
      AND openhab_config.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_openhab_config_updated_at
  BEFORE UPDATE ON public.openhab_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_openhab_items_updated_at
  BEFORE UPDATE ON public.openhab_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_openhab_config_user_id ON public.openhab_config(user_id);
CREATE INDEX idx_openhab_items_config_id ON public.openhab_items(config_id);
CREATE INDEX idx_openhab_items_sensor_id ON public.openhab_items(sensor_id);
CREATE INDEX idx_openhab_sync_log_config_id ON public.openhab_sync_log(config_id);
CREATE INDEX idx_openhab_sync_log_created_at ON public.openhab_sync_log(created_at DESC);