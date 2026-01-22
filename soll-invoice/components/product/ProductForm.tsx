'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PRODUCT_CATEGORIES, TAX_RATES, COMMON_UNITS } from '@/lib/constants';
import type { Product, ProductCategory, TaxRate } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '软件服务' as ProductCategory,
    unit: '项',
    price: '',
    taxRate: 0.06 as TaxRate,
    taxCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        unit: product.unit,
        price: product.price.toString(),
        taxRate: product.taxRate,
        taxCode: product.taxCode,
      });
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入产品名称';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = '请输入有效的单价';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price) || 0,
      });
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="产品名称"
            placeholder="请输入产品/服务名称"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            分类
          </label>
          <select
            value={formData.category}
            onChange={handleChange('category')}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Unit */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            单位
          </label>
          <div className="flex gap-2">
            <select
              value={formData.unit}
              onChange={handleChange('unit')}
              className="flex-1 px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {COMMON_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="默认单价"
          type="number"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange('price')}
          error={errors.price}
          required
        />

        {/* Tax Rate */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            税率
          </label>
          <select
            value={formData.taxRate}
            onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) as TaxRate }))}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {TAX_RATES.map((rate) => (
              <option key={rate.value} value={rate.value}>{rate.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Input
            label="商品编码"
            placeholder="请输入商品税收分类编码（选填）"
            value={formData.taxCode}
            onChange={handleChange('taxCode')}
            hint="用于税务申报的商品分类编码"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '保存中...' : product ? '保存修改' : '添加产品'}
        </Button>
      </div>
    </form>
  );
}
