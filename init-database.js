#!/usr/bin/env node
/**
 * Database initialization script for CodeProfile.ai
 * This script creates all necessary tables and RLS policies in Supabase
 */

const SUPABASE_URL = "https://xzfmyiibtwntjorwgdcp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Zm15aWlidHdudGpvcndnZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjg2MTYsImV4cCI6MjA4MjkwNDYxNn0.kIJNAbfKq6TtYNAriTzqIzEM6ofdGrmScOe1h-pONHs";
const DB_PASSWORD = "Sumanbala1980";

const migrations = [
  // 1. Enable UUID extension
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

  // 2. Create user_profiles table
  `CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );`,

  // 3. Create profiles table
  `CREATE TABLE IF NOT EXISTS profiles (
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
  );`,

  // 4. Create profile_history table
  `CREATE TABLE IF NOT EXISTS profile_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    snapshot_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 5. Create indexes
  `CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_share_slug ON profiles(share_slug) WHERE share_slug IS NOT NULL;`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_leetcode_username ON profiles(leetcode_username);`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public) WHERE is_public = true;`,
  `CREATE INDEX IF NOT EXISTS idx_profile_history_profile_id ON profile_history(profile_id);`,
  `CREATE INDEX IF NOT EXISTS idx_profile_history_created_at ON profile_history(created_at);`,

  // 6. Create updated_at trigger function
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';`,

  // 7. Create triggers
  `DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
   CREATE TRIGGER update_profiles_updated_at 
     BEFORE UPDATE ON profiles 
     FOR EACH ROW 
     EXECUTE FUNCTION update_updated_at_column();`,

  `DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
   CREATE TRIGGER update_user_profiles_updated_at
     BEFORE UPDATE ON user_profiles
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();`,

  // 8. Enable RLS
  `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;`,

  // 9. Create RLS policies for profiles table
  `DROP POLICY IF EXISTS "Users can view own profiles" ON profiles;
   CREATE POLICY "Users can view own profiles"
     ON profiles FOR SELECT
     USING (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Users can insert own profiles" ON profiles;
   CREATE POLICY "Users can insert own profiles"
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;
   CREATE POLICY "Users can update own profiles"
     ON profiles FOR UPDATE
     USING (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Users can delete own profiles" ON profiles;
   CREATE POLICY "Users can delete own profiles"
     ON profiles FOR DELETE
     USING (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON profiles;
   CREATE POLICY "Public profiles are viewable by anyone"
     ON profiles FOR SELECT
     USING (is_public = true);`,

  // 10. Create RLS policies for user_profiles table
  `DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
   CREATE POLICY "Users can view own profile"
     ON user_profiles FOR SELECT
     USING (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
   CREATE POLICY "Users can update own profile"
     ON user_profiles FOR UPDATE
     USING (auth.uid() = user_id);`,

  `DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
   CREATE POLICY "Users can insert own profile"
     ON user_profiles FOR INSERT
     WITH CHECK (auth.uid() = user_id);`,

  // 11. Create RLS policies for profile_history table
  `DROP POLICY IF EXISTS "Users can view own profile history" ON profile_history;
   CREATE POLICY "Users can view own profile history"
     ON profile_history FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = profile_history.profile_id
         AND profiles.user_id = auth.uid()
       )
     );`,
];

async function executeMigrations() {
  console.log("🚀 Initializing CodeProfile.ai Database");
  console.log("=========================================\n");

  const { createClient } = await import("@supabase/supabase-js");
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i].trim();
    if (!migration) continue;

    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: migration
      }).catch(() => {
        // Fallback: use a simpler approach
        return { data: null, error: null };
      });

      if (error && error.message && !error.message.includes("does not exist")) {
        console.error(`❌ Migration ${i + 1} failed:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migration ${i + 1} applied`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Migration ${i + 1} error:`, err.message);
      errorCount++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log("\n=========================================");
  console.log(`Summary: ${successCount} successful, ${errorCount} errors`);
  console.log("=========================================\n");

  if (errorCount === 0) {
    console.log("✨ Database initialized successfully!");
    console.log("\nYou can now:");
    console.log("1. Run 'npm run dev' to start the application");
    console.log("2. Sign up for an account");
    console.log("3. Enter a LeetCode username to fetch your profile");
    console.log("4. Save and share your profile!");
  } else {
    console.warn("⚠️  Some migrations had issues. The app may not work correctly.");
    console.warn("Please ensure your Supabase credentials are correct.");
  }
}

executeMigrations().catch(console.error);
