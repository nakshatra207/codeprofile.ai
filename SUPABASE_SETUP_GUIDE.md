# 🚀 Supabase Setup - Complete Step-by-Step Guide

**Total Time: 5-10 minutes**

---

## STEP 1: Create Supabase Project

### Action: Visit https://supabase.com/dashboard

1. **Sign up or log in** (create free account if needed)
2. Click **"New Project"** button
3. Fill in project details:
   - **Project Name**: `codeprofile-ai` (lowercase, no spaces)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `us-east-1`, `ap-south-1`)
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes for database to initialize...

**You'll see a progress bar. Once complete, you'll be in the Supabase dashboard.**

---

## STEP 2: Get Your API Credentials

### Action: Go to Settings → API

1. Click **Settings** (bottom left)
2. Click **API** (left sidebar)
3. You'll see:
   ```
   Project URL:  https://xxxxxxxxxxxxx.supabase.co
   
   API Keys:
   - Service Role: sk_service_xxxxxxxxx...
   - Anon Public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Copy These Two Values:
```
URL:              https://xxxxxxxxxxxxx.supabase.co
Anon Public Key:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**💡 Save these in a text file - you'll need them in 30 seconds!**

---

## STEP 3: Create .env.local File

### Action: Create environment variables

**Open terminal and run this command:**

```bash
cat > /home/nakshatra/Downloads/codecraft-career-main/.env.local << 'EOF'
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_HERE
EOF
```

### ⚠️ IMPORTANT: Replace values!

1. Replace `YOUR_PROJECT_ID` with the first part of your URL
   - If URL is `https://abcdef123456.supabase.co`
   - Then PROJECT_ID is `abcdef123456`

2. Replace `YOUR_ANON_KEY_HERE` with your Anon Public Key (the long JWT string)

### Example (filled in):
```bash
cat > /home/nakshatra/Downloads/codecraft-career-main/.env.local << 'EOF'
VITE_SUPABASE_URL=https://abcdef123456.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZjEyMzQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA0MjcxMDk5LCJleHAiOjE3MzU4MDcwOTl9.xxxxx
EOF
```

**✅ Now you have `.env.local` configured!**

---

## STEP 4: Run Database Migrations

### Action: Create tables in Supabase

1. Go back to Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **"New Query"** (green button)
4. You should see a blank SQL editor

### Copy-Paste the migration SQL:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username TEXT NOT NULL,
  profile_data JSONB,
  share_slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_synced_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_share_slug ON profiles(share_slug);
CREATE INDEX idx_profiles_is_public ON profiles(is_public);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles" ON profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Run the SQL:

1. Copy entire SQL above
2. Paste into Supabase SQL Editor
3. Click **"Run"** (green play button on right)
4. ✅ You should see: **"Query executed successfully"**

If you get an error, that's OK - might be duplicate tables. Just continue to Step 5.

---

## STEP 5: Start Development Server

### Action: Run the app

```bash
cd /home/nakshatra/Downloads/codecraft-career-main
npm run dev
```

You should see:
```
  VITE v7.3.0  ready in 523 ms

  ➜  Local:   http://localhost:8080/
  ➜  press h to show help
```

**Open browser → http://localhost:8080**

---

## ✅ VERIFICATION CHECKLIST

### Test 1: Sign Up
- [ ] Click "Sign Up" button (top right)
- [ ] Enter email + password
- [ ] Submit form
- [ ] Redirected to dashboard
- [ ] See email in top right dropdown

**If this works, authentication is ✅ functioning!**

---

### Test 2: Search LeetCode Profile
- [ ] On dashboard, enter `nakshatra` (or try your own LeetCode username)
- [ ] Click search button
- [ ] Wait 2-3 seconds...
- [ ] Should see stats load:
  - Name
  - Ranking
  - Problem breakdown (Easy/Medium/Hard)
  - Topics chart
  - Contest info
- [ ] See "Save Profile" button

**If this works, LeetCode integration is ✅ functioning!**

---

### Test 3: Save Profile
- [ ] After stats load, click "Save Profile"
- [ ] Should see toast: "Profile saved successfully"
- [ ] Click dropdown → "My Profiles"
- [ ] See your saved profile in list
- [ ] Click toggle icon → profile should become public

**If this works, database is ✅ functioning!**

---

### Test 4: View Public Profile
- [ ] Click 3-dot menu on your saved profile
- [ ] Should see share link
- [ ] Open link in new tab
- [ ] Should see public profile page (no login required)

**If this works, public sharing is ✅ functioning!**

---

### Test 5: Recruiter Dashboard
- [ ] Open http://localhost:8080/recruiter
- [ ] Should see mock candidates
- [ ] Try filters:
  - DSA: High/Medium/Low
  - Consistency: High/Medium/Low
  - Readiness: FAANG/Product/Startup/Building
- [ ] Should filter candidates

**If this works, UI/Filtering is ✅ functioning!**

---

## 🎉 SUCCESS!

If all 5 tests pass, **your app is fully functional and ready to deploy!**

Next steps:
1. Deploy to Vercel/Netlify (see DEPLOYMENT.md)
2. Share with beta users
3. Collect feedback
4. Build recruiter APIs (Week 2)

---

## ⚠️ TROUBLESHOOTING

### Error: "VITE_SUPABASE_URL is not defined"
**Solution**: `.env.local` file not found
- Check file exists: `ls -la /home/nakshatra/Downloads/codecraft-career-main/.env.local`
- Make sure no spaces in variable names
- Restart dev server: `npm run dev`

### Error: "LeetCode fetch failed"
**Solution**: LeetCode GraphQL API down (temporary)
- Wait 1 minute and try again
- Try different username
- Check browser console for details

### Error: "Cannot create profile - database error"
**Solution**: Database not initialized
- Go to Supabase dashboard
- Check SQL Editor - did migrations run?
- Check RLS policies are enabled

### Error: "Auth fails - invalid credentials"
**Solution**: Supabase credentials wrong
- Go to Supabase Settings → API
- Re-copy URL and anon key
- Update `.env.local` file
- Delete `.env.local` and recreate

### Page shows "Not Found"
**Solution**: React Router not working
- Make sure dev server is running
- Clear browser cache (Ctrl+Shift+Del)
- Restart dev server: `npm run dev`

---

## 📞 Need Help?

Check these files:
- **CTO_AUDIT_REPORT.md** - Full technical audit
- **FINAL_VERIFICATION.md** - Verification checklist
- **FEATURE_GAP_ANALYSIS.md** - What's next
- **README.md** - Project overview

---

**You're all set! 🚀 Time to build something amazing!**
