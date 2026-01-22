'use client';

import { useState, useEffect } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { db, Tables, InvoiceWithRelations } from '@/lib/supabase/hooks';
import { Users, Store, FileText, Wallet, TrendingUp, Calendar, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

function formatInvoiceId(id: string) {
  return `INV-${id.substring(0, 8).toUpperCase()}`;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [creators, setCreators] = useState<Tables<'creators'>[]>([]);
  const [merchants, setMerchants] = useState<Tables<'merchants'>[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [creatorsData, merchantsData, invoicesData] = await Promise.all([
          db.creators.getAll(),
          db.merchants.getAll(),
          db.invoices.getAll(),
        ]);
        setCreators(creatorsData);
        setMerchants(merchantsData);
        setInvoices(invoicesData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const recentInvoices = invoices.slice(0, 5);
  const upcomingInvoices = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())
    .slice(0, 3);

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

  if (loading) {
    return (
      <Layout>
        <Header title={t('dashboard.title')} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

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
              {recentInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No invoices yet</p>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(invoice.status || 'draft')}
                      <div>
                        <p className="text-sm font-medium text-foreground">{formatInvoiceId(invoice.id)}</p>
                        <p className="text-xs text-muted-foreground">{invoice.merchants?.name || invoice.merchant_name_snapshot || 'Unknown'} - {invoice.description || 'No description'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">${(invoice.amount || 0).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('dashboard.upcomingEvents')}
            </h3>
            <div className="space-y-2">
              {upcomingInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No upcoming events</p>
              ) : (
                upcomingInvoices.map((invoice, index) => {
                  const isOverdue = invoice.status === 'overdue';
                  const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
                  const dayNum = dueDate ? dueDate.getDate().toString() : '—';
                  const colorClass = isOverdue ? 'red' : 'blue';
                  return (
                    <div key={invoice.id} className={`flex items-center gap-3 py-2 ${index < upcomingInvoices.length - 1 ? 'border-b border-border' : ''}`}>
                      <div className={`w-10 h-10 rounded-lg bg-${colorClass}-500/10 flex items-center justify-center`}>
                        <span className={`text-xs font-bold text-${colorClass}-500`}>{dayNum}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formatInvoiceId(invoice.id)} {isOverdue ? t('invoice.status.overdue') : t('invoice.dueDate')}
                        </p>
                        <p className="text-xs text-muted-foreground">{invoice.merchants?.name || invoice.merchant_name_snapshot || 'Unknown'} - ${(invoice.amount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
