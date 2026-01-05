import { supabase } from "@/integrations/supabase/client";

export async function setupDatabase() {
  console.log("Setting up database tables...");
  
  try {
    // Create user_profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
          full_name TEXT,
          email TEXT NOT NULL,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
        CREATE TRIGGER update_user_profiles_updated_at
          BEFORE UPDATE ON user_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS (Row Level Security)
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

        -- Create policy for users to see their own profile
        CREATE POLICY "Users can view own profile"
          ON user_profiles FOR SELECT
          USING (auth.uid() = user_id);

        -- Create policy for users to update their own profile
        CREATE POLICY "Users can update own profile"
          ON user_profiles FOR UPDATE
          USING (auth.uid() = user_id);

        -- Create policy for users to insert their own profile
        CREATE POLICY "Users can insert own profile"
          ON user_profiles FOR INSERT
          WITH CHECK (auth.uid() = user_id);
      `
    });

    if (profilesError) {
      console.error("Error creating user_profiles table:", profilesError);
      return false;
    }

    // Create profiles table for LeetCode data
    const { error: leetcodeError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          leetcode_username TEXT NOT NULL,
          profile_data JSONB NOT NULL,
          share_slug TEXT UNIQUE,
          is_public BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          last_synced_at TIMESTAMP WITH TIME ZONE,
          
          CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
          CONSTRAINT profiles_share_slug_key UNIQUE (share_slug)
        );

        -- Create updated_at trigger
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
        CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies
        DROP POLICY IF EXISTS "Users can view own profiles" ON profiles;
        DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;
        DROP POLICY IF EXISTS "Users can insert own profiles" ON profiles;
        DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

        -- Create policies
        CREATE POLICY "Users can view own profiles"
          ON profiles FOR SELECT
          USING (auth.uid() = user_id OR is_public = true);

        CREATE POLICY "Users can update own profiles"
          ON profiles FOR UPDATE
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own profiles"
          ON profiles FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Public profiles are viewable by everyone"
          ON profiles FOR SELECT
          USING (is_public = true);
      `
    });

    if (leetcodeError) {
      console.error("Error creating profiles table:", leetcodeError);
      return false;
    }

    console.log("Database setup completed successfully!");
    return true;
  } catch (error) {
    console.error("Database setup failed:", error);
    return false;
  }
}

// Alternative approach using direct SQL if RPC doesn't work
export async function setupDatabaseDirect() {
  console.log("Setting up database with direct SQL...");
  
  try {
    // Since we can't use RPC, let's create a simple test to verify connection
    const { data, error } = await supabase.from('user_profiles').select('count');
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, we need to create it manually
      console.log("Tables don't exist. Please run the SQL migration manually in Supabase dashboard:");
      console.log("1. Go to https://supabase.com/dashboard/project/xzfmyiibtwntjorwgdcp");
      console.log("2. Navigate to SQL Editor");
      console.log("3. Run the contents of: /supabase/migrations/001_create_user_profiles.sql");
      return false;
    }
    
    console.log("Database tables exist and are accessible!");
    return true;
  } catch (error) {
    console.error("Database check failed:", error);
    return false;
  }
}
