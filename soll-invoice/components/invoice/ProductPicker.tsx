'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, Search, Plus } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/product/ProductForm';
import { formatCurrency } from '@/lib/format';
import { TAX_RATES, PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Product, InvoiceItem } from '@/lib/types';
import { generateId } from '@/lib/format';

interface ProductPickerProps {
  onAdd: (item: InvoiceItem) => void;
}

export function ProductPicker({ onAdd }: ProductPickerProps) {
  const { products, loadProducts, addProduct } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result.slice(0, 20);
  }, [products, searchQuery, selectedCategory]);

  const handleSelectProduct = (product: Product) => {
    const item: InvoiceItem = {
      id: generateId(),
      productId: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      taxRate: product.taxRate,
      amount: product.price,
      taxAmount: product.price * product.taxRate,
    };
    onAdd(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = await addProduct(data);
    if (newProduct) {
      handleSelectProduct(newProduct);
      setIsAddModalOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加项目
      </button>

      {/* Product Selection Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
          setSelectedCategory(null);
        }}
        title="选择产品"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索产品名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              全部
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add New Product Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加新产品
          </button>

          {/* Product List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchQuery || selectedCategory ? '没有找到匹配的产品' : '暂无产品'}
              </p>
            ) : (
              filteredProducts.map((product) => {
                const taxLabel = TAX_RATES.find((r) => r.value === product.taxRate)?.label || '';
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · {taxLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary tabular-nums">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        / {product.unit}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加产品"
        size="lg"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </>
  );
}
