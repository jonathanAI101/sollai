-- Migration: Add sequential invoice numbering system

CREATE TABLE invoice_number_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT NULL,
  prefix VARCHAR(20) DEFAULT 'INV',
  year INTEGER NOT NULL,
  last_number INTEGER DEFAULT 0,
  format VARCHAR(50) DEFAULT '{prefix}-{year}-{number}',
  number_padding INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, prefix, year)
);

-- Atomic function to get next invoice number
CREATE OR REPLACE FUNCTION get_next_invoice_number(
  p_user_id UUID DEFAULT NULL,
  p_prefix VARCHAR DEFAULT 'INV',
  p_year INTEGER DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_number INTEGER;
  v_padding INTEGER;
  v_format VARCHAR;
  v_result TEXT;
BEGIN
  v_year := COALESCE(p_year, EXTRACT(YEAR FROM NOW())::INTEGER);

  INSERT INTO invoice_number_sequences (user_id, prefix, year, last_number)
  VALUES (p_user_id, p_prefix, v_year, 1)
  ON CONFLICT (user_id, prefix, year)
  DO UPDATE SET last_number = invoice_number_sequences.last_number + 1
  RETURNING last_number, number_padding, format INTO v_number, v_padding, v_format;

  IF v_padding IS NULL THEN v_padding := 4; END IF;
  IF v_format IS NULL THEN v_format := '{prefix}-{year}-{number}'; END IF;

  v_result := v_format;
  v_result := REPLACE(v_result, '{prefix}', p_prefix);
  v_result := REPLACE(v_result, '{year}', v_year::TEXT);
  v_result := REPLACE(v_result, '{number}', LPAD(v_number::TEXT, v_padding, '0'));

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Preview function (doesn't consume a number)
CREATE OR REPLACE FUNCTION preview_next_invoice_number(
  p_user_id UUID DEFAULT NULL,
  p_prefix VARCHAR DEFAULT 'INV',
  p_year INTEGER DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_number INTEGER;
  v_padding INTEGER;
  v_format VARCHAR;
  v_result TEXT;
BEGIN
  v_year := COALESCE(p_year, EXTRACT(YEAR FROM NOW())::INTEGER);

  SELECT last_number + 1, number_padding, format
  INTO v_number, v_padding, v_format
  FROM invoice_number_sequences
  WHERE user_id IS NOT DISTINCT FROM p_user_id
    AND prefix = p_prefix
    AND year = v_year;

  IF v_number IS NULL THEN v_number := 1; END IF;
  IF v_padding IS NULL THEN v_padding := 4; END IF;
  IF v_format IS NULL THEN v_format := '{prefix}-{year}-{number}'; END IF;

  v_result := v_format;
  v_result := REPLACE(v_result, '{prefix}', p_prefix);
  v_result := REPLACE(v_result, '{year}', v_year::TEXT);
  v_result := REPLACE(v_result, '{number}', LPAD(v_number::TEXT, v_padding, '0'));

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Add invoice_number column to invoices
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50) UNIQUE;

-- Backfill existing invoices with generated numbers
WITH numbered AS (
  SELECT id, created_at,
    'INV-' || EXTRACT(YEAR FROM created_at)::TEXT || '-' ||
    LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0') AS gen_number
  FROM invoices
  WHERE invoice_number IS NULL
)
UPDATE invoices
SET invoice_number = numbered.gen_number
FROM numbered
WHERE invoices.id = numbered.id;

-- RLS
ALTER TABLE invoice_number_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to invoice_number_sequences"
  ON invoice_number_sequences FOR ALL
  USING (true)
  WITH CHECK (true);
