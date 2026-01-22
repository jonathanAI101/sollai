'use client';

import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Download, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function SettlementPage() {
  const { t } = useI18n();

  // Mock data for settlements
  const settlements = [
    { id: 1, creator: 'Sarah Johnson', campaign: 'Summer Collection', amount: '$2,500', date: '2024-01-15', status: 'completed' },
    { id: 2, creator: 'Mike Chen', campaign: 'Tech Review', amount: '$1,800', date: '2024-01-14', status: 'pending' },
    { id: 3, creator: 'Lisa Wang', campaign: 'Fashion Week', amount: '$3,200', date: '2024-01-13', status: 'processing' },
  ];

  const stats = [
    { label: t('settlement.totalPaid'), value: '$125,400', status: 'completed' },
    { label: t('settlement.pending'), value: '$12,300', status: 'pending' },
    { label: t('settlement.processing'), value: '$8,500', status: 'processing' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return '';
    }
  };

  return (
    <Layout>
      <Header
        title={t('settlement.title')}
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(stat.status)}
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            {t('common.filter')}
          </Button>
        </div>

        {/* Settlements List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.creator')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.campaign')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.amount')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.date')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {settlements.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{item.creator}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.campaign}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{item.amount}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
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
