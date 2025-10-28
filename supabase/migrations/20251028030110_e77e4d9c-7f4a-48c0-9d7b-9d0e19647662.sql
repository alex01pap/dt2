-- Enable realtime for sensors and sensor_readings tables
ALTER TABLE public.sensors REPLICA IDENTITY FULL;
ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;