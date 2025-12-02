-- Fix RLS policies for sensor_readings table
DROP POLICY IF EXISTS "Public access to sensor_readings" ON public.sensor_readings;
CREATE POLICY "Authenticated users can access sensor_readings" 
ON public.sensor_readings 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix RLS policies for sensors table
DROP POLICY IF EXISTS "Public access to sensors" ON public.sensors;
CREATE POLICY "Authenticated users can access sensors" 
ON public.sensors 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix RLS policies for assets table
DROP POLICY IF EXISTS "Public access to assets" ON public.assets;
CREATE POLICY "Authenticated users can access assets" 
ON public.assets 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix RLS policies for events table
DROP POLICY IF EXISTS "Public access to events" ON public.events;
CREATE POLICY "Authenticated users can access events" 
ON public.events 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix RLS policies for rules table
DROP POLICY IF EXISTS "Public access to rules" ON public.rules;
CREATE POLICY "Authenticated users can access rules" 
ON public.rules 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Fix RLS policies for scenarios table
DROP POLICY IF EXISTS "Public access to scenarios" ON public.scenarios;
CREATE POLICY "Authenticated users can access scenarios" 
ON public.scenarios 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);