#!/bin/bash

echo "🚀 Setting up CodeProfile.ai Database"
echo "=================================="

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Extract project ID from config
PROJECT_ID=$(grep "project_id" supabase/config.toml | cut -d'"' -f2)
echo "📋 Project ID: $PROJECT_ID"

echo ""
echo "🔧 To complete the setup, please follow these steps:"
echo ""
echo "1. Open your browser and go to:"
echo "   https://supabase.com/dashboard/project/$PROJECT_ID/sql"
echo ""
echo "2. Copy and paste the following SQL code:"
echo ""
echo "----------------------------------------"
cat supabase/migrations/001_create_user_profiles.sql
echo "----------------------------------------"
echo ""
echo "3. Click 'Run' to execute the migration"
echo ""
echo "4. After running the migration, your authentication system will be ready!"
echo ""
echo "🎉 Then you can start the app with: npm run dev"
echo ""
echo "📱 The app will be available at: http://localhost:8080"
echo ""
echo "🔐 Anyone can create accounts at: http://localhost:8080/signup"
echo "🔑 And login at: http://localhost:8080/login"
