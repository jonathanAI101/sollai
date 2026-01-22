-- Migration: Add foreign key relationships to invoices table
-- This migration adds merchant_id and creator_id foreign keys while
-- preserving the original merchant name as a snapshot field.

BEGIN;

-- Step 1: Add new FK columns
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES creators(id) ON DELETE SET NULL;

-- Step 2: Rename existing merchant column to merchant_name_snapshot
ALTER TABLE invoices
  RENAME COLUMN merchant TO merchant_name_snapshot;

-- Step 3: Populate merchant_id from existing merchant_name_snapshot
UPDATE invoices
SET merchant_id = merchants.id
FROM merchants
WHERE invoices.merchant_name_snapshot = merchants.name;

-- Step 4: Create indexes for FK columns
CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_creator_id ON invoices(creator_id);

-- Step 5: Add a comment documenting the migration
COMMENT ON COLUMN invoices.merchant_name_snapshot IS 'Legacy field: merchant name at time of invoice creation. Use merchant_id for current merchant data.';
COMMENT ON COLUMN invoices.merchant_id IS 'FK to merchants table. Primary way to reference the merchant.';
COMMENT ON COLUMN invoices.creator_id IS 'FK to creators table. Optional creator associated with this invoice.';

COMMIT;
