-- Add admin role to the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('c8f75252-7007-4948-8951-c9202b80cd1a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;