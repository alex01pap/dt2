import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GitBranch, RefreshCw, CheckCircle, XCircle, Send } from "lucide-react";
import { 
  SectionHeader, 
  EmptyState, 
  ActionButton, 
  DataListRow,
  StatusIndicator 
} from "@/components/enterprise";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MappedItem {
  id: string;
  openhab_item_name: string;
  openhab_item_type: string;
  openhab_item_label: string | null;
  sync_enabled: boolean;
  last_value: string | null;
  last_synced_at: string | null;
  sensors: { name: string } | null;
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

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitBranch}
        title="Mapped Sensors"
        description={`${mappedItems.length} items syncing from OpenHAB`}
        actions={
          <ActionButton
            size="sm"
            onClick={handleSync}
            loading={isSyncing}
            icon={RefreshCw}
            disabled={mappedItems.length === 0}
          >
            Sync Now
          </ActionButton>
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
