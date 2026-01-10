-- Create access_requests table for public form submissions
CREATE TABLE public.access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even unauthenticated) to INSERT
CREATE POLICY "Anyone can submit access request"
ON public.access_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view access requests
CREATE POLICY "Admins can view access requests"
ON public.access_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update access requests (to change status)
CREATE POLICY "Admins can update access requests"
ON public.access_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete access requests
CREATE POLICY "Admins can delete access requests"
ON public.access_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index on status for filtering
CREATE INDEX idx_access_requests_status ON public.access_requests(status);

-- Add index on created_at for sorting
CREATE INDEX idx_access_requests_created_at ON public.access_requests(created_at DESC);