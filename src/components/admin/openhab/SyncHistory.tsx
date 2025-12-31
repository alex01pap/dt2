import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { SectionHeader, EmptyState, DataListRow } from "@/components/enterprise";
import { supabase } from "@/integrations/supabase/client";

interface SyncLog {
  id: string;
  sync_type: string;
  status: string;
  items_synced: number | null;
  error_message: string | null;
  created_at: string;
}

interface SyncHistoryProps {
  config: { id: string } | null;
}

export function SyncHistory({ config }: SyncHistoryProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (config) loadLogs();
  }, [config]);

  const loadLogs = async () => {
    if (!config) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("openhab_sync_log")
        .select("*")
        .eq("config_id", config.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default" as const;
      case "error":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  if (!config) {
    return (
      <EmptyState
        icon={History}
        title="No Connection"
        description="Configure your OpenHAB connection first."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={History}
        title="Sync History"
        description="Recent synchronization activity"
      />

      {logs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <EmptyState
              icon={History}
              title="No Sync History"
              description="Sync history will appear here after your first synchronization."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <DataListRow key={log.id}>
              <div className="flex items-center gap-3">
                {getStatusIcon(log.status)}
                <div>
                  <p className="text-sm font-medium capitalize">{log.sync_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {log.items_synced !== null && (
                  <Badge variant="outline" className="text-xs">
                    {log.items_synced} items
                  </Badge>
                )}
                <Badge variant={getStatusVariant(log.status)} className="text-xs capitalize">
                  {log.status}
                </Badge>
              </div>
            </DataListRow>
          ))}
        </div>
      )}
    </div>
  );
}
