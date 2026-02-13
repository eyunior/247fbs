-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT NOT NULL UNIQUE,
  bol_number TEXT NOT NULL DEFAULT '',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  origin TEXT NOT NULL DEFAULT '',
  destination TEXT NOT NULL DEFAULT '',
  pickup_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  equipment_type TEXT NOT NULL DEFAULT '',
  weight INTEGER,
  commodity TEXT NOT NULL DEFAULT '',
  carrier_name TEXT NOT NULL DEFAULT '',
  shipper_name TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast tracking lookups
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_bol ON shipments(bol_number);
CREATE INDEX idx_shipments_user ON shipments(user_id);

-- RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view shipments (for tracking by number)
CREATE POLICY "Authenticated users can view shipments" ON shipments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can view their own shipments
CREATE POLICY "Users can view own shipments" ON shipments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for seeding)
CREATE POLICY "Service role full access" ON shipments
  FOR ALL USING (auth.role() = 'service_role');

