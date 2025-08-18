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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          created_at: string
          id: string
          interested_user_email: string
          interested_user_name: string
          interested_user_phone: string | null
          message: string | null
          property_id: string
          property_owner_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          interested_user_email: string
          interested_user_name: string
          interested_user_phone?: string | null
          message?: string | null
          property_id: string
          property_owner_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          interested_user_email?: string
          interested_user_name?: string
          interested_user_phone?: string | null
          message?: string | null
          property_id?: string
          property_owner_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          availability_date: string | null
          availability_type: string
          balconies: number | null
          bathrooms: number | null
          bhk_type: string | null
          carpet_area: number | null
          city: string
          created_at: string
          description: string | null
          expected_price: number
          floor_no: number | null
          furnishing: string | null
          id: string
          images: string[] | null
          landmarks: string | null
          listing_type: string
          locality: string
          maintenance_charges: number | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_role: string | null
          pincode: string
          price_negotiable: boolean | null
          property_type: string
          rejection_reason: string | null
          security_deposit: number | null
          state: string
          status: string | null
          street_address: string | null
          super_area: number
          title: string
          total_floors: number | null
          updated_at: string
          user_id: string
          videos: string[] | null
        }
        Insert: {
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          availability_date?: string | null
          availability_type: string
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city: string
          created_at?: string
          description?: string | null
          expected_price: number
          floor_no?: number | null
          furnishing?: string | null
          id?: string
          images?: string[] | null
          landmarks?: string | null
          listing_type: string
          locality: string
          maintenance_charges?: number | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          pincode: string
          price_negotiable?: boolean | null
          property_type: string
          rejection_reason?: string | null
          security_deposit?: number | null
          state: string
          status?: string | null
          street_address?: string | null
          super_area: number
          title: string
          total_floors?: number | null
          updated_at?: string
          user_id: string
          videos?: string[] | null
        }
        Update: {
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          availability_date?: string | null
          availability_type?: string
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city?: string
          created_at?: string
          description?: string | null
          expected_price?: number
          floor_no?: number | null
          furnishing?: string | null
          id?: string
          images?: string[] | null
          landmarks?: string | null
          listing_type?: string
          locality?: string
          maintenance_charges?: number | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          pincode?: string
          price_negotiable?: boolean | null
          property_type?: string
          rejection_reason?: string | null
          security_deposit?: number | null
          state?: string
          status?: string | null
          street_address?: string | null
          super_area?: number
          title?: string
          total_floors?: number | null
          updated_at?: string
          user_id?: string
          videos?: string[] | null
        }
        Relationships: []
      }
      property_drafts: {
        Row: {
          balconies: number | null
          bathrooms: number | null
          bhk_type: string | null
          carpet_area: number | null
          city: string | null
          created_at: string | null
          description: string | null
          expected_price: number | null
          id: string
          images: string[] | null
          listing_type: string | null
          locality: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_role: string | null
          pincode: string | null
          property_type: string | null
          state: string | null
          status: string | null
          step_completed: number | null
          super_area: number | null
          title: string | null
          updated_at: string | null
          user_id: string
          videos: string[] | null
        }
        Insert: {
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          expected_price?: number | null
          id?: string
          images?: string[] | null
          listing_type?: string | null
          locality?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          pincode?: string | null
          property_type?: string | null
          state?: string | null
          status?: string | null
          step_completed?: number | null
          super_area?: number | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          videos?: string[] | null
        }
        Update: {
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          expected_price?: number | null
          id?: string
          images?: string[] | null
          listing_type?: string | null
          locality?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          pincode?: string | null
          property_type?: string | null
          state?: string | null
          status?: string | null
          step_completed?: number | null
          super_area?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          videos?: string[] | null
        }
        Relationships: []
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
      public_properties: {
        Row: {
          availability_date: string | null
          availability_type: string | null
          balconies: number | null
          bathrooms: number | null
          bhk_type: string | null
          carpet_area: number | null
          city: string | null
          created_at: string | null
          description: string | null
          expected_price: number | null
          floor_no: number | null
          furnishing: string | null
          id: string | null
          images: string[] | null
          landmarks: string | null
          listing_type: string | null
          locality: string | null
          maintenance_charges: number | null
          pincode: string | null
          price_negotiable: boolean | null
          property_type: string | null
          security_deposit: number | null
          state: string | null
          status: string | null
          street_address: string | null
          super_area: number | null
          title: string | null
          total_floors: number | null
          updated_at: string | null
          videos: string[] | null
        }
        Insert: {
          availability_date?: string | null
          availability_type?: string | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          expected_price?: number | null
          floor_no?: number | null
          furnishing?: string | null
          id?: string | null
          images?: string[] | null
          landmarks?: string | null
          listing_type?: string | null
          locality?: string | null
          maintenance_charges?: number | null
          pincode?: string | null
          price_negotiable?: boolean | null
          property_type?: string | null
          security_deposit?: number | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          super_area?: number | null
          title?: string | null
          total_floors?: number | null
          updated_at?: string | null
          videos?: string[] | null
        }
        Update: {
          availability_date?: string | null
          availability_type?: string | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          carpet_area?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          expected_price?: number | null
          floor_no?: number | null
          furnishing?: string | null
          id?: string | null
          images?: string[] | null
          landmarks?: string | null
          listing_type?: string | null
          locality?: string | null
          maintenance_charges?: number | null
          pincode?: string | null
          price_negotiable?: boolean | null
          property_type?: string | null
          security_deposit?: number | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          super_area?: number | null
          title?: string | null
          total_floors?: number | null
          updated_at?: string | null
          videos?: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_property_owner: {
        Args: { _property_id: string }
        Returns: string
      }
      get_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          raw_user_meta_data: Json
        }[]
      }
      has_current_user_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
