# User Workflows

Complete workflow documentation organized by user role. Each section provides step-by-step guides for common tasks.

## Table of Contents
- [Operator Workflows](#operator-workflows)
- [Admin Workflows](#admin-workflows)
- [Analyst Workflows](#analyst-workflows)
- [Developer Workflows](#developer-workflows)

---

## Operator Workflows

The Operator role focuses on monitoring repository health, tracking worker status, and managing alerts.

### Dashboard Overview

1. **Initial View**
   - Four key metric cards display at the top:
     - **Repositories Monitored** - Total count of tracked repos
     - **Average Health Score** - Overall fleet health (0-100)
     - **Critical Repos** - Number of repos below health threshold
     - **Active Alerts** - Current monitoring rules

2. **Navigation Tabs**
   - **Dashboard** - Main overview with metrics
   - **Repositories** - Complete repository list
   - **Workers** - Worker status monitoring
   - **Healdec** - Auto-healing activity log
   - **Watchlist** - Starred favorites

### Monitoring Repositories

#### View Repository List
1. Navigate to **Repositories** tab
2. View table with columns:
   - Repository name
   - Health score (0-100)
   - Status indicator (🟢 Healthy, 🟡 Warning, 🔴 Critical)
   - 24h change (trend arrow)
   - Language
   - Last updated

3. **Sort Options**
   - Click column headers to sort
   - Click again to reverse order
   - Default: Health score (lowest first)

#### Add to Watchlist
1. Hover over repository row
2. Click **star icon** on the right
3. Toast notification confirms addition
4. Repository appears in Watchlist tab

#### View Repository Details
1. Click on repository name
2. Detail panel opens showing:
   - Health score with progress bar
   - Health trend chart (7 days)
   - Key metrics (issues, PRs, commits)
   - Contributors
   - Language breakdown
   - Last scan timestamp

### Managing Watchlist

#### Access Watchlist
1. Click **Watchlist** tab in navigation
2. See only starred repositories
3. Same table format as main repository list

#### Remove from Watchlist
1. Hover over watchlisted repository
2. Click **star icon** (now filled)
3. Toast confirms removal
4. Repository removed from Watchlist tab

#### Bulk Actions
- Star/unstar multiple repositories
- Set common alert thresholds
- Group by health status

### Worker Status Monitoring

#### View Worker Dashboard
1. Navigate to **Workers** tab
2. See grid of 12 worker cards
3. Each card displays:
   - Worker name and type
   - Status badge (Running, Idle, Error, Stopped)
   - Heartbeat indicator (🟢 Active, 🔴 Stale)
   - Success rate (percentage)
   - Last job timestamp
   - Jobs processed (24h)

#### Monitor Worker Health
1. **Healthy Workers** - Green heartbeat, >99% success rate
2. **Warning Signs** - Yellow badge, 95-99% success rate
3. **Critical Issues** - Red heartbeat, <95% success rate or stopped

#### Understanding Worker Types
- **IndexWorker** - Discovering new repositories
- **IdentityWorker** - Extracting developer info
- **ScoreWorker** - Computing health metrics
- **IngestWorker** - Processing webhooks
- **SyncWorker** - Syncing metadata
- **GCWorker** - Garbage collection
- **AlertWorker** - Monitoring alerts
- **ExportWorker** - Generating reports
- **AuditWorker** - Compliance logging
- **RepairWorker** - Fixing inconsistencies
- **BackfillWorker** - Historical data
- **MaintenanceWorker** - Database optimization

### Healdec Activity Monitoring

#### View Auto-Healing Log
1. Navigate to **Healdec** tab
2. See activity feed with recent recovery actions
3. Each entry shows:
   - Timestamp
   - Strategy badge (Retry, Restart, Rollback, etc.)
   - Affected worker
   - Issue description
   - Outcome (Success, Failed, In Progress)

#### Understanding Strategies
- **🔄 Retry** - Transient failure recovery with backoff
- **🔃 Restart** - Worker process restart
- **⚠️ Quarantine** - Isolate problematic jobs
- **↩️ Rollback** - Undo partial changes
- **🚨 Escalate** - Alert on-call team

#### Filter Actions
1. Use dropdown to filter by strategy type
2. Select date range for historical view
3. Filter by worker type
4. Search by issue description

### Alert Management

#### Create Alert
1. Click **Create Alert** button or bell icon on repository
2. Alert creation modal opens
3. Fill in fields:
   - **Repository** - Select from dropdown
   - **Condition** - Choose trigger (below threshold, above threshold)
   - **Threshold** - Enter health score value (0-100)
   - **Notification** - Enable/disable

4. Click **Create Alert**
5. Alert appears in active alerts list

#### Monitor Active Alerts
1. View alerts in dedicated panel
2. Each alert shows:
   - Repository name
   - Condition and threshold
   - Current status (Active, Triggered, Inactive)
   - Last checked timestamp

#### Manage Alerts
- **Toggle On/Off** - Click switch to enable/disable
- **Edit Alert** - Click edit icon to modify
- **Delete Alert** - Click trash icon to remove
- **View History** - See when alerts triggered

---

## Admin Workflows

The Admin role manages system configuration, user access, and worker lifecycle.

### Admin Dashboard

1. **System Metrics**
   - Total users (with growth %)
   - RPC endpoints status
   - Average response time
   - System success rate

2. **System Status Panel**
   - Database health
   - Cache status
   - API availability
   - Background jobs

3. **Recent Activity**
   - New users today
   - Alerts triggered (24h)
   - API calls (24h)
   - Failed requests

### Worker Lifecycle Management

#### Start Worker
1. Navigate to **Workers** tab
2. Find stopped worker
3. Click **Start** button
4. Worker status changes to "Running"
5. Heartbeat indicator turns green

#### Stop Worker
1. Find running worker
2. Click **Stop** button
3. Confirm action in modal
4. Worker status changes to "Stopped"
5. Existing jobs complete gracefully

#### Restart Worker
1. Find worker with errors
2. Click **Restart** button
3. Worker stops and restarts automatically
4. Job queue maintained

### Repository Administration

#### Configure Health Rules
1. Navigate to **Configuration** tab
2. Select **Health Rules** section
3. Modify scoring weights:
   - Code quality weight
   - Issue resolution weight
   - PR activity weight
   - Contributor weight
   - Documentation weight
   - Test coverage weight

4. Save changes
5. Health scores recalculate automatically

#### Set Custom Thresholds
1. Select repository from list
2. Click **Configure** button
3. Set custom thresholds:
   - Healthy: Above X
   - Warning: Between X and Y
   - Critical: Below Y

4. Apply to repository
5. Status indicator updates

### Identity Management

#### View Developer Identities
1. Navigate to **Identities** tab
2. See list of all developers
3. Each entry shows:
   - Name
   - Email addresses (linked)
   - GitHub accounts
   - Repositories contributed to
   - Claim status

#### Resolve Identity Conflicts
1. Find identity with multiple claims
2. Click **Resolve** button
3. Review claimed identities
4. Select primary identity
5. Merge duplicate records
6. Update all references

### System Configuration

#### Monitor RPC Endpoints
1. Navigate to **Endpoints** tab
2. View all configured endpoints
3. Each shows:
   - Name and URL
   - Status (Active/Inactive)
   - Response time (ms)
   - Success rate (%)
   - Last health check

#### Enable/Disable Endpoints
1. Find endpoint in list
2. Click toggle switch
3. Confirm action
4. Status updates immediately
5. Workers use active endpoints only

#### Configure Failover
1. Select primary endpoint
2. Add backup endpoints in priority order
3. Set failover conditions:
   - Response time threshold
   - Error rate threshold
   - Health check frequency

4. Save configuration
5. Automatic failover enabled

---

## Analyst Workflows

The Analyst role focuses on data exploration, insights, and reporting.

### Analytics Dashboard

1. **Key Metrics**
   - Total repositories analyzed
   - Average health score trend
   - Health distribution (Healthy/Warning/Critical)
   - Recovery success rate

2. **Visualization Options**
   - Time series charts
   - Distribution histograms
   - Correlation plots
   - Heatmaps

### Health Score Analysis

#### View Distribution
1. Navigate to **Analytics** tab
2. Select **Health Distribution** chart
3. View histogram of health scores
4. Identify clustering and outliers

#### Trend Analysis
1. Select date range
2. View health score trends over time
3. Identify seasonal patterns
4. Compare periods

#### Drill Down
1. Click on chart segment
2. View repositories in that score range
3. Analyze common characteristics
4. Generate insights

### Healdec Strategy Analysis

#### Strategy Effectiveness
1. Navigate to **Healdec Analytics**
2. View success rates by strategy:
   - Retry: ~85%
   - Restart: ~75%
   - Quarantine: ~60%
   - Rollback: ~90%
   - Escalate: ~95%

3. Analyze trends over time
4. Identify optimization opportunities

#### Common Failure Patterns
1. Group failures by type
2. Identify most frequent issues
3. Calculate MTTR (Mean Time To Recovery)
4. Recommend preventive measures

### Performance Metrics

#### Worker Performance
1. Navigate to **Worker Analytics**
2. View metrics by worker type:
   - Processing time (avg, p50, p95, p99)
   - Success rate
   - Job throughput
   - Error rate

3. Compare workers
4. Identify bottlenecks

#### System Performance
1. Track overall metrics:
   - API latency
   - Queue depth
   - Database connections
   - Memory usage

2. Set up performance baselines
3. Monitor for regressions

### Report Generation

#### Create Custom Report
1. Navigate to **Reports** tab
2. Click **New Report** button
3. Configure:
   - Report type (Health, Performance, Activity)
   - Date range
   - Repositories (All or selected)
   - Metrics to include
   - Chart types

4. Generate report
5. Preview results

#### Export Data
1. Select report or dataset
2. Choose export format:
   - CSV
   - JSON
   - PDF
   - Excel

3. Click **Export** button
4. Download file

#### Schedule Reports
1. Configure report parameters
2. Set schedule:
   - Daily, Weekly, Monthly
   - Time of day
   - Recipients

3. Save scheduled report
4. Automatic generation and delivery

---

## Developer Workflows

The Developer role focuses on API integration, testing, and documentation.

### Developer Dashboard

1. **API Overview**
   - Total API keys created
   - Requests today
   - Rate limit status
   - Available endpoints

2. **Quick Actions**
   - Create API key
   - Test endpoint
   - View documentation

### API Key Management

#### Create API Key
1. Navigate to **API Keys** tab
2. Click **Create API Key** button
3. Enter details:
   - Key name (e.g., "Production", "Testing")
   - Description (optional)
   - Permissions (read, write, admin)

4. Click **Generate**
5. Key displayed with `jsk_` prefix
6. **Important:** Copy key immediately (shown once)

#### View API Keys
1. See list of all created keys
2. Each entry shows:
   - Key name
   - Masked key string (jsk_****)
   - Request count
   - Last used date
   - Status (Active, Revoked)

#### Copy API Key
1. Click **copy icon** next to key
2. Key copied to clipboard
3. Toast notification confirms

#### Revoke API Key
1. Find key to revoke
2. Click **revoke/delete** button
3. Confirm action
4. Key immediately invalidated
5. Cannot be undone

### API Testing

#### Use API Playground
1. Navigate to **Playground** tab
2. Select endpoint from dropdown
3. Choose HTTP method (GET, POST, PUT, DELETE)
4. Add parameters:
   - Path parameters in URL
   - Query parameters in form
   - Body for POST/PUT (JSON)

5. Add headers (auto-includes auth)
6. Click **Send Request**

#### View Response
1. Response displayed below request
2. Shows:
   - Status code
   - Response time
   - Headers
   - Body (formatted JSON)

3. Copy response
4. Save as example

#### Example Requests

**Get Repository Health**
```bash
curl -X GET "https://api.algobraindoctor.io/v1/repositories/{repo_id}/health" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Create Alert**
```bash
curl -X POST "https://api.algobraindoctor.io/v1/alerts" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "repository_id": "123",
    "condition": "below",
    "threshold": 50
  }'
```

### API Documentation

#### Browse Endpoints
1. Navigate to **Documentation** tab
2. See list of all endpoints
3. Each endpoint shows:
   - HTTP method and path
   - Description
   - Parameters
   - Request body schema
   - Response schema
   - Example request/response
   - Rate limits

#### Search Documentation
1. Use search box at top
2. Search by:
   - Endpoint name
   - Method
   - Tag
   - Description

3. Results highlight matches

#### SDK Examples
1. Select endpoint
2. Choose language:
   - cURL
   - Node.js
   - Python
   - Go

3. Copy code snippet
4. Paste into your application

#### Authentication Guide
1. View **Authentication** section
2. Learn about:
   - API key format
   - Header-based auth
   - Rate limiting
   - Error handling

2. Example:
```javascript
// Node.js
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

fetch('https://api.algobraindoctor.io/v1/repositories', { headers })
  .then(res => res.json())
  .then(data => console.log(data));
```

### Integration Testing

#### Test Webhook Integration
1. Configure webhook URL
2. Select events to monitor:
   - Repository health changed
   - Alert triggered
   - Worker status changed

3. Test webhook delivery
4. View webhook logs

#### Monitor API Usage
1. View usage dashboard
2. Track:
   - Requests per hour/day
   - Endpoints called
   - Success/error rates
   - Response times

3. Identify optimization opportunities

---

## Common Patterns

### Data Persistence
All user data automatically persists using `useKV` hook:
- Watchlist
- Alerts
- Preferences
- Role selection

Data survives:
- Browser refresh
- Tab close/reopen
- Session restart

### Real-Time Updates
Some data updates automatically:
- Repository health scores (every 30 seconds)
- Worker heartbeats (every 30 seconds)
- Alert checking (every 1 minute)
- System metrics (every 30 seconds)

### Error Handling
When errors occur:
1. Toast notification shows error message
2. Action can be retried
3. Healdec may auto-remediate
4. Logs captured for analysis

### Visual Feedback
Consistent UI patterns:
- ✅ Success: Green toast, checkmark icon
- ⚠️ Warning: Yellow toast, alert icon
- ❌ Error: Red toast, X icon
- ℹ️ Info: Blue toast, info icon

---

## Related Documentation

- [Getting Started](./getting-started.md) - Basic introduction
- [Architecture](./architecture.md) - System design
- [API Reference](./api-reference.md) - Complete API docs
- [Troubleshooting](./troubleshooting.md) - Common issues

---

**Need help?** Check the [FAQ](./faq.md) or [Troubleshooting Guide](./troubleshooting.md).
