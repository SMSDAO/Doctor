# AlgoBrainDoctor - Architecture Overview

**⚠️ This file has been moved to comprehensive documentation.**

For complete architecture documentation, please see:

📖 **[docs/architecture.md](./docs/architecture.md)** - Comprehensive system architecture

## Quick Links

- **[Architecture Overview](./docs/architecture.md)** - Full system design
- **[Worker System](./docs/workers.md)** - Worker architecture details
- **[Healdec Engine](./docs/healdec.md)** - Auto-healing system
- **[API Reference](./docs/api-reference.md)** - API documentation

## High-Level Architecture

AlgoBrainDoctor is built on a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Application                      │
│  (React 19 + TypeScript + Tailwind CSS + shadcn/ui)        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ WebSocket/HTTP
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   Orchestration Layer                        │
│              (One-File Job Scheduler)                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
┌──────▼──────┐     ┌───────▼────────┐
│   Worker    │     │    Healdec     │
│    Pool     │◄────┤  Auto-Healing  │
│ (12 Workers)│     │     Engine     │
└──────┬──────┘     └────────────────┘
       │
       │
┌──────▼──────────────────────────────────────────┐
│           Data & Storage Layer                  │
│  (useKV Persistence + GitHub API Integration)   │
└─────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Application Layer
- React 19 with TypeScript
- Tailwind CSS + shadcn/ui components
- AuraFX Neo-Glow design system
- Role-based panels (Operator, Admin, Analyst, Developer)

### 2. Orchestration Layer
- Centralized job scheduling
- Worker supervision
- Load balancing
- Priority management

### 3. Worker Pool (12 Parallel Workers)
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

### 4. Healdec Auto-Healing Engine
Autonomous recovery with 5 strategies:
- **Retry** - Exponential backoff for transient failures
- **Restart** - Worker process restart
- **Quarantine** - Isolate problematic jobs
- **Rollback** - Compensating transactions
- **Escalate** - Page on-call for critical failures

### 5. Data & Storage Layer
- Browser localStorage via useKV hook
- GitHub API integration
- Computed metrics and analytics

## Key Features

- 🔄 **Self-Healing** - Autonomous error recovery
- ⚡ **12 Parallel Workers** - Specialized task handling
- 🎛️ **One-File Orchestrator** - Centralized job scheduling
- 📊 **Real-Time Scoring** - Repository health (0-100)
- 🔍 **Identity Resolution** - Developer tracking
- 🎨 **AuraFX UI** - Neo-glow cyber-medical theme

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **UI Components**: shadcn/ui v4 (Radix UI)
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **Charts**: Recharts + D3.js
- **State**: React hooks + useKV persistence
- **Build**: Vite 7.2

---

For detailed architecture documentation, design patterns, scalability considerations, and more, see the [complete architecture documentation](./docs/architecture.md)

**Version:** 4.0.0  
**Last Updated:** 2026-02-07
