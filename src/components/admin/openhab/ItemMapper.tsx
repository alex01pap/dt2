import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, RefreshCw, Zap } from "lucide-react";
import { 
  SectionHeader, 
  EmptyState, 
  ActionButton, 
  DataListRow 
} from "@/components/enterprise";
import { OpenHABItem } from "@/hooks/useOpenHABConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DigitalTwin {
  id: string;
  name: string;
  template_id: string;
}

interface ItemMapperProps {
  config: { id: string } | null;
  items: OpenHABItem[];
  onFetchItems: () => Promise<OpenHABItem[]>;
  onItemsChange: (items: OpenHABItem[]) => void;
  onMappedItemsChange: () => void;
}

export function ItemMapper({ 
  config, 
  items, 
  onFetchItems, 
  onItemsChange,
  onMappedItemsChange 
}: ItemMapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMappingAll, setIsMappingAll] = useState(false);
  const [twins, setTwins] = useState<DigitalTwin[]>([]);
  const [selectedTwinId, setSelectedTwinId] = useState<string>("");

  useEffect(() => {
    loadTwins();
  }, []);

  const loadTwins = async () => {
    const { data } = await supabase
      .from("digital_twins")
      .select("id, name, template_id")
      .order("name");
    if (data) {
      setTwins(data);
      if (data.length === 1) {
        setSelectedTwinId(data[0].id);
      }
    }
  };

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const fetched = await onFetchItems();
      onItemsChange(fetched);
      if (fetched.length > 0) {
        toast.success(`Found ${fetched.length} items`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const detectSensorType = (type: string) => {
    if (type.includes("Temperature")) return "temperature";
    if (type.includes("Pressure")) return "pressure";
    if (type.includes("Humidity")) return "humidity";
    if (type.includes("Flow")) return "flow";
    return "temperature";
  };

  const handleMapItem = async (item: OpenHABItem) => {
    if (!config) return;

    try {
      const { data: sensor, error: sensorError } = await supabase
        .from("sensors")
        .insert({
          name: item.label || item.name,
          type: detectSensorType(item.type),
          status: "online",
          twin_id: selectedTwinId || null,
        })
        .select()
        .single();

      if (sensorError) throw sensorError;

      const { error: mapError } = await supabase
        .from("openhab_items")
        .insert({
          config_id: config.id,
          sensor_id: sensor.id,
          openhab_item_name: item.name,
          openhab_item_type: item.type,
          openhab_item_label: item.label,
          sync_enabled: true,
        });

      if (mapError) throw mapError;

      toast.success(`Mapped ${item.label || item.name}`);
      onItemsChange(items.filter((i) => i.name !== item.name));
      onMappedItemsChange();
    } catch (error: any) {
      console.error("Error mapping item:", error);
      toast.error(error.message || "Failed to map item");
    }
  };

  const handleMapAll = async () => {
    if (!config || items.length === 0) return;

    setIsMappingAll(true);
    let success = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const { data: sensor, error: sensorError } = await supabase
          .from("sensors")
          .insert({
            name: item.label || item.name,
            type: detectSensorType(item.type),
            status: "online",
            twin_id: selectedTwinId || null,
          })
          .select()
          .single();

        if (sensorError) throw sensorError;

        const { error: mapError } = await supabase
          .from("openhab_items")
          .insert({
            config_id: config.id,
            sensor_id: sensor.id,
            openhab_item_name: item.name,
            openhab_item_type: item.type,
            openhab_item_label: item.label,
            sync_enabled: true,
          });

        if (mapError) throw mapError;
        success++;
      } catch {
        failed++;
      }
    }

    if (success > 0) {
      toast.success(`Mapped ${success} items${failed > 0 ? `, ${failed} failed` : ""}`);
      onItemsChange([]);
      onMappedItemsChange();
    } else {
      toast.error("Failed to map items");
    }

    setIsMappingAll(false);
  };

  if (!config) {
    return (
      <EmptyState
        icon={Layers}
        title="No Connection"
        description="Configure your OpenHAB connection first."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Layers}
        title="Available Items"
        description="OpenHAB items that can be mapped to sensors"
        actions={
          <div className="flex items-center gap-3">
            <Select value={selectedTwinId} onValueChange={setSelectedTwinId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign to twin..." />
              </SelectTrigger>
              <SelectContent>
                {twins.map((twin) => (
                  <SelectItem key={twin.id} value={twin.id}>
                    {twin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ActionButton
              variant="outline"
              size="sm"
              onClick={handleFetch}
              loading={isLoading}
              icon={RefreshCw}
            >
              Fetch
            </ActionButton>
            {items.length > 0 && (
              <ActionButton
                size="sm"
                onClick={handleMapAll}
                loading={isMappingAll}
                disabled={!selectedTwinId}
                icon={Zap}
              >
                Map All ({items.length})
              </ActionButton>
            )}
          </div>
        }
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <EmptyState
              icon={Layers}
              title="No Items"
              description="Click 'Fetch' to load available items from OpenHAB."
              action={
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={handleFetch}
                  loading={isLoading}
                  icon={RefreshCw}
                >
                  Fetch Items
                </ActionButton>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <DataListRow key={item.name}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.label || item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.type.replace("Number:", "")}
                  </Badge>
                  {item.state && item.state !== "NULL" && item.state !== "UNDEF" && (
                    <Badge variant="outline" className="text-xs">
                      {item.state}
                    </Badge>
                  )}
                </div>
              </div>
              <ActionButton size="sm" onClick={() => handleMapItem(item)}>
                Map
              </ActionButton>
            </DataListRow>
          ))}
        </div>
      )}
    </div>
  );
}
