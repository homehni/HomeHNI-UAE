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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          conversation_type: string
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_type: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_bot: boolean
          message: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_bot?: boolean
          message: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_bot?: boolean
          message?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          comments: string | null
          content_version_id: string
          created_at: string
          id: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          content_version_id: string
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          content_version_id?: string
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_approvals_content_version_id_fkey"
            columns: ["content_version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
        ]
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
      developer_pages: {
        Row: {
          about_content: string | null
          about_images: Json | null
          about_title: string | null
          amenities: Json | null
          awards: Json | null
          company_name: string
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_website: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          floor_plans: Json | null
          founded_year: string | null
          gallery_images: Json | null
          headquarters: string | null
          hero_cta_text: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          hero_video_url: string | null
          highlights: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          key_projects: Json | null
          location_description: string | null
          location_highlights: Json | null
          location_map_url: string | null
          location_title: string | null
          logo_url: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          primary_project: Json | null
          slug: string
          specializations: Json | null
          stats: Json | null
          tagline: string | null
          updated_at: string | null
          video_section_subtitle: string | null
          video_section_title: string | null
          video_thumbnail_url: string | null
          video_url: string | null
        }
        Insert: {
          about_content?: string | null
          about_images?: Json | null
          about_title?: string | null
          amenities?: Json | null
          awards?: Json | null
          company_name: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          floor_plans?: Json | null
          founded_year?: string | null
          gallery_images?: Json | null
          headquarters?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          highlights?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          key_projects?: Json | null
          location_description?: string | null
          location_highlights?: Json | null
          location_map_url?: string | null
          location_title?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          primary_project?: Json | null
          slug: string
          specializations?: Json | null
          stats?: Json | null
          tagline?: string | null
          updated_at?: string | null
          video_section_subtitle?: string | null
          video_section_title?: string | null
          video_thumbnail_url?: string | null
          video_url?: string | null
        }
        Update: {
          about_content?: string | null
          about_images?: Json | null
          about_title?: string | null
          amenities?: Json | null
          awards?: Json | null
          company_name?: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          floor_plans?: Json | null
          founded_year?: string | null
          gallery_images?: Json | null
          headquarters?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          highlights?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          key_projects?: Json | null
          location_description?: string | null
          location_highlights?: Json | null
          location_map_url?: string | null
          location_title?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          primary_project?: Json | null
          slug?: string
          specializations?: Json | null
          stats?: Json | null
          tagline?: string | null
          updated_at?: string | null
          video_section_subtitle?: string | null
          video_section_title?: string | null
          video_thumbnail_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string | null
          email_type: string
          error_message: string | null
          id: string
          processed_at: string | null
          recipient_email: string
          recipient_name: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          token: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          token: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      employee_payouts: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          description: string | null
          employee_id: string
          id: string
          paid_at: string | null
          payout_type: Database["public"]["Enums"]["transaction_type"]
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requested_at: string
          requested_by: string | null
          status: Database["public"]["Enums"]["payout_status"]
          stripe_payment_intent_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          description?: string | null
          employee_id: string
          id?: string
          paid_at?: string | null
          payout_type: Database["public"]["Enums"]["transaction_type"]
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_payment_intent_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          paid_at?: string | null
          payout_type?: Database["public"]["Enums"]["transaction_type"]
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_payment_intent_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_payouts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_payouts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "employee_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string | null
          employee_id: string
          id: string
          reference_number: string | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id: string
          id?: string
          reference_number?: string | null
          transaction_date?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          reference_number?: string | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "employee_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          department: string
          designation: string
          email: string
          employee_id: string
          full_name: string
          id: string
          join_date: string
          manager_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          salary: number | null
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          department: string
          designation: string
          email: string
          employee_id: string
          full_name: string
          id?: string
          join_date: string
          manager_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          department?: string
          designation?: string
          email?: string
          employee_id?: string
          full_name?: string
          id?: string
          join_date?: string
          manager_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
        ]
      }
      lead_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          lead_id: string
          message: string
          sender_id: string
          sender_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          lead_id: string
          message: string
          sender_id: string
          sender_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          lead_id?: string
          message?: string
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          created_at: string
          id: string
          interested_user_email: string
          interested_user_name: string
          interested_user_phone: string | null
          lead_type: string | null
          listing_type: string | null
          message: string | null
          property_id: string | null
          property_owner_id: string | null
          property_type: string | null
          status: string | null
          updated_at: string
          whatsapp_opted_in: boolean | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          interested_user_email: string
          interested_user_name: string
          interested_user_phone?: string | null
          lead_type?: string | null
          listing_type?: string | null
          message?: string | null
          property_id?: string | null
          property_owner_id?: string | null
          property_type?: string | null
          status?: string | null
          updated_at?: string
          whatsapp_opted_in?: boolean | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          interested_user_email?: string
          interested_user_name?: string
          interested_user_phone?: string | null
          lead_type?: string | null
          listing_type?: string | null
          message?: string | null
          property_id?: string | null
          property_owner_id?: string | null
          property_type?: string | null
          status?: string | null
          updated_at?: string
          whatsapp_opted_in?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
      payments: {
        Row: {
          amount_paise: number
          amount_rupees: number
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          invoice_number: string | null
          metadata: Json | null
          payment_date: string
          payment_id: string
          payment_method: string | null
          plan_duration: string | null
          plan_name: string
          plan_type: string | null
          property_id: string | null
          razorpay_order_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paise: number
          amount_rupees: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          payment_date?: string
          payment_id: string
          payment_method?: string | null
          plan_duration?: string | null
          plan_name: string
          plan_type?: string | null
          property_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paise?: number
          amount_rupees?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          payment_date?: string
          payment_id?: string
          payment_method?: string | null
          plan_duration?: string | null
          plan_name?: string
          plan_type?: string | null
          property_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
          free_contact_uses: number | null
          full_name: string | null
          id: string
          last_contact_use_at: string | null
          location: Json | null
          phone: string | null
          preferences: Json | null
          role: string | null
          total_contact_uses: number | null
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
          free_contact_uses?: number | null
          full_name?: string | null
          id?: string
          last_contact_use_at?: string | null
          location?: Json | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          total_contact_uses?: number | null
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
          free_contact_uses?: number | null
          full_name?: string | null
          id?: string
          last_contact_use_at?: string | null
          location?: Json | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          total_contact_uses?: number | null
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
          additional_documents: Json | null
          additional_info: Json | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          air_conditioner: string | null
          amenities: Json | null
          approved_by: string | null
          availability_date: string | null
          availability_type: string
          available_services: Json | null
          balconies: number | null
          bathrooms: number | null
          bhk_type: string | null
          booking_amount: number | null
          boundary_wall: string | null
          building_type: string | null
          carpet_area: number | null
          categorized_images: Json | null
          ceiling_height: string | null
          children_play_area: string | null
          city: string
          club_house: string | null
          corner_plot: boolean | null
          corner_property: boolean | null
          created_at: string
          current_property_condition: string | null
          description: string | null
          directions_tip: string | null
          electricity_connection: string | null
          entrance_width: string | null
          expected_price: number
          facing_direction: string | null
          fire_safety: string | null
          floor_no: number | null
          floor_type: string | null
          floors_allowed: number | null
          furnishing: string | null
          furnishing_status: string | null
          gas_pipeline: string | null
          gated_community: boolean | null
          gated_project: string | null
          gated_security: boolean | null
          gym: string | null
          home_loan_available: boolean | null
          house_keeping: string | null
          id: string
          images: string[] | null
          intercom: string | null
          internet_services: string | null
          is_featured: boolean
          is_premium: boolean | null
          is_visible: boolean | null
          land_type: string | null
          landmarks: string | null
          lift: string | null
          listing_type: string
          loading_facility: boolean | null
          locality: string
          maintenance_charges: number | null
          non_veg_allowed: boolean | null
          on_main_road: boolean | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_role: string | null
          ownership_type: string | null
          park: string | null
          parking: string | null
          pet_allowed: boolean | null
          pincode: string
          plot_area: number | null
          plot_area_unit: string | null
          plot_length: number | null
          plot_shape: string | null
          plot_width: number | null
          possession_date: string | null
          power_backup: string | null
          power_load: string | null
          price_negotiable: boolean | null
          property_age: string | null
          property_type: string
          rain_water_harvesting: string | null
          registration_status: string | null
          rejection_reason: string | null
          rental_status: string | null
          road_facing: string | null
          road_width: number | null
          secondary_phone: string | null
          security: string | null
          security_deposit: number | null
          servant_room: string | null
          sewage_connection: string | null
          sewage_treatment_plant: string | null
          shopping_center: string | null
          space_type: string | null
          state: string
          status: string | null
          street_address: string | null
          sub_division: string | null
          super_area: number
          super_built_up_area: number | null
          survey_number: string | null
          swimming_pool: string | null
          title: string
          total_floors: number | null
          updated_at: string
          user_id: string
          videos: string[] | null
          village_name: string | null
          visitor_parking: string | null
          water_storage_facility: string | null
          water_supply: string | null
          who_will_show: string | null
          wifi: string | null
        }
        Insert: {
          additional_documents?: Json | null
          additional_info?: Json | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          air_conditioner?: string | null
          amenities?: Json | null
          approved_by?: string | null
          availability_date?: string | null
          availability_type: string
          available_services?: Json | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          booking_amount?: number | null
          boundary_wall?: string | null
          building_type?: string | null
          carpet_area?: number | null
          categorized_images?: Json | null
          ceiling_height?: string | null
          children_play_area?: string | null
          city: string
          club_house?: string | null
          corner_plot?: boolean | null
          corner_property?: boolean | null
          created_at?: string
          current_property_condition?: string | null
          description?: string | null
          directions_tip?: string | null
          electricity_connection?: string | null
          entrance_width?: string | null
          expected_price: number
          facing_direction?: string | null
          fire_safety?: string | null
          floor_no?: number | null
          floor_type?: string | null
          floors_allowed?: number | null
          furnishing?: string | null
          furnishing_status?: string | null
          gas_pipeline?: string | null
          gated_community?: boolean | null
          gated_project?: string | null
          gated_security?: boolean | null
          gym?: string | null
          home_loan_available?: boolean | null
          house_keeping?: string | null
          id?: string
          images?: string[] | null
          intercom?: string | null
          internet_services?: string | null
          is_featured?: boolean
          is_premium?: boolean | null
          is_visible?: boolean | null
          land_type?: string | null
          landmarks?: string | null
          lift?: string | null
          listing_type: string
          loading_facility?: boolean | null
          locality: string
          maintenance_charges?: number | null
          non_veg_allowed?: boolean | null
          on_main_road?: boolean | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          ownership_type?: string | null
          park?: string | null
          parking?: string | null
          pet_allowed?: boolean | null
          pincode: string
          plot_area?: number | null
          plot_area_unit?: string | null
          plot_length?: number | null
          plot_shape?: string | null
          plot_width?: number | null
          possession_date?: string | null
          power_backup?: string | null
          power_load?: string | null
          price_negotiable?: boolean | null
          property_age?: string | null
          property_type: string
          rain_water_harvesting?: string | null
          registration_status?: string | null
          rejection_reason?: string | null
          rental_status?: string | null
          road_facing?: string | null
          road_width?: number | null
          secondary_phone?: string | null
          security?: string | null
          security_deposit?: number | null
          servant_room?: string | null
          sewage_connection?: string | null
          sewage_treatment_plant?: string | null
          shopping_center?: string | null
          space_type?: string | null
          state: string
          status?: string | null
          street_address?: string | null
          sub_division?: string | null
          super_area: number
          super_built_up_area?: number | null
          survey_number?: string | null
          swimming_pool?: string | null
          title: string
          total_floors?: number | null
          updated_at?: string
          user_id: string
          videos?: string[] | null
          village_name?: string | null
          visitor_parking?: string | null
          water_storage_facility?: string | null
          water_supply?: string | null
          who_will_show?: string | null
          wifi?: string | null
        }
        Update: {
          additional_documents?: Json | null
          additional_info?: Json | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          air_conditioner?: string | null
          amenities?: Json | null
          approved_by?: string | null
          availability_date?: string | null
          availability_type?: string
          available_services?: Json | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          booking_amount?: number | null
          boundary_wall?: string | null
          building_type?: string | null
          carpet_area?: number | null
          categorized_images?: Json | null
          ceiling_height?: string | null
          children_play_area?: string | null
          city?: string
          club_house?: string | null
          corner_plot?: boolean | null
          corner_property?: boolean | null
          created_at?: string
          current_property_condition?: string | null
          description?: string | null
          directions_tip?: string | null
          electricity_connection?: string | null
          entrance_width?: string | null
          expected_price?: number
          facing_direction?: string | null
          fire_safety?: string | null
          floor_no?: number | null
          floor_type?: string | null
          floors_allowed?: number | null
          furnishing?: string | null
          furnishing_status?: string | null
          gas_pipeline?: string | null
          gated_community?: boolean | null
          gated_project?: string | null
          gated_security?: boolean | null
          gym?: string | null
          home_loan_available?: boolean | null
          house_keeping?: string | null
          id?: string
          images?: string[] | null
          intercom?: string | null
          internet_services?: string | null
          is_featured?: boolean
          is_premium?: boolean | null
          is_visible?: boolean | null
          land_type?: string | null
          landmarks?: string | null
          lift?: string | null
          listing_type?: string
          loading_facility?: boolean | null
          locality?: string
          maintenance_charges?: number | null
          non_veg_allowed?: boolean | null
          on_main_road?: boolean | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          ownership_type?: string | null
          park?: string | null
          parking?: string | null
          pet_allowed?: boolean | null
          pincode?: string
          plot_area?: number | null
          plot_area_unit?: string | null
          plot_length?: number | null
          plot_shape?: string | null
          plot_width?: number | null
          possession_date?: string | null
          power_backup?: string | null
          power_load?: string | null
          price_negotiable?: boolean | null
          property_age?: string | null
          property_type?: string
          rain_water_harvesting?: string | null
          registration_status?: string | null
          rejection_reason?: string | null
          rental_status?: string | null
          road_facing?: string | null
          road_width?: number | null
          secondary_phone?: string | null
          security?: string | null
          security_deposit?: number | null
          servant_room?: string | null
          sewage_connection?: string | null
          sewage_treatment_plant?: string | null
          shopping_center?: string | null
          space_type?: string | null
          state?: string
          status?: string | null
          street_address?: string | null
          sub_division?: string | null
          super_area?: number
          super_built_up_area?: number | null
          survey_number?: string | null
          swimming_pool?: string | null
          title?: string
          total_floors?: number | null
          updated_at?: string
          user_id?: string
          videos?: string[] | null
          village_name?: string | null
          visitor_parking?: string | null
          water_storage_facility?: string | null
          water_supply?: string | null
          who_will_show?: string | null
          wifi?: string | null
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
        ]
      }
      property_contacts: {
        Row: {
          city: string
          created_at: string
          email: string
          id: string
          listing_type: string | null
          name: string
          phone: string
          property_type: string | null
          updated_at: string
          whatsapp_opted_in: boolean | null
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          id?: string
          listing_type?: string | null
          name: string
          phone: string
          property_type?: string | null
          updated_at?: string
          whatsapp_opted_in?: boolean | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          id?: string
          listing_type?: string | null
          name?: string
          phone?: string
          property_type?: string | null
          updated_at?: string
          whatsapp_opted_in?: boolean | null
        }
        Relationships: []
      }
      property_drafts: {
        Row: {
          additional_info: Json | null
          air_conditioner: string | null
          apartment_name: string | null
          apartment_type: string | null
          approved_by: string | null
          available_from: string | null
          balconies: number | null
          bathrooms: number | null
          bhk_type: string | null
          boundary_wall: string | null
          building_type: string | null
          built_up_area: number | null
          carpet_area: number | null
          categorized_images: Json | null
          ceiling_height: string | null
          children_play_area: string | null
          city: string | null
          club_house: string | null
          corner_plot: boolean | null
          corner_property: boolean | null
          created_at: string | null
          current_property_condition: string | null
          current_step: number | null
          description: string | null
          directions_tip: string | null
          electricity_connection: string | null
          entrance_width: string | null
          expected_deposit: number | null
          expected_price: number | null
          expected_rent: number | null
          facing: string | null
          fire_safety: string | null
          floor_no: number | null
          floors_allowed: number | null
          furnishing: string | null
          furnishing_status: string | null
          gas_pipeline: string | null
          gated_community: boolean | null
          gated_project: string | null
          gated_security: string | null
          gym: string | null
          house_keeping: string | null
          id: string
          images: string[] | null
          intercom: string | null
          internet_services: string | null
          is_completed: boolean | null
          land_type: string | null
          landmark: string | null
          lift: string | null
          listing_type: string
          loading_facility: boolean | null
          locality: string | null
          monthly_maintenance: string | null
          more_similar_units: boolean | null
          non_veg_allowed: boolean | null
          on_main_road: boolean | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          ownership_type: string | null
          park: string | null
          parking: string | null
          pet_allowed: boolean | null
          pincode: string | null
          plot_area: number | null
          plot_area_unit: string | null
          plot_length: number | null
          plot_shape: string | null
          plot_width: number | null
          possession_date: string | null
          power_backup: string | null
          power_load: string | null
          preferred_tenant: string | null
          price_negotiable: boolean | null
          property_age: string | null
          property_type: string
          rain_water_harvesting: string | null
          rent_negotiable: boolean | null
          road_facing: string | null
          road_width: number | null
          schedule_info: Json | null
          secondary_phone: string | null
          security: string | null
          servant_room: string | null
          sewage_connection: string | null
          sewage_treatment_plant: string | null
          shopping_center: string | null
          society_name: string | null
          space_type: string | null
          state: string | null
          sub_division: string | null
          super_built_up_area: number | null
          survey_number: string | null
          swimming_pool: string | null
          total_floors: number | null
          updated_at: string | null
          user_id: string | null
          video: string | null
          village_name: string | null
          visitor_parking: string | null
          water_storage_facility: string | null
          water_supply: string | null
          whatsapp_updates: boolean | null
          who_will_show: string | null
          wifi: string | null
        }
        Insert: {
          additional_info?: Json | null
          air_conditioner?: string | null
          apartment_name?: string | null
          apartment_type?: string | null
          approved_by?: string | null
          available_from?: string | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          boundary_wall?: string | null
          building_type?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          categorized_images?: Json | null
          ceiling_height?: string | null
          children_play_area?: string | null
          city?: string | null
          club_house?: string | null
          corner_plot?: boolean | null
          corner_property?: boolean | null
          created_at?: string | null
          current_property_condition?: string | null
          current_step?: number | null
          description?: string | null
          directions_tip?: string | null
          electricity_connection?: string | null
          entrance_width?: string | null
          expected_deposit?: number | null
          expected_price?: number | null
          expected_rent?: number | null
          facing?: string | null
          fire_safety?: string | null
          floor_no?: number | null
          floors_allowed?: number | null
          furnishing?: string | null
          furnishing_status?: string | null
          gas_pipeline?: string | null
          gated_community?: boolean | null
          gated_project?: string | null
          gated_security?: string | null
          gym?: string | null
          house_keeping?: string | null
          id?: string
          images?: string[] | null
          intercom?: string | null
          internet_services?: string | null
          is_completed?: boolean | null
          land_type?: string | null
          landmark?: string | null
          lift?: string | null
          listing_type: string
          loading_facility?: boolean | null
          locality?: string | null
          monthly_maintenance?: string | null
          more_similar_units?: boolean | null
          non_veg_allowed?: boolean | null
          on_main_road?: boolean | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          ownership_type?: string | null
          park?: string | null
          parking?: string | null
          pet_allowed?: boolean | null
          pincode?: string | null
          plot_area?: number | null
          plot_area_unit?: string | null
          plot_length?: number | null
          plot_shape?: string | null
          plot_width?: number | null
          possession_date?: string | null
          power_backup?: string | null
          power_load?: string | null
          preferred_tenant?: string | null
          price_negotiable?: boolean | null
          property_age?: string | null
          property_type: string
          rain_water_harvesting?: string | null
          rent_negotiable?: boolean | null
          road_facing?: string | null
          road_width?: number | null
          schedule_info?: Json | null
          secondary_phone?: string | null
          security?: string | null
          servant_room?: string | null
          sewage_connection?: string | null
          sewage_treatment_plant?: string | null
          shopping_center?: string | null
          society_name?: string | null
          space_type?: string | null
          state?: string | null
          sub_division?: string | null
          super_built_up_area?: number | null
          survey_number?: string | null
          swimming_pool?: string | null
          total_floors?: number | null
          updated_at?: string | null
          user_id?: string | null
          video?: string | null
          village_name?: string | null
          visitor_parking?: string | null
          water_storage_facility?: string | null
          water_supply?: string | null
          whatsapp_updates?: boolean | null
          who_will_show?: string | null
          wifi?: string | null
        }
        Update: {
          additional_info?: Json | null
          air_conditioner?: string | null
          apartment_name?: string | null
          apartment_type?: string | null
          approved_by?: string | null
          available_from?: string | null
          balconies?: number | null
          bathrooms?: number | null
          bhk_type?: string | null
          boundary_wall?: string | null
          building_type?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          categorized_images?: Json | null
          ceiling_height?: string | null
          children_play_area?: string | null
          city?: string | null
          club_house?: string | null
          corner_plot?: boolean | null
          corner_property?: boolean | null
          created_at?: string | null
          current_property_condition?: string | null
          current_step?: number | null
          description?: string | null
          directions_tip?: string | null
          electricity_connection?: string | null
          entrance_width?: string | null
          expected_deposit?: number | null
          expected_price?: number | null
          expected_rent?: number | null
          facing?: string | null
          fire_safety?: string | null
          floor_no?: number | null
          floors_allowed?: number | null
          furnishing?: string | null
          furnishing_status?: string | null
          gas_pipeline?: string | null
          gated_community?: boolean | null
          gated_project?: string | null
          gated_security?: string | null
          gym?: string | null
          house_keeping?: string | null
          id?: string
          images?: string[] | null
          intercom?: string | null
          internet_services?: string | null
          is_completed?: boolean | null
          land_type?: string | null
          landmark?: string | null
          lift?: string | null
          listing_type?: string
          loading_facility?: boolean | null
          locality?: string | null
          monthly_maintenance?: string | null
          more_similar_units?: boolean | null
          non_veg_allowed?: boolean | null
          on_main_road?: boolean | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          ownership_type?: string | null
          park?: string | null
          parking?: string | null
          pet_allowed?: boolean | null
          pincode?: string | null
          plot_area?: number | null
          plot_area_unit?: string | null
          plot_length?: number | null
          plot_shape?: string | null
          plot_width?: number | null
          possession_date?: string | null
          power_backup?: string | null
          power_load?: string | null
          preferred_tenant?: string | null
          price_negotiable?: boolean | null
          property_age?: string | null
          property_type?: string
          rain_water_harvesting?: string | null
          rent_negotiable?: boolean | null
          road_facing?: string | null
          road_width?: number | null
          schedule_info?: Json | null
          secondary_phone?: string | null
          security?: string | null
          servant_room?: string | null
          sewage_connection?: string | null
          sewage_treatment_plant?: string | null
          shopping_center?: string | null
          society_name?: string | null
          space_type?: string | null
          state?: string | null
          sub_division?: string | null
          super_built_up_area?: number | null
          survey_number?: string | null
          swimming_pool?: string | null
          total_floors?: number | null
          updated_at?: string | null
          user_id?: string | null
          video?: string | null
          village_name?: string | null
          visitor_parking?: string | null
          water_storage_facility?: string | null
          water_supply?: string | null
          whatsapp_updates?: boolean | null
          who_will_show?: string | null
          wifi?: string | null
        }
        Relationships: []
      }
      property_submissions: {
        Row: {
          city: string | null
          created_at: string
          id: string
          payload: Json
          rental_status: string | null
          state: string | null
          status: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          payload?: Json
          rental_status?: string | null
          state?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          payload?: Json
          rental_status?: string | null
          state?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
      role_permissions: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"]
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action: Database["public"]["Enums"]["permission_action"]
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"]
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      services: {
        Row: {
          additional_data: Json | null
          amount: number | null
          city: string | null
          country: string | null
          created_at: string
          details: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          service_subtype: string | null
          service_type: string
          status: string | null
          updated_at: string
          user_id: string | null
          whatsapp_opted_in: boolean | null
        }
        Insert: {
          additional_data?: Json | null
          amount?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          details?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          service_subtype?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Update: {
          additional_data?: Json | null
          amount?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          details?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          service_subtype?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
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
      user_sessions: {
        Row: {
          id: string
          ip_address: unknown
          session_end: string | null
          session_start: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: unknown
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: unknown
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role_by_email: {
        Args: { _email: string }
        Returns: undefined
      }
      auto_approve_pending_properties: { Args: never; Returns: number }
      can_contact_owner: { Args: { user_uuid: string }; Returns: boolean }
      check_security_status: {
        Args: never
        Returns: {
          policy_count: number
          rls_enabled: boolean
          table_name: string
        }[]
      }
      create_contact_lead: {
        Args: {
          p_message?: string
          p_property_id: string
          p_user_email: string
          p_user_name: string
          p_user_phone?: string
        }
        Returns: string
      }
      create_page_with_sections: {
        Args: {
          is_published?: boolean
          meta_description?: string
          meta_keywords?: string[]
          meta_title?: string
          page_slug?: string
          page_title: string
          sections_data?: Json
          user_id?: string
        }
        Returns: {
          page_id: string
          slug: string
        }[]
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
      detect_suspicious_activity: { Args: never; Returns: undefined }
      does_auth_user_exist: { Args: { _email: string }; Returns: boolean }
      ensure_unique_slug: { Args: { base_slug: string }; Returns: string }
      generate_verification_token: {
        Args: { p_email: string; p_user_id: string }
        Returns: string
      }
      get_available_roles: {
        Args: never
        Returns: {
          description: string
          display_name: string
          role_name: string
        }[]
      }
      get_contacted_properties_with_owners: {
        Args: { p_user_email: string }
        Returns: {
          city: string
          contact_date: string
          expected_price: number
          images: string[]
          lead_message: string
          listing_type: string
          locality: string
          owner_email: string
          owner_name: string
          owner_phone: string
          property_created_at: string
          property_id: string
          property_title: string
          property_type: string
          state: string
        }[]
      }
      get_current_employee_id: { Args: never; Returns: string }
      get_current_user_email: { Args: never; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_property_contact_info: {
        Args: { property_id: string }
        Returns: {
          contact_message: string
          owner_name: string
        }[]
      }
      get_property_owner: { Args: { _property_id: string }; Returns: string }
      get_property_owner_contact: {
        Args: { property_id: string }
        Returns: {
          owner_email: string
          owner_name: string
          owner_phone: string
          property_title: string
        }[]
      }
      get_public_pg_hostel_properties: {
        Args: never
        Returns: {
          amenities: Json
          available_from: string
          available_services: Json
          city: string
          created_at: string
          description: string
          expected_deposit: number
          expected_rent: number
          food_included: boolean
          gate_closing_time: string
          id: string
          images: string[]
          landmark: string
          locality: string
          parking: string
          place_available_for: string
          preferred_guests: string
          property_type: string
          state: string
          status: string
          title: string
          updated_at: string
          videos: string[]
        }[]
      }
      get_public_properties: {
        Args: never
        Returns: {
          additional_documents: Json
          air_conditioner: string
          amenities: Json
          availability_date: string
          availability_type: string
          balconies: number
          bathrooms: number
          bhk_type: string
          booking_amount: number
          carpet_area: number
          children_play_area: string
          city: string
          club_house: string
          created_at: string
          current_property_condition: string
          description: string
          directions_tip: string
          expected_price: number
          facing_direction: string
          fire_safety: string
          floor_no: number
          floor_type: string
          furnishing: string
          gas_pipeline: string
          gated_security: boolean
          gym: string
          home_loan_available: boolean
          house_keeping: string
          id: string
          images: string[]
          intercom: string
          internet_services: string
          is_featured: boolean
          is_premium: boolean
          landmarks: string
          lift: string
          listing_type: string
          locality: string
          maintenance_charges: number
          non_veg_allowed: boolean
          park: string
          parking: string
          pet_allowed: boolean
          pincode: string
          plot_area_unit: string
          power_backup: string
          price_negotiable: boolean
          property_age: string
          property_type: string
          rain_water_harvesting: string
          registration_status: string
          secondary_phone: string
          security: string
          security_deposit: number
          servant_room: string
          sewage_treatment_plant: string
          shopping_center: string
          state: string
          status: string
          street_address: string
          super_area: number
          swimming_pool: string
          title: string
          total_floors: number
          updated_at: string
          user_id: string
          videos: string[]
          visitor_parking: string
          water_storage_facility: string
          water_supply: string
          who_will_show: string
          wifi: string
        }[]
      }
      get_public_property_by_id: {
        Args: { property_id: string }
        Returns: {
          additional_documents: Json
          air_conditioner: string
          amenities: Json
          availability_date: string
          availability_type: string
          balconies: number
          bathrooms: number
          bhk_type: string
          booking_amount: number
          carpet_area: number
          children_play_area: string
          city: string
          club_house: string
          created_at: string
          current_property_condition: string
          description: string
          directions_tip: string
          expected_price: number
          facing_direction: string
          fire_safety: string
          floor_no: number
          floor_type: string
          furnishing: string
          gas_pipeline: string
          gated_security: boolean
          gym: string
          home_loan_available: boolean
          house_keeping: string
          id: string
          images: string[]
          intercom: string
          internet_services: string
          is_featured: boolean
          is_premium: boolean
          landmarks: string
          lift: string
          listing_type: string
          locality: string
          maintenance_charges: number
          non_veg_allowed: boolean
          park: string
          parking: string
          pet_allowed: boolean
          pincode: string
          plot_area_unit: string
          power_backup: string
          price_negotiable: boolean
          property_age: string
          property_type: string
          rain_water_harvesting: string
          registration_status: string
          secondary_phone: string
          security: string
          security_deposit: number
          servant_room: string
          sewage_treatment_plant: string
          shopping_center: string
          state: string
          status: string
          street_address: string
          super_area: number
          swimming_pool: string
          title: string
          total_floors: number
          updated_at: string
          user_id: string
          videos: string[]
          visitor_parking: string
          water_storage_facility: string
          water_supply: string
          who_will_show: string
          wifi: string
        }[]
      }
      get_role_permissions: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: {
          action: Database["public"]["Enums"]["permission_action"]
          content_type: Database["public"]["Enums"]["content_type"]
        }[]
      }
      get_security_recommendations: {
        Args: never
        Returns: {
          priority: string
          recommendation: string
          status: string
        }[]
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
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          raw_user_meta_data: Json
        }[]
      }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          assigned_at: string
          expires_at: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      has_current_user_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      has_permission: {
        Args: {
          action_param: Database["public"]["Enums"]["permission_action"]
          content_type_param: Database["public"]["Enums"]["content_type"]
          user_uuid: string
        }
        Returns: boolean
      }
      has_role:
        | {
            Args: {
              required_role: Database["public"]["Enums"]["user_role"]
              user_uuid: string
            }
            Returns: boolean
          }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      is_content_manager: { Args: never; Returns: boolean }
      is_finance_admin: { Args: never; Returns: boolean }
      is_hr_admin: { Args: never; Returns: boolean }
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
      log_sensitive_data_access: {
        Args: {
          access_type: string
          details?: Json
          record_id: string
          table_name: string
        }
        Returns: undefined
      }
      make_user_admin: { Args: { user_email: string }; Returns: string }
      replace_asset_placeholders: {
        Args: { asset_map: Json; content_data: Json }
        Returns: Json
      }
      toggle_property_favorite: {
        Args: { property_id: string }
        Returns: boolean
      }
      update_user_role: {
        Args: {
          _new_role: Database["public"]["Enums"]["app_role"]
          _reason?: string
          _user_id: string
        }
        Returns: undefined
      }
      upload_file_to_storage: {
        Args: { content_type?: string; file_content: string; file_name: string }
        Returns: string
      }
      use_contact_attempt: {
        Args: { user_uuid: string }
        Returns: {
          remaining_uses: number
          success: boolean
        }[]
      }
      validate_sensitive_access: {
        Args: {
          target_record_id: string
          target_table: string
          user_id: string
        }
        Returns: boolean
      }
      verify_email_token: { Args: { p_token: string }; Returns: Json }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "buyer"
        | "seller"
        | "consultant"
        | "content_manager"
        | "blog_content_creator"
        | "static_page_manager"
        | "sales_team"
        | "property_moderator"
        | "lead_manager"
        | "owner"
        | "agent"
      content_type:
        | "homepage"
        | "properties"
        | "blog"
        | "static_pages"
        | "users"
        | "settings"
        | "homepage_sections"
        | "testimonials"
        | "services"
        | "featured_properties"
        | "marketing_content"
      employee_role:
        | "hr_admin"
        | "finance_admin"
        | "content_manager"
        | "blog_manager"
        | "employee_manager"
        | "employee"
      employee_status: "active" | "inactive" | "pending_approval" | "terminated"
      payout_status: "pending" | "approved" | "rejected" | "paid"
      permission_action: "create" | "read" | "update" | "delete"
      transaction_type:
        | "salary"
        | "bonus"
        | "reimbursement"
        | "penalty"
        | "advance"
      user_role:
        | "admin"
        | "content_manager"
        | "sales_team"
        | "blog_creator"
        | "static_page_manager"
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
      app_role: [
        "admin",
        "user",
        "buyer",
        "seller",
        "consultant",
        "content_manager",
        "blog_content_creator",
        "static_page_manager",
        "sales_team",
        "property_moderator",
        "lead_manager",
        "owner",
        "agent",
      ],
      content_type: [
        "homepage",
        "properties",
        "blog",
        "static_pages",
        "users",
        "settings",
        "homepage_sections",
        "testimonials",
        "services",
        "featured_properties",
        "marketing_content",
      ],
      employee_role: [
        "hr_admin",
        "finance_admin",
        "content_manager",
        "blog_manager",
        "employee_manager",
        "employee",
      ],
      employee_status: ["active", "inactive", "pending_approval", "terminated"],
      payout_status: ["pending", "approved", "rejected", "paid"],
      permission_action: ["create", "read", "update", "delete"],
      transaction_type: [
        "salary",
        "bonus",
        "reimbursement",
        "penalty",
        "advance",
      ],
      user_role: [
        "admin",
        "content_manager",
        "sales_team",
        "blog_creator",
        "static_page_manager",
      ],
    },
  },
} as const
