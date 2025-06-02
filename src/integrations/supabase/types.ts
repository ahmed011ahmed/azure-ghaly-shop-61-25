export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string
          id: string
          sender: string
          target_user: string | null
          text: string
          updated_at: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          sender: string
          target_user?: string | null
          text: string
          updated_at?: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          sender?: string
          target_user?: string | null
          text?: string
          updated_at?: string
          user_name?: string | null
        }
        Relationships: []
      }
      download_links: {
        Row: {
          created_at: string | null
          description: string
          download_url: string
          file_size: string | null
          id: number
          name: string
          version: string
        }
        Insert: {
          created_at?: string | null
          description: string
          download_url: string
          file_size?: string | null
          id?: number
          name: string
          version: string
        }
        Update: {
          created_at?: string | null
          description?: string
          download_url?: string
          file_size?: string | null
          id?: number
          name?: string
          version?: string
        }
        Relationships: []
      }
      giveaways: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          image: string
          is_active: boolean
          participants_count: number
          prize: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          image: string
          is_active?: boolean
          participants_count?: number
          prize: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          image?: string
          is_active?: boolean
          participants_count?: number
          prize?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      global_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          id: number
          image: string
          name: string
          price: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          image: string
          name: string
          price: string
          rating?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          image?: string
          name?: string
          price?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nickname: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nickname: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          updated_at?: string
        }
        Relationships: []
      }
      pubg_accounts: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string
          is_available: boolean
          updated_at: string
          video: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image: string
          is_available?: boolean
          updated_at?: string
          video?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string
          is_available?: boolean
          updated_at?: string
          video?: string | null
        }
        Relationships: []
      }
      pubg_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          sender: string
          target_user: string | null
          text: string
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sender: string
          target_user?: string | null
          text: string
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sender?: string
          target_user?: string | null
          text?: string
          user_name?: string | null
        }
        Relationships: []
      }
      subscriber_permissions: {
        Row: {
          email: string
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
        }
        Insert: {
          email: string
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
        }
        Update: {
          email?: string
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      updates: {
        Row: {
          created_at: string | null
          description: string
          id: number
          title: string
          version: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          title: string
          version: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          title?: string
          version?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          is_used: boolean
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          is_used?: boolean
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          user_id?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
