#!/bin/bash

# CodeProfile.ai - Complete Setup & Verification Script
# This script verifies that everything is properly configured

set -e

echo "🔍 CodeProfile.ai - Complete Setup Verification"
echo "==============================================="
echo ""

# Check 1: Environment variables
echo "✓ Checking environment variables..."
if [ -f ".env" ]; then
    echo "  ✅ .env file found"
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo "  ✅ VITE_SUPABASE_URL configured"
    else
        echo "  ❌ VITE_SUPABASE_URL missing"
        exit 1
    fi
    
    if grep -q "VITE_SUPABASE_PUBLISHABLE_KEY" .env; then
        echo "  ✅ VITE_SUPABASE_PUBLISHABLE_KEY configured"
    else
        echo "  ❌ VITE_SUPABASE_PUBLISHABLE_KEY missing"
        exit 1
    fi
    
    if grep -q "DATABASE_URL" .env; then
        echo "  ✅ DATABASE_URL configured"
    else
        echo "  ❌ DATABASE_URL missing (optional but recommended)"
    fi
else
    echo "  ❌ .env file not found"
    exit 1
fi

# Check 2: Node modules
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ Dependencies installed"
else
    echo "  ⚠️  Installing dependencies..."
    npm install
fi

# Check 3: Build
echo ""
echo "✓ Checking build..."
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build successful"
else
    echo "  ❌ Build failed"
    exit 1
fi

# Check 4: Show migration files
echo ""
echo "✓ Database migration files:"
if [ -d "supabase/migrations" ]; then
    for file in supabase/migrations/*.sql; do
        echo "  ✅ $(basename $file)"
    done
else
    echo "  ⚠️  No migration files found"
fi

echo ""
echo "==============================================="
echo "✅ All checks passed!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📋 Database Setup Instructions:"
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Open your project SQL editor"
echo "3. Copy and execute the SQL from:"
echo "   supabase/migrations/001_create_user_profiles.sql"
echo "4. Then copy and execute:"
echo "   supabase/migrations/001_initial_schema.sql"
echo ""
echo "✨ After database setup:"
echo "   npm run dev"
echo "   Visit: http://localhost:8080"
echo ""
