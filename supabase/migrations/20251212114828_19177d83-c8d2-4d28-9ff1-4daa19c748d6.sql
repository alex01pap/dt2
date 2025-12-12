-- Drop the overly permissive policy that allows any authenticated user to manage app settings
DROP POLICY IF EXISTS "Authenticated users can manage app settings" ON app_settings;

-- Create admin-only write policy for app_settings
CREATE POLICY "Only admins can manage app settings"
ON app_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));