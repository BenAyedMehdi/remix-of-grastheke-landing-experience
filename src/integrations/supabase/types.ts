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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      batch_lab_results: {
        Row: {
          batch_id: string
          category: string
          id: string
          limit_value: string | null
          parameter: string
          passed: boolean | null
          sort_order: number
          unit: string | null
          value: string | null
        }
        Insert: {
          batch_id: string
          category?: string
          id?: string
          limit_value?: string | null
          parameter: string
          passed?: boolean | null
          sort_order?: number
          unit?: string | null
          value?: string | null
        }
        Update: {
          batch_id?: string
          category?: string
          id?: string
          limit_value?: string | null
          parameter?: string
          passed?: boolean | null
          sort_order?: number
          unit?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_lab_results_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_photos: {
        Row: {
          batch_id: string
          caption: string | null
          created_at: string
          id: string
          sort_order: number
          storage_path: string
          taken_at: string | null
        }
        Insert: {
          batch_id: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          storage_path: string
          taken_at?: string | null
        }
        Update: {
          batch_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          storage_path?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_photos_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_reviews: {
        Row: {
          batch_id: string
          body: string
          consumption_method: string | null
          created_at: string
          display_name: string | null
          id: string
          rating_aroma: number | null
          rating_burn: number | null
          rating_consistency: number | null
          rating_effect: number | null
          rating_overall: number
          rating_taste: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["review_status"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_id: string
          body: string
          consumption_method?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          rating_aroma?: number | null
          rating_burn?: number | null
          rating_consistency?: number | null
          rating_effect?: number | null
          rating_overall: number
          rating_taste?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_id?: string
          body?: string
          consumption_method?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          rating_aroma?: number | null
          rating_burn?: number | null
          rating_consistency?: number | null
          rating_effect?: number | null
          rating_overall?: number
          rating_taste?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_reviews_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_terpenes: {
        Row: {
          batch_id: string
          id: string
          name: string
          note: string | null
          percent: number | null
          sort_order: number
        }
        Insert: {
          batch_id: string
          id?: string
          name: string
          note?: string | null
          percent?: number | null
          sort_order?: number
        }
        Update: {
          batch_id?: string
          id?: string
          name?: string
          note?: string | null
          percent?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "batch_terpenes_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_number: string
          best_before: string | null
          cbd_percent: number | null
          coa_issued_on: string | null
          coa_lab: string | null
          coa_number: string | null
          coa_path: string | null
          created_at: string
          created_by: string | null
          cultivar: string | null
          cultivation: string | null
          genetics: string | null
          harvest_date: string | null
          id: string
          irradiation: string | null
          moisture_percent: number | null
          notes: string | null
          origin: string | null
          packaged_date: string | null
          product_name: string
          product_slug: string | null
          status: string
          thc_percent: number | null
          total_terpenes_percent: number | null
          updated_at: string
          water_activity: number | null
        }
        Insert: {
          batch_number: string
          best_before?: string | null
          cbd_percent?: number | null
          coa_issued_on?: string | null
          coa_lab?: string | null
          coa_number?: string | null
          coa_path?: string | null
          created_at?: string
          created_by?: string | null
          cultivar?: string | null
          cultivation?: string | null
          genetics?: string | null
          harvest_date?: string | null
          id?: string
          irradiation?: string | null
          moisture_percent?: number | null
          notes?: string | null
          origin?: string | null
          packaged_date?: string | null
          product_name: string
          product_slug?: string | null
          status?: string
          thc_percent?: number | null
          total_terpenes_percent?: number | null
          updated_at?: string
          water_activity?: number | null
        }
        Update: {
          batch_number?: string
          best_before?: string | null
          cbd_percent?: number | null
          coa_issued_on?: string | null
          coa_lab?: string | null
          coa_number?: string | null
          coa_path?: string | null
          created_at?: string
          created_by?: string | null
          cultivar?: string | null
          cultivation?: string | null
          genetics?: string | null
          harvest_date?: string | null
          id?: string
          irradiation?: string | null
          moisture_percent?: number | null
          notes?: string | null
          origin?: string | null
          packaged_date?: string | null
          product_name?: string
          product_slug?: string | null
          status?: string
          thc_percent?: number | null
          total_terpenes_percent?: number | null
          updated_at?: string
          water_activity?: number | null
        }
        Relationships: []
      }
      gram_invites: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          label: string | null
          max_uses: number
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          label?: string | null
          max_uses?: number
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          label?: string | null
          max_uses?: number
          used_count?: number
        }
        Relationships: []
      }
      gram_members: {
        Row: {
          invite_code: string | null
          joined_at: string
          tier: string
          user_id: string
        }
        Insert: {
          invite_code?: string | null
          joined_at?: string
          tier?: string
          user_id: string
        }
        Update: {
          invite_code?: string | null
          joined_at?: string
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gram_members_invite_code_fkey"
            columns: ["invite_code"]
            isOneToOne: false
            referencedRelation: "gram_invites"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      review_verifications: {
        Row: {
          created_at: string
          order_number: string
          pharmacy: string | null
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          order_number: string
          pharmacy?: string | null
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          order_number?: string
          pharmacy?: string | null
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_verifications_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "batch_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string
          review_id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          review_id: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          review_id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "batch_reviews"
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
      ensure_profile: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_gram_member: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      redeem_gram_invite: { Args: { _code: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "staff" | "patient"
      review_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "staff", "patient"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
