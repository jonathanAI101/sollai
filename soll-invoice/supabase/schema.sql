-- SollAI Invoice Database Schema (Optimized)
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES (Only what the app currently uses)
-- ============================================

-- 商户 (Merchants)
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT '',
  campaigns INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(50),
  tax_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创作者 (Creators)
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  followers INTEGER DEFAULT 0,
  engagement DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  email VARCHAR(255),
  phone VARCHAR(50),
  social_handle VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 发票 (Invoices) - matches app's Invoice type
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'draft',
  items JSONB DEFAULT '[]',
  from_company JSONB DEFAULT '{}',
  to_company JSONB DEFAULT '{}',
  paid_to_date DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_merchants_status ON merchants(status);
CREATE INDEX idx_merchants_country ON merchants(country);
CREATE INDEX idx_creators_platform ON creators(platform);
CREATE INDEX idx_creators_status ON creators(status);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_merchant ON invoices(merchant);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow full access for both anon and authenticated users
-- (You can tighten this after adding auth)
CREATE POLICY "Allow all access" ON merchants
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access" ON creators
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access" ON invoices
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO merchants (name, country, campaigns, status, email, phone, address, city, postal_code, tax_id)
VALUES
  ('TechBrand Inc.', 'USA', 12, 'active', 'contact@techbrand.com', '+1 555-0123', '456 Tech Avenue', 'Los Angeles, CA', '90001', 'US123456789'),
  ('Fashion Forward', 'UK', 8, 'active', 'hello@fashionforward.com', '+44 20 1234 5678', '789 Fashion Blvd', 'London', 'W1A 1AA', 'GB987654321'),
  ('Beauty Co.', 'France', 5, 'pending', 'info@beautyco.fr', '+33 1 23 45 67 89', '321 Beauty Lane', 'Paris', '75001', 'FR12345678901');

INSERT INTO creators (name, platform, followers, engagement, status, email, social_handle)
VALUES
  ('Sarah Johnson', 'YouTube', 125000, 4.5, 'active', 'sarah@email.com', '@sarahjohnson'),
  ('Mike Chen', 'TikTok', 89000, 6.2, 'active', 'mike@email.com', '@mikechen'),
  ('Lisa Wang', 'Instagram', 234000, 3.8, 'active', 'lisa@email.com', '@lisawang'),
  ('Alex Kim', 'Twitter', 56000, 5.1, 'pending', 'alex@email.com', '@alexkim');
