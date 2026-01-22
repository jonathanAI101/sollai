export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          name: string;
          country: string;
          campaigns: number;
          status: string;
          email: string | null;
          phone: string | null;
          website: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          tax_id: string | null;
          notes: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string;
          campaigns?: number;
          status?: string;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          tax_id?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string;
          campaigns?: number;
          status?: string;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          tax_id?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      creators: {
        Row: {
          id: string;
          name: string;
          platform: string;
          followers: number;
          engagement: number;
          status: string;
          email: string | null;
          phone: string | null;
          social_handle: string | null;
          notes: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          platform: string;
          followers?: number;
          engagement?: number;
          status?: string;
          email?: string | null;
          phone?: string | null;
          social_handle?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          platform?: string;
          followers?: number;
          engagement?: number;
          status?: string;
          email?: string | null;
          phone?: string | null;
          social_handle?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      invoices: {
        Row: {
          id: string;
          merchant_id: string | null;
          creator_id: string | null;
          merchant_name_snapshot: string;
          description: string;
          amount: number;
          currency: string;
          issue_date: string;
          due_date: string | null;
          status: string;
          items: Json;
          from_company: Json;
          to_company: Json;
          paid_to_date: number;
          notes: string | null;
          voided_at: string | null;
          voided_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          merchant_id?: string | null;
          creator_id?: string | null;
          merchant_name_snapshot: string;
          description?: string;
          amount: number;
          currency?: string;
          issue_date?: string;
          due_date?: string | null;
          status?: string;
          items?: Json;
          from_company?: Json;
          to_company?: Json;
          paid_to_date?: number;
          notes?: string | null;
          voided_at?: string | null;
          voided_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          merchant_id?: string | null;
          creator_id?: string | null;
          merchant_name_snapshot?: string;
          description?: string;
          amount?: number;
          currency?: string;
          issue_date?: string;
          due_date?: string | null;
          status?: string;
          items?: Json;
          from_company?: Json;
          to_company?: Json;
          paid_to_date?: number;
          notes?: string | null;
          voided_at?: string | null;
          voided_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      invoice_audit_logs: {
        Row: {
          id: string;
          invoice_id: string;
          user_id: string | null;
          action: string;
          old_value: Json | null;
          new_value: Json | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          user_id?: string | null;
          action: string;
          old_value?: Json | null;
          new_value?: Json | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          user_id?: string | null;
          action?: string;
          old_value?: Json | null;
          new_value?: Json | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Invoice with expanded merchant/creator data (from JOIN queries)
export type InvoiceWithRelations = Tables<'invoices'> & {
  merchants: Tables<'merchants'> | null;
  creators: Tables<'creators'> | null;
};

// Audit log type
export interface InvoiceAuditLog {
  id: string;
  invoice_id: string;
  user_id: string | null;
  action: 'created' | 'status_changed' | 'updated' | 'voided' | 'email_sent' | 'deleted';
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
