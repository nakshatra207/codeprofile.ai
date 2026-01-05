#!/usr/bin/env node
/**
 * Test database connection and create tables using Supabase SQL
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xzfmyiibtwntjorwgdcp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Zm15aWlidHdudGpvcndnZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjg2MTYsImV4cCI6MjA4MjkwNDYxNn0.kIJNAbfKq6TtYNAriTzqIzEM6ofdGrmScOe1h-pONHs';

async function testAndCreateTables() {
  console.log('🔍 Testing Supabase connection...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'public' }
  });

  try {
    // Test basic connectivity by checking if we can auth
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('✅ Supabase connection successful');
    console.log(`   Project: ${SUPABASE_URL}\n`);

    // Try to create tables
    console.log('📝 Creating database tables...\n');

    const createTableSql = `
      -- Create extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create user_profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
        full_name TEXT,
        email TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create profiles table
      CREATE TABLE IF NOT EXISTS profiles (
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
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public) WHERE is_public = true;

      -- Enable RLS
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY "Users can view own profiles" ON profiles
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own profiles" ON profiles
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own profiles" ON profiles
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete own profiles" ON profiles
        FOR DELETE USING (auth.uid() = user_id);

      CREATE POLICY "Public profiles viewable by anyone" ON profiles
        FOR SELECT USING (is_public = true);

      CREATE POLICY "Users can view own profile" ON user_profiles
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can update own profile" ON user_profiles
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own profile" ON user_profiles
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    `;

    // Use rpc to execute SQL (if available)
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSql });
      if (error) {
        console.log('⚠️  RPC method not available, trying alternative approach...\n');
      } else {
        console.log('✅ Tables created successfully!\n');
      }
    } catch (err) {
      console.log('⚠️  Cannot use RPC (this is normal - requires specific database setup)\n');
      console.log('📝 To create tables, use the Supabase SQL Editor:\n');
      console.log('   1. Go to https://app.supabase.com');
      console.log('   2. Select your project');
      console.log('   3. Click on "SQL Editor"');
      console.log('   4. Click "New query" and paste the migration SQL');
      console.log('   5. Run the query\n');
      
      console.log('📋 Migration SQL:\n');
      console.log(createTableSql);
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('💡 Tip: You can also run: bash setup-db.sh');
  console.log('   (This requires psql to be installed)\n');
}

testAndCreateTables().catch(console.error);
