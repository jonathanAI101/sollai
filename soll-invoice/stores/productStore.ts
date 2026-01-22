import { create } from 'zustand';
import { db } from '@/lib/db';
import type { Product, ProductCategory } from '@/lib/types';
import { generateId } from '@/lib/format';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<Product | null>;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: ProductCategory) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await db.products.orderBy('createdAt').reverse().toArray();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: '加载产品列表失败', isLoading: false });
      console.error('Failed to load products:', error);
    }
  },

  addProduct: async (productData) => {
    const { products } = get();
    const now = Date.now();

    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.products.add(newProduct);
      set({ products: [newProduct, ...products], error: null });
      return newProduct;
    } catch (error) {
      set({ error: '添加产品失败' });
      console.error('Failed to add product:', error);
      return null;
    }
  },

  updateProduct: async (id, updates) => {
    const { products } = get();
    const now = Date.now();

    try {
      await db.products.update(id, { ...updates, updatedAt: now });
      set({
        products: products.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: now } : p
        ),
        error: null,
      });
    } catch (error) {
      set({ error: '更新产品失败' });
      console.error('Failed to update product:', error);
    }
  },

  deleteProduct: async (id) => {
    const { products } = get();

    try {
      await db.products.delete(id);
      set({
        products: products.filter((p) => p.id !== id),
        error: null,
      });
    } catch (error) {
      set({ error: '删除产品失败' });
      console.error('Failed to delete product:', error);
    }
  },

  duplicateProduct: async (id) => {
    const { products, addProduct } = get();
    const product = products.find((p) => p.id === id);

    if (!product) {
      set({ error: '找不到该产品' });
      return null;
    }

    const { id: _, createdAt: __, updatedAt: ___, ...productData } = product;
    return addProduct({
      ...productData,
      name: `${product.name} (副本)`,
    });
  },

  searchProducts: (query) => {
    const { products } = get();
    const lowerQuery = query.toLowerCase();

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.taxCode.includes(query)
    );
  },

  getProductsByCategory: (category) => {
    const { products } = get();
    return products.filter((p) => p.category === category);
  },
}));
