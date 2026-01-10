-- Add access_code column for approved requests
ALTER TABLE public.access_requests 
ADD COLUMN access_code TEXT UNIQUE;