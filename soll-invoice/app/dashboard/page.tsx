'use client';

import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Users, Store, FileText, Wallet, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useI18n();

  const stats = [
    { label: t('dashboard.totalCreators'), value: '1,234', icon: Users, color: 'blue' },
    { label: t('dashboard.totalMerchants'), value: '56', icon: Store, color: 'green' },
    { label: t('dashboard.pendingInvoices'), value: '12', icon: FileText, color: 'orange' },
    { label: t('dashboard.monthlyRevenue'), value: '$45,678', icon: Wallet, color: 'purple' },
  ];

  return (
    <Layout>
      <Header title={t('dashboard.title')} />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('dashboard.recentActivity')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t('dashboard.noActivity')}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('dashboard.upcomingEvents')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t('dashboard.noEvents')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
