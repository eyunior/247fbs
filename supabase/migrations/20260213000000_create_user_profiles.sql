CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL DEFAULT '',
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  mc_number TEXT NOT NULL DEFAULT '',
  dot_number TEXT NOT NULL DEFAULT '',
  interstate_permit TEXT NOT NULL DEFAULT '',
  ein_ssn_w9 TEXT NOT NULL DEFAULT '',
  dba TEXT NOT NULL DEFAULT '',
  mc_dot_authorities_url TEXT NOT NULL DEFAULT '',
  insurance_company TEXT NOT NULL DEFAULT '',
  insurance_contact_name TEXT NOT NULL DEFAULT '',
  insurance_phone TEXT NOT NULL DEFAULT '',
  factoring_company TEXT NOT NULL DEFAULT '',
  factoring_contact_name TEXT NOT NULL DEFAULT '',
  factoring_phone TEXT NOT NULL DEFAULT '',
  num_drivers INTEGER NOT NULL DEFAULT 1,
  num_trucks INTEGER NOT NULL DEFAULT 1,
  equipment_types TEXT NOT NULL DEFAULT '[]',
  preferred_states TEXT NOT NULL DEFAULT '[]',
  shipper_contact_name TEXT NOT NULL DEFAULT '',
  shipper_contact_phone TEXT NOT NULL DEFAULT '',
  shipper_contact_email TEXT NOT NULL DEFAULT '',
  share_location BOOLEAN NOT NULL DEFAULT false,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  notify_sms BOOLEAN NOT NULL DEFAULT false,
  notify_push BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

