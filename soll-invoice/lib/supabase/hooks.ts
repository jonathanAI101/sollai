'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from './client';
import type { Database, InvoiceWithRelations, InvoiceAuditLog } from './types';

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type { InvoiceWithRelations, InvoiceAuditLog };

// Supabase client singleton
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

// Generic hook for fetching table data
export function useSupabaseQuery<T>(
  tableName: string,
  options?: {
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      let query = supabase.from(tableName).select(options?.select || '*');

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;
      setData(result as T[]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [tableName, options?.select, options?.orderBy, options?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Typed hooks
export function useMerchants() {
  return useSupabaseQuery<Tables<'merchants'>>('merchants', {
    orderBy: { column: 'created_at', ascending: false },
  });
}

export function useCreators() {
  return useSupabaseQuery<Tables<'creators'>>('creators', {
    orderBy: { column: 'created_at', ascending: false },
  });
}

export function useInvoices() {
  return useSupabaseQuery<Tables<'invoices'>>('invoices', {
    orderBy: { column: 'created_at', ascending: false },
  });
}

// CRUD operations
export const db = {
  merchants: {
    async getAll() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tables<'merchants'>[];
    },
    async getById(id: string) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Tables<'merchants'>;
    },
    async create(merchant: InsertTables<'merchants'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('merchants')
        .insert(merchant as never)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<'merchants'>;
    },
    async update(id: string, updates: UpdateTables<'merchants'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('merchants')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<'merchants'>;
    },
    async delete(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase.from('merchants').delete().eq('id', id);
      if (error) throw error;
    },
    async softDelete(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('merchants')
        .update({ deleted_at: new Date().toISOString() } as never)
        .eq('id', id);
      if (error) throw error;
    },
  },

  creators: {
    async getAll() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tables<'creators'>[];
    },
    async getById(id: string) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Tables<'creators'>;
    },
    async create(creator: InsertTables<'creators'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('creators')
        .insert(creator as never)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<'creators'>;
    },
    async update(id: string, updates: UpdateTables<'creators'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('creators')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<'creators'>;
    },
    async delete(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase.from('creators').delete().eq('id', id);
      if (error) throw error;
    },
    async softDelete(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('creators')
        .update({ deleted_at: new Date().toISOString() } as never)
        .eq('id', id);
      if (error) throw error;
    },
  },

  invoices: {
    async getAll() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, merchants(*), creators(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as InvoiceWithRelations[];
    },
    async getById(id: string) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, merchants(*), creators(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as InvoiceWithRelations;
    },
    async getByMerchantId(merchantId: string) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, merchants(*), creators(*)')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as InvoiceWithRelations[];
    },
    async create(invoice: InsertTables<'invoices'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice as never)
        .select('*, merchants(*), creators(*)')
        .single();
      if (error) throw error;
      return data as InvoiceWithRelations;
    },
    async update(id: string, updates: UpdateTables<'invoices'>) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoices')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<'invoices'>;
    },
    async delete(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
    },
    async countByMerchantId(merchantId: string) {
      const supabase = getSupabase();
      const { count, error } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId);
      if (error) throw error;
      return count || 0;
    },
  },

  invoiceAudit: {
    async log(params: {
      invoice_id: string;
      action: InvoiceAuditLog['action'];
      old_value?: Record<string, unknown>;
      new_value?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }) {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('invoice_audit_logs')
        .insert({
          invoice_id: params.invoice_id,
          action: params.action,
          old_value: (params.old_value || null) as never,
          new_value: (params.new_value || null) as never,
          metadata: (params.metadata || null) as never,
        } as never);
      if (error) console.error('Audit log failed:', error);
    },

    async getByInvoice(invoiceId: string): Promise<InvoiceAuditLog[]> {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('invoice_audit_logs')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as InvoiceAuditLog[];
    },
  },
};
