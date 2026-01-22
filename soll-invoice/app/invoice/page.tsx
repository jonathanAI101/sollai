'use client';

import { useState } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

export default function InvoicePage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-2024-001',
      creator: 'Sarah Johnson',
      merchant: 'TechBrand Inc.',
      campaign: 'Summer Collection 2024',
      amount: 2500.00,
      currency: 'USD',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'paid',
    },
    {
      id: 'INV-2024-002',
      creator: 'Mike Chen',
      merchant: 'Fashion Forward',
      campaign: 'Tech Review Series',
      amount: 1800.00,
      currency: 'USD',
      issueDate: '2024-01-14',
      dueDate: '2024-02-14',
      status: 'pending',
    },
    {
      id: 'INV-2024-003',
      creator: 'Lisa Wang',
      merchant: 'Beauty Co.',
      campaign: 'Fashion Week Promo',
      amount: 3200.00,
      currency: 'USD',
      issueDate: '2024-01-13',
      dueDate: '2024-02-13',
      status: 'overdue',
    },
    {
      id: 'INV-2024-004',
      creator: 'Alex Kim',
      merchant: 'Sports Plus',
      campaign: 'Fitness Challenge',
      amount: 1500.00,
      currency: 'USD',
      issueDate: '2024-01-12',
      dueDate: '2024-02-12',
      status: 'paid',
    },
    {
      id: 'INV-2024-005',
      creator: 'Emma Davis',
      merchant: 'Food & Co.',
      campaign: 'Recipe Series',
      amount: 2100.00,
      currency: 'USD',
      issueDate: '2024-01-11',
      dueDate: '2024-02-11',
      status: 'pending',
    },
    {
      id: 'INV-2024-006',
      creator: 'James Wilson',
      merchant: 'Travel World',
      campaign: 'Destination Review',
      amount: 4500.00,
      currency: 'USD',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'paid',
    },
    {
      id: 'INV-2024-007',
      creator: 'Sophie Lee',
      merchant: 'Gaming Hub',
      campaign: 'Game Launch Event',
      amount: 3800.00,
      currency: 'USD',
      issueDate: '2024-01-09',
      dueDate: '2024-02-09',
      status: 'draft',
    },
    {
      id: 'INV-2024-008',
      creator: 'Ryan Park',
      merchant: 'Music Live',
      campaign: 'Concert Promo',
      amount: 2800.00,
      currency: 'USD',
      issueDate: '2024-01-08',
      dueDate: '2024-02-08',
      status: 'paid',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: t('invoice.status.paid'),
      pending: t('invoice.status.pending'),
      overdue: t('invoice.status.overdue'),
      draft: t('invoice.status.draft'),
    };
    return labels[status] || status;
  };

  // Calculate stats
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Layout>
      <Header
        title={t('invoice.title')}
        action={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            {t('invoice.create')}
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.total')}</p>
            <p className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.paid')}</p>
            <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.pending')}</p>
            <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.overdue')}</p>
            <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('invoice.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            {t('common.filter')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.number')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.creator')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.merchant')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.campaign')}</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.amount')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.dueDate')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.status')}</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-primary">{invoice.id}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{invoice.creator}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.merchant}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.campaign}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-foreground">${invoice.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="More">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
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
