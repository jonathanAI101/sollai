'use client';

import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useCompanyStore } from '@/stores/companyStore';
import type { Company } from '@/lib/types';

interface CompanySelectorProps {
  value?: string;
  onChange: (companyId: string) => void;
}

export function CompanySelector({ value, onChange }: CompanySelectorProps) {
  const { companies, loadCompanies, getDefaultCompany } = useCompanyStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    // Set default company if none selected
    if (!value && companies.length > 0) {
      const defaultCompany = getDefaultCompany();
      if (defaultCompany) {
        onChange(defaultCompany.id);
      }
    }
  }, [value, companies, getDefaultCompany, onChange]);

  const selectedCompany = companies.find((c) => c.id === value);

  if (companies.length === 0) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border text-center">
        <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          请先在设置中添加开票主体
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
      >
        {selectedCompany?.logo ? (
          <img
            src={selectedCompany.logo}
            alt={selectedCompany.name}
            className="w-10 h-10 rounded-lg object-contain bg-muted"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">开票主体</p>
          <p className="font-medium text-foreground truncate">
            {selectedCompany?.name || '选择开票主体'}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  onChange(company.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-secondary transition-colors text-left"
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-8 h-8 rounded-lg object-contain bg-muted"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {company.shortCode}
                  </p>
                </div>
                {company.id === value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
