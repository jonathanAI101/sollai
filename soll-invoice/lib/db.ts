import Dexie, { type EntityTable } from 'dexie';
import type { Company, Customer, Product, Invoice } from './types';

// Database definition
const db = new Dexie('SollInvoiceDB') as Dexie & {
  companies: EntityTable<Company, 'id'>;
  customers: EntityTable<Customer, 'id'>;
  products: EntityTable<Product, 'id'>;
  invoices: EntityTable<Invoice, 'id'>;
};

// Schema definition
db.version(1).stores({
  companies: 'id, name, shortCode, isDefault, createdAt',
  customers: 'id, name, taxNumber, *tags, createdAt',
  products: 'id, name, category, createdAt',
  invoices: 'id, invoiceNumber, companyId, customerId, status, issueDate, createdAt',
});

export { db };

// Database helper functions
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.companies.clear(),
    db.customers.clear(),
    db.products.clear(),
    db.invoices.clear(),
  ]);
}

export async function exportAllData(): Promise<{
  companies: Company[];
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
}> {
  const [companies, customers, products, invoices] = await Promise.all([
    db.companies.toArray(),
    db.customers.toArray(),
    db.products.toArray(),
    db.invoices.toArray(),
  ]);

  return { companies, customers, products, invoices };
}

export async function importAllData(data: {
  companies?: Company[];
  customers?: Customer[];
  products?: Product[];
  invoices?: Invoice[];
}): Promise<void> {
  await db.transaction('rw', [db.companies, db.customers, db.products, db.invoices], async () => {
    if (data.companies?.length) {
      await db.companies.bulkPut(data.companies);
    }
    if (data.customers?.length) {
      await db.customers.bulkPut(data.customers);
    }
    if (data.products?.length) {
      await db.products.bulkPut(data.products);
    }
    if (data.invoices?.length) {
      await db.invoices.bulkPut(data.invoices);
    }
  });
}
