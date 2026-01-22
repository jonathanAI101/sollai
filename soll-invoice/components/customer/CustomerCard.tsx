'use client';

import { User, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Customer } from '@/lib/types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
  onSelect?: () => void;
}

const tagVariants: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
  'VIP': 'primary',
  '常用': 'success',
  '待跟进': 'warning',
  '新客户': 'default',
};

export function CustomerCard({ customer, onEdit, onDelete, onSelect }: CustomerCardProps) {
  return (
    <div
      className={`bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">{customer.name}</h3>
            {customer.tags.map((tag) => (
              <Badge key={tag} variant={tagVariants[tag] || 'default'}>
                {tag}
              </Badge>
            ))}
          </div>
          {customer.contactPerson && (
            <p className="text-sm text-muted-foreground mt-0.5">
              联系人: {customer.contactPerson}
            </p>
          )}
          {customer.taxNumber && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              税号: {customer.taxNumber}
            </p>
          )}
        </div>

        {/* Actions */}
        {!onSelect && (
          <div className="flex items-center gap-1">
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

      {/* Contact Info */}
      {(customer.phone || customer.email) && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-4">
          {customer.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              {customer.phone}
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              {customer.email}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
