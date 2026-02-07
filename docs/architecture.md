# Architecture Overview

AlgoBrainDoctor is built on a modern, scalable architecture designed for high availability and autonomous operation. This document provides a comprehensive overview of the system design.

## System Architecture

### High-Level Architecture

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

The user interface is built with modern React patterns and provides four role-based panels.

#### Technology Stack
- **React 19.0** - Modern UI framework with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 7.2** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui v4** - Radix UI-based component library
- **Phosphor Icons** - Comprehensive icon set
- **Recharts** - Data visualization
- **D3.js** - Advanced charting
- **Sonner** - Toast notifications

#### Key Features
- **AuraFX Neo-Glow Theme** - Custom design system with GitHub Dark base
- **Role-Based Panels** - Operator, Admin, Analyst, Developer views
- **Real-Time Updates** - Live data synchronization
- **Responsive Design** - Mobile and desktop support
- **State Persistence** - useKV hook for data storage

### 2. Orchestration Layer

Central job scheduling and worker supervision system.

#### Responsibilities
- **Job Scheduling** - Distribute work across workers
- **Worker Supervision** - Monitor and restart workers
- **Load Balancing** - Optimize resource utilization
- **Priority Management** - Handle critical tasks first
- **Failure Detection** - Identify and report issues

#### Design Principles
- **Single File** - Entire orchestrator in one cohesive module
- **Zero Dependencies** - Self-contained implementation
- **Graceful Degradation** - Continue operation during partial failures
- **Observable** - Comprehensive logging and metrics

### 3. Worker Pool (12 Parallel Workers)

Specialized workers handle different aspects of repository monitoring.

#### Worker Types

##### Ingestion Workers
1. **IndexWorker**
   - Discovers new repositories
   - Updates repository metadata
   - Maintains repository catalog
   - Frequency: Continuous

2. **IngestWorker**
   - Processes GitHub webhooks
   - Handles real-time events
   - Updates repository state
   - Frequency: Event-driven

3. **SyncWorker**
   - Synchronizes repository metadata
   - Updates stars, forks, issues
   - Refreshes language detection
   - Frequency: Every 15 minutes

##### Analysis Workers
4. **IdentityWorker**
   - Extracts developer identities
   - Links email → GitHub accounts
   - Resolves identity conflicts
   - Frequency: Hourly

5. **ScoreWorker**
   - Computes repository health scores
   - Analyzes code quality metrics
   - Tracks health trends
   - Frequency: Every 30 minutes

6. **AuditWorker**
   - Compliance logging
   - Change tracking
   - Audit trail generation
   - Frequency: Real-time

##### Maintenance Workers
7. **GCWorker** (Garbage Collection)
   - Removes stale data
   - Archives old records
   - Optimizes storage
   - Frequency: Daily at 2 AM

8. **RepairWorker**
   - Fixes data inconsistencies
   - Validates relationships
   - Corrects errors
   - Frequency: Every 6 hours

9. **BackfillWorker**
   - Populates historical data
   - Fills missing metrics
   - Rebuilds indexes
   - Frequency: On-demand

10. **MaintenanceWorker**
    - Database optimization
    - Index rebuilding
    - Performance tuning
    - Frequency: Weekly

##### Notification Workers
11. **AlertWorker**
    - Monitors health thresholds
    - Sends notifications
    - Tracks alert state
    - Frequency: Every 5 minutes

12. **ExportWorker**
    - Generates reports
    - Exports data
    - Creates summaries
    - Frequency: On-demand

#### Worker Architecture

```typescript
interface Worker {
  id: string;
  type: WorkerType;
  status: 'idle' | 'running' | 'error' | 'stopped';
  lastHeartbeat: Date;
  successRate: number;
  processJob(job: Job): Promise<JobResult>;
  healthCheck(): Promise<boolean>;
}
```

#### Worker Communication
- **Job Queue** - Workers pull jobs from shared queue
- **Result Publishing** - Workers publish results to channels
- **Heartbeat** - Regular health check signals
- **Error Reporting** - Structured error messages

### 4. Healdec Auto-Healing Engine

Autonomous recovery system that detects and remediates failures without human intervention.

#### Architecture

```
┌─────────────┐
│   Monitor   │  Detect failures, anomalies, errors
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Analyzer   │  Classify issue, select strategy
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Executor   │  Apply recovery action
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Logger    │  Record outcome, metrics
└─────────────┘
```

#### Recovery Strategies

1. **Retry Strategy**
   - Use: Transient network/API failures
   - Implementation: Exponential backoff (1s, 2s, 4s, 8s, 16s)
   - Max Attempts: 5
   - Success Rate: ~85%

2. **Restart Strategy**
   - Use: Worker crashes, deadlocks
   - Implementation: Graceful shutdown + restart
   - Cooldown: 30 seconds
   - Success Rate: ~75%

3. **Quarantine Strategy**
   - Use: Corrupted data, malformed jobs
   - Implementation: Move to quarantine queue for review
   - Review Period: 24 hours
   - Success Rate: ~60% (after manual fix)

4. **Rollback Strategy**
   - Use: Partial transactions, inconsistent state
   - Implementation: Compensating transactions
   - Atomicity: Guaranteed
   - Success Rate: ~90%

5. **Escalate Strategy**
   - Use: Critical failures, repeated errors
   - Implementation: Page on-call, create incident
   - Response Time: <5 minutes
   - Success Rate: ~95% (with human intervention)

#### Decision Tree

```
Is failure transient? ──Yes──► Retry (max 5x)
       │
      No
       │
Is worker crashed? ──Yes──► Restart
       │
      No
       │
Is data corrupted? ──Yes──► Quarantine
       │
      No
       │
Is state inconsistent? ──Yes──► Rollback
       │
      No
       │
Critical failure ────────────► Escalate
```

### 5. Data & Storage Layer

#### Persistence Strategy

```typescript
// Browser-based persistence using useKV hook
interface StorageSchema {
  watchlist: string[];           // Repository IDs
  alerts: Alert[];               // Active alerts
  userRole: Role;                // Current role
  preferences: UserPreferences;  // Settings
}
```

#### Data Sources

1. **GitHub API**
   - Repository metadata
   - Contributor information
   - Issue and PR data
   - Commit history

2. **Computed Metrics**
   - Health scores
   - Trend analysis
   - Performance metrics
   - Worker statistics

3. **User Data**
   - Watchlists
   - Alert configurations
   - Role preferences
   - Custom settings

## Design Patterns

### 1. Role-Based Access Control (RBAC)

```typescript
enum Role {
  Operator = 'operator',
  Admin = 'admin',
  Analyst = 'analyst',
  Developer = 'developer'
}

interface RolePermissions {
  canViewRepositories: boolean;
  canManageWorkers: boolean;
  canViewAnalytics: boolean;
  canAccessAPI: boolean;
  canConfigureSystem: boolean;
}
```

### 2. Observer Pattern

Workers publish events; orchestrator and UI subscribe:

```typescript
interface EventEmitter {
  on(event: string, handler: Function): void;
  emit(event: string, data: any): void;
  off(event: string, handler: Function): void;
}
```

### 3. Strategy Pattern

Healdec uses strategy pattern for recovery:

```typescript
interface RecoveryStrategy {
  canHandle(error: Error): boolean;
  execute(context: RecoveryContext): Promise<RecoveryResult>;
  rollback(context: RecoveryContext): Promise<void>;
}
```

### 4. Repository Pattern

Data access abstraction:

```typescript
interface Repository<T> {
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

## Scalability Considerations

### Current Architecture
- **Browser-Based** - No backend infrastructure required
- **Client-Side Processing** - All computation in browser
- **API Integration** - GitHub API for data
- **Local Storage** - Browser storage for persistence

### Future Scaling Paths

1. **Backend Service Layer**
   - Move heavy processing to server
   - Centralized data storage
   - Multi-user support
   - Real-time synchronization

2. **Worker Distribution**
   - Distribute workers across machines
   - Message queue integration (RabbitMQ/SQS)
   - Horizontal scaling

3. **Database Layer**
   - PostgreSQL for persistent storage
   - Redis for caching
   - Time-series DB for metrics

4. **API Gateway**
   - Rate limiting
   - Authentication
   - Load balancing
   - Monitoring

## Security Architecture

### Authentication
- GitHub OAuth integration (planned)
- API key-based auth for developer access
- Role-based access control

### Authorization
- Permission checks at component level
- Feature flags per role
- Audit logging for sensitive actions

### Data Security
- No sensitive data in browser storage
- HTTPS for all API calls
- API key encryption
- Secure credential handling

## Performance Optimizations

### Frontend
- **Code Splitting** - Lazy load components
- **Memoization** - React.memo for expensive renders
- **Virtual Scrolling** - Handle large lists efficiently
- **Debouncing** - Optimize user input handling

### Data Processing
- **Batch Operations** - Group API calls
- **Caching** - Cache frequently accessed data
- **Pagination** - Load data incrementally
- **Background Processing** - Non-blocking operations

### Monitoring
- **Performance Metrics** - Track render times
- **Error Tracking** - Capture and log errors
- **Usage Analytics** - Understand user patterns
- **Health Checks** - System status monitoring

## Technology Choices

### Why React 19?
- Concurrent features for better UX
- Server Components (future use)
- Automatic batching
- Improved hydration

### Why TypeScript?
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Refactoring confidence

### Why Vite?
- Lightning-fast HMR
- Modern ESM support
- Optimized builds
- Plugin ecosystem

### Why Tailwind CSS?
- Rapid development
- Consistent design
- Purged CSS (small bundles)
- Customizable theme

### Why shadcn/ui?
- Accessible components
- Customizable and composable
- No runtime overhead
- Copy-paste philosophy

## Future Architecture

### Planned Enhancements

1. **Real-Time Collaboration**
   - WebSocket connections
   - Shared state across users
   - Live updates

2. **AI/ML Integration**
   - Predictive health scores
   - Anomaly detection
   - Smart recommendations

3. **Plugin System**
   - Custom workers
   - Extended functionality
   - Third-party integrations

4. **Multi-Tenancy**
   - Organization support
   - Team management
   - Access control

## Related Documentation

- [Worker System](./workers.md) - Detailed worker documentation
- [Healdec Engine](./healdec.md) - Auto-healing deep dive
- [API Reference](./api-reference.md) - API documentation
- [Development Guide](./development.md) - Development setup

---

**Next:** Learn about the [Worker System](./workers.md) in detail.
