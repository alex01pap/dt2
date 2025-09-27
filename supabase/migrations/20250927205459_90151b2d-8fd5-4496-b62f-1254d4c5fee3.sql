-- Insert seed data for digital twin platform (fixed UUID format)

-- Insert sample assets
INSERT INTO public.assets (name, description, type, parent_id, metadata, position) VALUES
('Main Building', 'Primary office building', 'building', NULL, '{"area": 5000, "floors": 3}', '{"x": 0, "y": 0, "z": 0}'),
('Ground Floor', 'Ground floor of main building', 'room', (SELECT id FROM public.assets WHERE name = 'Main Building'), '{"area": 1600, "occupancy": 120}', '{"x": 0, "y": 0, "z": 0}'),
('First Floor', 'First floor of main building', 'room', (SELECT id FROM public.assets WHERE name = 'Main Building'), '{"area": 1600, "occupancy": 100}', '{"x": 0, "y": 0, "z": 3}'),
('HVAC System A', 'Primary HVAC system for ground floor', 'equipment', (SELECT id FROM public.assets WHERE name = 'Ground Floor'), '{"capacity": "50kW", "efficiency": 0.92}', '{"x": 10, "y": 10, "z": 0.5}'),
('HVAC System B', 'Secondary HVAC system for first floor', 'equipment', (SELECT id FROM public.assets WHERE name = 'First Floor'), '{"capacity": "45kW", "efficiency": 0.89}', '{"x": 15, "y": 15, "z": 3.5}');

-- Insert sample sensors
INSERT INTO public.sensors (name, type, status, asset_id, location, thresholds, last_reading, last_reading_at) VALUES
('Temperature Sensor 1', 'temperature', 'online', (SELECT id FROM public.assets WHERE name = 'HVAC System A'), '{"x": 10, "y": 10, "z": 0.5}', '{"min": 18, "max": 26}', 22.5, now() - interval '2 minutes'),
('Temperature Sensor 2', 'temperature', 'online', (SELECT id FROM public.assets WHERE name = 'HVAC System B'), '{"x": 15, "y": 15, "z": 3.5}', '{"min": 18, "max": 26}', 23.1, now() - interval '1 minute'),
('Pressure Sensor 1', 'pressure', 'warning', (SELECT id FROM public.assets WHERE name = 'HVAC System A'), '{"x": 12, "y": 10, "z": 0.5}', '{"min": 95, "max": 105}', 106.2, now() - interval '5 minutes'),
('Humidity Sensor 1', 'humidity', 'online', (SELECT id FROM public.assets WHERE name = 'Ground Floor'), '{"x": 5, "y": 5, "z": 1}', '{"min": 30, "max": 60}', 45.0, now() - interval '3 minutes'),
('Air Quality Sensor 1', 'air_quality', 'critical', (SELECT id FROM public.assets WHERE name = 'First Floor'), '{"x": 8, "y": 8, "z": 4}', '{"min": 0, "max": 50}', 75.5, now() - interval '10 minutes');