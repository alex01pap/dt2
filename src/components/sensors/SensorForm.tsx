import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { useOpenHABConfig, OpenHABItem } from "@/hooks/useOpenHABConfig";
import { useOrganization } from "@/contexts/OrganizationContext";

interface SensorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SensorForm({ open, onOpenChange, onSuccess }: SensorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openhabItems, setOpenhabItems] = useState<OpenHABItem[]>([]);
  const { config, fetchItems } = useOpenHABConfig();
  const { currentOrgId } = useOrganization();
  const [formData, setFormData] = useState({
    name: "",
    type: "temperature" as const,
    status: "offline" as const,
    location_x: "",
    location_y: "",
    location_z: "",
    threshold_min: "",
    threshold_max: "",
    openhab_item: "",
  });

  useEffect(() => {
    if (open && config?.enabled) {
      loadOpenHABItems();
    }
  }, [open, config]);

  const loadOpenHABItems = async () => {
    try {
      const items = await fetchItems();
      setOpenhabItems(items);
    } catch (error) {
      console.error("Error loading OpenHAB items:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error("Sensor name is required");
        return;
      }

      // Prepare location data
      const location = (formData.location_x || formData.location_y || formData.location_z) 
        ? {
            x: formData.location_x ? parseFloat(formData.location_x) : 0,
            y: formData.location_y ? parseFloat(formData.location_y) : 0,
            z: formData.location_z ? parseFloat(formData.location_z) : 0,
          }
        : null;

      // Prepare thresholds data
      const thresholds = (formData.threshold_min || formData.threshold_max)
        ? {
            min: formData.threshold_min ? parseFloat(formData.threshold_min) : null,
            max: formData.threshold_max ? parseFloat(formData.threshold_max) : null,
          }
        : {};

      // Insert sensor
      const { data: sensorData, error } = await supabase.from("sensors").insert({
        name: formData.name.trim(),
        type: formData.type,
        status: formData.status,
        location,
        thresholds,
        org_id: currentOrgId!,
      }).select().single();

      if (error) throw error;

      // Create OpenHAB mapping if an item was selected
      if (formData.openhab_item && config?.id && sensorData) {
        const selectedItem = openhabItems.find(item => item.name === formData.openhab_item);
        
        const { error: mappingError } = await supabase.from("openhab_items").insert({
          config_id: config.id,
          sensor_id: sensorData.id,
          openhab_item_name: selectedItem!.name,
          openhab_item_type: selectedItem!.type,
          openhab_item_label: selectedItem!.label,
          mapping_type: 'manual',
          sync_enabled: true
        });

        if (mappingError) {
          console.error("Error creating OpenHAB mapping:", mappingError);
          toast.error("Sensor created but OpenHAB mapping failed");
        } else {
          toast.success("Sensor created and linked to OpenHAB");
        }
      } else {
        toast.success("Sensor created successfully");
      }
      
      // Reset form
      setFormData({
        name: "",
        type: "temperature",
        status: "offline",
        location_x: "",
        location_y: "",
        location_z: "",
        threshold_min: "",
        threshold_max: "",
        openhab_item: "",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating sensor:", error);
      toast.error(error.message || "Failed to create sensor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Sensor</SheetTitle>
          <SheetDescription>
            Create a new sensor to track data streams from your IoT devices
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sensor Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Temperature Sensor 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Sensor Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="pressure">Pressure</SelectItem>
                  <SelectItem value="air_quality">Air Quality</SelectItem>
                  <SelectItem value="power">Power</SelectItem>
                  <SelectItem value="vibration">Vibration</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Location (Optional)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="location_x" className="text-xs">X</Label>
                <Input
                  id="location_x"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.location_x}
                  onChange={(e) => setFormData({ ...formData, location_x: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_y" className="text-xs">Y</Label>
                <Input
                  id="location_y"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.location_y}
                  onChange={(e) => setFormData({ ...formData, location_y: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_z" className="text-xs">Z</Label>
                <Input
                  id="location_z"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.location_z}
                  onChange={(e) => setFormData({ ...formData, location_z: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* OpenHAB Integration */}
          {config?.enabled && openhabItems.length > 0 && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">OpenHAB Integration (Optional)</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openhab_item" className="text-sm">Link to OpenHAB Item</Label>
                <Select 
                  value={formData.openhab_item} 
                  onValueChange={(value) => setFormData({ ...formData, openhab_item: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an OpenHAB item..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {openhabItems.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.label || item.name} ({item.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Link this sensor to an OpenHAB item for automatic data sync
                </p>
              </div>
            </div>
          )}

          {/* Thresholds */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Thresholds (Optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="threshold_min" className="text-xs">Min Value</Label>
                <Input
                  id="threshold_min"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18"
                  value={formData.threshold_min}
                  onChange={(e) => setFormData({ ...formData, threshold_min: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold_max" className="text-xs">Max Value</Label>
                <Input
                  id="threshold_max"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 26"
                  value={formData.threshold_max}
                  onChange={(e) => setFormData({ ...formData, threshold_max: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Set min/max values to trigger alerts when exceeded
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-enterprise"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Sensor"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
