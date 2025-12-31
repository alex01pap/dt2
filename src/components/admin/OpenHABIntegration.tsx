import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Activity, Settings, Layers, GitBranch, History } from "lucide-react";
import { useOpenHABConfig, OpenHABItem } from "@/hooks/useOpenHABConfig";
import { supabase } from "@/integrations/supabase/client";
import { 
  LiveDashboard, 
  ConnectionSetup, 
  ItemMapper, 
  MappedItems,
  SyncHistory 
} from "./openhab";

export function OpenHABIntegration() {
  const { config, isLoading, saveConfig, testConnection, fetchItems, syncData, sendCommand } = useOpenHABConfig();
  const [items, setItems] = useState<OpenHABItem[]>([]);
  const [mappedItems, setMappedItems] = useState<any[]>([]);

  useEffect(() => {
    if (config) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">OpenHAB Integration</h1>
        <p className="text-muted-foreground mt-1">
          Connect and sync sensor data from your OpenHAB instance
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="live" className="gap-2 data-[state=active]:bg-background">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="setup" className="gap-2 data-[state=active]:bg-background">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Setup</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="gap-2 data-[state=active]:bg-background">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Items</span>
          </TabsTrigger>
          <TabsTrigger value="mapped" className="gap-2 data-[state=active]:bg-background">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Mapped</span>
            {mappedItems.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {mappedItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-background">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <LiveDashboard 
            config={config} 
            fetchItems={fetchItems} 
          />
        </TabsContent>

        <TabsContent value="setup">
          <ConnectionSetup
            config={config}
            onSave={saveConfig}
            onTestConnection={testConnection}
          />
        </TabsContent>

        <TabsContent value="items">
          <ItemMapper
            config={config}
            items={items}
            onFetchItems={fetchItems}
            onItemsChange={setItems}
            onMappedItemsChange={loadMappedItems}
          />
        </TabsContent>

        <TabsContent value="mapped">
          <MappedItems
            config={config}
            mappedItems={mappedItems}
            onSync={syncData}
            onSendCommand={sendCommand}
            onRefresh={loadMappedItems}
          />
        </TabsContent>

        <TabsContent value="history">
          <SyncHistory config={config} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
