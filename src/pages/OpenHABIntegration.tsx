import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw, Link as LinkIcon, CheckCircle, XCircle } from "lucide-react";
import { useOpenHABConfig, OpenHABItem } from "@/hooks/useOpenHABConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function OpenHABIntegration() {
  const { config, isLoading, saveConfig, testConnection, fetchItems, syncData } = useOpenHABConfig();
  const [formData, setFormData] = useState({
    openhab_url: "",
    api_token: "",
    sync_interval: 30,
    enabled: true,
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [items, setItems] = useState<OpenHABItem[]>([]);
  const [mappedItems, setMappedItems] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        openhab_url: config.openhab_url,
        api_token: config.api_token || "",
        sync_interval: config.sync_interval,
        enabled: config.enabled,
      });
      loadMappedItems();
    }
  }, [config]);

  const loadMappedItems = async () => {
    if (!config) return;
    
    try {
      const { data, error } = await supabase
        .from("openhab_items")
        .select("*, sensors(*)")
        .eq("config_id", config.id);

      if (error) throw error;
      setMappedItems(data || []);
    } catch (error) {
      console.error("Error loading mapped items:", error);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await testConnection(formData.openhab_url, formData.api_token);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveConfig(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
      if (fetchedItems.length > 0) {
        toast.success(`Found ${fetchedItems.length} sensor-compatible items`);
      }
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      await loadMappedItems();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMapItem = async (item: OpenHABItem) => {
    if (!config) return;

    try {
      // Create or update sensor
      const sensorType = item.type.includes("Temperature") ? "temperature" 
        : item.type.includes("Pressure") ? "pressure"
        : item.type.includes("Humidity") ? "humidity"
        : "temperature";

      const { data: sensor, error: sensorError } = await supabase
        .from("sensors")
        .insert({
          name: item.label || item.name,
          type: sensorType,
          status: "online",
        })
        .select()
        .single();

      if (sensorError) throw sensorError;

      // Map OpenHAB item to sensor
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

      toast.success(`Mapped ${item.label || item.name} to sensor`);
      await loadMappedItems();
      
      // Remove from available items
      setItems(items.filter(i => i.name !== item.name));
    } catch (error: any) {
      console.error("Error mapping item:", error);
      toast.error(error.message || "Failed to map item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OpenHAB Integration</h1>
        <p className="text-muted-foreground">Connect your OpenHAB instance to sync sensor data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Enter your OpenHAB connection details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">OpenHAB URL</Label>
            <Input
              id="url"
              placeholder="http://your-openhab-ip:8080"
              value={formData.openhab_url}
              onChange={(e) => setFormData({ ...formData, openhab_url: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              The URL of your OpenHAB instance (e.g., http://192.168.1.100:8080)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">API Token (Optional)</Label>
            <Input
              id="token"
              type="password"
              placeholder="Your OpenHAB API token"
              value={formData.api_token}
              onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              Create an API token in OpenHAB: Settings → API Tokens
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Sync Interval (seconds)</Label>
            <Input
              id="interval"
              type="number"
              min="10"
              value={formData.sync_interval}
              onChange={(e) => setFormData({ ...formData, sync_interval: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
            <Label htmlFor="enabled">Enable automatic sync</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={isTesting} variant="outline">
              {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LinkIcon className="h-4 w-4 mr-2" />}
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Configuration
            </Button>
          </div>

          {config?.last_sync_at && (
            <p className="text-sm text-muted-foreground">
              Last synced: {new Date(config.last_sync_at).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {config && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available OpenHAB Items</CardTitle>
                  <CardDescription>
                    Sensor-compatible items from your OpenHAB instance
                  </CardDescription>
                </div>
                <Button onClick={handleFetchItems} disabled={isLoadingItems} variant="outline" size="sm">
                  {isLoadingItems ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Fetch Items
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items fetched. Click "Fetch Items" to load from OpenHAB.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.label || item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                        {item.state && <Badge variant="outline">{item.state}</Badge>}
                      </div>
                      <Button onClick={() => handleMapItem(item)} size="sm">
                        Map to Sensor
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mapped Items ({mappedItems.length})</CardTitle>
                  <CardDescription>
                    Items currently syncing from OpenHAB
                  </CardDescription>
                </div>
                <Button onClick={handleSync} disabled={isSyncing || mappedItems.length === 0}>
                  {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Sync Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mappedItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items mapped yet. Map items from the available items above.
                </p>
              ) : (
                <div className="space-y-2">
                  {mappedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.openhab_item_label || item.openhab_item_name}</p>
                        <p className="text-sm text-muted-foreground">{item.openhab_item_type}</p>
                        {item.sensors && (
                          <Badge variant="secondary" className="mt-1">
                            → {item.sensors.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {item.last_value && (
                          <Badge variant="outline">{item.last_value}</Badge>
                        )}
                        {item.sync_enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
