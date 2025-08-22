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
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          block_type: string
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          section_id: string | null
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          block_type: string
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_id?: string | null
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          block_type?: string
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_id?: string | null
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "page_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      content_elements: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          element_key: string
          element_type: string
          id: string
          images: string[] | null
          is_active: boolean | null
          page_location: string | null
          section_location: string | null
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          element_key: string
          element_type: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          page_location?: string | null
          section_location?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          element_key?: string
          element_type?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          page_location?: string | null
          section_location?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_pages: {
        Row: {
          content: Json | null
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          page_type: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          page_type?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          page_type?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          content_data: Json
          content_id: string
          content_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          version_number: number
        }
        Insert: {
          content_data: Json
          content_id: string
          content_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          version_number?: number
        }
        Update: {
          content_data?: Json
          content_id?: string
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          version_number?: number
        }
        Relationships: []
      }
      featured_properties: {
        Row: {
          created_at: string
          created_by: string | null
          featured_until: string | null
          id: string
          is_active: boolean | null
          property_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          featured_until?: string | null
          id?: string
          is_active?: boolean | null
          property_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          featured_until?: string | null
          id?: string
          is_active?: boolean | null
          property_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
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
      page_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_active: boolean | null
          page_id: string
          section_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          page_id: string
          section_type: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          page_id?: string
          section_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "content_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email_notifications: boolean | null
          full_name: string | null
          id: string
          location: Json | null
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: string | null
          whatsapp_opted_in: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          location?: Json | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          location?: Json | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Relationships: []
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
      property_audit_log: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_status: string
          old_status: string | null
          property_id: string
          reason: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          property_id: string
          reason?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          property_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_audit_log_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_audit_log_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
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
      regions: {
        Row: {
          code: string
          country_code: string
          created_at: string
          currency_code: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          code: string
          country_code: string
          created_at?: string
          currency_code?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          country_code?: string
          created_at?: string
          currency_code?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_role_audit_log: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_id?: string
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
      assign_admin_role_by_email: {
        Args: { _email: string }
        Returns: undefined
      }
      create_property_lead: {
        Args: {
          interested_user_email: string
          interested_user_name: string
          interested_user_phone?: string
          message?: string
          property_id: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_property_contact_info: {
        Args: { property_id: string }
        Returns: {
          contact_message: string
          owner_name: string
        }[]
      }
      get_property_owner: {
        Args: { _property_id: string }
        Returns: string
      }
      get_user_profile_with_role: {
        Args: { _user_id?: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          email_notifications: boolean
          full_name: string
          id: string
          location: Json
          phone: string
          preferences: Json
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
          verification_status: string
          whatsapp_opted_in: boolean
        }[]
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
      log_audit_event: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_new_values?: Json
          p_old_values?: Json
          p_record_id: string
          p_table_name: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: undefined
      }
      log_auth_event: {
        Args: {
          p_details?: string
          p_event_type: string
          p_ip_address?: unknown
          p_success?: boolean
          p_user_agent?: string
          p_user_email?: string
        }
        Returns: undefined
      }
      update_user_role: {
        Args:
          | {
              _new_role: Database["public"]["Enums"]["app_role"]
              _reason?: string
              _user_id: string
            }
          | {
              _new_role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "buyer" | "seller" | "consultant"
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
      app_role: ["admin", "user", "buyer", "seller", "consultant"],
    },
  },
} as const
