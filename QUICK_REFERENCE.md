# ⚡ CodeProfile.ai - Quick Reference Guide

## 🚀 Start Here

### 1. Apply Database Migrations (IMPORTANT!)
Go to: https://supabase.com/dashboard → Your Project → SQL Editor

**Run these in order:**

**Migration 1:**
```sql
-- Paste contents of: supabase/migrations/001_create_user_profiles.sql
-- Then click: Run
```

**Migration 2:**
```sql
-- Paste contents of: supabase/migrations/001_initial_schema.sql
-- Then click: Run
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open App
Visit: http://localhost:8081

---

## 📱 Quick Usage

### Sign Up
1. Go to `/signup`
2. Enter email, password, name
3. Click "Create Account"

### Search LeetCode Profile
1. Go to `/dashboard`
2. Enter LeetCode username (e.g., "neetcode")
3. Click Search
4. View stats and scores

### Save Profile
1. Click "Save Profile" button
2. Profile saved to your account

### Generate Resume
1. Click "Generate Resume"
2. Choose format (FAANG/Startup/Service)
3. Click "Download"
4. File saves as .txt

### Share Profile
1. Go to "/profiles"
2. Make profile "Public"
3. Click "Copy Link"
4. Share link with others

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Home | / |
| Dashboard | /dashboard |
| My Profiles | /profiles |
| Public Profile | /u/{slug} |
| Login | /login |
| Signup | /signup |
| Settings | /settings |
| Recruiter | /recruiter |

---

## 📋 Common Tasks

### Test Authentication
```
Email: test@example.com
Password: TestPass123!
```

### Test with LeetCode Username
```
Username: neetcode
Username: 1737404
Username: 0610501
```

### Check Dev Server
```bash
npm run dev
# Server runs on: http://localhost:8081
```

### Build for Production
```bash
npm run build
# Output: dist/ folder
```

### Run Linter
```bash
npm run lint
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "User not authenticated" | Login first at /login |
| "LeetCode user not found" | Use valid public username |
| "Database error" | Apply migrations in Supabase |
| "Port already in use" | App uses port 8081 (or next available) |
| "Dependencies missing" | Run: npm install |
| "Build fails" | Clear node_modules: rm -rf node_modules && npm install |

---

## 📚 Documentation Map

```
docs/
├── PROJECT_COMPLETE.md         ← Start here! Full overview
├── SETUP_COMPLETE.md           ← Complete setup guide
├── TESTING_GUIDE.md            ← How to test features
├── DEPLOYMENT_CHECKLIST.md     ← Before going live
├── CODE_REVIEW_REPORT.md       ← Code quality review
├── CTO_AUDIT_REPORT.md         ← Technical audit
├── README.md                   ← Original README
└── README_FEATURES.md          ← Feature documentation
```

---

## ✅ Verification Checklist

Before launching:
- [ ] Migrations applied in Supabase
- [ ] Dev server running: `npm run dev`
- [ ] Sign up works
- [ ] Login works
- [ ] LeetCode search works
- [ ] Profile save works
- [ ] Resume generation works
- [ ] Public sharing works

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🚀 Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 💡 Key Features

✅ **Authentication** - Secure signup/login  
✅ **LeetCode API** - Real-time data fetch  
✅ **Scoring** - Smart readiness calculation  
✅ **Resume** - Professional generation  
✅ **Sharing** - Public profile URLs  
✅ **Responsive** - Works on all devices  
✅ **Fast** - Cached API responses  
✅ **Secure** - RLS policies enabled  

---

## 🎯 Success Metrics

After deployment:
- Users can sign up
- Profiles appear in database
- Resume generates correctly
- Public profiles accessible
- API response <2 seconds
- No console errors

---

## 📞 Need Help?

1. **Check** → PROJECT_COMPLETE.md
2. **Read** → SETUP_COMPLETE.md
3. **Test** → TESTING_GUIDE.md
4. **Deploy** → DEPLOYMENT_CHECKLIST.md

---

**Last Updated**: January 3, 2026  
**Status**: ✅ READY TO LAUNCH  

🎉 **Your app is production-ready!**
