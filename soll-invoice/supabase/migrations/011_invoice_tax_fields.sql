-- Migration: Add tax and subtotal fields to invoices

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12, 2);

-- Backfill subtotal for existing invoices (subtotal = amount when no tax)
UPDATE invoices SET subtotal = amount WHERE subtotal IS NULL;

-- Update to_company JSONB structure documentation
COMMENT ON COLUMN invoices.to_company IS 'JSON: {name, email, address, city, state, postalCode, country, phone}';
