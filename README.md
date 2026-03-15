# AlgoBrainDoctor — Brain-Doctor Hospital V4 🧠⚡

> **Production-ready repository health monitoring and auto-healing platform**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-4.0.0-purple.svg)](PRD.md)
[![Status](https://img.shields.io/badge/status-production--ready-green.svg)](README.md)

---

## 🎯 Overview

Brain-Doctor Hospital V4 is an advanced GitOps health monitoring system that continuously scans repositories, tracks developer identities, computes health scores, and automatically remediates issues through intelligent auto-healing strategies.

### Key Features

- 🔄 **Self-Healing**: Autonomous error detection and recovery via Healdec engine
- ⚡ **12 Parallel Workers**: Specialized workers for indexing, scoring, ingestion, and more
- 🎛️ **One-File Orchestrator**: Centralized job scheduling and worker supervision
- 📊 **Real-Time Scoring**: Repository health scores (0-100) with detailed breakdowns
- 🔍 **Identity Resolution**: Developer identity tracking and claim management
- 🎨 **Aura FX UI**: Neo-glow cyber-medical theme with GitHub Dark base
- 🚀 **Production-Ready**: Built with React, TypeScript, and modern web technologies

---

## 🏗️ Architecture

The system is built around four key role-based panels:

### **Operator Dashboard** 
Fleet overview, worker health monitoring, Healdec actions, and auto-healing log

### **Admin Panel**
Backfills, reindexing, overrides, and raw record inspection

### **Analyst Panel**
Query builder, table explorer, graph surfaces, and export tools

### **Developer Panel**
API keys, webhooks, error traces, and sandbox console

---

## 🚀 Quick Start

This is a Spark application that runs in your browser. Simply explore the interface:

1. **Select your role** from the dropdown (Operator, Admin, Analyst, or Developer)
2. **View repository health scores** and monitor critical repos
3. **Check worker status** - all 12 parallel workers
4. **Review Healdec actions** - autonomous healing activities
5. **Monitor system metrics** - queue depth, API latency, and more

---

## 🧠 Core Components

### Repository Health Monitoring
- Real-time health scores (0-100)
- Health trend tracking (24h changes)
- Status indicators: Healthy, Warning, Critical
- Language detection and metadata

### 12 Parallel Workers
1. **IndexWorker** - Discover repositories
2. **IdentityWorker** - Extract developer identities
3. **ScoreWorker** - Compute health scores
4. **IngestWorker** - Process GitHub webhooks
5. **SyncWorker** - Sync repo metadata
6. **GCWorker** - Garbage collection
7. **AlertWorker** - Monitor and notify
8. **ExportWorker** - Generate reports
9. **AuditWorker** - Compliance logging
10. **RepairWorker** - Fix data inconsistencies
11. **BackfillWorker** - Historical data population
12. **MaintenanceWorker** - Database optimization

### Healdec Auto-Healing Engine
Autonomous recovery system with 5 strategies:
- **Retry** - Exponential backoff for transient failures
- **Restart** - Worker process restart for crashes
- **Quarantine** - Isolate problematic jobs for review
- **Rollback** - Undo partial changes with compensating transactions
- **Escalate** - Page on-call for critical failures

---

## 🎨 UI/UX Design System

### AuraFX Neo-Glow + GitHub Dark Theme

**Color Palette:**
- Violet Aura: `oklch(0.50 0.25 285)` - Primary actions and glow effects
- Aqua Pulse: `oklch(0.65 0.20 240)` - Health indicators and success states
- Coral Heat: `oklch(0.58 0.24 25)` - Alerts and warnings
- Cyber Background: `oklch(0.10 0.03 270)` - Deep blue-black with purple tint

**Core Components:**
- Repository Cards with health progress bars
- Worker Status Cards with live heartbeat indicators
- Healdec Action Log with strategy badges
- System Metrics Dashboard with real-time updates
- Role-adaptive navigation and views

---

## 📸 UI Dashboards & Screenshots

### Visual Guide

Comprehensive visual layouts for all four role-based dashboards:

**[📖 Complete UI Guide](docs/ui-guide.md)** - Detailed ASCII layouts and component descriptions for:
- **Operator Dashboard**: Repository monitoring, worker status, Healdec activity
- **Admin Dashboard**: System administration, worker management, identity resolution
- **Analyst Dashboard**: Analytics, charts, performance metrics
- **Developer Dashboard**: API keys, playground, documentation

### Dashboard Previews

#### Operator Dashboard
```
┌─────────────────────────────────────────────┐
│  📊 System Metrics                          │
│  127 Repos | 87% Avg Health | 12 Workers   │
│                                              │
│  🏥 Repository Health Overview              │
│  SMSDAO/Doctor        🟢 92  ⬆ +2  ⭐      │
│  ████████████████████░░░░ TypeScript        │
│                                              │
│  microsoft/vscode     🟡 67  ⬇ -5          │
│  ████████████░░░░░░░░░░░░ TypeScript        │
│                                              │
│  👷 Worker Status (12 Active)               │
│  🟢 Index 98% | 🟢 Score 99% | 🟢 Sync 97% │
└─────────────────────────────────────────────┘
```

#### Admin Dashboard
```
┌─────────────────────────────────────────────┐
│  📈 System Status                           │
│  🟢 Database | 🟢 Cache | 🟢 API | 🟢 Jobs │
│                                              │
│  🔧 Worker Lifecycle Management             │
│  IndexWorker   🟢 Active  [Stop] [Restart]  │
│  ScoreWorker   🟢 Active  [Stop] [Restart]  │
│                                              │
│  👥 Identity Management                      │
│  Developer: Alice Smith                     │
│  Emails: alice@example.com                  │
│  GitHub: @alicedev                          │
└─────────────────────────────────────────────┘
```

#### Analyst Dashboard
```
┌─────────────────────────────────────────────┐
│  📊 Health Score Distribution               │
│      ┃                                       │
│  60 ┃     ██                                │
│  40 ┃     ██  ██                            │
│  20 ┃     ██  ██  ██  ██                    │
│   0 ┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃  │
│       0-20 20-40 40-60 60-80 80-100         │
│                                              │
│  🔧 Healdec Strategy Effectiveness          │
│  RETRY     ████████████ 94% | 2.3s         │
│  RESTART   ██████████░░ 87% | 8.1s         │
└─────────────────────────────────────────────┘
```

#### Developer Dashboard
```
┌─────────────────────────────────────────────┐
│  🔑 API Keys           [+ Create New Key]   │
│  Production Key                             │
│  bdh_v4_****** [Copy] [Delete]             │
│                                              │
│  🧪 API Playground                          │
│  GET /api/v1/repositories/health            │
│  Authorization: Bearer bdh_v4_******        │
│                         [Send Request]      │
│                                              │
│  Response (200 OK) - 45ms                   │
│  { "health_score": 92, "status": "healthy" }│
└─────────────────────────────────────────────┘
```

### Screenshot Directory

Full screenshots will be available in [`docs/screenshots/`](docs/screenshots/) organized by role:
- `operator/` - Fleet monitoring and health tracking
- `admin/` - System administration and configuration
- `analyst/` - Analytics and insights
- `developer/` - API integration and development

**Note**: Actual PNG screenshots will be captured once the application is deployed. The [UI Guide](docs/ui-guide.md) provides detailed visual descriptions of all dashboard layouts.

---

## 📊 System Metrics

Key metrics monitored:
- Worker success rate (>99% target)
- Healdec action rate (<5% target)
- API latency p95 (<500ms target)
- Queue depth (<100 pending)
- Database connections (<80% pool)

---

## 🔧 Technical Stack

- **Frontend**: React 19 + TypeScript
- **UI Components**: shadcn/ui v4 (Radix UI)
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **State Management**: React hooks + useKV persistence
- **Notifications**: Sonner
- **Build Tool**: Vite

---

## 📚 Data Persistence

All critical data is persisted using the `useKV` hook:
- Watchlist (tracked repositories)
- Alerts (active monitoring rules)
- User role preferences
- System configuration

---

## 🎭 Role-Based Access

### Operator
- Monitor all repositories and their health scores
- Track worker status and performance
- Review Healdec auto-healing actions
- Manage watchlist and alerts

### Admin
- Control worker lifecycle (start/stop)
- Manage developer identities
- Monitor job queue
- Repository administration

### Analyst
- View system-wide analytics
- Health score distribution
- Healdec strategy analysis
- Performance metrics

### Developer
- Access API keys
- View available endpoints
- Test API calls in playground
- Review SDK examples (Node.js, Python, cURL)

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Getting Started
- **[Quick Start Guide](./docs/getting-started.md)** - Get up and running in minutes
- **[Installation](./docs/getting-started.md)** - Installation and setup instructions

### Core Documentation
- **[Architecture Overview](./docs/architecture.md)** - System design and components
- **[Worker System](./docs/workers.md)** - 12 parallel workers explained
- **[Healdec Engine](./docs/healdec.md)** - Auto-healing strategies
- **[Workflows](./docs/workflows.md)** - Role-based user workflows

### Technical Documentation
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Development Guide](./docs/development.md)** - Development setup
- **[Deployment Guide](./docs/deployment.md)** - Production deployment

### Support
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[FAQ](./docs/faq.md)** - Frequently asked questions
- **[Contributing](./docs/contributing.md)** - How to contribute
- **[Glossary](./docs/glossary.md)** - Terms and definitions

📖 **[View All Documentation](./docs/README.md)**

---

## 🔮 Future Enhancements

- GitHub integration for live repository scanning
- Webhook support for real-time updates
- Advanced analytics and ML-powered predictions
- Custom alert rules and notifications
- Export capabilities for reports
- Multi-tenant support

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/contributing.md) for details on:
- Code of conduct
- Development workflow
- Coding standards
- Pull request process

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🆘 Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Report Issues](https://github.com/SMSDAO/Doctor/issues)
- 💬 [Discussions](https://github.com/SMSDAO/Doctor/discussions)
- 🔒 [Security Policy](./SECURITY.md)

---

**Version:** 4.0.0  
**Last Updated:** 2026-02-07  
**Made with** 🧠⚡ **by the AlgoBrainDoctor team**
