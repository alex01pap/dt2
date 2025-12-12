-- Add twin_id to sensors table for linking sensors to digital twins
ALTER TABLE sensors ADD COLUMN twin_id uuid REFERENCES digital_twins(id) ON DELETE SET NULL;

-- Add position column for 3D coordinates
ALTER TABLE sensors ADD COLUMN position_3d jsonb DEFAULT NULL;

-- Create index for efficient queries by twin
CREATE INDEX idx_sensors_twin_id ON sensors(twin_id);