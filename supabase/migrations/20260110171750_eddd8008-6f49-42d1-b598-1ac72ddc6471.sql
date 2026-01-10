-- Fix: Sensor readings cross-organization data exposure
-- The current policy allows any authenticated user to view all sensor readings
-- This update restricts access to org members only via the sensors table

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view sensor_readings" ON public.sensor_readings;

-- Create org-scoped policy that joins with sensors table to check org membership
CREATE POLICY "Org members can view their sensor readings"
ON public.sensor_readings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sensors
    WHERE sensors.id = sensor_readings.sensor_id
    AND (public.is_org_member(auth.uid(), sensors.org_id) OR public.has_role(auth.uid(), 'admin'))
  )
);