import { create } from 'zustand';
import { db } from '@/lib/db';
import type { Customer } from '@/lib/types';
import { generateId } from '@/lib/format';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Customer | null>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  importCustomers: (customers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<number>;
  searchCustomers: (query: string) => Customer[];
  getCustomersByTag: (tag: string) => Customer[];
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await db.customers.orderBy('createdAt').reverse().toArray();
      set({ customers, isLoading: false });
    } catch (error) {
      set({ error: '加载客户列表失败', isLoading: false });
      console.error('Failed to load customers:', error);
    }
  },

  addCustomer: async (customerData) => {
    const { customers } = get();
    const now = Date.now();

    const newCustomer: Customer = {
      ...customerData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.customers.add(newCustomer);
      set({ customers: [newCustomer, ...customers], error: null });
      return newCustomer;
    } catch (error) {
      set({ error: '添加客户失败' });
      console.error('Failed to add customer:', error);
      return null;
    }
  },

  updateCustomer: async (id, updates) => {
    const { customers } = get();
    const now = Date.now();

    try {
      await db.customers.update(id, { ...updates, updatedAt: now });
      set({
        customers: customers.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: now } : c
        ),
        error: null,
      });
    } catch (error) {
      set({ error: '更新客户失败' });
      console.error('Failed to update customer:', error);
    }
  },

  deleteCustomer: async (id) => {
    const { customers } = get();

    try {
      await db.customers.delete(id);
      set({
        customers: customers.filter((c) => c.id !== id),
        error: null,
      });
    } catch (error) {
      set({ error: '删除客户失败' });
      console.error('Failed to delete customer:', error);
    }
  },

  importCustomers: async (customersData) => {
    const { customers } = get();
    const now = Date.now();

    const newCustomers: Customer[] = customersData.map((data, index) => ({
      ...data,
      id: generateId() + index,
      createdAt: now,
      updatedAt: now,
    }));

    try {
      await db.customers.bulkAdd(newCustomers);
      set({ customers: [...newCustomers, ...customers], error: null });
      return newCustomers.length;
    } catch (error) {
      set({ error: '导入客户失败' });
      console.error('Failed to import customers:', error);
      return 0;
    }
  },

  searchCustomers: (query) => {
    const { customers } = get();
    const lowerQuery = query.toLowerCase();

    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.taxNumber.includes(query) ||
        c.contactPerson.toLowerCase().includes(lowerQuery)
    );
  },

  getCustomersByTag: (tag) => {
    const { customers } = get();
    return customers.filter((c) => c.tags.includes(tag));
  },
}));
