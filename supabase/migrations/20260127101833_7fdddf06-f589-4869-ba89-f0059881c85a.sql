-- Fix: Restrict hero-videos storage bucket to admin-only for uploads/updates/deletes
-- Current issue: Any authenticated user can upload, update, and delete hero videos
-- Fix: Only platform admins should be able to manage hero videos

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload hero videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hero videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hero videos" ON storage.objects;

-- Create admin-only policy for managing hero videos (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can upload hero videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update hero videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hero-videos' 
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'hero-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete hero videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hero-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Keep public SELECT policy (anyone can view hero videos on the homepage)
-- This policy should already exist, but ensure it's there
DROP POLICY IF EXISTS "Anyone can view hero videos" ON storage.objects;
CREATE POLICY "Anyone can view hero videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-videos');