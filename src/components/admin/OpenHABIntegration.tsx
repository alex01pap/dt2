import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  RefreshCw, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle,
  Info,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { useOpenHABConfig, OpenHABItem } from "@/hooks/useOpenHABConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function OpenHABIntegration() {
  const { config, isLoading, saveConfig, testConnection, fetchItems, syncData, sendCommand } = useOpenHABConfig();
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
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [commandValues, setCommandValues] = useState<Record<string, string>>({});
  const [sendingCommand, setSendingCommand] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setFormData({
        openhab_url: config.openhab_url,
        api_token: config.api_token || "",
        sync_interval: config.sync_interval,
        enabled: config.enabled,
      });
      loadMappedItems();
      loadSyncLogs();
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

  const loadSyncLogs = async () => {
    if (!config) return;
    
    try {
      const { data, error } = await supabase
        .from("openhab_sync_log")
        .select("*")
        .eq("config_id", config.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setSyncLogs(data || []);
    } catch (error) {
      console.error("Error loading sync logs:", error);
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
      await loadSyncLogs(); // Refresh sync logs after manual sync
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

  const handleSendCommand = async (itemName: string) => {
    const command = commandValues[itemName];
    if (!command) {
      toast.error("Please enter a command value");
      return;
    }

    setSendingCommand(itemName);
    try {
      await sendCommand(itemName, command);
      // Clear the input after successful send
      setCommandValues({ ...commandValues, [itemName]: "" });
    } finally {
      setSendingCommand(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
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
        <h2 className="text-2xl font-bold tracking-tight">OpenHAB Integration</h2>
        <p className="text-muted-foreground">Connect your OpenHAB home automation system to sync sensor data</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>What you'll need from OpenHAB</AlertTitle>
        <AlertDescription className="space-y-2 mt-2">
          <div className="space-y-1">
            <p className="font-medium">1. OpenHAB Server URL</p>
            <p className="text-sm">Your OpenHAB instance address (e.g., <code className="bg-muted px-1 py-0.5 rounded">http://192.168.1.100:8080</code>)</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">2. API Token (Optional but recommended)</p>
            <p className="text-sm">Create one in OpenHAB UI:</p>
            <ol className="text-sm list-decimal list-inside ml-2 space-y-1">
              <li>Open OpenHAB UI</li>
              <li>Go to <strong>Settings → API Security → API Tokens</strong></li>
              <li>Click <strong>"+ Create New API Token"</strong></li>
              <li>Enter a name (e.g., "Digital Twin Integration")</li>
              <li>Set scope: <strong>admin</strong> (or at least <strong>read</strong> access)</li>
              <li>Click <strong>"Create"</strong></li>
              <li>Copy the token immediately (it won't be shown again)</li>
            </ol>
          </div>
          <div className="space-y-1">
            <p className="font-medium">3. Compatible Items</p>
            <p className="text-sm">We support these OpenHAB item types:</p>
            <ul className="text-sm list-disc list-inside ml-2">
              <li><code className="bg-muted px-1 py-0.5 rounded text-xs">Number:Temperature</code> - Temperature sensors</li>
              <li><code className="bg-muted px-1 py-0.5 rounded text-xs">Number:Pressure</code> - Pressure sensors</li>
              <li><code className="bg-muted px-1 py-0.5 rounded text-xs">Number:Dimensionless</code> - Generic numeric sensors</li>
              <li><code className="bg-muted px-1 py-0.5 rounded text-xs">Number</code> - Any numeric value</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="items">Available Items</TabsTrigger>
          <TabsTrigger value="mapped">Mapped Items ({mappedItems.length})</TabsTrigger>
          <TabsTrigger value="status">Sync Status</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Configuration</CardTitle>
              <CardDescription>
                Enter your OpenHAB server details below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">OpenHAB Server URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="http://192.168.1.100:8080"
                    value={formData.openhab_url}
                    onChange={(e) => setFormData({ ...formData, openhab_url: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard("http://192.168.1.100:8080")}
                  >
                    {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ℹ️ Find your IP: In OpenHAB UI go to <strong>Settings → System → Network Settings</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  💡 Make sure your Digital Twin platform can access this URL (same network or port forwarding)
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="token">API Token (Optional)</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="your-openhab-api-token-here"
                  value={formData.api_token}
                  onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                />
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Without API Token:</strong> Works if OpenHAB has no authentication enabled.<br/>
                    <strong>With API Token:</strong> Secure access even with authentication enabled (recommended for production).
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="interval">Sync Interval (seconds)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="10"
                  max="3600"
                  value={formData.sync_interval}
                  onChange={(e) => setFormData({ ...formData, sync_interval: parseInt(e.target.value) || 30 })}
                />
                <p className="text-sm text-muted-foreground">
                  How often to fetch new data from OpenHAB (minimum 10 seconds, recommended 30-60 seconds)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label htmlFor="enabled" className="cursor-pointer">
                  Enable automatic synchronization
                </Label>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isTesting || !formData.openhab_url} 
                  variant="outline"
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || !formData.openhab_url}
                  className="btn-enterprise"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Configuration
                </Button>
              </div>

              {config?.last_sync_at && (
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Connected</AlertTitle>
                  <AlertDescription>
                    Last synced: {new Date(config.last_sync_at).toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Follow these steps to complete the integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Configure Connection</p>
                  <p className="text-sm text-muted-foreground">Enter your OpenHAB URL and optional API token above</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Test Connection</p>
                  <p className="text-sm text-muted-foreground">Click "Test Connection" to verify the setup works</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Save Configuration</p>
                  <p className="text-sm text-muted-foreground">Save your settings to enable the integration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium">Fetch & Map Items</p>
                  <p className="text-sm text-muted-foreground">Go to "Available Items" tab to see and map your OpenHAB sensors</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <p className="font-medium">Monitor Synced Data</p>
                  <p className="text-sm text-muted-foreground">Check "Mapped Items" tab to see active synchronization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available OpenHAB Items</CardTitle>
                  <CardDescription>
                    Sensor-compatible items from your OpenHAB instance
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleFetchItems} 
                  disabled={isLoadingItems || !config} 
                  variant="outline" 
                  size="sm"
                >
                  {isLoadingItems ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Fetch Items
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!config ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Please save your OpenHAB configuration in the "Setup" tab first.
                  </AlertDescription>
                </Alert>
              ) : items.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">
                    No items fetched yet. Click "Fetch Items" to load sensor-compatible items from OpenHAB.
                  </p>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>What items will appear here?</AlertTitle>
                    <AlertDescription>
                      Only numeric sensor items will be shown (Temperature, Pressure, Humidity, etc.)
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div 
                      key={item.name} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.label || item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                          {item.state && item.state !== 'NULL' && item.state !== 'UNDEF' && (
                            <Badge variant="outline" className="text-xs">
                              Current: {item.state}
                            </Badge>
                          )}
                          {item.category && (
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button onClick={() => handleMapItem(item)} size="sm" className="btn-enterprise">
                        Map to Sensor
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapped" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mapped Items ({mappedItems.length})</CardTitle>
                  <CardDescription>
                    Items currently syncing from OpenHAB to your Digital Twin
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleSync} 
                  disabled={isSyncing || mappedItems.length === 0}
                  className="btn-enterprise"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mappedItems.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">
                    No items mapped yet. Go to "Available Items" tab and map items to start syncing.
                  </p>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>How mapping works</AlertTitle>
                    <AlertDescription>
                      Each OpenHAB item you map creates a new sensor in your Digital Twin. Data from OpenHAB will automatically sync to these sensors based on your configured interval.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-2">
                  {mappedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col p-4 border rounded-lg gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.openhab_item_label || item.openhab_item_name}</p>
                            {item.sync_enabled ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.openhab_item_type}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {item.sensors && (
                              <Badge variant="secondary" className="text-xs">
                                → {item.sensors.name}
                              </Badge>
                            )}
                            {item.last_value && (
                              <Badge variant="outline" className="text-xs">
                                {item.last_value}
                              </Badge>
                            )}
                            {item.last_synced_at && (
                              <span className="text-xs text-muted-foreground">
                                Last synced: {new Date(item.last_synced_at).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Send Command</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter command value (e.g., 23, ON, OFF)"
                            value={commandValues[item.openhab_item_name] || ""}
                            onChange={(e) => setCommandValues({
                              ...commandValues,
                              [item.openhab_item_name]: e.target.value
                            })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendCommand(item.openhab_item_name);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleSendCommand(item.openhab_item_name)}
                            disabled={sendingCommand === item.openhab_item_name || !commandValues[item.openhab_item_name]}
                            size="sm"
                            variant="default"
                          >
                            {sendingCommand === item.openhab_item_name ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Send"
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Common commands: ON, OFF, numeric values, or item-specific commands
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Automatic Sync Status</span>
                {config?.enabled && (
                  <Badge variant="default" className="bg-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Automatic synchronization runs every {formData.sync_interval} seconds when enabled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Last Sync</p>
                  <p className="text-2xl font-bold">
                    {config?.last_sync_at 
                      ? new Date(config.last_sync_at).toLocaleString()
                      : "Never"
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sync Interval</p>
                  <p className="text-2xl font-bold">{formData.sync_interval}s</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Mapped Items</p>
                  <p className="text-2xl font-bold">{mappedItems.length}</p>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Sync History</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSyncLogs}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {syncLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No sync history yet</p>
                    <p className="text-sm mt-2">Sync logs will appear here once data synchronization begins</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {syncLogs.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {log.status === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          ) : log.status === 'partial' ? (
                            <Info className="h-5 w-5 text-warning mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant={log.sync_type === 'automatic' ? 'default' : 'secondary'}>
                                {log.sync_type}
                              </Badge>
                              <Badge 
                                variant={
                                  log.status === 'success' ? 'default' :
                                  log.status === 'partial' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">
                              Synced {log.items_synced} items
                            </p>
                            {log.error_message && (
                              <p className="text-xs text-destructive mt-1">{log.error_message}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-sm">Connection fails?</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2 mt-1 space-y-1">
              <li>Verify the OpenHAB URL is correct and accessible from this network</li>
              <li>Check if OpenHAB is running: <code className="bg-muted px-1 py-0.5 rounded text-xs">systemctl status openhab</code></li>
              <li>If using authentication, make sure the API token is valid</li>
              <li>Check firewall rules allow connection to port 8080</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm">No items showing up?</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2 mt-1 space-y-1">
              <li>Only numeric sensor types are supported (Number, Number:Temperature, etc.)</li>
              <li>Make sure your OpenHAB items are properly configured with states</li>
              <li>Check OpenHAB logs for any item errors</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm">Need help?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check the <a href="https://www.openhab.org/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                OpenHAB Documentation
                <ExternalLink className="h-3 w-3" />
              </a> for more information about items and API access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
