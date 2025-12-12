-- Create digital_twins table to persist created twins
CREATE TABLE public.digital_twins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  template_id text NOT NULL,
  size text NOT NULL DEFAULT 'medium',
  building text,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.digital_twins ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Authenticated users can view digital twins" 
ON public.digital_twins 
FOR SELECT 
USING (true);

CREATE POLICY "Moderators and admins can create digital twins" 
ON public.digital_twins 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators and admins can update digital twins" 
ON public.digital_twins 
FOR UPDATE 
USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete digital twins" 
ON public.digital_twins 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_digital_twins_updated_at
BEFORE UPDATE ON public.digital_twins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();