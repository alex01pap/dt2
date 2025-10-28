import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OpenHABConfig {
  id: string;
  openhab_url: string;
  api_token?: string;
  sync_interval: number;
  enabled: boolean;
  last_sync_at?: string;
}

export interface OpenHABItem {
  name: string;
  type: string;
  label: string;
  state?: string;
  category?: string;
}

export const useOpenHABConfig = () => {
  const [config, setConfig] = useState<OpenHABConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("openhab_config")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 = no rows
        throw error;
      }

      setConfig(data);
    } catch (error: any) {
      console.error("Error loading config:", error);
      toast({
        title: "Error",
        description: "Failed to load OpenHAB configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (configData: Omit<OpenHABConfig, "id" | "last_sync_at">) => {
    try {
      if (config) {
        const { error } = await supabase
          .from("openhab_config")
          .update(configData)
          .eq("id", config.id);

        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
          .from("openhab_config")
          .insert({ ...configData, user_id: user.id });

        if (error) throw error;
      }

      await loadConfig();
      toast({
        title: "Success",
        description: "OpenHAB configuration saved",
      });
    } catch (error: any) {
      console.error("Error saving config:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const testConnection = async (url: string, token?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("openhab-sync", {
        body: { action: "test-connection", openhabUrl: url, apiToken: token },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Connection successful",
          description: data.message,
        });
        return true;
      } else {
        toast({
          title: "Connection failed",
          description: data.error,
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Connection test error:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to OpenHAB",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchItems = async (): Promise<OpenHABItem[]> => {
    try {
      const { data, error } = await supabase.functions.invoke("openhab-sync", {
        body: { action: "fetch-items" },
      });

      if (error) throw error;

      return data.items || [];
    } catch (error: any) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch OpenHAB items",
        variant: "destructive",
      });
      return [];
    }
  };

  const syncData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("openhab-sync", {
        body: { action: "sync-data" },
      });

      if (error) throw error;

      toast({
        title: "Sync complete",
        description: `Synced ${data.synced} of ${data.total} items`,
      });

      await loadConfig();
      return data;
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync data",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    config,
    isLoading,
    saveConfig,
    testConnection,
    fetchItems,
    syncData,
    reload: loadConfig,
  };
};
