'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock, Search, Filter } from 'lucide-react';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useCustomerStore } from '@/stores/customerStore';
import { useCompanyStore } from '@/stores/companyStore';
import { InvoiceCard } from './InvoiceCard';
import { InvoiceDetail } from './InvoiceDetail';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { INVOICE_STATUSES } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { downloadInvoicePDF, printInvoice, sendInvoiceByEmail } from '@/lib/pdf';
import type { Invoice, InvoiceStatus } from '@/lib/types';

export function InvoiceList() {
  const {
    invoices,
    isLoading,
    loadInvoices,
    updateInvoiceStatus,
    duplicateInvoice,
    deleteInvoice,
    getInvoiceStats,
  } = useInvoiceStore();
  const { customers, loadCustomers } = useCustomerStore();
  const { companies, loadCompanies } = useCompanyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
    loadCustomers();
    loadCompanies();
  }, [loadInvoices, loadCustomers, loadCompanies]);

  const stats = useMemo(() => getInvoiceStats(), [invoices]);

  const filteredInvoices = useMemo(() => {
    let result = invoices;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((inv) => {
        const customer = customers.find((c) => c.id === inv.customerId);
        return (
          inv.invoiceNumber.toLowerCase().includes(query) ||
          customer?.name.toLowerCase().includes(query)
        );
      });
    }

    if (selectedStatus) {
      result = result.filter((inv) => inv.status === selectedStatus);
    }

    return result;
  }, [invoices, customers, searchQuery, selectedStatus]);

  const handleDownload = async (invoice: Invoice) => {
    setViewingInvoice(invoice);
    // Wait for the modal to render
    setTimeout(async () => {
      try {
        await downloadInvoicePDF('invoice-preview', `${invoice.invoiceNumber}.pdf`);
      } catch (error) {
        console.error('Download failed:', error);
        alert('下载失败，请重试');
      }
      setViewingInvoice(null);
    }, 500);
  };

  const handlePrint = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setTimeout(() => {
      try {
        printInvoice('invoice-preview');
      } catch (error) {
        console.error('Print failed:', error);
      }
      setViewingInvoice(null);
    }, 500);
  };

  const handleEmail = (invoice: Invoice) => {
    const customer = customers.find((c) => c.id === invoice.customerId);
    const subject = `发票 ${invoice.invoiceNumber}`;
    const body = `您好，\n\n附件是发票 ${invoice.invoiceNumber}，金额 ${formatCurrency(invoice.total)}。\n\n谢谢！`;
    sendInvoiceByEmail(customer?.email || '', subject, body);
  };

  const handleDelete = async (id: string) => {
    await deleteInvoice(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">本月开票</p>
          <p className="text-xl font-semibold text-foreground tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">本月金额</p>
          <p className="text-xl font-semibold text-foreground tabular-nums">
            {formatCurrency(stats.totalAmount)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">已付款</p>
          <p className="text-xl font-semibold text-success tabular-nums">
            {stats.paidCount}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">待付款</p>
          <p className="text-xl font-semibold text-warning tabular-nums">
            {stats.unpaidCount}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索发票号、客户名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStatus === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            全部
          </button>
          {INVOICE_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === status.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {searchQuery || selectedStatus ? '没有找到匹配的发票' : '暂无发票记录'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery || selectedStatus
                ? '尝试调整搜索条件'
                : '您开具的发票会显示在这里'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              customer={customers.find((c) => c.id === invoice.customerId)}
              company={companies.find((c) => c.id === invoice.companyId)}
              onStatusChange={(status) => updateInvoiceStatus(invoice.id, status)}
              onDuplicate={() => duplicateInvoice(invoice.id)}
              onDelete={() => setDeleteConfirm(invoice.id)}
              onDownload={() => handleDownload(invoice)}
              onPrint={() => handlePrint(invoice)}
              onEmail={() => handleEmail(invoice)}
              onView={() => setViewingInvoice(invoice)}
            />
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        title="发票详情"
        size="xl"
      >
        {viewingInvoice && (
          <InvoiceDetail
            invoice={viewingInvoice}
            customer={customers.find((c) => c.id === viewingInvoice.customerId)}
            company={companies.find((c) => c.id === viewingInvoice.companyId)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="确认删除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            确定要删除此发票吗？此操作无法撤销。
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1"
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
