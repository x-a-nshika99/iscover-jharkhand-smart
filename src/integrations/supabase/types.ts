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
      bookings: {
        Row: {
          booking_date: string
          booking_type: string
          created_at: string
          id: string
          item_id: string
          quantity: number | null
          special_requests: string | null
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_type: string
          created_at?: string
          id?: string
          item_id: string
          quantity?: number | null
          special_requests?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_type?: string
          created_at?: string
          id?: string
          item_id?: string
          quantity?: number | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          price: number | null
          rating: number | null
          updated_at: string
          visitor_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          price?: number | null
          rating?: number | null
          updated_at?: string
          visitor_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          price?: number | null
          rating?: number | null
          updated_at?: string
          visitor_count?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          description: string
          event_date: string
          event_time: string | null
          expected_attendees: number | null
          highlights: string[] | null
          id: string
          image_url: string | null
          location: string
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          event_date: string
          event_time?: string | null
          expected_attendees?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          event_date?: string
          event_time?: string | null
          expected_attendees?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          artisan_name: string | null
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          rating: number | null
          stock_quantity: number | null
          updated_at: string
          village: string | null
        }
        Insert: {
          artisan_name?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          rating?: number | null
          stock_quantity?: number | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          artisan_name?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          rating?: number | null
          stock_quantity?: number | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          item_id: string
          item_type: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
