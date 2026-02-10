# Deployment Guide

This guide covers deploying AlgoBrainDoctor to production environments. The application is a browser-based Spark application that can be deployed using various methods.

## Deployment Overview

AlgoBrainDoctor is a static web application built with:
- React 19 + TypeScript
- Vite build tool
- No backend server required
- Client-side data persistence

## Prerequisites

- Node.js 18+ and npm 8+
- Git
- Modern web browser

## Build Process

### 1. Clone the Repository

```bash
git clone https://github.com/SMSDAO/Doctor.git
cd Doctor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build for Production

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### 4. Preview Build (Optional)

```bash
npm run preview
```

Access the preview at `http://localhost:4173`

## Deployment Options

### Option 1: Static Hosting (Recommended)

Deploy to any static hosting service.

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Configure `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

1. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run build
npm run deploy
```

#### Cloudflare Pages

1. Connect GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: Vite

### Option 2: Docker Container

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t algobraindoctor:latest .

# Run container
docker run -d -p 80:80 algobraindoctor:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

### Option 3: AWS S3 + CloudFront

#### 1. Create S3 Bucket

```bash
aws s3 mb s3://algobraindoctor-app
aws s3 website s3://algobraindoctor-app \
  --index-document index.html \
  --error-document index.html
```

#### 2. Upload Files

```bash
npm run build
aws s3 sync dist/ s3://algobraindoctor-app --delete
```

#### 3. Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name algobraindoctor-app.s3.amazonaws.com \
  --default-root-object index.html
```

#### 4. Configure Custom Domain (Optional)

Add CNAME record pointing to CloudFront distribution.

## Environment Configuration

### Environment Variables

Create `.env.production`:

```bash
# API Configuration (if using external API)
VITE_API_BASE_URL=https://api.algobraindoctor.io
VITE_API_VERSION=v1

# GitHub Integration
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REDIRECT_URI=https://app.algobraindoctor.io/auth/callback

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBHOOKS=false

# Performance
VITE_CACHE_TTL=300000
VITE_MAX_REPOSITORIES=1000
```

### Build-time Configuration

Pass environment variables during build:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Post-Deployment Setup

### 1. Verify Deployment

Check these items after deployment:

- [ ] Application loads successfully
- [ ] All assets load (check browser console)
- [ ] Data persists across refreshes
- [ ] Role switching works
- [ ] Charts and visualizations render
- [ ] No console errors

### 2. Configure DNS

Point your domain to the hosting service:

```
# Example DNS records
Type    Name                Value
A       algobraindoctor.io  192.0.2.1
CNAME   www                 algobraindoctor.io
```

### 3. SSL/TLS Certificate

Most hosting providers auto-provision SSL certificates. For custom setups:

**Let's Encrypt (Certbot):**
```bash
sudo certbot --nginx -d algobraindoctor.io -d www.algobraindoctor.io
```

### 4. Configure CDN (Optional)

For better performance:
- Use Cloudflare for CDN and DDoS protection
- Configure caching rules
- Enable Brotli compression

## Performance Optimization

### Code Splitting

Vite automatically splits code. Additional optimization:

```typescript
// Lazy load heavy components
const Charts = lazy(() => import('./components/Charts'));
const Analytics = lazy(() => import('./components/Analytics'));
```

### Asset Optimization

```bash
# Optimize images
npm install --save-dev imagemin-cli
npx imagemin src/assets/*.{jpg,png} --out-dir=dist/assets
```

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
      },
    },
  },
});
```

## Monitoring & Analytics

### Setup Monitoring

#### 1. Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

#### 2. Analytics (Google Analytics)

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### 3. Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Configure checks for:
- Homepage availability
- API endpoint health
- Response time

## Backup & Recovery

### Data Backup

User data is stored in browser localStorage. For backup:

1. **Export Functionality**
   - Add export feature in UI
   - Users download JSON backup
   - Import on restore

2. **Cloud Sync (Future)**
   - Sync to cloud storage
   - Automatic backups
   - Cross-device sync

### Disaster Recovery

**Recovery Time Objective (RTO):** < 15 minutes  
**Recovery Point Objective (RPO):** N/A (stateless)

**Recovery Steps:**
1. Restore latest build from Git
2. Rebuild and deploy
3. Verify functionality
4. Update DNS if needed

## Security Considerations

### Content Security Policy

Add CSP headers:

```nginx
# nginx.conf
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.github.com;
";
```

### HTTPS Enforcement

```nginx
# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name algobraindoctor.io;
  return 301 https://$server_name$request_uri;
}
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

## Scaling

### Horizontal Scaling

Deploy to multiple regions:

```bash
# Deploy to US region
vercel --prod --regions sfo1

# Deploy to EU region
vercel --prod --regions cdg1

# Deploy to Asia region
vercel --prod --regions hnd1
```

### CDN Configuration

Configure cache rules:

```javascript
// Cache static assets aggressively
/assets/*  max-age=31536000, immutable

// Cache HTML with revalidation
/*.html    max-age=0, must-revalidate

// Cache API responses briefly
/api/*     max-age=60, stale-while-revalidate=300
```

## Troubleshooting Deployment

### Build Fails

**Issue:** Build command fails

**Solutions:**
1. Check Node.js version: `node --version` (need 18+)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check for TypeScript errors: `npm run build`
4. Review build logs for specific errors

### Assets Not Loading

**Issue:** CSS/JS files return 404

**Solutions:**
1. Verify build output in `dist/` directory
2. Check base path in `vite.config.ts`
3. Configure server rewrites for SPA
4. Clear browser cache

### Environment Variables Not Working

**Issue:** `process.env.VITE_*` variables undefined

**Solutions:**
1. In Vite client code, access env vars via `import.meta.env.VITE_*` (for example, `import.meta.env.VITE_API_URL`) instead of `process.env.VITE_*`
2. Prefix variables in `.env` files with `VITE_`: `VITE_API_URL=...`
3. Restart the Vite dev server after adding or changing variables
4. Check `.env.production` file exists and is included in the build

### Slow Load Times

**Issue:** Application loads slowly

**Solutions:**
1. Enable Brotli/Gzip compression
2. Configure CDN caching
3. Optimize images and assets
4. Enable code splitting
5. Use performance profiling tools

## Rollback Procedure

If deployment issues occur:

### Quick Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# AWS S3
aws s3 sync s3://algobraindoctor-app-backup/ s3://algobraindoctor-app/
```

### Git-Based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push

# Trigger new deployment
```

## Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Health Checks

### Endpoint Monitoring

Create a health check endpoint or page:

```typescript
// src/health.ts
export function getHealthStatus() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '4.0.0',
  };
}
```

### Automated Testing

```bash
# Smoke tests after deployment
curl -f https://algobraindoctor.io || exit 1
curl -f https://algobraindoctor.io/health || exit 1
```

## Related Documentation

- [Development Guide](./development.md) - Development setup
- [Architecture](./architecture.md) - System architecture
- [Troubleshooting](./troubleshooting.md) - Common issues
- [Contributing](./contributing.md) - Contributing guidelines

---

**Need help?** Contact the team or open an issue on GitHub.
