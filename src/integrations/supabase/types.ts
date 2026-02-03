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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cookie_of_week: {
        Row: {
          cookie_name: string
          discount_percent: number
          id: string
          is_active: boolean
          valid_from: string
          valid_until: string
        }
        Insert: {
          cookie_name: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          valid_from?: string
          valid_until: string
        }
        Update: {
          cookie_name?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      cookie_reviews: {
        Row: {
          cookie_name: string
          created_at: string
          id: string
          profile_id: string | null
          rating: number
          review_text: string | null
        }
        Insert: {
          cookie_name: string
          created_at?: string
          id?: string
          profile_id?: string | null
          rating: number
          review_text?: string | null
        }
        Update: {
          cookie_name?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          rating?: number
          review_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cookie_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_packages: {
        Row: {
          cookies: Json
          created_at: string
          id: string
          is_template: boolean
          name: string
          profile_id: string | null
          total_price: number
        }
        Insert: {
          cookies: Json
          created_at?: string
          id?: string
          is_template?: boolean
          name: string
          profile_id?: string | null
          total_price: number
        }
        Update: {
          cookies?: Json
          created_at?: string
          id?: string
          is_template?: boolean
          name?: string
          profile_id?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "gift_packages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string | null
          id: string
          is_active: boolean
          phone: string | null
          subscribed_at: string
        }
        Insert: {
          email?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          cookie_name: string
          id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          cookie_name: string
          id?: string
          order_id: string
          price: number
          quantity: number
        }
        Update: {
          cookie_name?: string
          id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          profile_id: string | null
          status: string
          total_amount: number
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          profile_id?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          profile_id?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_tokens: {
        Row: {
          code_hash: string
          created_at: string
          email: string
          expires_at: string
          id: string
          verified: boolean
        }
        Insert: {
          code_hash: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          verified?: boolean
        }
        Update: {
          code_hash?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          notes: string | null
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otp_tokens: { Args: never; Returns: undefined }
      get_my_order_items: {
        Args: { order_uuid: string }
        Returns: {
          cookie_name: string
          id: string
          price: number
          quantity: number
        }[]
      }
      get_my_orders: {
        Args: never
        Returns: {
          address: string
          city: string
          created_at: string
          full_name: string
          id: string
          status: string
          total_amount: number
        }[]
      }
      get_my_profile: {
        Args: never
        Returns: {
          address: string
          city: string
          full_name: string
          id: string
          notes: string
          phone: string
        }[]
      }
      upsert_my_profile: {
        Args: {
          p_address?: string
          p_city?: string
          p_full_name?: string
          p_notes?: string
          p_phone: string
        }
        Returns: {
          address: string
          city: string
          full_name: string
          id: string
          notes: string
          phone: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
