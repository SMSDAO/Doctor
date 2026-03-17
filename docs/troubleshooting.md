# Troubleshooting Guide

Common issues and solutions for AlgoBrainDoctor. If you encounter a problem not listed here, please check the [FAQ](./faq.md) or open an issue on GitHub.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Problems](#build-problems)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)
- [Data Persistence Problems](#data-persistence-problems)
- [Worker Issues](#worker-issues)
- [Healdec Problems](#healdec-problems)
- [UI/UX Issues](#uiux-issues)
- [API Integration](#api-integration)

---

## Installation Issues

### Problem: npm install fails

**Symptoms:**
- Package installation errors
- Dependency conflicts
- Network timeouts

**Solutions:**

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Check Node version:**
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

3. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

4. **Check network connectivity:**
```bash
npm config set registry https://registry.npmjs.org/
npm config set strict-ssl false  # Only if behind corporate proxy
```

---

### Problem: TypeScript errors during setup

**Symptoms:**
- Type definition errors
- Module not found errors

**Solutions:**

1. **Install type definitions:**
```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

2. **Clean TypeScript cache:**
```bash
rm -rf node_modules/.cache
npx tsc --build --clean
```

3. **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

---

## Build Problems

### Problem: Build command fails

**Symptoms:**
- `npm run build` exits with errors
- Build hangs indefinitely
- Out of memory errors

**Solutions:**

1. **Increase Node memory:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

2. **Check for TypeScript errors:**
```bash
npm run build 2>&1 | grep "error TS"
```

3. **Clear build cache:**
```bash
rm -rf dist node_modules/.vite
npm run build
```

4. **Disable minification (debugging):**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: false
  }
});
```

---

### Problem: Assets not found after build

**Symptoms:**
- 404 errors for JS/CSS files
- Blank page after deployment
- Console errors about missing modules

**Solutions:**

1. **Check base path:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // or '/your-subdirectory/'
});
```

2. **Verify build output:**
```bash
ls -la dist/
# Should contain index.html, assets/ folder
```

3. **Configure server rewrites:**
```nginx
# For Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Runtime Errors

### Problem: White screen / Application won't load

**Symptoms:**
- Blank white screen
- Loading spinner forever
- No error messages

**Solutions:**

1. **Check browser console:**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Clear site data: DevTools > Application > Clear Storage

3. **Check localStorage:**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

4. **Disable browser extensions:**
   - Try in incognito mode
   - Disable ad blockers
   - Disable React DevTools temporarily

---

### Problem: "Failed to fetch" errors

**Symptoms:**
- Network errors in console
- API calls failing
- Data not loading

**Solutions:**

1. **Check API endpoint:**
```javascript
// Verify in console
fetch('https://api.algobraindoctor.io/v1/health')
  .then(r => r.json())
  .then(console.log);
```

2. **Check CORS settings:**
   - Verify API allows origin
   - Check preflight requests
   - Review Access-Control-Allow-Origin

3. **Verify authentication:**
```javascript
// Check if API key is set
console.log(localStorage.getItem('apiKey'));
```

---

### Problem: React errors and crashes

**Symptoms:**
- Error boundary displayed
- Component crashes
- "Something went wrong" message

**Solutions:**

1. **Check error details:**
   - Click "Show details" in error boundary
   - Copy error stack trace
   - Check for common patterns

2. **Clear application state:**
```javascript
// In console
localStorage.removeItem('hospital-watchlist');
localStorage.removeItem('hospital-alerts');
location.reload();
```

3. **Update dependencies:**
```bash
npm update
npm audit fix
```

---

## Performance Issues

### Problem: Slow page load times

**Symptoms:**
- Long initial load (>5 seconds)
- Sluggish interactions
- High memory usage

**Solutions:**

1. **Enable performance profiling:**
   - Open Chrome DevTools
   - Performance tab > Record
   - Analyze flame graph

2. **Reduce bundle size:**
```bash
# Analyze bundle
npx vite-bundle-visualizer
```

3. **Implement code splitting:**
```typescript
// Lazy load heavy components
const Charts = lazy(() => import('./components/Charts'));
```

4. **Optimize images:**
   - Use WebP format
   - Compress images
   - Implement lazy loading

---

### Problem: Memory leaks

**Symptoms:**
- Memory usage grows over time
- Browser becomes unresponsive
- Tab crashes after extended use

**Solutions:**

1. **Profile memory:**
   - DevTools > Memory
   - Take heap snapshots
   - Identify detached DOM nodes

2. **Check for common causes:**
   - Event listeners not cleaned up
   - Timers not cleared
   - Large arrays not released

3. **Fix useEffect cleanup:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  // Cleanup!
  return () => clearInterval(timer);
}, []);
```

---

### Problem: Charts rendering slowly

**Symptoms:**
- Chart updates lag
- Animations choppy
- High CPU usage

**Solutions:**

1. **Reduce data points:**
```typescript
// Sample large datasets
const sampledData = data.filter((_, i) => i % 10 === 0);
```

2. **Debounce updates:**
```typescript
const debouncedUpdate = useMemo(
  () => debounce(updateChart, 300),
  []
);
```

3. **Use canvas instead of SVG:**
   - For large datasets (>1000 points)
   - Better performance
   - Trade-off: less interactive

---

## Data Persistence Problems

### Problem: Data not persisting across sessions

**Symptoms:**
- Watchlist resets on refresh
- Alerts disappear
- Role selection not saved

**Solutions:**

1. **Check localStorage availability:**
```javascript
// In console
try {
  localStorage.setItem('test', '1');
  localStorage.removeItem('test');
  console.log('localStorage working');
} catch (e) {
  console.error('localStorage blocked', e);
}
```

2. **Verify browser settings:**
   - Check if cookies/storage enabled
   - Not in private/incognito mode
   - No browser extensions blocking storage

3. **Check storage quota:**
```javascript
navigator.storage.estimate().then(console.log);
```

4. **Use fallback storage:**
```typescript
// Implement memory fallback
const storage = localStorage?.available 
  ? localStorage 
  : new MemoryStorage();
```

---

### Problem: Data corruption

**Symptoms:**
- Invalid JSON errors
- Application crashes on load
- Unexpected data values

**Solutions:**

1. **Clear corrupted data:**
```javascript
// Clear specific key
localStorage.removeItem('hospital-watchlist');

// Or clear all app data
Object.keys(localStorage)
  .filter(k => k.startsWith('hospital-'))
  .forEach(k => localStorage.removeItem(k));
```

2. **Implement data validation:**
```typescript
function loadWatchlist(): string[] {
  try {
    const data = localStorage.getItem('hospital-watchlist');
    const parsed = JSON.parse(data || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
```

3. **Add data migration:**
```typescript
function migrateData(version: string) {
  // Handle schema changes
  if (version < '2.0.0') {
    // Migrate old format to new
  }
}
```

---

## Worker Issues

### Problem: Workers not starting

**Symptoms:**
- Worker status shows "Stopped"
- No heartbeat indicator
- Jobs not processing

**Solutions:**

1. **Check worker configuration:**
```typescript
// Verify config is valid
console.log(workerConfig);
```

2. **Review worker logs:**
   - Check browser console
   - Look for initialization errors
   - Verify dependencies loaded

3. **Restart worker:**
   - Click "Restart" in UI
   - Or reload application

---

### Problem: High worker error rate

**Symptoms:**
- Success rate <95%
- Many Healdec actions
- Jobs failing repeatedly

**Solutions:**

1. **Identify error pattern:**
   - Check Healdec log
   - Group errors by type
   - Look for common cause

2. **Check external dependencies:**
   - GitHub API status
   - Network connectivity
   - Rate limits

3. **Adjust worker settings:**
```typescript
{
  maxRetries: 3,
  timeout: 30000,
  concurrency: 1  // Reduce if overwhelmed
}
```

---

### Problem: Worker queue building up

**Symptoms:**
- Queue depth >100
- Processing delays
- Timeouts

**Solutions:**

1. **Increase worker concurrency:**
```typescript
{
  concurrency: 5  // Process more jobs in parallel
}
```

2. **Reduce job frequency:**
```typescript
{
  scanInterval: 600000  // 10 min instead of 5
}
```

3. **Implement job prioritization:**
```typescript
jobs.sort((a, b) => b.priority - a.priority);
```

---

## Healdec Problems

### Problem: Healdec action rate too high (>10%)

**Symptoms:**
- Many recovery actions
- System unstable
- Performance degraded

**Solutions:**

1. **Analyze failure patterns:**
   - Group by error type
   - Identify root causes
   - Fix underlying issues

2. **Adjust retry limits:**
```typescript
{
  maxRetryAttempts: 2  // Reduce retries
}
```

3. **Improve error handling:**
```typescript
// Better error classification
if (isRateLimitError(error)) {
  return 'quarantine';  // Don't retry immediately
}
```

---

### Problem: Escalations not working

**Symptoms:**
- Critical errors not notified
- No incident created
- On-call not paged

**Solutions:**

1. **Verify escalation config:**
```typescript
{
  escalate: {
    enabled: true,
    onCallRotation: 'pagerduty',
    webhookUrl: 'https://...'
  }
}
```

2. **Check webhook delivery:**
   - Test endpoint manually
   - Verify authentication
   - Check webhook logs

3. **Test escalation:**
```typescript
// Trigger test escalation
healdec.testEscalate();
```

---

## UI/UX Issues

### Problem: Charts not rendering

**Symptoms:**
- Blank chart area
- Console errors about D3
- Data present but no visualization

**Solutions:**

1. **Check D3 import:**
```typescript
import * as d3 from 'd3';
```

2. **Verify data format:**
```typescript
console.log('Chart data:', chartData);
// Should be array of objects with expected fields
```

3. **Check container dimensions:**
```typescript
// Container must have height
<div style={{ height: '400px' }}>
  <Chart data={data} />
</div>
```

---

### Problem: Styling issues

**Symptoms:**
- Components look broken
- Tailwind classes not applying
- Theme colors wrong

**Solutions:**

1. **Check Tailwind config:**
```javascript
// tailwind.config.js should be present
```

2. **Rebuild CSS:**
```bash
npm run dev  # Restart dev server
```

3. **Clear Tailwind cache:**
```bash
rm -rf node_modules/.cache
```

---

## API Integration

### Problem: GitHub API rate limiting

**Symptoms:**
- 403 errors
- "Rate limit exceeded" messages
- Data not updating

**Solutions:**

1. **Check rate limit status:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

2. **Use authenticated requests:**
```typescript
// Include GitHub token
headers: {
  'Authorization': `token ${githubToken}`
}
```

3. **Implement caching:**
```typescript
// Cache responses for 5 minutes
const cache = new Map();
const ttl = 300000;
```

4. **Wait for reset:**
```typescript
// Calculate wait time
const resetTime = response.headers['x-ratelimit-reset'];
const waitTime = (resetTime * 1000) - Date.now();
```

---

### Problem: Webhook not receiving events

**Symptoms:**
- No real-time updates
- Events not processed
- Webhook logs empty

**Solutions:**

1. **Verify webhook configuration:**
   - Check webhook URL
   - Verify events subscribed
   - Test endpoint reachability

2. **Check webhook signature:**
```typescript
function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}
```

3. **Review webhook logs:**
   - Check GitHub webhook deliveries
   - Look for failed deliveries
   - Review response codes

---

## Getting Help

If you can't resolve your issue:

1. **Search existing issues:** [GitHub Issues](https://github.com/SMSDAO/Doctor/issues)
2. **Check FAQ:** [FAQ](./faq.md)
3. **Ask the community:** [Discussions](https://github.com/SMSDAO/Doctor/discussions)
4. **Open an issue:** Include:
   - Detailed description
   - Steps to reproduce
   - Browser/OS info
   - Console logs
   - Screenshots

## Related Documentation

- [FAQ](./faq.md) - Frequently asked questions
- [Development Guide](./development.md) - Development setup
- [Architecture](./architecture.md) - System architecture
- [API Reference](./api-reference.md) - API documentation

---

**Still stuck?** Open an issue on GitHub with detailed information about your problem.
