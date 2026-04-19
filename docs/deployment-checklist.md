# Deployment Checklist

Use this checklist to ensure successful deployment of AlgoBrainDoctor to production.

## Pre-Deployment Checklist

### 1. GitHub Setup

- [ ] Create GitHub OAuth App
  - Go to [GitHub Developer Settings](https://github.com/settings/developers)
  - Click "New OAuth App"
  - Set Application name: "AlgoBrainDoctor"
  - Set Homepage URL: `https://your-domain.vercel.app`
  - Set Authorization callback URL: `https://your-domain.vercel.app/auth/callback`
  - Copy Client ID
  - Generate and copy Client Secret

- [ ] Create GitHub Personal Access Token
  - Go to [GitHub Tokens](https://github.com/settings/tokens)
  - Click "Generate new token (classic)"
  - Set note: "AlgoBrainDoctor Production"
  - Select scopes: `repo`, `read:user`
  - Generate token
  - Copy token (starts with `ghp_`)

### 2. External Services (Optional)

- [ ] Sentry (Error Tracking)
  - Create project at [sentry.io](https://sentry.io)
  - Copy DSN from project settings
  - Format: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

- [ ] Google Analytics (Analytics)
  - Create property at [analytics.google.com](https://analytics.google.com)
  - Copy Measurement ID
  - Format: `G-XXXXXXXXXX`

- [ ] PostHog (Product Analytics)
  - Create project at [posthog.com](https://posthog.com)
  - Copy API key from project settings
  - Format: `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Prepare Environment Variables

Create a secure document with all values:

```
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.vercel.app
VITE_GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
VITE_GITHUB_REDIRECT_URI=https://your-domain.vercel.app/auth/callback
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBHOOKS=false
VITE_ENABLE_REAL_REPOS=true
VITE_ENABLE_AI_CHAT=true
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Vercel Deployment

### 1. Initial Setup

- [ ] Sign up/Login to [Vercel](https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Import GitHub repository
- [ ] Select "SMSDAO/Doctor" repository

### 2. Configure Project

- [ ] Framework Preset: Detected as "Vite" ✅
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `dist` (auto-detected)

### 3. Add Environment Variables

In Vercel Project Settings → Environment Variables:

**Required Variables:**
- [ ] `VITE_APP_ENV` = `production`
- [ ] `VITE_APP_URL` = `https://your-project.vercel.app`
- [ ] `VITE_GITHUB_CLIENT_ID` = `[from GitHub OAuth]`
- [ ] `VITE_GITHUB_REDIRECT_URI` = `https://your-project.vercel.app/auth/callback`
- [ ] `VITE_GITHUB_TOKEN` = `[from GitHub PAT]`

**Feature Flags:**
- [ ] `VITE_ENABLE_ANALYTICS` = `true`
- [ ] `VITE_ENABLE_WEBHOOKS` = `false`
- [ ] `VITE_ENABLE_REAL_REPOS` = `true`
- [ ] `VITE_ENABLE_AI_CHAT` = `true`

**Optional Services:**
- [ ] `VITE_SENTRY_DSN` = `[if using Sentry]`
- [ ] `VITE_GA_MEASUREMENT_ID` = `[if using GA]`
- [ ] `VITE_POSTHOG_API_KEY` = `[if using PostHog]`

**Performance (use defaults or customize):**
- [ ] `VITE_CACHE_TTL` = `300000` (5 minutes)
- [ ] `VITE_MAX_REPOSITORIES` = `1000`
- [ ] `VITE_WORKER_REFRESH_INTERVAL` = `30000` (30 seconds)

### 4. Deploy

- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Check build logs for errors
- [ ] Note the deployment URL

### 5. Update GitHub OAuth

- [ ] Go back to GitHub OAuth App settings
- [ ] Update Authorization callback URL with actual Vercel URL
- [ ] Save changes

## Post-Deployment Verification

### 1. Basic Functionality

- [ ] Visit deployment URL
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] All assets load correctly (check Network tab)

### 2. Environment Variables

- [ ] Open browser console
- [ ] Check environment variables are set:
  ```javascript
  console.log(import.meta.env.VITE_APP_URL)
  // Should output your Vercel URL
  ```
- [ ] Verify feature flags work
- [ ] Test GitHub integration (if enabled)

### 3. Role-Based Panels

- [ ] Select "Operator" role → Dashboard loads
- [ ] Select "Admin" role → Admin panel loads
- [ ] Select "Analyst" role → Analytics load
- [ ] Select "Developer" role → API tools load

### 4. Features

- [ ] Repository list displays
- [ ] Worker status cards show
- [ ] Health scores display correctly
- [ ] Watchlist add/remove works
- [ ] Alerts can be created
- [ ] AI chat opens and functions (if enabled)

### 5. Data Persistence

- [ ] Add repository to watchlist
- [ ] Refresh page
- [ ] Verify watchlist persists
- [ ] Change role
- [ ] Refresh page
- [ ] Verify role selection persists

### 6. GitHub Integration (if enabled)

- [ ] Click GitHub login/connect
- [ ] OAuth flow completes
- [ ] Real repositories load
- [ ] Repository data displays correctly

### 7. Performance

- [ ] Initial load time < 3 seconds
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Smooth interactions
- [ ] Charts render without lag
- [ ] Workers update every 30 seconds

### 8. Error Tracking (if configured)

- [ ] Trigger a test error
- [ ] Check Sentry dashboard
- [ ] Verify error was captured
- [ ] Check error details and context

### 9. Analytics (if configured)

- [ ] Visit several pages
- [ ] Wait 5 minutes
- [ ] Check Google Analytics Real-Time
- [ ] Verify events are being tracked

## Security Verification

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers present (check Network → Response Headers):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] No secrets exposed in client-side code
- [ ] API keys not visible in browser (check all files)
- [ ] No console.log with sensitive data

## Common Issues

### Build Fails

**Error**: `npm install` fails
- **Solution**: Check package.json, update dependencies

**Error**: TypeScript errors
- **Solution**: Run `npm run build` locally first

### Environment Variables Not Working

**Error**: Variables are undefined
- **Solution**: 
  1. Ensure prefixed with `VITE_`
  2. Redeploy after adding variables
  3. Check variable names (case-sensitive)

### GitHub OAuth Fails

**Error**: Redirect mismatch
- **Solution**: 
  1. Verify callback URL matches exactly
  2. Must use HTTPS
  3. No trailing slash

### Performance Issues

**Error**: Slow loading
- **Solution**:
  1. Check Vercel region (should be close to users)
  2. Enable CDN caching
  3. Optimize images

## Maintenance

### Regular Tasks

- [ ] **Weekly**: Check error logs in Sentry
- [ ] **Weekly**: Review analytics for issues
- [ ] **Monthly**: Rotate GitHub tokens
- [ ] **Monthly**: Review and update dependencies
- [ ] **Quarterly**: Test backup/restore procedures

### Monitoring

Set up monitoring for:
- [ ] Uptime (UptimeRobot, Pingdom)
- [ ] Error rate (Sentry alerts)
- [ ] Performance (Vercel Analytics)
- [ ] GitHub API rate limits

### Updates

When deploying updates:
1. Test in preview deployment first
2. Verify environment variables still set
3. Check for breaking changes
4. Deploy to production
5. Verify post-deployment checklist

## Rollback Procedure

If deployment has issues:

1. In Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"
4. Verify rollback successful
5. Fix issues locally
6. Redeploy when ready

## Support

- **Documentation**: [docs/README.md](./README.md)
- **Environment Variables**: [docs/environment-variables.md](./environment-variables.md)
- **Deployment Guide**: [docs/deployment.md](./deployment.md)
- **Troubleshooting**: [docs/troubleshooting.md](./troubleshooting.md)
- **Issues**: [GitHub Issues](https://github.com/SMSDAO/Doctor/issues)

---

## Quick Reference

### Vercel CLI Commands

```bash
# Install
npm install -g vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VITE_GITHUB_TOKEN production

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Promote deployment to production
vercel promote [deployment-url]
```

### Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub OAuth Apps**: https://github.com/settings/developers
- **GitHub Tokens**: https://github.com/settings/tokens
- **Sentry**: https://sentry.io
- **Google Analytics**: https://analytics.google.com

---

**Last Updated**: 2026-02-17  
**Version**: 4.0.0

✅ **Ready to deploy? Start with [GitHub Setup](#1-github-setup)!**
