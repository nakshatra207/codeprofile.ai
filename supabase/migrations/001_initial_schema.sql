-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table to store LeetCode profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username VARCHAR(255) NOT NULL,
  profile_data JSONB NOT NULL, -- Stores the full LeetCodeStats JSON
  share_slug VARCHAR(255) UNIQUE, -- For shareable URLs (e.g., codeprofile.ai/u/abc123)
  is_public BOOLEAN DEFAULT false, -- Whether profile is publicly accessible via slug
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ, -- When profile was last synced from LeetCode
  
  -- Ensure one profile per user per leetcode_username
  UNIQUE(user_id, leetcode_username)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_share_slug ON profiles(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_leetcode_username ON profiles(leetcode_username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public) WHERE is_public = true;

-- Profile history table to track changes over time (for analytics)
CREATE TABLE IF NOT EXISTS profile_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL, -- Snapshot of profile data at this point in time
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_history_profile_id ON profile_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_history_created_at ON profile_history(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique share slug
CREATE OR REPLACE FUNCTION generate_share_slug()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profiles
CREATE POLICY "Users can view own profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profiles
CREATE POLICY "Users can insert own profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profiles
CREATE POLICY "Users can update own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own profiles
CREATE POLICY "Users can delete own profiles"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public profiles can be viewed by anyone (via share_slug)
CREATE POLICY "Public profiles are viewable by anyone"
  ON profiles FOR SELECT
  USING (is_public = true);

-- Policy: Users can view their own profile history
CREATE POLICY "Users can view own profile history"
  ON profile_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_history.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Policy: System can insert profile history (via service role)
-- Note: For production, you might want to use a service role key for inserts

-- Create a function to automatically create a profile for a user's first login
-- This is optional, but can be useful
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- You can add default profile creation logic here if needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

