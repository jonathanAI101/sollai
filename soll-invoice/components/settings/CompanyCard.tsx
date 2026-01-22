'use client';

import { Building2, Edit2, Trash2, Star } from 'lucide-react';
import type { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export function CompanyCard({ company, onEdit, onDelete, onSetDefault }: CompanyCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Logo */}
        {company.logo ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{company.name}</h3>
            {company.isDefault && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                <Star className="w-3 h-3" />
                默认
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            简码: {company.shortCode}
          </p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            税号: {company.taxNumber}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {!company.isDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="设为默认"
            >
              <Star className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Details */}
      {(company.address || company.bankName) && (
        <div className="mt-3 pt-3 border-t border-border space-y-1">
          {company.address && (
            <p className="text-xs text-muted-foreground truncate">
              地址: {company.address}
            </p>
          )}
          {company.bankName && (
            <p className="text-xs text-muted-foreground truncate">
              开户行: {company.bankName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
