'use client';

import { useState } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Building2, Globe, Mail } from 'lucide-react';

export default function MerchantsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for merchants
  const merchants = [
    { id: 1, name: 'TechBrand Inc.', industry: 'Technology', country: 'USA', campaigns: 12, status: 'active' },
    { id: 2, name: 'Fashion Forward', industry: 'Fashion', country: 'UK', campaigns: 8, status: 'active' },
    { id: 3, name: 'Beauty Co.', industry: 'Beauty', country: 'France', campaigns: 5, status: 'pending' },
  ];

  return (
    <Layout>
      <Header
        title={t('merchants.title')}
        action={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            {t('merchants.add')}
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('merchants.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            {t('common.filter')}
          </Button>
        </div>

        {/* Merchants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {merchants.map((merchant) => (
            <div key={merchant.id} className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  merchant.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {merchant.status}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{merchant.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{merchant.industry}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" />
                  {merchant.country}
                </span>
                <span className="text-foreground font-medium">{merchant.campaigns} {t('merchants.campaigns')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
