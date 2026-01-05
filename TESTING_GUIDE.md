# CodeProfile.ai - Quick Testing Guide

## Prerequisites
- Supabase project with migrations applied
- Development server running (`npm run dev`)
- Browser open to `http://localhost:8080`

## Test Scenario 1: Authentication Flow ✅

### Step 1: Sign Up
1. Navigate to `/signup`
2. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPassword123!"
   - Confirm: "TestPassword123!"
3. Click "Create Account"
4. Expected: Redirect to dashboard

### Step 2: Login
1. Navigate to `/login`
2. Enter same email and password
3. Click "Sign In"
4. Expected: Access dashboard

### Step 3: Check Profile
1. In navbar, verify your name/email is displayed
2. Click dropdown to see options
3. Expected: Dashboard, My Profiles, Settings, Sign Out options

---

## Test Scenario 2: LeetCode Profile Fetch ✅

### Step 1: Search Profile
1. On Dashboard, enter "LeetCode username" (e.g., "neetcode", "1737404")
2. Click Search
3. Expected: Stats load within 2-3 seconds

### Step 2: Verify Data Display
You should see:
- ✅ LeetCode ranking and reputation
- ✅ Problem statistics (Easy/Medium/Hard split)
- ✅ Skill radar chart
- ✅ Interview readiness score
- ✅ Scoring dashboard

---

## Test Scenario 3: Profile Saving ✅

### Step 1: Save Profile
1. After fetching LeetCode stats, click "Save Profile"
2. Expected: Toast notification "Profile saved!"

### Step 2: View Saved Profiles
1. Click navbar → "My Profiles"
2. Expected: Your saved profile appears in list with username

### Step 3: Verify Data
1. Click profile card to expand
2. Expected: All stats display correctly

---

## Test Scenario 4: Public Sharing ✅

### Step 1: Make Profile Public
1. On "My Profiles" page
2. Click profile to expand
3. Click "Make Public" button
4. Expected: Status changes to "Public"

### Step 2: Get Share Link
1. Click "Copy Link" button
2. Expected: Toast shows "Link copied!"

### Step 3: Test Public Access
1. Open new incognito window (or different browser)
2. Paste the share link
3. Expected: Profile visible without authentication

---

## Test Scenario 5: Resume Generation ✅

### Step 1: Generate Resume
1. On Dashboard with loaded stats, click "Generate Resume"
2. Select format: "FAANG"
3. Check options (Skills, Contests, Badges)
4. Click "Download"
5. Expected: .txt file downloads

### Step 2: Verify Resume Content
Open downloaded file and verify:
- ✅ Username and ranking
- ✅ Problem-solving bullet points
- ✅ Skills section
- ✅ Contest performance (if applicable)
- ✅ Professional summary

---

## Test Scenario 6: Profile Management ✅

### Step 1: Delete Profile
1. On "My Profiles" page
2. Click profile to expand
3. Click "Delete" button
4. Confirm deletion
5. Expected: Profile removed from list

### Step 2: Multiple Profiles
1. Search different LeetCode usernames
2. Save multiple profiles
3. Expected: All appear in "My Profiles"

---

## Troubleshooting Common Issues

### Issue: "User not authenticated"
```
✓ Solution: 
- Verify you're logged in
- Check browser console for errors
- Try clearing cookies and logging in again
```

### Issue: "Failed to fetch LeetCode stats"
```
✓ Solution:
- Verify LeetCode username is correct and public
- Check internet connection
- Try a different username first
- Check browser console for API errors
```

### Issue: "Profile not found" when accessing public link
```
✓ Solution:
- Verify link is correct
- Make sure profile is marked as public
- Try in new incognito window
- Check that slug in URL is correct
```

### Issue: Database errors
```
✓ Solution:
- Verify migrations are applied in Supabase
- Check DATABASE_URL in .env
- Verify RLS policies are enabled
- Check Supabase dashboard for table status
```

### Issue: "Cannot POST /functions/v1/leetcode-stats"
```
✓ Solution:
- This is expected - the edge function runs on Supabase, not locally
- For local testing, ensure your Supabase project is active
- Test with real LeetCode usernames only
```

---

## Performance Metrics

### Expected Load Times
- **LeetCode Stats Fetch**: 2-4 seconds (cached for 10 mins)
- **Profile Save**: <1 second
- **Public Profile Load**: <500ms
- **Resume Generation**: Instant (<200ms)

---

## API Endpoints (Supabase Functions)

### LeetCode Stats Fetch
```
POST /functions/v1/leetcode-stats
Body: { username: string }
Response: { LeetCodeStats } | { error: string }
```

### Rate Limiting
- 5 requests per minute per IP
- 10-minute cache per username
- Automatic retry with exponential backoff

---

## Testing Checklist ✅

- [ ] User can sign up
- [ ] User can log in
- [ ] User can search LeetCode profiles
- [ ] Stats load and display correctly
- [ ] User can save profiles
- [ ] User can view saved profiles
- [ ] User can make profiles public
- [ ] User can copy share links
- [ ] User can access public profiles anonymously
- [ ] User can generate resumes
- [ ] Resume downloads as .txt file
- [ ] User can delete profiles
- [ ] Navbar updates with user info
- [ ] Logout works correctly
- [ ] Error messages display appropriately

---

## Advanced Testing

### Test with Different User Roles

```bash
# Admin user
Email: admin@example.com
Password: AdminPass123!

# Regular user
Email: user@example.com
Password: UserPass123!

# Test publicsharing
Email: share@example.com
Password: SharePass123!
```

### Load Testing Commands

```bash
# Test profile save endpoint
curl -X POST http://localhost:8080/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"username":"neetcode"}'

# Test public profile fetch
curl http://localhost:8080/api/profiles/share-slug-here
```

---

## Success Criteria ✅

When ALL of the following work, the app is production-ready:

1. ✅ Authentication (signup/login/logout)
2. ✅ LeetCode data fetching
3. ✅ Profile persistence
4. ✅ Profile sharing
5. ✅ Resume generation
6. ✅ Error handling
7. ✅ Performance
8. ✅ Security (RLS policies)

---

**Last Updated**: January 3, 2026
**Status**: Ready for Testing ✅
