-- Migration: Add void support to invoices
-- Paid invoices can be voided instead of deleted.

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS voided_reason TEXT DEFAULT NULL;
