const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://codboudpagsoevqgoiip.supabase.co',
  'sb_publishable_9Q7X7Yn9kYQ6ZuiRtloZyQ_S3eJNvSl'
)

async function setup() {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: 'c9a7af25-4401-469d-a99b-c75a4d75fb0d',
      full_name: '',
      phone: '',
      company_name: '',
      user_type: '',
      profile_completed: false,
      share_location: false,
      notify_email: true,
      notify_sms: false,
      notify_push: false,
    })
    .select()

  if (error) {
    console.log('Table may not exist yet. Error:', error.message)
    console.log('\n=== Please create the table in Supabase SQL Editor ===\n')
    console.log(`CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  user_type text NOT NULL DEFAULT '',
  profile_completed boolean NOT NULL DEFAULT false,
  share_location boolean NOT NULL DEFAULT false,
  notify_email boolean NOT NULL DEFAULT true,
  notify_sms boolean NOT NULL DEFAULT false,
  notify_push boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);`)
  } else {
    console.log('Success! Profile row created:', data)
  }
}

setup()

