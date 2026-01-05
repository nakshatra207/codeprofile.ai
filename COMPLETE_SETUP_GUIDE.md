# CodeProfile.ai - Complete Setup & Troubleshooting Guide

## Current Status

✅ **Frontend**: Fully built and running at http://localhost:8081  
✅ **Supabase Connection**: Configured and ready  
⚠️ **Database Tables**: Need to be created  

## The Network Error Explained

When you see "NetworkError when attempting to fetch resource", it means:
- The app is trying to save a profile to the database
- The database tables don't exist yet
- The API returns a 404 error

## 3-Step Fix

### Step 1: Create Database Tables (2 minutes)

**Option A: Using Supabase Web Dashboard (EASIEST)**

1. Open https://app.supabase.com
2. Log in to your account
3. Click on project `xzfmyiibtwntjorwgdcp`
4. Go to **SQL Editor** (left sidebar)
5. Click **New Query**
6. Open file: [SCHEMA_SETUP.sql](./SCHEMA_SETUP.sql)
7. Copy ALL the SQL code
8. Paste into the Supabase SQL Editor
9. Click **Run** (Ctrl+Enter)
10. ✅ Done!

**Option B: Using Command Line**

```bash
# Only if you have psql installed
bash setup-db.sh
```

**Option C: Using Docker**

```bash
docker run --rm -it postgres:16 psql \
  -h db.pvklrsgqyapbugxejeyf.supabase.co \
  -U postgres \
  -d postgres \
  -f SCHEMA_SETUP.sql
```
Password: `Sumanbala1980`

### Step 2: Verify Tables Were Created

In Supabase SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `profiles`
- `profile_history` 
- `user_profiles`

### Step 3: Refresh Your App

1. Press `Ctrl+R` (or `Cmd+R` on Mac) to refresh your browser
2. The error message should disappear
3. You can now use all features!

## What Each Table Does

| Table | Purpose |
|-------|---------|
| `user_profiles` | Stores user account info (name, email, avatar) |
| `profiles` | Stores saved LeetCode profiles + metadata |
| `profile_history` | Archives past snapshots for tracking progress |

## Feature Checklist

After setting up the database, you can:

- ✅ Sign up with email and password
- ✅ Fetch LeetCode profile data
- ✅ Save profiles to your account
- ✅ View all your saved profiles
- ✅ Make profiles public/private
- ✅ Share profiles with custom URLs
- ✅ Generate text resumes
- ✅ View profile analytics

## Testing the App

1. **Sign Up**
   ```
   Go to: http://localhost:8081/signup
   Email: test@example.com
   Password: Password123
   ```

2. **Fetch a Profile**
   ```
   Go to: http://localhost:8081/dashboard
   Enter LeetCode username: "StefanPochmann" or "ljpzzz"
   Click: Search
   ```

3. **Save Your Profile**
   ```
   Click: Save Profile
   (Now it's stored in your account)
   ```

4. **View Saved Profiles**
   ```
   Click: My Profiles (in navbar)
   (See all profiles you've saved)
   ```

5. **Share a Profile**
   ```
   Make public: Toggle "Public" on any profile
   Copy link: Click the link icon
   Share with others!
   ```

## Credentials

Your database is pre-configured with these credentials:

```
Supabase URL: https://xzfmyiibtwntjorwgdcp.supabase.co
Project ID:   xzfmyiibtwntjorwgdcp
API Key:      (in .env file as VITE_SUPABASE_PUBLISHABLE_KEY)
Password:     Sumanbala1980
```

These are in `.env` and automatically loaded by the app.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React + TypeScript)                           │
│ - Auth pages (Login, Signup)                            │
│ - Dashboard (Fetch & Save profiles)                     │
│ - My Profiles (List, share, delete)                     │
│ - Public Profiles (View via /u/{slug})                  │
└────────────┬────────────────────────────────────────────┘
             │
             ↓ REST API (Supabase)
┌──────────────────────────────────────────────────────────┐
│ Backend (Supabase + PostgreSQL)                         │
│ - Auth: users, sessions, tokens                         │
│ - Data: user_profiles, profiles, profile_history       │
│ - RLS: Row-level security for data privacy             │
│ - Functions: Edge Functions (LeetCode API integration)  │
└────────────┬─────────────────────────────────────────────┘
             │
             ↓ GraphQL API
┌──────────────────────────────────────────────────────────┐
│ External APIs                                            │
│ - LeetCode GraphQL (fetch coding stats)                 │
└──────────────────────────────────────────────────────────┘
```

## Common Issues & Solutions

### "Could not find the table 'public.profiles'"
→ Database tables haven't been created yet  
→ **Fix**: Follow "Step 1: Create Database Tables" above

### "NetworkError when attempting to fetch resource"
→ Usually means database tables are missing  
→ **Fix**: Run the SQL schema setup

### "JWT expired" or auth errors
→ Your session token expired  
→ **Fix**: Sign out and sign back in

### "Profile data not saving"
→ Check if you're logged in (look for your name in navbar)  
→ **Fix**: Make sure you're signed in before saving

### LeetCode username returns "not found"
→ The username doesn't exist or is private  
→ **Fix**: Try a different username like "StefanPochmann"

## Development Commands

```bash
# Start dev server (http://localhost:8081)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

## File Structure

```
codecraft-career-main/
├── src/
│   ├── pages/          # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Sign up page
│   │   └── MyProfiles.tsx  # Profile management
│   ├── components/     # Reusable components
│   │   ├── Navbar.tsx      # Navigation
│   │   ├── LeetCodeProfile.tsx  # Profile display
│   │   └── ResumeGenerator.tsx  # Resume generation
│   ├── hooks/          # React hooks
│   │   ├── useAuth.ts      # Authentication
│   │   ├── useProfile.ts   # Profile management
│   │   └── useLeetCodeStats.ts  # API integration
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx # Auth state
│   └── utils/          # Utilities
│       └── resumeGenerator.ts
├── supabase/
│   ├── migrations/     # Database migrations
│   └── functions/      # Edge functions
├── .env                # Environment variables
├── SCHEMA_SETUP.sql    # Database schema (RUN THIS!)
├── DATABASE_SETUP.md   # Database setup guide
└── package.json
```

## Next Steps for Production

1. ✅ Create database tables (see Step 1)
2. ⬜ Deploy to hosting (Vercel, Netlify, AWS, etc.)
3. ⬜ Set up custom domain
4. ⬜ Configure email notifications
5. ⬜ Add payment processing (Stripe)
6. ⬜ Set up recruiter dashboard

## Need Help?

1. Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database-specific help
2. Look at browser console (F12) for error messages
3. Check Network tab in DevTools to see what requests are failing
4. Review Supabase documentation: https://supabase.com/docs

---

**Made with ❤️ for developers**

Start building your coding profile today! 🚀
