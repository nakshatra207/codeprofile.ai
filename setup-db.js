import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = "https://xzfmyiibtwntjorwgdcp.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Zm15aWlidHdudGpvcndnZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjg2MTYsImV4cCI6MjA4MjkwNDYxNn0.kIJNAbfKq6TtYNAriTzqIzEM6ofdGrmScOe1h-pONHs"

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('📦 Reading schema file...')
    const schema = readFileSync('SCHEMA_SETUP.sql', 'utf-8')
    
    console.log('🧪 Testing Supabase connection...')
    const { data, error: connError } = await supabase.from('user_profiles').select('*').limit(1)
    
    if (connError && connError.message.includes('PGRST205')) {
      console.log('✅ Connection established (tables not created yet - that\'s expected)\n')
      console.log('⚠️  The RPC method for executing SQL isn\'t available in this setup.\n')
      console.log('📝 Please complete database setup manually:\n')
      console.log('1️⃣  Open: https://app.supabase.com/project/xzfmyiibtwntjorwgdcp/sql/new')
      console.log('2️⃣  Paste the contents of SCHEMA_SETUP.sql')
      console.log('3️⃣  Click "Run" button')
      console.log('4️⃣  Refresh the app at http://localhost:8081\n')
      console.log('⏱️  Takes ~30 seconds\n')
    } else if (data) {
      console.log('✅ Tables already exist! Skipping setup.')
    } else {
      console.log('Connection test results:', { connError })
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

setupDatabase()
