'use client';

import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import type { Invoice, Customer, Company } from '@/lib/types';

interface InvoiceDetailProps {
  invoice: Invoice;
  customer?: Customer;
  company?: Company;
}

export function InvoiceDetail({ invoice, customer, company }: InvoiceDetailProps) {
  return (
    <InvoicePreview
      companyId={invoice.companyId}
      customerId={invoice.customerId}
      items={invoice.items}
      totals={{
        subtotal: invoice.subtotal,
        totalTax: invoice.totalTax,
        total: invoice.total,
      }}
      paymentMethod={invoice.paymentMethod}
      remark={invoice.remark}
      invoiceNumber={invoice.invoiceNumber}
    />
  );
}
