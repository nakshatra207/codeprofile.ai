# Setup Guide for CodeProfile.ai

This guide will help you set up the application with authentication and database functionality.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2.2 Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL script

This will create:
- `profiles` table for storing user profiles
- `profile_history` table for tracking profile changes
- Row Level Security (RLS) policies
- Indexes for performance

### 2.3 Configure Authentication

In Supabase Dashboard:
1. Go to Authentication > Settings
2. Enable Email authentication
3. (Optional) Configure email templates

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

## Step 4: Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Step 5: Test the Setup

1. Go to `/signup` and create an account
2. Go to `/dashboard` and search for a LeetCode username
3. Click "Save Profile" to save your first profile
4. Go to `/profiles` to view your saved profiles

## Database Schema

### Tables

**profiles**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `leetcode_username` (VARCHAR)
- `profile_data` (JSONB) - Stores complete LeetCode stats
- `share_slug` (VARCHAR, Unique) - For public URLs
- `is_public` (BOOLEAN) - Whether profile is publicly accessible
- `created_at`, `updated_at`, `last_synced_at` (TIMESTAMPTZ)

**profile_history**
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key to profiles)
- `snapshot_data` (JSONB) - Historical snapshot
- `created_at` (TIMESTAMPTZ)

## Features Implemented

✅ **Authentication System**
- Sign up / Sign in pages
- Auth context for global state
- Protected routes

✅ **Profile Management**
- Save profiles to database
- View all saved profiles
- Delete profiles
- Toggle public/private visibility
- Shareable profile URLs (`/u/{slug}`)

✅ **Database**
- Full schema with RLS policies
- Profile history tracking (schema ready)
- Unique share slugs

## Next Steps (To Complete MVP)

1. **Resume Generator** - PDF export functionality
2. **Auto-sync** - Background jobs to update profiles
3. **Recruiter Dashboard** - B2B features
4. **Email Notifications** - User engagement

## Troubleshooting

### "User not authenticated" error
- Make sure you're signed in
- Check that RLS policies are correctly set up
- Verify Supabase credentials in `.env`

### Database errors
- Ensure migration SQL has been run
- Check Supabase dashboard for table creation
- Verify RLS policies are enabled

### Authentication not working
- Check Supabase Auth settings
- Verify email authentication is enabled
- Check browser console for errors

## Support

For issues, check:
- Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev
- Project README.md

