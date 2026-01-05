# CodeProfile.ai - Database Setup Guide

## The Network Error Issue

The app is experiencing "NetworkError when attempting to fetch resource" because the Supabase database tables don't exist yet.

## Quick Fix (2 minutes)

### Option 1: Use Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `xzfmyiibtwntjorwgdcp`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire content of `SCHEMA_SETUP.sql` from this project
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for the query to complete (should say "Success")
9. Done! Refresh the app and you should be able to sign up

### Option 2: Using Command Line (Linux/Mac)

If you have `psql` installed:

```bash
# Install psql if needed
# On Ubuntu: sudo apt install postgresql-client-common postgresql-client
# On Mac: brew install postgresql

# Then run:
bash setup-db.sh
```

### Option 3: Using Docker

```bash
docker run --rm postgres:16 psql \
  -h db.pvklrsgqyapbugxejeyf.supabase.co \
  -U postgres \
  -d postgres \
  -f SCHEMA_SETUP.sql
```

When prompted, enter password: `Sumanbala1980`

## What Gets Created

The setup creates these tables:
- `user_profiles` - Stores user account information
- `profiles` - Stores saved LeetCode profiles
- `profile_history` - Stores snapshots of profiles over time

Plus:
- Row Level Security (RLS) policies - Users can only see their own data
- Indexes - For fast queries
- Triggers - To automatically update timestamps

## Verify Setup Success

After running the SQL:

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
3. You should see: `user_profiles`, `profiles`, `profile_history`

If you see them, the setup is complete!

## Next Steps

1. Refresh your app browser (Ctrl+R or Cmd+R)
2. Click "Get Started Free" or navigate to /signup
3. Create an account with email and password
4. Go to the Dashboard
5. Enter a LeetCode username (e.g., "leetcode")
6. Click Search to fetch the profile
7. Click "Save Profile" to store it
8. View all your profiles on the "My Profiles" page
9. Make a profile public to get a shareable link!

## Troubleshooting

### Still seeing "NetworkError"?
- Check that all SQL statements ran without errors
- Try clearing your browser cache (Ctrl+Shift+Delete)
- Make sure you're using the correct password: `Sumanbala1980`

### "No API key found" error?
- This is normal if testing with curl
- The app handles authentication automatically

### "Could not find the table" error?
- The migrations haven't been applied yet
- Use the Supabase Dashboard method above

## Contact

If you need help:
1. Check the browser console (F12) for detailed error messages
2. Look at the Network tab to see what requests are failing
3. Verify your Supabase credentials are correct in `.env`

