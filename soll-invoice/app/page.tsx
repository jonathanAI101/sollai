'use client';

import { useState } from 'react';
import { Layout, Header } from '@/components/layout';
import { InvoiceForm } from '@/components/invoice';
import { Modal } from '@/components/ui/Modal';
import { Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import type { Invoice } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [successInvoice, setSuccessInvoice] = useState<Invoice | null>(null);

  const handleSuccess = (invoice: Invoice) => {
    setSuccessInvoice(invoice);
  };

  const handleCloseSuccess = () => {
    setSuccessInvoice(null);
  };

  const handleViewHistory = () => {
    setSuccessInvoice(null);
    router.push('/history');
  };

  return (
    <Layout>
      <Header title={t('invoice.title')} />

      <div className="p-4 md:p-6">
        <InvoiceForm onSuccess={handleSuccess} />
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={!!successInvoice}
        onClose={handleCloseSuccess}
        title=""
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {successInvoice?.status === 'draft' ? t('success.draftSaved') : t('success.invoiceCreated')}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            {t('invoice.number')}: {successInvoice?.invoiceNumber}
          </p>
          <p className="text-2xl font-bold text-primary tabular-nums mb-6">
            ¥{successInvoice?.total.toFixed(2)}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCloseSuccess}
              className="flex-1"
            >
              {t('success.continue')}
            </Button>
            <Button
              onClick={handleViewHistory}
              className="flex-1"
            >
              <FileText className="w-4 h-4" />
              {t('success.viewHistory')}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
