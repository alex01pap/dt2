import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface SensorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sensor: {
    id: string;
    name: string;
    type: string;
    position: [number, number, number];
    thresholds?: { min?: number; max?: number; unit?: string };
  } | null;
  onSensorUpdated?: () => void;
  onSensorDeleted?: () => void;
}

const sensorTypes = [
  { value: 'temperature', label: 'Temperature', icon: '🌡️', unit: '°C' },
  { value: 'humidity', label: 'Humidity', icon: '💧', unit: '%' },
  { value: 'air_quality', label: 'Air Quality (CO2)', icon: '🌬️', unit: 'ppm' },
  { value: 'pressure', label: 'Pressure', icon: '📊', unit: 'hPa' },
  { value: 'flow', label: 'Flow', icon: '🌊', unit: 'L/min' },
  { value: 'vibration', label: 'Vibration', icon: '📳', unit: 'Hz' },
];

export function SensorEditDialog({
  open,
  onOpenChange,
  sensor,
  onSensorUpdated,
  onSensorDeleted
}: SensorEditDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('temperature');
  const [minThreshold, setMinThreshold] = useState([18]);
  const [maxThreshold, setMaxThreshold] = useState([28]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (sensor) {
      setName(sensor.name);
      setType(sensor.type);
      setMinThreshold([sensor.thresholds?.min ?? 18]);
      setMaxThreshold([sensor.thresholds?.max ?? 28]);
    }
  }, [sensor]);

  const selectedType = sensorTypes.find(t => t.value === type);

  const handleSubmit = async () => {
    if (!sensor) return;
    if (!name.trim()) {
      toast.error('Please enter a sensor name');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('sensors').update({
        name: name.trim(),
        type: type as 'temperature' | 'humidity' | 'air_quality' | 'pressure' | 'flow' | 'vibration',
        thresholds: {
          min: minThreshold[0],
          max: maxThreshold[0],
          unit: selectedType?.unit
        }
      }).eq('id', sensor.id);

      if (error) throw error;

      toast.success(`Sensor "${name}" updated successfully`);
      onSensorUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating sensor:', error);
      toast.error('Failed to update sensor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!sensor) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('sensors').delete().eq('id', sensor.id);

      if (error) throw error;

      toast.success(`Sensor "${sensor.name}" deleted`);
      onSensorDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting sensor:', error);
      toast.error('Failed to delete sensor');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!sensor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedType?.icon} Edit Sensor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Position Display */}
          <div className="bg-muted rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">Position</p>
            <p className="font-mono">
              X: {sensor.position[0].toFixed(2)}, Y: {sensor.position[1].toFixed(2)}, Z: {sensor.position[2].toFixed(2)}
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

        <DialogFooter className="flex justify-between sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Sensor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{sensor.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
