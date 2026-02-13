-- Add INSERT policy so authenticated users can create their own shipments
CREATE POLICY "Users can insert own shipments" ON shipments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy so users can update their own shipments
CREATE POLICY "Users can update own shipments" ON shipments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add is_admin column to user_profiles (default false)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Admin: full access to shipments (for brokers)
-- Admins can view ALL shipments
CREATE POLICY "Admins can view all shipments" ON shipments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can update ANY shipment
CREATE POLICY "Admins can update all shipments" ON shipments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can insert shipments (with any user_id or null)
CREATE POLICY "Admins can insert shipments" ON shipments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can delete shipments
CREATE POLICY "Admins can delete shipments" ON shipments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

