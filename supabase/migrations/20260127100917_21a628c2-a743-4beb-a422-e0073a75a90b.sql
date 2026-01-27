-- Fix: Remove the "Users can view their own access request by email" SELECT policy
-- This policy is a security risk because:
-- 1. It allows enumeration attacks - checking if emails exist in access_requests
-- 2. Authenticated users shouldn't need to query this table - they should see a confirmation page after submitting
-- Only admins should be able to view access requests

DROP POLICY IF EXISTS "Users can view their own access request by email" ON public.access_requests;