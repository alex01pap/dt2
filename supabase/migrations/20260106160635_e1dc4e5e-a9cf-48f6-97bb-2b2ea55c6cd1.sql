-- Remove the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;