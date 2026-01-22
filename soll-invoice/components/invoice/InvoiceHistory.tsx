'use client';

import { useState, useEffect } from 'react';
import { db, type InvoiceAuditLog } from '@/lib/supabase/hooks';
import { CheckCircle, Clock, XCircle, FileText, Ban, Mail, Trash2, PenLine } from 'lucide-react';

interface InvoiceHistoryProps {
  invoiceId: string;
  language: string;
}

const actionConfig: Record<string, { icon: typeof CheckCircle; color: string; label: Record<string, string> }> = {
  created: {
    icon: FileText,
    color: 'text-blue-400',
    label: { zh: '创建发票', en: 'Invoice created' },
  },
  status_changed: {
    icon: PenLine,
    color: 'text-yellow-400',
    label: { zh: '状态变更', en: 'Status changed' },
  },
  updated: {
    icon: PenLine,
    color: 'text-muted-foreground',
    label: { zh: '发票更新', en: 'Invoice updated' },
  },
  voided: {
    icon: Ban,
    color: 'text-orange-400',
    label: { zh: '发票作废', en: 'Invoice voided' },
  },
  email_sent: {
    icon: Mail,
    color: 'text-green-400',
    label: { zh: '邮件发送', en: 'Email sent' },
  },
  deleted: {
    icon: Trash2,
    color: 'text-red-400',
    label: { zh: '发票删除', en: 'Invoice deleted' },
  },
};

const statusLabels: Record<string, Record<string, string>> = {
  draft: { zh: '草稿', en: 'Draft' },
  pending: { zh: '待付', en: 'Pending' },
  paid: { zh: '已付', en: 'Paid' },
  overdue: { zh: '逾期', en: 'Overdue' },
  voided: { zh: '已作废', en: 'Voided' },
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

export function InvoiceHistory({ invoiceId, language }: InvoiceHistoryProps) {
  const [logs, setLogs] = useState<InvoiceAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.invoiceAudit.getByInvoice(invoiceId)
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [invoiceId]);

  const lang = language === 'zh' ? 'zh' : 'en';

  const getDescription = (log: InvoiceAuditLog) => {
    if (log.action === 'status_changed' && log.old_value && log.new_value) {
      const oldStatus = String(log.old_value.status || '');
      const newStatus = String(log.new_value.status || '');
      const oldLabel = statusLabels[oldStatus]?.[lang] || oldStatus;
      const newLabel = statusLabels[newStatus]?.[lang] || newStatus;
      return `${oldLabel} → ${newLabel}`;
    }
    if (log.action === 'email_sent' && log.metadata) {
      return log.metadata.recipient as string;
    }
    if (log.action === 'created' && log.new_value) {
      const amount = log.new_value.amount;
      const merchant = log.new_value.merchant;
      return `${merchant} · $${Number(amount).toLocaleString()}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {language === 'zh' ? '加载中...' : 'Loading...'}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {language === 'zh' ? '暂无操作记录' : 'No history yet'}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => {
        const config = actionConfig[log.action] || actionConfig.updated;
        const Icon = config.icon;
        const description = getDescription(log);
        const isLast = index === logs.length - 1;

        return (
          <div key={log.id} className="flex gap-3">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border min-h-[20px]" />}
            </div>

            {/* Content */}
            <div className="pb-4 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {config.label[lang]}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {description}
                </p>
              )}
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                {formatTime(log.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
