'use client';

import { Layout, Header } from '@/components/layout';
import { CustomerList } from '@/components/customer';
import { useI18n } from '@/lib/i18n';

export default function CustomersPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <Header title={t('customer.title')} />

      <div className="p-4 md:p-6">
        <CustomerList />
      </div>
    </Layout>
  );
}
