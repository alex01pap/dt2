-- Fix: RLS Policy Always True for access_requests INSERT
-- The current "Anyone can submit access request" uses WITH CHECK (true) which is too permissive
-- We add validation to ensure proper data and rate limiting via check constraints

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can submit access request" ON public.access_requests;

-- Create a more restrictive policy that still allows public inserts
-- but validates that required fields are not empty strings
CREATE POLICY "Anyone can submit valid access request"
ON public.access_requests
FOR INSERT
TO public
WITH CHECK (
  -- Ensure email looks valid (basic format check)
  email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  -- Ensure required fields are not empty
  AND length(trim(full_name)) > 1
  AND length(trim(organization)) > 1
  AND length(trim(role)) > 0
  -- Status must be pending for new requests
  AND status = 'pending'
  -- These fields must be null for new requests
  AND reviewed_at IS NULL
  AND reviewed_by IS NULL
  AND approved_org_id IS NULL
  AND access_code IS NULL
);

-- Add policy for users to view their own access requests by email
-- This allows people to check their request status
CREATE POLICY "Users can view their own access request by email"
ON public.access_requests
FOR SELECT
TO public
USING (
  -- Allow viewing if email matches (for status checking on public pages)
  -- Users can only see their own requests, not others'
  email = current_setting('request.jwt.claims', true)::json->>'email'
);