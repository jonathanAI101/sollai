'use client';

import { Layout, Header } from '@/components/layout';
import { ProductList } from '@/components/product';
import { useI18n } from '@/lib/i18n';

export default function ProductsPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <Header title={t('product.title')} />

      <div className="p-4 md:p-6">
        <ProductList />
      </div>
    </Layout>
  );
}
