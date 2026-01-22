'use client';

import { Trash2 } from 'lucide-react';
import { TAX_RATES } from '@/lib/constants';
import { formatCurrency, calculateAmount, calculateTax } from '@/lib/format';
import type { InvoiceItem, TaxRate } from '@/lib/types';

interface InvoiceItemRowProps {
  item: InvoiceItem;
  index: number;
  onChange: (item: InvoiceItem) => void;
  onRemove: () => void;
}

export function InvoiceItemRow({ item, index, onChange, onRemove }: InvoiceItemRowProps) {
  const handleFieldChange = (field: keyof InvoiceItem, value: string | number) => {
    const updatedItem = { ...item, [field]: value };

    // Recalculate amounts when quantity, price, or tax rate changes
    if (field === 'quantity' || field === 'price' || field === 'taxRate') {
      const quantity = field === 'quantity' ? Number(value) : item.quantity;
      const price = field === 'price' ? Number(value) : item.price;
      const taxRate = field === 'taxRate' ? Number(value) as TaxRate : item.taxRate;

      updatedItem.quantity = quantity;
      updatedItem.price = price;
      updatedItem.taxRate = taxRate;
      updatedItem.amount = calculateAmount(quantity, price);
      updatedItem.taxAmount = calculateTax(updatedItem.amount, taxRate);
    }

    onChange(updatedItem);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-3 space-y-3">
      {/* Row header with index and remove button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">项目 {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Name */}
      <div>
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="项目名称"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Quantity, Unit, Price */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">数量</label>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleFieldChange('quantity', e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">单位</label>
          <input
            type="text"
            value={item.unit}
            onChange={(e) => handleFieldChange('unit', e.target.value)}
            className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">单价</label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => handleFieldChange('price', e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tax Rate and Amounts */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">税率</label>
          <select
            value={item.taxRate}
            onChange={(e) => handleFieldChange('taxRate', e.target.value)}
            className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {TAX_RATES.map((rate) => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            金额: {formatCurrency(item.amount)} + 税额: {formatCurrency(item.taxAmount)}
          </p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            = {formatCurrency(item.amount + item.taxAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
