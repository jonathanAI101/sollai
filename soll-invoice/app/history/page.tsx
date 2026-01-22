'use client';

import { Layout, Header } from '@/components/layout';
import { InvoiceList } from '@/components/history';
import { useI18n } from '@/lib/i18n';

export default function HistoryPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <Header title={t('history.title')} />

      <div className="p-4 md:p-6">
        <InvoiceList />
      </div>
    </Layout>
  );
}
