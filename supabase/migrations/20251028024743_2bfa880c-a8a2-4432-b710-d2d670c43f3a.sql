-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to automatically sync OpenHAB data for all enabled configs
CREATE OR REPLACE FUNCTION public.auto_sync_openhab()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config_record RECORD;
  function_url TEXT;
  anon_key TEXT;
BEGIN
  -- Get all enabled OpenHAB configs where sync is due
  FOR config_record IN 
    SELECT id, sync_interval, last_sync_at
    FROM openhab_config
    WHERE enabled = true
      AND (
        last_sync_at IS NULL 
        OR last_sync_at < NOW() - (sync_interval || ' seconds')::INTERVAL
      )
  LOOP
    -- Call the edge function for each config
    -- The edge function will handle the actual sync logic
    function_url := 'https://vjrfdglwtpdtfkiluwah.supabase.co/functions/v1/openhab-sync';
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcmZkZ2x3dHBkdGZraWx1d2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5Nzc3NDgsImV4cCI6MjA3NDU1Mzc0OH0.Y_MTY7yyZsgv2AWhknCab-m7-AjiYFyXJKJM2L76gP4';
    
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object(
        'action', 'auto-sync',
        'config_id', config_record.id
      )
    );
    
    -- Log the automatic sync attempt
    INSERT INTO openhab_sync_log (config_id, sync_type, status, items_synced)
    VALUES (config_record.id, 'automatic', 'triggered', 0);
  END LOOP;
END;
$$;

-- Schedule the auto-sync to run every minute
-- This will check all configs and sync only those that are due based on their sync_interval
SELECT cron.schedule(
  'auto-sync-openhab',
  '* * * * *', -- Run every minute
  $$
  SELECT public.auto_sync_openhab();
  $$
);