-- Migration: Add soft delete support to merchants and creators
-- Records are never fully deleted; instead deleted_at is set.

BEGIN;

ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE creators
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_merchants_deleted_at ON merchants(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_creators_deleted_at ON creators(deleted_at) WHERE deleted_at IS NULL;

COMMIT;
