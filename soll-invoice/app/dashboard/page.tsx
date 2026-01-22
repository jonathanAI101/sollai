'use client';

import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Users, Store, FileText, Wallet, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useI18n();

  // Mock data matching other pages
  const creators = [
    { id: 1, name: 'Sarah Johnson', status: 'active' },
    { id: 2, name: 'Mike Chen', status: 'active' },
    { id: 3, name: 'Lisa Wang', status: 'pending' },
  ];

  const merchants = [
    { id: 1, name: 'TechBrand Inc.', status: 'active' },
    { id: 2, name: 'Fashion Forward', status: 'active' },
    { id: 3, name: 'Beauty Co.', status: 'pending' },
  ];

  const invoices = [
    { id: 'INV-2024-001', merchant: 'TechBrand Inc.', campaign: 'Summer Collection 2024', amount: 2500, status: 'paid', date: '2024-01-15' },
    { id: 'INV-2024-002', merchant: 'Fashion Forward', campaign: 'Tech Review Series', amount: 1800, status: 'pending', date: '2024-01-14' },
    { id: 'INV-2024-003', merchant: 'Beauty Co.', campaign: 'Fashion Week Promo', amount: 3200, status: 'overdue', date: '2024-01-13' },
    { id: 'INV-2024-004', merchant: 'Sports Plus', campaign: 'Fitness Challenge', amount: 1500, status: 'paid', date: '2024-01-12' },
    { id: 'INV-2024-005', merchant: 'Food & Co.', campaign: 'Recipe Series', amount: 2100, status: 'pending', date: '2024-01-11' },
    { id: 'INV-2024-006', merchant: 'Travel World', campaign: 'Destination Review', amount: 4500, status: 'paid', date: '2024-01-10' },
    { id: 'INV-2024-007', merchant: 'Gaming Hub', campaign: 'Game Launch Event', amount: 3800, status: 'draft', date: '2024-01-09' },
    { id: 'INV-2024-008', merchant: 'Music Live', campaign: 'Concert Promo', amount: 2800, status: 'paid', date: '2024-01-08' },
  ];

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const recentInvoices = invoices.slice(0, 5);

  const stats = [
    { label: t('dashboard.totalCreators'), value: creators.length.toString(), icon: Users, color: 'blue' },
    { label: t('dashboard.totalMerchants'), value: merchants.length.toString(), icon: Store, color: 'green' },
    { label: t('dashboard.pendingInvoices'), value: pendingInvoices.toString(), icon: FileText, color: 'orange' },
    { label: t('dashboard.monthlyRevenue'), value: `$${totalRevenue.toLocaleString()}`, icon: Wallet, color: 'purple' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

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
            <div className="space-y-2">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.merchant} - {invoice.campaign}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">${invoice.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('dashboard.upcomingEvents')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">15</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">INV-2024-002 {t('invoice.dueDate')}</p>
                  <p className="text-xs text-muted-foreground">Fashion Forward - $1,800</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-500">13</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">INV-2024-003 {t('invoice.status.overdue')}</p>
                  <p className="text-xs text-muted-foreground">Beauty Co. - $3,200</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-500">11</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">INV-2024-005 {t('invoice.dueDate')}</p>
                  <p className="text-xs text-muted-foreground">Food & Co. - $2,100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
