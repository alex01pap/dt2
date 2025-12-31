import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Activity, RefreshCw } from "lucide-react";
import { 
  MetricCard, 
  SectionHeader, 
  EmptyState, 
  ActionButton,
  StatusIndicator 
} from "@/components/enterprise";
import { OpenHABItem } from "@/hooks/useOpenHABConfig";

interface LiveDashboardProps {
  config: { id: string } | null;
  fetchItems: () => Promise<OpenHABItem[]>;
}

export function LiveDashboard({ config, fetchItems }: LiveDashboardProps) {
  const [liveItems, setLiveItems] = useState<OpenHABItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  const fetchLiveData = useCallback(async () => {
    if (!config) return;
    setIsLoading(true);
    try {
      const items = await fetchItems();
      setLiveItems(items);
    } catch (error) {
      console.error("Error fetching live data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [config, fetchItems]);

  useEffect(() => {
    if (!autoRefresh || !config) return;
    fetchLiveData();
    const interval = setInterval(fetchLiveData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, config, fetchLiveData]);

  const getVariant = (type: string) => {
    if (type.includes("Temperature")) return "temperature";
    if (type.includes("Humidity")) return "humidity";
    if (type.includes("Pressure")) return "pressure";
    if (type.includes("Flow")) return "flow";
    return "default";
  };

  const getUnit = (type: string) => {
    if (type.includes("Temperature")) return "°C";
    if (type.includes("Humidity")) return "%";
    if (type.includes("Pressure")) return "hPa";
    return "";
  };

  const formatValue = (state: string | undefined) => {
    if (!state || state === "NULL" || state === "UNDEF") return "--";
    const num = parseFloat(state);
    return isNaN(num) ? state : num.toFixed(1);
  };

  if (!config) {
    return (
      <EmptyState
        icon={Activity}
        title="No Connection"
        description="Configure your OpenHAB connection in the Setup tab to view live data."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Activity}
        title="Live Sensors"
        description="Real-time sensor values from OpenHAB"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm">Auto</Label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={2}
                max={60}
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 5)}
                className="w-14 h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
            <ActionButton
              variant="outline"
              size="sm"
              onClick={fetchLiveData}
              loading={isLoading}
              icon={RefreshCw}
            />
          </div>
        }
      />

      {liveItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <EmptyState
              icon={Activity}
              title={isLoading ? "Loading..." : "No Sensors Found"}
              description="Make sure OpenHAB has numeric sensor items configured."
              action={
                !isLoading && (
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={fetchLiveData}
                    icon={RefreshCw}
                  >
                    Refresh
                  </ActionButton>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveItems.map((item) => (
              <MetricCard
                key={item.name}
                title={item.label || item.name}
                value={formatValue(item.state)}
                unit={getUnit(item.type)}
                type={item.type}
                category={item.category}
                variant={getVariant(item.type)}
                isLive={autoRefresh}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <span>{liveItems.length} sensors</span>
            <StatusIndicator 
              status={autoRefresh ? "live" : "offline"} 
              label={autoRefresh ? `Refreshing every ${refreshInterval}s` : "Paused"}
              pulse={autoRefresh}
            />
          </div>
        </>
      )}
    </div>
  );
}
