# CodeProfile.ai - Complete Setup & Usage Guide

## ✨ What is CodeProfile.ai?

CodeProfile.ai is a platform that converts your LeetCode profile into a job-ready resume. It helps software engineers showcase their coding skills to recruiters and hiring teams.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works great)
- Your LeetCode username

### 2. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd codecraft-career-main

# Install dependencies
npm install

# Verify setup
bash verify-setup.sh
```

### 3. Configure Supabase

#### Option A: Using Existing Supabase Project (RECOMMENDED)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the SQL from `supabase/migrations/001_create_user_profiles.sql`
5. Click **Run**
6. Repeat for `supabase/migrations/001_initial_schema.sql`

#### Option B: Create New Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click **New Project**
3. Fill in project details
4. Copy your project credentials
5. Update `.env` file with:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
6. Run SQL migrations (see Option A above)

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:8080`

## 📝 Features

### ✅ User Accounts
- Sign up with email and password
- Secure authentication via Supabase Auth
- User profile management

### ✅ LeetCode Integration
- Fetch real-time LeetCode stats
- View problem-solving progress
- Analyze skill distribution
- Track consistency streaks

### ✅ Smart Scoring
- DSA Strength Score (0-100)
- Interview Readiness Score
- Difficulty balance analysis
- Performance metrics

### ✅ Resume Generation
- One-click resume download
- Multiple format options:
  - FAANG / Top Tech Companies
  - Startup / Mid-Tier Companies
  - Service-Based Companies
- Professional bullet points

### ✅ Profile Sharing
- Generate public profile URLs
- Share with recruiters
- Privacy controls (public/private)
- View and manage your profiles

### ✅ Dashboard
- Search LeetCode profiles
- Save and organize profiles
- View profile statistics
- Generate resumes

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **API Integration**: GraphQL (LeetCode)

## 🛠️ Environment Variables

Create a `.env` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional: Database URL for server-side operations
DATABASE_URL=postgresql://user:password@host:port/database
```

## 📚 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── LeetCodeProfile.tsx
│   ├── ResumeGenerator.tsx
│   └── ... other components
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main search interface
│   ├── Login.tsx       # Authentication
│   ├── Signup.tsx      # User registration
│   ├── MyProfiles.tsx  # Profile management
│   └── PublicProfile.tsx # Shareable profiles
├── hooks/              # Custom React hooks
│   ├── useLeetCodeStats.ts
│   ├── useProfile.ts
│   └── useUserProfile.ts
├── contexts/           # React Context
│   └── AuthContext.tsx # Authentication state
├── utils/              # Utility functions
│   └── resumeGenerator.ts
└── integrations/       # External integrations
    └── supabase/

supabase/
├── migrations/         # SQL migrations
├── functions/          # Edge functions
└── config.toml        # Supabase config
```

## 🔐 Security

- **Row Level Security (RLS)**: All database tables have RLS policies
- **Authentication**: Supabase Auth handles user authentication
- **Public Profiles**: Only profiles marked as public are visible without authentication
- **Private Profiles**: Only the owner can view private profiles
- **API Rate Limiting**: LeetCode API calls are rate-limited and cached

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the app
npm run build

# Deploy the dist/ folder to Netlify
```

## 📱 Usage Guide

### 1. Create Account
- Go to `/signup`
- Enter email and password
- Click "Create Account"

### 2. Search LeetCode Profile
- Go to `/dashboard`
- Enter a LeetCode username
- Click "Search"
- View stats and scores

### 3. Save Profile
- Click "Save Profile" button
- Your profile is now saved to your account

### 4. View Your Profiles
- Go to `/profiles`
- See all your saved profiles
- Toggle visibility (public/private)
- Copy share links

### 5. Generate Resume
- On any profile, click "Generate Resume"
- Choose format (FAANG, Startup, or Service)
- Download as text file

### 6. Share Profile
- Make profile public
- Copy the share link
- Send to recruiters

## 🐛 Troubleshooting

### "User not authenticated" error
- Make sure you're logged in
- Check that your auth token is valid
- Try logging out and back in

### "Profile not found" error
- Verify the LeetCode username is correct
- Make sure the LeetCode profile is public
- Check your internet connection

### Database errors
- Verify DATABASE_URL is correct
- Check that Supabase migrations were executed
- Ensure RLS policies are enabled

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📞 Support

For issues or questions:
1. Check this README
2. Review the troubleshooting section
3. Check Supabase documentation
4. Review project issues on GitHub

## 📄 License

This project is provided as-is for educational purposes.

## 🎯 Roadmap

- [ ] PDF Resume Export
- [ ] Email Notifications
- [ ] Auto-Sync (Weekly updates)
- [ ] Recruiter Dashboard
- [ ] Interview Prep Quiz
- [ ] Progress Tracking
- [ ] Mobile App

## 💡 Tips

1. **LeetCode Username**: Make sure your LeetCode profile is public
2. **Share Your Profile**: Generate a unique link and share with recruiters
3. **Update Resume**: Regenerate resume after solving more problems
4. **Privacy**: Keep your profile private until you're ready to share
5. **Track Progress**: Check back regularly to see your improvement

---

**Made with ❤️ for aspiring engineers**
