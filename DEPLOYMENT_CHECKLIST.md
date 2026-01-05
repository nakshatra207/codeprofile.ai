# CodeProfile.ai - Production Deployment Checklist

## Pre-Deployment Requirements ✅

### 1. Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in dev mode
- [ ] No TODO comments in critical paths

### 2. Environment Configuration
- [ ] `.env` file configured with production URLs
- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` set correctly
- [ ] `DATABASE_URL` updated for production DB
- [ ] No credentials hardcoded in code
- [ ] `.env` added to `.gitignore`

### 3. Database Setup
- [ ] Supabase project created
- [ ] Database migrations applied:
  - [ ] `001_create_user_profiles.sql`
  - [ ] `001_initial_schema.sql`
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies configured and tested
- [ ] Backups configured in Supabase
- [ ] Database connection tested

### 4. Authentication
- [ ] Supabase Auth enabled
- [ ] Email provider configured
- [ ] Auth URLs configured in Supabase settings
- [ ] Redirect URLs set correctly
- [ ] Email templates customized (optional)

### 5. Security
- [ ] CORS properly configured
- [ ] Rate limiting enabled on API functions
- [ ] API keys never logged
- [ ] Sensitive data encrypted
- [ ] HTTPS enforced (on production)
- [ ] Security headers set
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled

### 6. Performance
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Caching strategies implemented
- [ ] API response times acceptable (<2s)
- [ ] Database queries optimized
- [ ] CDN configured (if applicable)

### 7. Monitoring & Logging
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics enabled (if needed)
- [ ] Logging infrastructure set up
- [ ] Monitoring dashboards created
- [ ] Alert thresholds configured

---

## Deployment Steps

### Step 1: Prepare Repository
```bash
# Clean up
rm -rf node_modules dist
rm .env.local

# Install dependencies
npm install

# Run build
npm run build

# Verify build output
ls -la dist/
```

### Step 2: Configure Production Environment
```bash
# Create production .env
cat > .env.production << EOF
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-prod-key
DATABASE_URL=postgresql://prod-user:prod-pass@prod-db:5432/prod-db
EOF
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Verify deployment
# Visit your production URL
```

### Step 4: Deploy to Netlify

```bash
# Build locally
npm run build

# Option A: Drag and drop dist/ folder
# Visit: https://app.netlify.com/drop

# Option B: Use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Step 5: Configure Domain
- [ ] Purchase domain (if needed)
- [ ] Point DNS to hosting provider
- [ ] Enable SSL/TLS certificate
- [ ] Configure redirect URLs in Supabase

### Step 6: Final Verification

```bash
# Test in production
curl https://your-domain.com

# Verify all routes work
# - Home page loads
# - Sign up works
# - Login works
# - Dashboard loads
# - Profile search works

# Test error scenarios
# - Invalid credentials
# - Non-existent user
# - Network errors
```

---

## Supabase Production Checklist

### Database
- [ ] Production database created
- [ ] Backups enabled
- [ ] Point-in-time recovery configured
- [ ] Database size monitored
- [ ] Performance metrics reviewed

### Security
- [ ] RLS policies enabled and tested
- [ ] API keys rotated
- [ ] Firewall rules configured (if applicable)
- [ ] IP whitelist reviewed
- [ ] Service role key secured

### Authentication
- [ ] Auth policies reviewed
- [ ] Session timeout configured
- [ ] Password requirements set
- [ ] Email confirmation required
- [ ] Rate limiting enabled

### Functions
- [ ] Edge functions deployed
- [ ] Secrets configured
- [ ] Memory limits set appropriately
- [ ] Timeout values configured
- [ ] Logs accessible

---

## Post-Deployment Tasks

### 1. Monitoring (First 24 hours)
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Verify API response times
- [ ] Monitor user signups
- [ ] Check for security alerts

### 2. User Communication
- [ ] Send launch notification
- [ ] Update status page
- [ ] Post on social media
- [ ] Email user base (if applicable)

### 3. Documentation
- [ ] Update README with production URL
- [ ] Create troubleshooting guide
- [ ] Document support process
- [ ] Create incident response plan

### 4. Backups
- [ ] Verify database backups
- [ ] Test backup restoration
- [ ] Document backup procedure
- [ ] Schedule backup reviews

---

## Rollback Plan

If issues arise:

1. **Immediate Rollback**
   ```bash
   # Vercel
   vercel --prod --target <previous-deployment-id>
   
   # Netlify
   netlify deploy --prod --dir=previous-dist
   ```

2. **Database Rollback**
   - Use Supabase point-in-time recovery
   - Restore from latest backup
   - Update connection strings

3. **Communication**
   - Notify users of issue
   - Provide ETA for fix
   - Post status updates

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Home Page Load | < 2s | TBD |
| Authentication | < 1s | TBD |
| Dashboard | < 2s | TBD |
| LeetCode Fetch | < 4s | TBD |
| Resume Download | Instant | TBD |
| Database Query | < 100ms | TBD |

---

## Security Checklist

- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] CORS properly scoped
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] SQL injection prevention verified
- [ ] Rate limiting active
- [ ] API authentication required
- [ ] User data encrypted in transit
- [ ] Secrets not in logs
- [ ] Dependencies updated
- [ ] Security headers set

---

## Post-Launch Monitoring

### Daily
- [ ] Check error logs
- [ ] Review user feedback
- [ ] Monitor critical metrics

### Weekly
- [ ] Performance analysis
- [ ] Security audit
- [ ] Database health check
- [ ] Backup verification

### Monthly
- [ ] Full system review
- [ ] Security penetration test
- [ ] Performance optimization
- [ ] Capacity planning

---

## Support Resources

For deployment help:
1. Vercel Docs: https://vercel.com/docs
2. Netlify Docs: https://docs.netlify.com/
3. Supabase Docs: https://supabase.com/docs
4. React Docs: https://react.dev

---

## Sign-Off

- [ ] Tech Lead: _____________________ Date: _____
- [ ] DevOps: _____________________ Date: _____
- [ ] QA: _____________________ Date: _____
- [ ] Product: _____________________ Date: _____

---

**Status**: Ready for Deployment ✅
**Last Updated**: January 3, 2026
**Next Review**: After First Week in Production
