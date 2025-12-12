import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SensorPlacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number; z: number };
  twinId: string;
  onSensorCreated?: () => void;
}

const sensorTypes = [
  { value: 'temperature', label: 'Temperature', icon: '🌡️', unit: '°C' },
  { value: 'humidity', label: 'Humidity', icon: '💧', unit: '%' },
  { value: 'air_quality', label: 'Air Quality (CO2)', icon: '🌬️', unit: 'ppm' },
  { value: 'pressure', label: 'Pressure', icon: '📊', unit: 'hPa' },
  { value: 'flow', label: 'Flow', icon: '🌊', unit: 'L/min' },
  { value: 'vibration', label: 'Vibration', icon: '📳', unit: 'Hz' },
];

export function SensorPlacementDialog({
  open,
  onOpenChange,
  position,
  twinId,
  onSensorCreated
}: SensorPlacementDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('temperature');
  const [minThreshold, setMinThreshold] = useState([18]);
  const [maxThreshold, setMaxThreshold] = useState([28]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedType = sensorTypes.find(t => t.value === type);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a sensor name');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('sensors').insert({
        name: name.trim(),
        type: type as 'temperature' | 'humidity' | 'air_quality' | 'pressure' | 'flow' | 'vibration',
        twin_id: twinId,
        position_3d: position,
        location: position,
        status: 'offline',
        thresholds: {
          min: minThreshold[0],
          max: maxThreshold[0],
          unit: selectedType?.unit
        }
      });

      if (error) throw error;

      toast.success(`Sensor "${name}" created successfully`);
      onSensorCreated?.();
      onOpenChange(false);
      
      // Reset form
      setName('');
      setType('temperature');
      setMinThreshold([18]);
      setMaxThreshold([28]);
    } catch (error) {
      console.error('Error creating sensor:', error);
      toast.error('Failed to create sensor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedType?.icon} Place New Sensor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Position Display */}
          <div className="bg-muted rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">Position</p>
            <p className="font-mono">
              X: {position.x.toFixed(2)}, Y: {position.y.toFixed(2)}, Z: {position.z.toFixed(2)}
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Sensor Name</Label>
            <Input
              id="name"
              placeholder="e.g., Temperature Sensor A1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Sensor Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sensorTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Thresholds */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Min Threshold</Label>
                <span className="text-sm text-muted-foreground">
                  {minThreshold[0]} {selectedType?.unit}
                </span>
              </div>
              <Slider
                value={minThreshold}
                onValueChange={setMinThreshold}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Max Threshold</Label>
                <span className="text-sm text-muted-foreground">
                  {maxThreshold[0]} {selectedType?.unit}
                </span>
              </div>
              <Slider
                value={maxThreshold}
                onValueChange={setMaxThreshold}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Sensor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
