export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          parent_id: string | null
          position: Json | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          parent_id?: string | null
          position?: Json | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          position?: Json | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_twins: {
        Row: {
          building: string | null
          created_at: string
          id: string
          metadata: Json | null
          name: string
          size: string
          tags: string[] | null
          template_id: string
          updated_at: string
        }
        Insert: {
          building?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          size?: string
          tags?: string[] | null
          template_id: string
          updated_at?: string
        }
        Update: {
          building?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          size?: string
          tags?: string[] | null
          template_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          severity: Database["public"]["Enums"]["event_severity"]
          source: string | null
          source_id: string | null
          title: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["event_severity"]
          source?: string | null
          source_id?: string | null
          title: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["event_severity"]
          source?: string | null
          source_id?: string | null
          title?: string
        }
        Relationships: []
      }
      openhab_config: {
        Row: {
          api_token: string | null
          created_at: string | null
          enabled: boolean | null
          id: string
          last_sync_at: string | null
          openhab_url: string
          sync_interval: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_token?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync_at?: string | null
          openhab_url: string
          sync_interval?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_token?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync_at?: string | null
          openhab_url?: string
          sync_interval?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      openhab_items: {
        Row: {
          config_id: string
          created_at: string | null
          id: string
          last_synced_at: string | null
          last_value: string | null
          mapping_type: string | null
          openhab_item_label: string | null
          openhab_item_name: string
          openhab_item_type: string
          sensor_id: string | null
          sync_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_id: string
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          last_value?: string | null
          mapping_type?: string | null
          openhab_item_label?: string | null
          openhab_item_name: string
          openhab_item_type: string
          sensor_id?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_id?: string
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          last_value?: string | null
          mapping_type?: string | null
          openhab_item_label?: string | null
          openhab_item_name?: string
          openhab_item_type?: string
          sensor_id?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "openhab_items_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "openhab_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openhab_items_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      openhab_sync_log: {
        Row: {
          config_id: string
          created_at: string | null
          error_message: string | null
          id: string
          items_synced: number | null
          status: string
          sync_type: string
        }
        Insert: {
          config_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_synced?: number | null
          status: string
          sync_type: string
        }
        Update: {
          config_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_synced?: number | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "openhab_sync_log_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "openhab_config"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          id: string
          last_triggered_at: string | null
          name: string
          priority: number | null
          status: Database["public"]["Enums"]["rule_status"]
          updated_at: string
          window_config: Json | null
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          last_triggered_at?: string | null
          name: string
          priority?: number | null
          status?: Database["public"]["Enums"]["rule_status"]
          updated_at?: string
          window_config?: Json | null
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          last_triggered_at?: string | null
          name?: string
          priority?: number | null
          status?: Database["public"]["Enums"]["rule_status"]
          updated_at?: string
          window_config?: Json | null
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          completed_at: string | null
          configuration: Json
          created_at: string
          description: string | null
          id: string
          name: string
          results: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["scenario_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          results?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["scenario_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          results?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["scenario_status"]
          updated_at?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          id: string
          metadata: Json | null
          quality_score: number | null
          recorded_at: string
          sensor_id: string
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          recorded_at?: string
          sensor_id: string
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          recorded_at?: string
          sensor_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      sensors: {
        Row: {
          asset_id: string | null
          calibration: Json | null
          created_at: string
          id: string
          last_reading: number | null
          last_reading_at: string | null
          location: Json | null
          name: string
          status: Database["public"]["Enums"]["sensor_status"]
          thresholds: Json | null
          type: Database["public"]["Enums"]["sensor_type"]
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          calibration?: Json | null
          created_at?: string
          id?: string
          last_reading?: number | null
          last_reading_at?: string | null
          location?: Json | null
          name: string
          status?: Database["public"]["Enums"]["sensor_status"]
          thresholds?: Json | null
          type: Database["public"]["Enums"]["sensor_type"]
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          calibration?: Json | null
          created_at?: string
          id?: string
          last_reading?: number | null
          last_reading_at?: string | null
          location?: Json | null
          name?: string
          status?: Database["public"]["Enums"]["sensor_status"]
          thresholds?: Json | null
          type?: Database["public"]["Enums"]["sensor_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensors_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_sync_openhab: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      asset_type: "building" | "room" | "equipment" | "sensor" | "system"
      event_severity: "info" | "warning" | "error" | "critical"
      rule_status: "active" | "inactive" | "triggered"
      scenario_status: "draft" | "running" | "completed" | "failed"
      sensor_status: "online" | "offline" | "warning" | "critical"
      sensor_type:
        | "temperature"
        | "pressure"
        | "flow"
        | "vibration"
        | "humidity"
        | "air_quality"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      asset_type: ["building", "room", "equipment", "sensor", "system"],
      event_severity: ["info", "warning", "error", "critical"],
      rule_status: ["active", "inactive", "triggered"],
      scenario_status: ["draft", "running", "completed", "failed"],
      sensor_status: ["online", "offline", "warning", "critical"],
      sensor_type: [
        "temperature",
        "pressure",
        "flow",
        "vibration",
        "humidity",
        "air_quality",
      ],
    },
  },
} as const
