-- Migration: Add invoice audit log table for tracking status changes and actions

CREATE TABLE invoice_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_invoice_id ON invoice_audit_logs(invoice_id);
CREATE INDEX idx_audit_created_at ON invoice_audit_logs(created_at DESC);

-- RLS
ALTER TABLE invoice_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to invoice_audit_logs"
  ON invoice_audit_logs FOR ALL
  USING (true)
  WITH CHECK (true);
