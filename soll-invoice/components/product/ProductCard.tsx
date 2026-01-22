'use client';

import { Package, Edit2, Trash2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { TAX_RATES } from '@/lib/constants';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect?: () => void;
}

export function ProductCard({ product, onEdit, onDelete, onDuplicate, onSelect }: ProductCardProps) {
  const taxRateLabel = TAX_RATES.find((r) => r.value === product.taxRate)?.label || `${product.taxRate * 100}%`;

  return (
    <div
      className={`bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <Badge variant="default">{product.category}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-semibold text-primary tabular-nums">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {product.unit}
            </span>
            <Badge variant="primary" size="sm">
              {taxRateLabel}
            </Badge>
          </div>
          {product.taxCode && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              编码: {product.taxCode}
            </p>
          )}
        </div>

        {/* Actions */}
        {!onSelect && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="复制"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="编辑"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
