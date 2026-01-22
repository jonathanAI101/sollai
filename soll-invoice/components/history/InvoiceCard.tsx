'use client';

import { FileText, Download, Printer, Mail, Copy, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { INVOICE_STATUSES } from '@/lib/constants';
import type { Invoice, Customer, Company } from '@/lib/types';

interface InvoiceCardProps {
  invoice: Invoice;
  customer?: Customer;
  company?: Company;
  onStatusChange: (status: Invoice['status']) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onEmail: () => void;
  onView: () => void;
}

export function InvoiceCard({
  invoice,
  customer,
  company,
  onStatusChange,
  onDuplicate,
  onDelete,
  onDownload,
  onPrint,
  onEmail,
  onView,
}: InvoiceCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = INVOICE_STATUSES.find((s) => s.value === invoice.status);

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={onView}>
          <div className="flex items-center gap-2 flex-wrap cursor-pointer">
            <span className="font-mono text-sm text-foreground">
              {invoice.invoiceNumber}
            </span>
            <Badge
              variant={
                invoice.status === 'paid'
                  ? 'success'
                  : invoice.status === 'void'
                  ? 'destructive'
                  : invoice.status === 'issued'
                  ? 'primary'
                  : 'default'
              }
            >
              {statusConfig?.label || invoice.status}
            </Badge>
          </div>
          <p className="text-sm text-foreground mt-1 truncate">
            {customer?.name || '未知客户'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {company?.shortCode} · {formatDate(invoice.issueDate)}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground tabular-nums">
            {formatCurrency(invoice.total)}
          </p>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 w-40 py-1">
                {/* Status Actions */}
                {invoice.status === 'issued' && (
                  <button
                    onClick={() => {
                      onStatusChange('paid');
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                  >
                    标记为已付款
                  </button>
                )}
                {invoice.status === 'draft' && (
                  <button
                    onClick={() => {
                      onStatusChange('issued');
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                  >
                    确认开票
                  </button>
                )}
                {invoice.status !== 'void' && (
                  <button
                    onClick={() => {
                      onStatusChange('void');
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left text-destructive hover:bg-secondary transition-colors"
                  >
                    作废
                  </button>
                )}

                <div className="border-t border-border my-1" />

                {/* Export Actions */}
                <button
                  onClick={() => {
                    onDownload();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载 PDF
                </button>
                <button
                  onClick={() => {
                    onPrint();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  打印
                </button>
                <button
                  onClick={() => {
                    onEmail();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  发送邮件
                </button>

                <div className="border-t border-border my-1" />

                {/* Other Actions */}
                <button
                  onClick={() => {
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制为新发票
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-destructive hover:bg-secondary transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
