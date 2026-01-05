# CodeProfile.ai - Quick Start Guide

## 🚀 Get Your App Running in 5 Minutes

### Step 1: Clone & Install (1 min)
```bash
cd /home/nakshatra/Downloads/codecraft-career-main
npm install
```

### Step 2: Create Supabase Project (2 min)

1. Go to **https://supabase.com/dashboard**
2. Click **"New Project"**
3. Fill in:
   - Project Name: `CodeProfile-AI`
   - Database Password: (Generate a strong one)
   - Region: (Choose closest to your users)
4. Click **"Create new project"** (wait 2-3 min)
5. Once created, go to **Settings → API**
6. Copy these two values:
   ```
   URL: https://xxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Set Up Environment Variables (1 min)

Create `.env.local` file in root:
```bash
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-url.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_ALLOWED_ORIGIN=http://localhost:8080
EOF
```

Replace `your-url` and `your-anon-key` with values from Supabase.

### Step 4: Run Database Migrations (1 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy-paste contents of [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql)
4. Click **"Run"** (green button)
5. You should see: "Query executed successfully"

### Step 5: Start Dev Server (1 min)

```bash
npm run dev
```

Open **http://localhost:8080** in your browser 🎉

---

## ✅ Verify Everything Works

### Test Authentication
1. Click **"Sign Up"** (top right)
2. Create account with email/password
3. You should be redirected to dashboard
4. See your email in top right dropdown

### Test LeetCode Profile
1. On dashboard, enter: `nakshatra` (or any LeetCode username)
2. Click search icon
3. You should see stats load (name, ranking, problems, etc.)

### Test Profile Saving
1. After stats load, click **"Save Profile"**
2. Go to **"My Profiles"** (from dropdown menu)
3. You should see your saved profile

### Test Recruiter Dashboard
1. Go to URL: **http://localhost:8080/recruiter**
2. You should see sample candidates with filters
3. Filters should work (DSA, Consistency, Readiness)

---

## 📊 Understanding the Scoring

When you load a profile, you'll see three scores:

### 1. **DSA Strength** (0-100)
- Based on: Total problems + Topic diversity
- Formula: `(problem_score + topic_score) / 2`
- Example: 350 easy + 280 med + 95 hard = DSA 77

### 2. **Consistency Score** (0-100)
- Based on: Solving streak + Contest participation
- Formula: `min(streak_days * 3) + min(contests * 2)`
- Example: 45-day streak + 28 contests = Consistency 95

### 3. **Interview Readiness** (0-100)
- Based on: All above factors weighted
- Formula: `(DSA * 0.4) + (Consistency * 0.3) + (Other * 0.3)`
- Example: Combined score = 88 = **FAANG Ready**

---

## 📱 Feature Checklist

### ✅ Working Now
- [x] Sign up / Login
- [x] LeetCode stats fetching
- [x] Scoring calculation
- [x] Profile saving
- [x] Profile sharing (public URLs)
- [x] Resume generation
- [x] Recruiter filtering (mock data)

### 🟡 Next Phase (Not yet)
- [ ] Auto-refresh profiles
- [ ] Weekly email updates
- [ ] Contact candidate emails
- [ ] CSV export
- [ ] Stripe payments
- [ ] Recruiter subscriptions

---

## 🔧 Troubleshooting

### "VITE_SUPABASE_URL is not defined"
→ Create `.env.local` file with correct values

### "Cannot connect to Supabase"
→ Check your URL and Anon Key are correct (no spaces)

### "Error creating profile"
→ Run migrations in Supabase (Step 4 above)

### "LeetCode stats not loading"
→ Check if username is valid
→ Ensure `supabase/functions/leetcode-stats` is deployed

### "Sign up not working"
→ Go to Supabase Settings → Auth
→ Check if Email Provider is enabled
→ Check SMTP settings if using custom email

---

## 📚 Project Structure

```
src/
├── pages/              # Route pages
│   ├── Dashboard.tsx   # Main profile search
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── MyProfiles.tsx  # Saved profiles
│   ├── PublicProfile.tsx
│   └── RecruiterDashboard.tsx
├── components/         # UI components
│   ├── LeetCodeProfile.tsx  # Main stats display
│   ├── ResumeGenerator.tsx
│   ├── SkillRadar.tsx
│   └── Navbar.tsx
├── contexts/           # State management
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   ├── useProfile.ts
│   ├── useLeetCodeStats.ts
│   └── useUserProfile.ts
└── utils/
    └── resumeGenerator.ts

supabase/
├── migrations/         # Database schema
│   └── 001_initial_schema.sql
└── functions/          # Edge functions
    └── leetcode-stats/ # GraphQL fetcher
```

---

## 🚢 Ready to Deploy?

### Free Hosting Options
1. **Vercel** (Recommended) - Free tier
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Netlify** - Free tier
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   ```

3. **Firebase** - Free tier
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

### Production Checklist
- [ ] Update `VITE_SUPABASE_URL` for production
- [ ] Update `VITE_ALLOWED_ORIGIN` to your domain
- [ ] Set up custom domain (codeprofile.ai)
- [ ] Enable HTTPS
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics
- [ ] Configure email service (Resend/SendGrid)
- [ ] Set up Stripe payments
- [ ] Security: Enable 2FA on Supabase
- [ ] Backup: Enable automated backups in Supabase

---

## 💡 Quick Wins to Add

### This Week
- [ ] Add PDF resume export (pdfkit)
- [ ] Add profile preview before saving
- [ ] Add more stats (monthly progress chart)
- [ ] Add profile comparison (vs other users)

### This Month
- [ ] Email notifications for weekly updates
- [ ] Skill decay warnings
- [ ] Recruiter profile subscriptions
- [ ] CSV export for recruiters
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Happy coding! 🎉**  
Built with ❤️ for developers, by developers.
