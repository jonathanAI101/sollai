import { create } from 'zustand';
import { db } from '@/lib/db';
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/lib/types';
import { generateId, generateInvoiceNumber, calculateAmount, calculateTax } from '@/lib/format';
import { useCompanyStore } from './companyStore';

interface InvoiceFilters {
  status?: InvoiceStatus;
  customerId?: string;
  companyId?: string;
  startDate?: number;
  endDate?: number;
}

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadInvoices: () => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Promise<Invoice | null>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  duplicateInvoice: (id: string) => Promise<Invoice | null>;
  searchInvoices: (query: string) => Invoice[];
  filterInvoices: (filters: InvoiceFilters) => Invoice[];
  getInvoiceStats: (companyId?: string) => {
    total: number;
    totalAmount: number;
    paidCount: number;
    unpaidCount: number;
  };
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  loadInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await db.invoices.orderBy('createdAt').reverse().toArray();
      set({ invoices, isLoading: false });
    } catch (error) {
      set({ error: '加载发票列表失败', isLoading: false });
      console.error('Failed to load invoices:', error);
    }
  },

  createInvoice: async (invoiceData) => {
    const { invoices } = get();
    const now = Date.now();

    // Get company to generate invoice number
    const companies = useCompanyStore.getState().companies;
    const company = companies.find((c) => c.id === invoiceData.companyId);

    if (!company) {
      set({ error: '请先选择开票主体' });
      return null;
    }

    // Increment counter and generate invoice number
    const counter = await useCompanyStore.getState().incrementInvoiceCounter(company.id);
    const invoiceNumber = generateInvoiceNumber(company.shortCode, counter);

    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      invoiceNumber,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.invoices.add(newInvoice);
      set({ invoices: [newInvoice, ...invoices], error: null });
      return newInvoice;
    } catch (error) {
      set({ error: '创建发票失败' });
      console.error('Failed to create invoice:', error);
      return null;
    }
  },

  updateInvoice: async (id, updates) => {
    const { invoices } = get();
    const now = Date.now();

    try {
      await db.invoices.update(id, { ...updates, updatedAt: now });
      set({
        invoices: invoices.map((inv) =>
          inv.id === id ? { ...inv, ...updates, updatedAt: now } : inv
        ),
        error: null,
      });
    } catch (error) {
      set({ error: '更新发票失败' });
      console.error('Failed to update invoice:', error);
    }
  },

  updateInvoiceStatus: async (id, status) => {
    await get().updateInvoice(id, { status });
  },

  deleteInvoice: async (id) => {
    const { invoices } = get();

    try {
      await db.invoices.delete(id);
      set({
        invoices: invoices.filter((inv) => inv.id !== id),
        error: null,
      });
    } catch (error) {
      set({ error: '删除发票失败' });
      console.error('Failed to delete invoice:', error);
    }
  },

  duplicateInvoice: async (id) => {
    const { invoices, createInvoice } = get();
    const invoice = invoices.find((inv) => inv.id === id);

    if (!invoice) {
      set({ error: '找不到该发票' });
      return null;
    }

    const { id: _, invoiceNumber: __, createdAt: ___, updatedAt: ____, ...invoiceData } = invoice;

    // Reset status to draft and update issue date
    return createInvoice({
      ...invoiceData,
      status: 'draft',
      issueDate: Date.now(),
    });
  },

  searchInvoices: (query) => {
    const { invoices } = get();
    const lowerQuery = query.toLowerCase();

    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(lowerQuery)
    );
  },

  filterInvoices: (filters) => {
    const { invoices } = get();

    return invoices.filter((inv) => {
      if (filters.status && inv.status !== filters.status) return false;
      if (filters.customerId && inv.customerId !== filters.customerId) return false;
      if (filters.companyId && inv.companyId !== filters.companyId) return false;
      if (filters.startDate && inv.issueDate < filters.startDate) return false;
      if (filters.endDate && inv.issueDate > filters.endDate) return false;
      return true;
    });
  },

  getInvoiceStats: (companyId) => {
    const { invoices } = get();

    const filteredInvoices = companyId
      ? invoices.filter((inv) => inv.companyId === companyId)
      : invoices;

    // Filter for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthlyInvoices = filteredInvoices.filter(
      (inv) => inv.issueDate >= startOfMonth && inv.status !== 'void'
    );

    return {
      total: monthlyInvoices.length,
      totalAmount: monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0),
      paidCount: monthlyInvoices.filter((inv) => inv.status === 'paid').length,
      unpaidCount: monthlyInvoices.filter((inv) => inv.status === 'issued').length,
    };
  },
}));

// Helper function to calculate invoice totals from items
export function calculateInvoiceTotals(items: InvoiceItem[]): {
  subtotal: number;
  totalTax: number;
  total: number;
} {
  let subtotal = 0;
  let totalTax = 0;

  for (const item of items) {
    const amount = calculateAmount(item.quantity, item.price);
    const tax = calculateTax(amount, item.taxRate);
    subtotal += amount;
    totalTax += tax;
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    total: Math.round((subtotal + totalTax) * 100) / 100,
  };
}
