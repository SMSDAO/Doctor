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

## 🔮 Future Enhancements

- GitHub integration for live repository scanning
- Webhook support for real-time updates
- Advanced analytics and ML-powered predictions
- Custom alert rules and notifications
- Export capabilities for reports
- Multi-tenant support

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Version:** 4.0.0  
**Last Updated:** 2025-01-28  
**Made with** 🧠⚡ **by the AlgoBrainDoctor team**
