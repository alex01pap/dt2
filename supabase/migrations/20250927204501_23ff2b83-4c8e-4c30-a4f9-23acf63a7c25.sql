-- Create comprehensive database schema for digital twin platform

-- Create enum types
CREATE TYPE public.sensor_type AS ENUM ('temperature', 'pressure', 'flow', 'vibration', 'humidity', 'air_quality');
CREATE TYPE public.sensor_status AS ENUM ('online', 'offline', 'warning', 'critical');
CREATE TYPE public.asset_type AS ENUM ('building', 'room', 'equipment', 'sensor', 'system');
CREATE TYPE public.rule_status AS ENUM ('active', 'inactive', 'triggered');
CREATE TYPE public.scenario_status AS ENUM ('draft', 'running', 'completed', 'failed');
CREATE TYPE public.event_severity AS ENUM ('info', 'warning', 'error', 'critical');

-- Assets table (hierarchical structure)
CREATE TABLE public.assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type asset_type NOT NULL,
    parent_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    position JSONB, -- For 3D coordinates {x, y, z}
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sensors table
CREATE TABLE public.sensors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type sensor_type NOT NULL,
    status sensor_status NOT NULL DEFAULT 'offline',
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    location JSONB, -- For positioning {x, y, z}
    thresholds JSONB DEFAULT '{}', -- Min/max values for alerts
    calibration JSONB DEFAULT '{}',
    last_reading NUMERIC,
    last_reading_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sensor readings table (time series data)
CREATE TABLE public.sensor_readings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES public.sensors(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    quality_score NUMERIC DEFAULT 1.0 CHECK (quality_score >= 0 AND quality_score <= 1),
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Automation rules table
CREATE TABLE public.rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status rule_status NOT NULL DEFAULT 'inactive',
    conditions JSONB NOT NULL DEFAULT '[]', -- Array of condition objects
    actions JSONB NOT NULL DEFAULT '[]', -- Array of action objects
    window_config JSONB DEFAULT '{}', -- Time window and debounce settings
    priority INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scenarios table
CREATE TABLE public.scenarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status scenario_status NOT NULL DEFAULT 'draft',
    configuration JSONB NOT NULL DEFAULT '{}', -- Input parameters
    results JSONB DEFAULT '{}', -- Simulation results
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Events table (system events, alerts, logs)
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    severity event_severity NOT NULL DEFAULT 'info',
    source TEXT, -- Component that generated the event
    source_id UUID, -- ID of the source entity
    metadata JSONB DEFAULT '{}',
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_assets_parent_id ON public.assets(parent_id);
CREATE INDEX idx_assets_type ON public.assets(type);
CREATE INDEX idx_sensors_asset_id ON public.sensors(asset_id);
CREATE INDEX idx_sensors_status ON public.sensors(status);
CREATE INDEX idx_sensor_readings_sensor_id ON public.sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_recorded_at ON public.sensor_readings(recorded_at DESC);
CREATE INDEX idx_rules_status ON public.rules(status);
CREATE INDEX idx_scenarios_status ON public.scenarios(status);
CREATE INDEX idx_events_severity ON public.events(severity);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later with authentication)
CREATE POLICY "Public access to assets" ON public.assets FOR ALL USING (true);
CREATE POLICY "Public access to sensors" ON public.sensors FOR ALL USING (true);
CREATE POLICY "Public access to sensor_readings" ON public.sensor_readings FOR ALL USING (true);
CREATE POLICY "Public access to rules" ON public.rules FOR ALL USING (true);
CREATE POLICY "Public access to scenarios" ON public.scenarios FOR ALL USING (true);
CREATE POLICY "Public access to events" ON public.events FOR ALL USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at
    BEFORE UPDATE ON public.sensors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
    BEFORE UPDATE ON public.rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at
    BEFORE UPDATE ON public.scenarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();