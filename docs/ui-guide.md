# UI Dashboard Guide

Visual guide to AlgoBrainDoctor's user interfaces across all four role-based dashboards.

## 🎨 Dashboard Overview

AlgoBrainDoctor features four specialized role-based dashboards, each optimized for specific tasks and workflows. All dashboards share a consistent **AuraFX Neo-Glow + GitHub Dark** design system.

---

## 🔍 Operator Dashboard

**Primary Use**: Real-time monitoring, health tracking, and quick actions

### Main View Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  AlgoBrainDoctor                    [Operator ▼]    🔔 👤 ⚙️        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📊 System Metrics                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┐                     │
│  │ 127 Repos│ 87% Avg  │ 12 Active│ 3 Alerts │                     │
│  │ Monitored│ Health   │ Workers  │ Active   │                     │
│  └──────────┴──────────┴──────────┴──────────┘                     │
│                                                                      │
│  🏥 Repository Health Overview                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ SMSDAO/Doctor                          🟢 92  ⬆ +2  ⭐      │    │
│  │ ████████████████████░░░░ TypeScript                        │    │
│  │                                                             │    │
│  │ microsoft/vscode                       🟡 67  ⬇ -5         │    │
│  │ ████████████░░░░░░░░░░░░ TypeScript                        │    │
│  │                                                             │    │
│  │ facebook/react                         🔴 34  ⬇ -12        │    │
│  │ ██████░░░░░░░░░░░░░░░░░░ JavaScript                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  👷 Worker Status (12 Active)                                       │
│  ┌──────────┬──────────┬──────────┬──────────┐                     │
│  │ 🟢 Index │ 🟢 Score │ 🟢 Sync  │ 🟢 Ingest│                     │
│  │ 98% ✓    │ 99% ✓    │ 97% ✓    │ 100% ✓   │                     │
│  ├──────────┼──────────┼──────────┼──────────┤                     │
│  │ 🟢 Alert │ 🟢 Export│ 🟢 Audit │ 🟢 Repair│                     │
│  │ 96% ✓    │ 100% ✓   │ 100% ✓   │ 94% ✓    │                     │
│  ├──────────┼──────────┼──────────┼──────────┤                     │
│  │ 🟢 ID    │ 🟢 GC    │ 🟢 Back  │ 🟢 Maint │                     │
│  │ 99% ✓    │ 100% ✓   │ 95% ✓    │ 98% ✓    │                     │
│  └──────────┴──────────┴──────────┴──────────┘                     │
│                                                                      │
│  🔧 Healdec Auto-Healing Activity                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 2026-03-15 08:05 [RETRY] IndexWorker - Rate limit hit      │    │
│  │ 2026-03-15 08:03 [RESTART] SyncWorker - Memory leak        │    │
│  │ 2026-03-15 08:00 [QUARANTINE] ScoreWorker - Invalid data   │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key UI Elements

**Repository Health Cards**
- Health score with color-coded badge (🟢 >80, 🟡 60-80, 🔴 <60)
- Progress bar visualization
- 24h trend indicator (⬆ improving, ⬇ declining)
- Star button to add to watchlist
- Language tag and last updated timestamp

**Worker Status Grid**
- 3x4 grid showing all 12 workers
- Real-time heartbeat indicators (🟢 Active, 🔴 Stale)
- Success rate percentage
- Jobs processed count
- Click to expand details

**Healdec Activity Log**
- Chronological list of auto-healing actions
- Strategy badges: [RETRY], [RESTART], [QUARANTINE], [ROLLBACK], [ESCALATE]
- Affected worker name
- Issue description
- Timestamp

---

## ⚙️ Admin Dashboard

**Primary Use**: System administration, worker management, configuration

### Main View Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  AlgoBrainDoctor                    [Admin ▼]       🔔 👤 ⚙️        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📈 System Status                                                    │
│  ┌──────────┬──────────┬──────────┬──────────┐                     │
│  │🟢Database│🟢 Cache  │🟢 API    │🟢 Jobs   │                     │
│  │  Online  │  23ms    │  45ms    │  128     │                     │
│  └──────────┴──────────┴──────────┴──────────┘                     │
│                                                                      │
│  🔧 Worker Lifecycle Management                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ IndexWorker        🟢 Active   [Stop] [Restart] [Config]   │    │
│  │ ScoreWorker        🟢 Active   [Stop] [Restart] [Config]   │    │
│  │ SyncWorker         🔴 Stopped  [Start] [Config]            │    │
│  │ IngestWorker       🟢 Active   [Stop] [Restart] [Config]   │    │
│  │ ...                                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  👥 Identity Management                                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Developer: Alice Smith                                      │    │
│  │ Emails: alice@example.com, asmith@company.io               │    │
│  │ GitHub: @alicedev                                           │    │
│  │ Commits: 1,247  [Merge Identities]                         │    │
│  │                                                             │    │
│  │ Developer: Bob Johnson                                      │    │
│  │ Emails: bob@example.com                                     │    │
│  │ GitHub: @bobjohnson                                         │    │
│  │ Commits: 892   [Merge Identities]                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ⚙️ System Configuration                                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Health Score Weights                                        │    │
│  │ • Code Quality:    30% ──────██████────────              │    │
│  │ • Documentation:   20% ────────████──────────            │    │
│  │ • Test Coverage:   25% ─────────█████─────────           │    │
│  │ • Security:        25% ─────────█████─────────           │    │
│  │                                         [Save Changes]     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key UI Elements

**System Status Panel**
- Real-time service health (Database, Cache, API, Jobs)
- Response time metrics
- Connection status indicators

**Worker Control Panel**
- Start/Stop/Restart buttons for each worker
- Configuration modal for worker settings
- Real-time status indicators
- Job queue depth

**Identity Management**
- Developer profile cards
- Email address consolidation
- GitHub account linking
- Commit attribution
- Merge identities functionality

**Configuration Sliders**
- Health score weight adjustment
- Custom threshold settings
- RPC endpoint management
- Global system settings

---

## 📊 Analyst Dashboard

**Primary Use**: Analytics, insights, data visualization

### Main View Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  AlgoBrainDoctor                    [Analyst ▼]     🔔 👤 ⚙️        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📊 Health Score Distribution                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │      ┃                                                      │    │
│  │  60 ┃     ██                                                │    │
│  │  50 ┃     ██                                                │    │
│  │  40 ┃     ██  ██                                            │    │
│  │  30 ┃     ██  ██  ██                                        │    │
│  │  20 ┃     ██  ██  ██  ██                                    │    │
│  │  10 ┃     ██  ██  ██  ██  ██  ██  ██                        │    │
│  │   0 ┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃    │
│  │       0-20 20-40 40-60 60-80 80-100                         │    │
│  │              Health Score Ranges                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  🔧 Healdec Strategy Effectiveness                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Strategy     Success Rate    Avg Recovery Time   Usage     │    │
│  │ ──────────────────────────────────────────────────────────│    │
│  │ RETRY        ████████████ 94%    2.3s           876 times  │    │
│  │ RESTART      ██████████░░ 87%    8.1s           234 times  │    │
│  │ QUARANTINE   ████████████ 100%   N/A            45 times   │    │
│  │ ROLLBACK     ████████░░░░ 78%    15.2s          89 times   │    │
│  │ ESCALATE     ██████████░░ 89%    Manual         23 times   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  👷 Worker Performance Metrics                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Worker       P50      P95      P99      Success   Errors    │    │
│  │ ──────────────────────────────────────────────────────────│    │
│  │ IndexWorker  120ms    450ms    1.2s     98.3%     12       │    │
│  │ ScoreWorker  85ms     200ms    450ms    99.1%     5        │    │
│  │ SyncWorker   340ms    1.1s     2.8s     97.2%     23       │    │
│  │ IngestWorker 50ms     120ms    280ms    100.0%    0        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key UI Elements

**Health Distribution Chart**
- Histogram showing repository count by health score range
- Color coding: 🔴 Red (0-40), 🟡 Yellow (40-80), 🟢 Green (80-100)
- Statistical summary (mean, median, std dev)
- Filterable by language, organization, date range

**Strategy Effectiveness Table**
- Success rate bars for each Healdec strategy
- Average recovery time (MTTR)
- Usage frequency
- Trend indicators

**Performance Metrics**
- Processing time percentiles (p50, p95, p99)
- Success rates by worker
- Error counts
- Throughput graphs
- Time-series visualizations

---

## 💻 Developer Dashboard

**Primary Use**: API integration, testing, key management

### Main View Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  AlgoBrainDoctor                  [Developer ▼]     🔔 👤 ⚙️        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔑 API Keys                                    [+ Create New Key]  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Production Key                                              │    │
│  │ bdh_v4_****************                    [Copy] [Delete]  │    │
│  │ Created: 2026-02-15  Last used: 5 min ago  Requests: 1.2k  │    │
│  │                                                             │    │
│  │ Development Key                                             │    │
│  │ bdh_v4_****************                    [Copy] [Delete]  │    │
│  │ Created: 2026-01-10  Last used: 2 days ago  Requests: 456  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  🧪 API Playground                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ GET /api/v1/repositories/health                             │    │
│  │                                                             │    │
│  │ Headers:                                                    │    │
│  │ Authorization: Bearer bdh_v4_****************               │    │
│  │                                                             │    │
│  │ Query Parameters:                                           │    │
│  │ owner: SMSDAO                                               │    │
│  │ repo: Doctor                                                │    │
│  │                                        [Send Request]       │    │
│  │ ─────────────────────────────────────────────────────────  │    │
│  │ Response (200 OK) - 45ms                                    │    │
│  │ {                                                           │    │
│  │   "health_score": 92,                                       │    │
│  │   "status": "healthy",                                      │    │
│  │   "components": {                                           │    │
│  │     "code_quality": 88,                                     │    │
│  │     "documentation": 95,                                    │    │
│  │     "test_coverage": 90,                                    │    │
│  │     "security": 96                                          │    │
│  │   }                                                         │    │
│  │ }                                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  📚 API Documentation                      [View Full Docs →]      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Quick Links:                                                │    │
│  │ • Authentication & API Keys                                 │    │
│  │ • Repository Endpoints                                      │    │
│  │ • Health Metrics API                                        │    │
│  │ • Worker Status API                                         │    │
│  │ • Webhooks Configuration                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key UI Elements

**API Key Management**
- Create new keys with custom names
- Masked key display (bdh_v4_****)
- Copy to clipboard functionality
- Usage statistics (requests, last used)
- Delete/revoke keys

**API Playground**
- Endpoint selector dropdown
- Live request builder
- Header and parameter inputs
- Send request button
- Formatted response display
- Status code and timing
- Code examples (Node.js, Python, cURL)

**Documentation Links**
- Quick navigation to API docs
- Authentication guide
- Rate limiting information
- Example requests/responses

---

## 🎨 Design System

### AuraFX Neo-Glow Theme

**Color Palette**
- **Violet Aura**: `oklch(0.50 0.25 285)` - Primary actions, focused elements
- **Aqua Pulse**: `oklch(0.65 0.20 240)` - Health indicators, success states
- **Coral Heat**: `oklch(0.58 0.24 25)` - Alerts, warnings, errors
- **Cyber Background**: `oklch(0.10 0.03 270)` - Deep blue-black base

**Typography**
- Headers: System font stack with bold weights
- Body: -apple-system, BlinkMacSystemFont, "Segoe UI"
- Code: "SF Mono", Consolas, monospace

**Components**
- Cards with subtle glow effects
- Progress bars with gradient fills
- Status badges with color coding
- Interactive buttons with hover states
- Smooth transitions and animations

### Responsive Design

**Desktop (1920x1080)**
- Full dashboard with side-by-side panels
- Expanded metrics and charts
- Multi-column layouts

**Tablet (768x1024)**
- Stacked panels
- Collapsible sidebars
- Condensed navigation

**Mobile (375x812)**
- Single column layout
- Bottom navigation
- Swipeable cards
- Touch-optimized controls

---

## 🔄 Real-Time Features

All dashboards update automatically every 30 seconds:
- Repository health scores refresh
- Worker heartbeats update
- System metrics recalculate
- Healdec activity log appends new entries
- Visual indicators pulse during updates

---

## 📸 Screenshot Specifications

When capturing actual screenshots:

1. **Resolution**: 1920x1080 (desktop), 375x812 (mobile)
2. **Format**: PNG with lossless compression
3. **Color Profile**: sRGB
4. **Content**: Representative data, no real user info
5. **State**: Clean UI, no errors unless demonstrating error states

### Recommended Captures

**Operator Dashboard**
- Full dashboard view
- Repository list sorted by health
- Worker status grid
- Healdec activity log with recent actions
- Watchlist with starred repos

**Admin Dashboard**
- System status overview
- Worker control panel with mix of active/stopped workers
- Identity management interface
- Configuration panel with sliders

**Analyst Dashboard**
- Health distribution chart
- Healdec effectiveness table
- Worker performance metrics
- Time-series graphs

**Developer Dashboard**
- API key list
- API playground with sample request
- Response display with formatted JSON
- Documentation quick links

---

**Note**: This document serves as a comprehensive UI guide. Actual screenshots will be captured once the application is successfully deployed and running. The layouts described here match the current implementation in the codebase.

**Last Updated**: 2026-03-15
