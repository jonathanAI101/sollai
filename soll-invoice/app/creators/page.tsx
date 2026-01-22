'use client';

import { useState } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Instagram, Youtube, Twitter } from 'lucide-react';

export default function CreatorsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for creators
  const creators = [
    { id: 1, name: 'Sarah Johnson', handle: '@sarahj', platform: 'instagram', followers: '125K', category: 'Lifestyle', status: 'active' },
    { id: 2, name: 'Mike Chen', handle: '@mikechen', platform: 'youtube', followers: '890K', category: 'Tech', status: 'active' },
    { id: 3, name: 'Lisa Wang', handle: '@lisawang', platform: 'twitter', followers: '45K', category: 'Fashion', status: 'pending' },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <Header
        title={t('creators.title')}
        action={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            {t('creators.add')}
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
              placeholder={t('creators.searchPlaceholder')}
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

        {/* Creators List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.name')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.platform')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.followers')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.category')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {creators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{creator.name}</p>
                        <p className="text-sm text-muted-foreground">{creator.handle}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getPlatformIcon(creator.platform)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{creator.followers}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{creator.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        creator.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {creator.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
