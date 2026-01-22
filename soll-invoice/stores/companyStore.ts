import { create } from 'zustand';
import { db } from '@/lib/db';
import type { Company } from '@/lib/types';
import { generateId } from '@/lib/format';
import { MAX_COMPANIES } from '@/lib/constants';

interface CompanyState {
  companies: Company[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id' | 'invoiceCounter' | 'isDefault' | 'createdAt' | 'updatedAt'>) => Promise<Company | null>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setDefaultCompany: (id: string) => Promise<void>;
  incrementInvoiceCounter: (id: string) => Promise<number>;
  getDefaultCompany: () => Company | undefined;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,

  loadCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const companies = await db.companies.orderBy('createdAt').toArray();
      set({ companies, isLoading: false });
    } catch (error) {
      set({ error: '加载开票主体失败', isLoading: false });
      console.error('Failed to load companies:', error);
    }
  },

  addCompany: async (companyData) => {
    const { companies } = get();
    if (companies.length >= MAX_COMPANIES) {
      set({ error: `最多只能添加 ${MAX_COMPANIES} 个开票主体` });
      return null;
    }

    const now = Date.now();
    const isFirst = companies.length === 0;

    const newCompany: Company = {
      ...companyData,
      id: generateId(),
      invoiceCounter: 0,
      isDefault: isFirst,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.companies.add(newCompany);
      set({ companies: [...companies, newCompany], error: null });
      return newCompany;
    } catch (error) {
      set({ error: '添加开票主体失败' });
      console.error('Failed to add company:', error);
      return null;
    }
  },

  updateCompany: async (id, updates) => {
    const { companies } = get();
    const now = Date.now();

    try {
      await db.companies.update(id, { ...updates, updatedAt: now });
      set({
        companies: companies.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: now } : c
        ),
        error: null,
      });
    } catch (error) {
      set({ error: '更新开票主体失败' });
      console.error('Failed to update company:', error);
    }
  },

  deleteCompany: async (id) => {
    const { companies } = get();

    try {
      await db.companies.delete(id);
      const newCompanies = companies.filter((c) => c.id !== id);

      // If deleted company was default and there are others, set first as default
      if (companies.find((c) => c.id === id)?.isDefault && newCompanies.length > 0) {
        await db.companies.update(newCompanies[0].id, { isDefault: true });
        newCompanies[0].isDefault = true;
      }

      set({ companies: newCompanies, error: null });
    } catch (error) {
      set({ error: '删除开票主体失败' });
      console.error('Failed to delete company:', error);
    }
  },

  setDefaultCompany: async (id) => {
    const { companies } = get();

    try {
      // Remove default from all, set new default
      await db.transaction('rw', db.companies, async () => {
        for (const company of companies) {
          await db.companies.update(company.id, { isDefault: company.id === id });
        }
      });

      set({
        companies: companies.map((c) => ({ ...c, isDefault: c.id === id })),
        error: null,
      });
    } catch (error) {
      set({ error: '设置默认主体失败' });
      console.error('Failed to set default company:', error);
    }
  },

  incrementInvoiceCounter: async (id) => {
    const { companies } = get();
    const company = companies.find((c) => c.id === id);
    if (!company) return 0;

    const newCounter = company.invoiceCounter + 1;

    try {
      await db.companies.update(id, { invoiceCounter: newCounter });
      set({
        companies: companies.map((c) =>
          c.id === id ? { ...c, invoiceCounter: newCounter } : c
        ),
      });
      return newCounter;
    } catch (error) {
      console.error('Failed to increment invoice counter:', error);
      return company.invoiceCounter;
    }
  },

  getDefaultCompany: () => {
    const { companies } = get();
    return companies.find((c) => c.isDefault) || companies[0];
  },
}));
