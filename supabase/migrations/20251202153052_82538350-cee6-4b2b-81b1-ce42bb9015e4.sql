-- Update RLS policies to enforce role-based access control
-- Users can read all data, but only moderators/admins can write

-- Drop existing permissive policies and create role-based ones

-- SENSORS TABLE
DROP POLICY IF EXISTS "Authenticated users can access sensors" ON public.sensors;

CREATE POLICY "Authenticated users can view sensors" 
ON public.sensors 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can modify sensors" 
ON public.sensors 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators and admins can update sensors" 
ON public.sensors 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sensors" 
ON public.sensors 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SENSOR_READINGS TABLE
DROP POLICY IF EXISTS "Authenticated users can access sensor_readings" ON public.sensor_readings;

CREATE POLICY "Authenticated users can view sensor_readings" 
ON public.sensor_readings 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can insert sensor_readings" 
ON public.sensor_readings 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sensor_readings" 
ON public.sensor_readings 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ASSETS TABLE
DROP POLICY IF EXISTS "Authenticated users can access assets" ON public.assets;

CREATE POLICY "Authenticated users can view assets" 
ON public.assets 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can modify assets" 
ON public.assets 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators and admins can update assets" 
ON public.assets 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assets" 
ON public.assets 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- EVENTS TABLE
DROP POLICY IF EXISTS "Authenticated users can access events" ON public.events;

CREATE POLICY "Authenticated users can view events" 
ON public.events 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can insert events" 
ON public.events 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators and admins can update events" 
ON public.events 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RULES TABLE
DROP POLICY IF EXISTS "Authenticated users can access rules" ON public.rules;

CREATE POLICY "Authenticated users can view rules" 
ON public.rules 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can modify rules" 
ON public.rules 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators and admins can update rules" 
ON public.rules 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rules" 
ON public.rules 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SCENARIOS TABLE
DROP POLICY IF EXISTS "Authenticated users can access scenarios" ON public.scenarios;

CREATE POLICY "Authenticated users can view scenarios" 
ON public.scenarios 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Moderators and admins can modify scenarios" 
ON public.scenarios 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators and admins can update scenarios" 
ON public.scenarios 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete scenarios" 
ON public.scenarios 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));