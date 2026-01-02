import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GitBranch, RefreshCw, Send, MapPin } from "lucide-react";
import { 
  SectionHeader, 
  EmptyState, 
  ActionButton, 
  StatusIndicator 
} from "@/components/enterprise";
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
}

interface MappedItem {
  id: string;
  openhab_item_name: string;
  openhab_item_type: string;
  openhab_item_label: string | null;
  sync_enabled: boolean;
  last_value: string | null;
  last_synced_at: string | null;
  sensor_id: string | null;
  sensors: { 
    id: string;
    name: string;
    twin_id: string | null;
  } | null;
}

interface MappedItemsProps {
  config: { id: string } | null;
  mappedItems: MappedItem[];
  onSync: () => Promise<void>;
  onSendCommand: (itemName: string, command: string) => Promise<void>;
  onRefresh: () => void;
}

export function MappedItems({ 
  config, 
  mappedItems, 
  onSync, 
  onSendCommand,
  onRefresh 
}: MappedItemsProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [commandValues, setCommandValues] = useState<Record<string, string>>({});
  const [sendingCommand, setSendingCommand] = useState<string | null>(null);
  const [twins, setTwins] = useState<DigitalTwin[]>([]);
  const [bulkTwinId, setBulkTwinId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadTwins();
  }, []);

  const loadTwins = async () => {
    const { data } = await supabase
      .from("digital_twins")
      .select("id, name")
      .order("name");
    if (data) setTwins(data);
  };

  const handleBulkAssign = async () => {
    if (!bulkTwinId) return;

    const unassigned = mappedItems.filter(
      (item) => item.sensors && !item.sensors.twin_id
    );
    
    if (unassigned.length === 0) {
      toast.info("All sensors are already assigned");
      return;
    }

    setIsAssigning(true);
    try {
      const sensorIds = unassigned
        .map((item) => item.sensors?.id)
        .filter(Boolean) as string[];

      const { error } = await supabase
        .from("sensors")
        .update({ twin_id: bulkTwinId })
        .in("id", sensorIds);

      if (error) throw error;

      toast.success(`Assigned ${sensorIds.length} sensors to twin`);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign sensors");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignSingle = async (sensorId: string, twinId: string) => {
    try {
      const { error } = await supabase
        .from("sensors")
        .update({ twin_id: twinId })
        .eq("id", sensorId);

      if (error) throw error;
      toast.success("Sensor assigned");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign");
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
      onRefresh();
      toast.success("Sync completed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendCommand = async (itemName: string) => {
    const command = commandValues[itemName];
    if (!command) {
      toast.error("Enter a command value");
      return;
    }

    setSendingCommand(itemName);
    try {
      await onSendCommand(itemName, command);
      setCommandValues({ ...commandValues, [itemName]: "" });
    } finally {
      setSendingCommand(null);
    }
  };

  if (!config) {
    return (
      <EmptyState
        icon={GitBranch}
        title="No Connection"
        description="Configure your OpenHAB connection first."
      />
    );
  }

  const unassignedCount = mappedItems.filter(
    (item) => item.sensors && !item.sensors.twin_id
  ).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitBranch}
        title="Mapped Sensors"
        description={`${mappedItems.length} items syncing from OpenHAB`}
        actions={
          <div className="flex items-center gap-3">
            {unassignedCount > 0 && (
              <>
                <Select value={bulkTwinId} onValueChange={setBulkTwinId}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Assign to..." />
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
                  size="sm"
                  variant="outline"
                  onClick={handleBulkAssign}
                  loading={isAssigning}
                  disabled={!bulkTwinId}
                  icon={MapPin}
                >
                  Assign ({unassignedCount})
                </ActionButton>
              </>
            )}
            <ActionButton
              size="sm"
              onClick={handleSync}
              loading={isSyncing}
              icon={RefreshCw}
              disabled={mappedItems.length === 0}
            >
              Sync Now
            </ActionButton>
          </div>
        }
      />

      {mappedItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <EmptyState
              icon={GitBranch}
              title="No Mapped Items"
              description="Map items from the 'Items' tab to start syncing data."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mappedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {item.openhab_item_label || item.openhab_item_name}
                      </p>
                      <StatusIndicator 
                        status={item.sync_enabled ? "success" : "offline"} 
                        size="sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.openhab_item_type.replace("Number:", "")}
                      </Badge>
                      {item.sensors && (
                        <Badge variant="outline" className="text-xs">
                          → {item.sensors.name}
                        </Badge>
                      )}
                      {item.sensors?.twin_id ? (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          {twins.find((t) => t.id === item.sensors?.twin_id)?.name || "Assigned"}
                        </Badge>
                      ) : (
                        <Select
                          onValueChange={(value) =>
                            item.sensors && handleAssignSingle(item.sensors.id, value)
                          }
                        >
                          <SelectTrigger className="h-6 text-xs w-[120px]">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            {twins.map((twin) => (
                              <SelectItem key={twin.id} value={twin.id}>
                                {twin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {item.last_value && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.last_value}
                        </Badge>
                      )}
                    </div>
                    {item.last_synced_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last sync: {new Date(item.last_synced_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Command input */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Input
                    placeholder="Command (e.g., 23, ON, OFF)"
                    value={commandValues[item.openhab_item_name] || ""}
                    onChange={(e) => setCommandValues({
                      ...commandValues,
                      [item.openhab_item_name]: e.target.value
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendCommand(item.openhab_item_name);
                    }}
                    className="flex-1 h-9"
                  />
                  <ActionButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendCommand(item.openhab_item_name)}
                    loading={sendingCommand === item.openhab_item_name}
                    icon={Send}
                  >
                    Send
                  </ActionButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
