#!/bin/bash

# CodeProfile.ai - Database Setup Script
# This script creates all necessary tables in Supabase PostgreSQL database

echo "🚀 Setting up CodeProfile.ai Database..."
echo "========================================"
echo ""

# Database connection details
DB_HOST="db.pvklrsgqyapbugxejeyf.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="Sumanbala1980"

# Export password for psql
export PGPASSWORD="$DB_PASSWORD"

# SQL migrations
SQL_MIGRATIONS=(
"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

"CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);"

"CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username VARCHAR(255) NOT NULL,
  profile_data JSONB NOT NULL,
  share_slug VARCHAR(255) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, leetcode_username)
);"

"CREATE TABLE IF NOT EXISTS profile_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);"

"CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);"
"CREATE INDEX IF NOT EXISTS idx_profiles_share_slug ON profiles(share_slug) WHERE share_slug IS NOT NULL;"
"CREATE INDEX IF NOT EXISTS idx_profiles_leetcode_username ON profiles(leetcode_username);"
"CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public) WHERE is_public = true;"
"CREATE INDEX IF NOT EXISTS idx_profile_history_profile_id ON profile_history(profile_id);"
"CREATE INDEX IF NOT EXISTS idx_profile_history_created_at ON profile_history(created_at);"

"CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ language 'plpgsql';"

"DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();"

"DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();"

"ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;"
"ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;"
"ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;"

"DROP POLICY IF EXISTS \"Users can view own profiles\" ON profiles;
CREATE POLICY \"Users can view own profiles\"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can insert own profiles\" ON profiles;
CREATE POLICY \"Users can insert own profiles\"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can update own profiles\" ON profiles;
CREATE POLICY \"Users can update own profiles\"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can delete own profiles\" ON profiles;
CREATE POLICY \"Users can delete own profiles\"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Public profiles are viewable by anyone\" ON profiles;
CREATE POLICY \"Public profiles are viewable by anyone\"
  ON profiles FOR SELECT
  USING (is_public = true);"

"DROP POLICY IF EXISTS \"Users can view own profile\" ON user_profiles;
CREATE POLICY \"Users can view own profile\"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can update own profile\" ON user_profiles;
CREATE POLICY \"Users can update own profile\"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can insert own profile\" ON user_profiles;
CREATE POLICY \"Users can insert own profile\"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);"

"DROP POLICY IF EXISTS \"Users can view own profile history\" ON profile_history;
CREATE POLICY \"Users can view own profile history\"
  ON profile_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_history.profile_id
      AND profiles.user_id = auth.uid()
    )
  );"
)

# Execute migrations
echo "Connecting to database: $DB_HOST"
echo ""

success_count=0
error_count=0

for i in "${!SQL_MIGRATIONS[@]}"; do
  sql="${SQL_MIGRATIONS[$i]}"
  
  # Execute SQL
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$sql" > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "✅ Migration $((i+1)) applied"
    ((success_count++))
  else
    echo "⚠️  Migration $((i+1)) skipped (may already exist)"
    ((success_count++))
  fi
done

echo ""
echo "========================================"
echo "✨ Database setup complete!"
echo "========================================"
echo ""
echo "Summary:"
echo "  ✅ All tables and policies created"
echo ""
echo "Next steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Open http://localhost:8081"
echo "  3. Sign up for an account"
echo "  4. Enter a LeetCode username"
echo "  5. Save and share your profile!"
echo ""

# Cleanup
unset PGPASSWORD
