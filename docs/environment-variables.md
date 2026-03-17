# Environment Variables Reference

Complete guide to configuring AlgoBrainDoctor via environment variables.

## Overview

AlgoBrainDoctor uses environment variables for configuration. All client-side environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Quick Setup

### Local Development

1. Copy the example file:
```bash
cp .env.development.example .env.local
```

2. Edit `.env.local` with your values
3. Restart the dev server

### Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each `VITE_*` variable from `.env.production.example`
3. Set environment to "Production"
4. Redeploy your application

## Environment Variables

### API Configuration

#### `VITE_API_BASE_URL`
- **Default**: `https://api.algobraindoctor.io`
- **Description**: Base URL for API requests (future backend)
- **Example**: `https://api.yourdomain.com`

#### `VITE_API_VERSION`
- **Default**: `v1`
- **Description**: API version to use
- **Example**: `v1`, `v2`

### GitHub Integration

#### `VITE_GITHUB_CLIENT_ID`
- **Required**: For GitHub OAuth
- **Description**: OAuth App Client ID from GitHub
- **Where to get**: GitHub Settings → Developer Settings → OAuth Apps
- **Example**: `Iv1.a1b2c3d4e5f6g7h8`

#### `VITE_GITHUB_REDIRECT_URI`
- **Required**: For GitHub OAuth
- **Description**: OAuth callback URL
- **Must match**: OAuth App settings on GitHub
- **Example**: `https://yourdomain.vercel.app/auth/callback`

#### `VITE_GITHUB_TOKEN`
- **Required**: For GitHub API access
- **Description**: Personal Access Token or OAuth token
- **Scopes needed**: `repo`, `read:user`
- **Where to get**: GitHub Settings → Developer Settings → Personal Access Tokens
- **Security**: Use fine-grained tokens with minimal scopes
- **Example**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Feature Flags

#### `VITE_ENABLE_ANALYTICS`
- **Type**: `boolean`
- **Default**: `true` (production), `false` (development)
- **Description**: Enable analytics tracking
- **Values**: `true`, `false`

#### `VITE_ENABLE_WEBHOOKS`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable webhook support (when implemented)
- **Values**: `true`, `false`

#### `VITE_ENABLE_REAL_REPOS`
- **Type**: `boolean`
- **Default**: `true` (production), `false` (development)
- **Description**: Use real GitHub repositories instead of mock data
- **Values**: `true`, `false`

#### `VITE_ENABLE_AI_CHAT`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable AI chat assistant feature
- **Values**: `true`, `false`

### Performance & Caching

#### `VITE_CACHE_TTL`
- **Type**: `number` (milliseconds)
- **Default**: `300000` (5 minutes)
- **Description**: Cache time-to-live for API responses
- **Example**: `300000`, `600000`

#### `VITE_MAX_REPOSITORIES`
- **Type**: `number`
- **Default**: `1000`
- **Description**: Maximum number of repositories to monitor
- **Example**: `100`, `1000`, `5000`

#### `VITE_WORKER_REFRESH_INTERVAL`
- **Type**: `number` (milliseconds)
- **Default**: `30000` (30 seconds)
- **Description**: How often workers refresh their status
- **Example**: `30000`, `60000`

### External Services

#### `VITE_SENTRY_DSN`
- **Optional**: Error tracking
- **Description**: Sentry DSN for error monitoring
- **Where to get**: Sentry Project Settings
- **Example**: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

#### `VITE_GA_MEASUREMENT_ID`
- **Optional**: Analytics
- **Description**: Google Analytics Measurement ID
- **Where to get**: Google Analytics Admin
- **Example**: `G-XXXXXXXXXX`

#### `VITE_POSTHOG_API_KEY`
- **Optional**: Product analytics
- **Description**: PostHog API key
- **Where to get**: PostHog Project Settings
- **Example**: `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Application Configuration

#### `VITE_APP_ENV`
- **Type**: `string`
- **Default**: `production`
- **Description**: Application environment
- **Values**: `development`, `staging`, `production`

#### `VITE_APP_URL`
- **Required**: Yes
- **Description**: Full URL where app is deployed
- **Example**: `https://algobraindoctor.vercel.app`

#### `VITE_RATE_LIMIT_FREE`
- **Type**: `number`
- **Default**: `100`
- **Description**: API requests per hour for free tier
- **Example**: `100`, `500`

#### `VITE_RATE_LIMIT_PRO`
- **Type**: `number`
- **Default**: `5000`
- **Description**: API requests per hour for pro tier
- **Example**: `5000`, `10000`

## Accessing Environment Variables

### In Code

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isProduction = import.meta.env.VITE_APP_ENV === 'production'

// Check if variable is defined
if (import.meta.env.VITE_GITHUB_TOKEN) {
  // Use GitHub integration
}

// Type-safe access with defaults
const cacheTime = Number(import.meta.env.VITE_CACHE_TTL) || 300000
```

### TypeScript Types

Extend the existing `src/vite-end.d.ts` file with environment variable types:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_GITHUB_REDIRECT_URI: string
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_WEBHOOKS: string
  readonly VITE_ENABLE_REAL_REPOS: string
  readonly VITE_ENABLE_AI_CHAT: string
  readonly VITE_CACHE_TTL: string
  readonly VITE_MAX_REPOSITORIES: string
  readonly VITE_WORKER_REFRESH_INTERVAL: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Vercel Deployment

### Automatic Variables

Vercel automatically provides these variables:

- `VERCEL_URL` - Deployment URL
- `VERCEL_ENV` - Environment (production, preview, development)
- `VERCEL_GIT_COMMIT_SHA` - Git commit SHA
- `VERCEL_GIT_COMMIT_MESSAGE` - Commit message

### Setting Variables in Vercel

1. **Via Dashboard**:
   - Project Settings → Environment Variables
   - Add variable name and value
   - Select environments (Production, Preview, Development)
   - Click "Save"

2. **Via CLI**:
```bash
vercel env add VITE_GITHUB_TOKEN production
# Paste your token when prompted
```

3. **Via vercel.json**:
```json
{
  "env": {
    "VITE_APP_ENV": "production"
  }
}
```

### Environment-Specific Variables

Set different values per environment:

```bash
# Production
vercel env add VITE_API_BASE_URL production
# Enter: https://api.algobraindoctor.io

# Preview (PR deployments)
vercel env add VITE_API_BASE_URL preview
# Enter: https://api-staging.algobraindoctor.io

# Development
vercel env add VITE_API_BASE_URL development
# Enter: http://localhost:3000
```

## Security Best Practices

### Do's ✅

- Use `.env.local` for local development (gitignored)
- Rotate tokens regularly
- Use fine-grained GitHub tokens with minimal scopes
- Set token expiration dates
- Use Vercel's encrypted environment variables
- Use different tokens for different environments
- Document all required variables

### Don'ts ❌

- Never commit `.env` files with secrets
- Don't use production tokens in development
- Don't expose sensitive variables in client code
- Don't use the same token across projects
- Don't share tokens via insecure channels

### Recommended Token Scopes

For GitHub Personal Access Token:
- `repo` - Full control of private repositories (if needed)
- `public_repo` - Access to public repositories only (preferred)
- `read:user` - Read user profile data

For GitHub OAuth App:
- `read:user` - Read user profile
- `repo` - Repository access (if needed)

## Troubleshooting

### Variable Not Defined

**Problem**: `import.meta.env.VITE_MY_VAR` is undefined

**Solutions**:
1. Ensure variable is prefixed with `VITE_`
2. Restart dev server after adding variable
3. Check spelling and capitalization
4. Verify `.env.local` file exists

### Changes Not Applying

**Problem**: Environment variable changes not reflected

**Solutions**:
1. Restart Vite dev server (`npm run dev`)
2. Clear browser cache and hard refresh
3. Check you're editing the right `.env` file
4. Verify Vercel deployment includes new variables

### CORS Errors with API

**Problem**: API requests blocked by CORS

**Solutions**:
1. Verify `VITE_API_BASE_URL` is correct
2. Check API server allows your origin
3. Ensure proper headers in API configuration

### GitHub Auth Not Working

**Problem**: GitHub OAuth fails

**Solutions**:
1. Verify `VITE_GITHUB_CLIENT_ID` is correct
2. Check `VITE_GITHUB_REDIRECT_URI` matches GitHub OAuth App settings
3. Ensure callback URL is whitelisted
4. Check token has required scopes

## Examples

### Development Setup

```bash
# .env.local
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_GITHUB_TOKEN=ghp_dev_token_here
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_REAL_REPOS=false
```

### Production Setup (Vercel)

Set in Vercel Dashboard:
```
VITE_APP_ENV=production
VITE_APP_URL=https://algobraindoctor.vercel.app
VITE_GITHUB_CLIENT_ID=Iv1.abc123
VITE_GITHUB_REDIRECT_URI=https://algobraindoctor.vercel.app/auth/callback
VITE_GITHUB_TOKEN=ghp_production_token_here
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REAL_REPOS=true
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Testing Configuration

```typescript
// src/config/env.ts
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.algobraindoctor.io',
    version: import.meta.env.VITE_API_VERSION || 'v1',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
    token: import.meta.env.VITE_GITHUB_TOKEN,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    webhooks: import.meta.env.VITE_ENABLE_WEBHOOKS === 'true',
    realRepos: import.meta.env.VITE_ENABLE_REAL_REPOS === 'true',
    aiChat: import.meta.env.VITE_ENABLE_AI_CHAT === 'true',
  },
  performance: {
    cacheTTL: Number(import.meta.env.VITE_CACHE_TTL) || 300000,
    maxRepos: Number(import.meta.env.VITE_MAX_REPOSITORIES) || 1000,
    refreshInterval: Number(import.meta.env.VITE_WORKER_REFRESH_INTERVAL) || 30000,
  },
}

// Validate required variables
if (!config.github.clientId && config.features.realRepos) {
  console.warn('GitHub Client ID not set. Real repos feature will not work.')
}
```

## Related Documentation

- [Deployment Guide](./deployment.md) - Deployment instructions
- [Development Guide](./development.md) - Development setup
- [Troubleshooting](./troubleshooting.md) - Common issues
- [Security Policy](../SECURITY.md) - Security guidelines

---

**Last Updated**: 2026-02-17  
**Version**: 4.0.0
