'use client';

import { useState } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Download, Filter, CheckCircle, Clock, AlertCircle, Search, X, Eye } from 'lucide-react';

type Settlement = {
  id: number;
  invoiceId: string;
  creator: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
};

export default function SettlementPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'processing'>('all');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data for settlements - matching invoice data
  const [settlements, setSettlements] = useState<Settlement[]>([
    { id: 1, invoiceId: 'INV-2024-001', creator: 'Sarah Johnson', amount: 2500, date: '2024-01-15', status: 'completed' },
    { id: 2, invoiceId: 'INV-2024-002', creator: 'Mike Chen', amount: 1800, date: '2024-01-14', status: 'pending' },
    { id: 3, invoiceId: 'INV-2024-003', creator: 'Lisa Wang', amount: 3200, date: '2024-01-13', status: 'processing' },
    { id: 4, invoiceId: 'INV-2024-004', creator: 'Alex Kim', amount: 1500, date: '2024-01-12', status: 'completed' },
    { id: 5, invoiceId: 'INV-2024-005', creator: 'Emma Davis', amount: 2100, date: '2024-01-11', status: 'pending' },
    { id: 6, invoiceId: 'INV-2024-006', creator: 'James Wilson', amount: 4500, date: '2024-01-10', status: 'completed' },
    { id: 7, invoiceId: 'INV-2024-008', creator: 'Ryan Park', amount: 2800, date: '2024-01-08', status: 'completed' },
  ]);

  // Filter settlements
  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = searchQuery === '' ||
      settlement.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.creator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats from actual data
  const totalPaid = filteredSettlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0);
  const totalPending = filteredSettlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
  const totalProcessing = filteredSettlements.filter(s => s.status === 'processing').reduce((sum, s) => sum + s.amount, 0);

  const stats = [
    { label: t('settlement.totalPaid'), value: `$${totalPaid.toLocaleString()}`, status: 'completed' },
    { label: t('settlement.pending'), value: `$${totalPending.toLocaleString()}`, status: 'pending' },
    { label: t('settlement.processing'), value: `$${totalProcessing.toLocaleString()}`, status: 'processing' },
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t('settlement.totalPaid');
      case 'pending': return t('settlement.pending');
      case 'processing': return t('settlement.processing');
      default: return status;
    }
  };

  const handleExportAll = () => {
    const csvContent = [
      ['ID', 'Invoice', 'Creator', 'Amount', 'Date', 'Status'],
      ...filteredSettlements.map(s => [
        s.id, s.invoiceId, s.creator, s.amount, s.date, s.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlements-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewSettlement = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setShowDetailModal(true);
  };

  const handleMarkAsCompleted = (id: number) => {
    setSettlements(settlements.map(s => s.id === id ? { ...s, status: 'completed' as const } : s));
    setShowDetailModal(false);
  };

  return (
    <Layout>
      <Header
        title={t('settlement.title')}
        action={
          <Button variant="outline" size="sm" onClick={handleExportAll}>
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

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search settlements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <Filter className="w-4 h-4" />
              {t('common.filter')}
            </Button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10 p-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">{t('settlement.status')}</p>
                {['all', 'completed', 'pending', 'processing'].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status as typeof statusFilter); setShowFilterMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded flex items-center gap-2 ${statusFilter === status ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                  >
                    {status !== 'all' && getStatusIcon(status)}
                    {status === 'all' ? t('common.all') : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settlements List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.number')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.creator')}</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.amount')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.date')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('settlement.status')}</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSettlements.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-primary">{item.invoiceId}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{item.creator}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">${item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewSettlement(item)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => handleMarkAsCompleted(item.id)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4 text-muted-foreground hover:text-green-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSettlements.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {t('common.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Settlement Detail Modal */}
      {showDetailModal && selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{selectedSettlement.invoiceId}</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedSettlement.status)}`}>
                  {getStatusIcon(selectedSettlement.status)}
                  {getStatusLabel(selectedSettlement.status)}
                </span>
                <p className="text-2xl font-bold text-foreground">${selectedSettlement.amount.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">{t('settlement.creator')}</p>
                  <p className="text-sm font-medium text-foreground">{selectedSettlement.creator}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('settlement.date')}</p>
                  <p className="text-sm font-medium text-foreground">{selectedSettlement.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('invoice.number')}</p>
                  <p className="text-sm font-medium text-primary">{selectedSettlement.invoiceId}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              {selectedSettlement.status !== 'completed' ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                    {t('common.close')}
                  </Button>
                  <Button className="flex-1" onClick={() => handleMarkAsCompleted(selectedSettlement.id)}>
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </Button>
                </>
              ) : (
                <Button className="flex-1" onClick={() => setShowDetailModal(false)}>
                  {t('common.close')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
