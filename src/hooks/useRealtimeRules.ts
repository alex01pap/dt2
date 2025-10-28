import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Rule = Tables<"rules">;

export const useRealtimeRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial rules
    const loadRules = async () => {
      try {
        const { data, error } = await supabase
          .from("rules")
          .select("*")
          .order("priority", { ascending: true });

        if (error) throw error;
        setRules(data || []);
      } catch (error) {
        console.error("Error loading rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRules();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("rules-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rules",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRules((prev) => [...prev, payload.new as Rule]);
          } else if (payload.eventType === "UPDATE") {
            setRules((prev) =>
              prev.map((rule) =>
                rule.id === payload.new.id ? (payload.new as Rule) : rule
              )
            );
          } else if (payload.eventType === "DELETE") {
            setRules((prev) => prev.filter((rule) => rule.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rules, isLoading };
};
