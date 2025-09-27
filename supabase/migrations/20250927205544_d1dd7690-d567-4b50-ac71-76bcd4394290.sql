-- Insert remaining seed data

-- Insert sensor readings (last 24 hours)
INSERT INTO public.sensor_readings (sensor_id, value, quality_score, recorded_at)
SELECT 
    s.id,
    s.last_reading + (random() - 0.5) * 2, -- Vary reading by +/- 1
    0.9 + random() * 0.1, -- Quality between 0.9-1.0
    now() - interval '1 hour' * generate_series(1, 24)
FROM public.sensors s
WHERE s.status IN ('online', 'warning');

-- Insert sample rules
INSERT INTO public.rules (name, description, status, conditions, actions, window_config, priority) VALUES
('High Temperature Alert', 'Alert when temperature exceeds safe threshold', 'active',
 '[{"field": "temperature", "operator": "greater_than", "value": 25}]',
 '[{"type": "send_notification", "parameters": {"title": "High Temperature", "message": "Temperature exceeded 25°C"}}]',
 '{"enabled": true, "duration": 5, "debounce": 30, "aggregation": "any"}', 1),
('Pressure Monitoring', 'Monitor pressure levels in HVAC systems', 'active',
 '[{"field": "pressure", "operator": "greater_than", "value": 105}]',
 '[{"type": "update_status", "parameters": {"target": "hvac-1", "status": "warning"}}]',
 '{"enabled": false, "duration": 10, "debounce": 60, "aggregation": "all"}', 2),
('Air Quality Emergency', 'Critical air quality response', 'active',
 '[{"field": "air_quality", "operator": "greater_than", "value": 70}]',
 '[{"type": "trigger_alarm", "parameters": {"severity": "critical", "duration": 300}}]',
 '{"enabled": true, "duration": 2, "debounce": 0, "aggregation": "any"}', 3);

-- Insert sample scenarios
INSERT INTO public.scenarios (name, description, status, configuration, results) VALUES
('HVAC Stress Test', 'Test HVAC system under high load conditions', 'completed',
 '{"duration": 300, "temperature_range": [28, 32], "occupancy": 150, "system_mode": "cooling"}',
 '{"max_power": 52.3, "efficiency": 0.87, "comfort_score": 8.2, "energy_consumed": 12.5}'),
('Energy Optimization', 'Optimize energy consumption during peak hours', 'running',
 '{"duration": 600, "target_savings": 15, "priority": "efficiency", "constraints": ["comfort", "safety"]}',
 '{}'),
('Emergency Response', 'Test emergency shutdown procedures', 'draft',
 '{"trigger": "fire_alarm", "response_time": 30, "affected_systems": ["hvac", "lighting", "security"]}',
 '{}');

-- Insert sample events
INSERT INTO public.events (title, description, severity, source, metadata, acknowledged, created_at) VALUES
('High Temperature Alert', 'Temperature sensor reading exceeded threshold in HVAC-1', 'warning', 'sensor', '{"sensor_value": 27.2, "threshold": 26}', false, now() - interval '15 minutes'),
('Pressure System Warning', 'Pressure levels approaching maximum in HVAC system', 'warning', 'sensor', '{"sensor_value": 106.2, "threshold": 105}', true, now() - interval '30 minutes'),
('Air Quality Critical', 'Air quality readings at critical levels', 'critical', 'sensor', '{"sensor_value": 75.5, "threshold": 50}', false, now() - interval '45 minutes'),
('System Startup', 'HVAC System A started successfully', 'info', 'equipment', '{"startup_time": "2.3s", "status": "online"}', true, now() - interval '2 hours'),
('Sensor Offline', 'Temperature sensor lost connection', 'error', 'sensor', '{"last_seen": "2024-01-15T10:30:00Z"}', false, now() - interval '4 hours'),
('Maintenance Completed', 'Scheduled maintenance completed on HVAC-2', 'info', 'equipment', '{"technician": "John Smith", "duration": "45 minutes"}', true, now() - interval '6 hours'),
('Rule Triggered', 'High temperature rule activated', 'warning', 'automation', '{"rule_name": "High Temperature Alert", "trigger_count": 3}', false, now() - interval '1 hour');