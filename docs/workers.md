# Worker System

The AlgoBrainDoctor platform runs 12 specialized workers in parallel to handle different aspects of repository monitoring, analysis, and maintenance. This document provides comprehensive documentation for the worker system.

## Overview

### Architecture

The worker system follows a distributed, event-driven architecture:

```
┌─────────────────────────────────────────┐
│        Job Orchestrator                 │
│  (Scheduling & Load Balancing)          │
└──────────┬──────────────────────────────┘
           │
           │ Distributes Jobs
           │
    ┌──────┴──────────────────┐
    │                          │
┌───▼────┐  ┌───────┐  ┌─────▼───┐
│Worker 1│  │Worker 2│  │Worker 12│
│Running │  │ Idle   │  │ Running │
└────┬───┘  └───┬───┘  └────┬────┘
     │          │            │
     └──────────┴────────────┘
                │
         ┌──────▼──────┐
         │   Healdec   │
         │ Auto-Healing│
         └─────────────┘
```

### Key Characteristics

- **Parallel Execution** - All 12 workers run concurrently
- **Specialized** - Each worker type handles specific tasks
- **Resilient** - Auto-recovery via Healdec engine
- **Observable** - Real-time status and metrics
- **Scalable** - Can be distributed across machines

## Worker Types

### 1. IndexWorker

**Purpose:** Discovers and catalogs repositories

**Responsibilities:**
- Scan GitHub organizations for new repositories
- Update repository metadata
- Maintain searchable index
- Track repository lifecycle (created, archived, deleted)

**Schedule:** Continuous (every 5 minutes)

**Configuration:**
```typescript
{
  type: 'IndexWorker',
  scanInterval: 300000, // 5 minutes
  maxReposPerScan: 100,
  organizations: ['org1', 'org2'],
  includeArchived: false
}
```

**Key Metrics:**
- Repositories discovered per hour
- Index update latency
- Scan completion rate
- API rate limit usage

**Common Issues:**
- GitHub API rate limits
- Organization permission errors
- Network timeouts

---

### 2. IdentityWorker

**Purpose:** Extracts and links developer identities

**Responsibilities:**
- Parse commit author information
- Link emails to GitHub accounts
- Resolve identity conflicts
- Track contributor statistics

**Schedule:** Hourly

**Configuration:**
```typescript
{
  type: 'IdentityWorker',
  batchSize: 500,
  deduplicationThreshold: 0.85,
  emailDomains: ['github.com', 'users.noreply.github.com']
}
```

**Key Metrics:**
- Identities resolved per hour
- Conflict resolution rate
- Unique contributors tracked
- Email → GitHub match rate

**Common Issues:**
- Multiple emails per developer
- Name variations
- Privacy settings blocking email

---

### 3. ScoreWorker

**Purpose:** Computes repository health scores

**Responsibilities:**
- Calculate health metrics (0-100)
- Track health trends
- Identify critical repositories
- Generate health reports

**Schedule:** Every 30 minutes

**Configuration:**
```typescript
{
  type: 'ScoreWorker',
  weights: {
    codeQuality: 0.25,
    issueResolution: 0.20,
    prActivity: 0.20,
    contributors: 0.15,
    documentation: 0.10,
    testCoverage: 0.10
  },
  thresholds: {
    healthy: 80,
    warning: 50,
    critical: 0
  }
}
```

**Health Score Formula:**
```
Health Score = (
  codeQuality * 0.25 +
  issueResolution * 0.20 +
  prActivity * 0.20 +
  contributors * 0.15 +
  documentation * 0.10 +
  testCoverage * 0.10
) * 100
```

**Key Metrics:**
- Scores computed per hour
- Average health score
- Score distribution
- Trend accuracy

**Common Issues:**
- Missing metrics for new repos
- Stale data affecting scores
- Weight configuration tuning

---

### 4. IngestWorker

**Purpose:** Processes GitHub webhooks in real-time

**Responsibilities:**
- Receive webhook events
- Parse event payloads
- Update repository state
- Trigger dependent workers

**Schedule:** Event-driven (on webhook receipt)

**Configuration:**
```typescript
{
  type: 'IngestWorker',
  events: [
    'push',
    'pull_request',
    'issues',
    'repository'
  ],
  queueSize: 1000,
  processingTimeout: 30000 // 30 seconds
}
```

**Supported Events:**
- `push` - New commits
- `pull_request` - PR opened/closed/merged
- `issues` - Issue created/closed
- `repository` - Repo created/deleted/archived

**Key Metrics:**
- Events processed per second
- Queue depth
- Processing latency
- Event types distribution

**Common Issues:**
- Queue overflow during spikes
- Invalid webhook signatures
- Duplicate events

---

### 5. SyncWorker

**Purpose:** Synchronizes repository metadata

**Responsibilities:**
- Update stars, forks, watchers
- Refresh language detection
- Sync issue/PR counts
- Update last activity timestamp

**Schedule:** Every 15 minutes

**Configuration:**
```typescript
{
  type: 'SyncWorker',
  batchSize: 50,
  concurrency: 5,
  fields: [
    'stars',
    'forks',
    'language',
    'issues',
    'pullRequests'
  ]
}
```

**Key Metrics:**
- Repositories synced per hour
- Sync latency
- Data freshness
- API quota usage

**Common Issues:**
- API rate limiting
- Stale cache
- Network delays

---

### 6. GCWorker (Garbage Collection)

**Purpose:** Cleans up stale and obsolete data

**Responsibilities:**
- Remove archived repositories
- Delete old logs
- Purge expired cache entries
- Optimize storage

**Schedule:** Daily at 2:00 AM UTC

**Configuration:**
```typescript
{
  type: 'GCWorker',
  retention: {
    logs: 90,        // 90 days
    metrics: 365,    // 1 year
    cache: 7         // 7 days
  },
  dryRun: false
}
```

**Key Metrics:**
- Data deleted per run
- Storage reclaimed
- Cleanup duration
- Errors encountered

**Common Issues:**
- Long-running cleanup
- Accidental data deletion
- Concurrency conflicts

---

### 7. AlertWorker

**Purpose:** Monitors health thresholds and sends notifications

**Responsibilities:**
- Check active alerts
- Evaluate trigger conditions
- Send notifications
- Track alert history

**Schedule:** Every 5 minutes

**Configuration:**
```typescript
{
  type: 'AlertWorker',
  checkInterval: 300000, // 5 minutes
  cooldown: 3600000,     // 1 hour
  channels: ['email', 'webhook', 'ui']
}
```

**Alert Conditions:**
- Health score below threshold
- Health score above threshold
- Health dropped by X% in Y hours
- Worker failure rate exceeded

**Key Metrics:**
- Alerts checked per minute
- Alerts triggered per day
- False positive rate
- Notification delivery rate

**Common Issues:**
- Alert fatigue (too many alerts)
- Notification delivery failures
- Cooldown too short/long

---

### 8. ExportWorker

**Purpose:** Generates reports and exports data

**Responsibilities:**
- Create CSV/JSON/PDF reports
- Export repository data
- Generate summaries
- Archive historical data

**Schedule:** On-demand

**Configuration:**
```typescript
{
  type: 'ExportWorker',
  formats: ['csv', 'json', 'pdf'],
  maxExportSize: 100000, // 100k records
  compressionEnabled: true
}
```

**Export Types:**
- Repository health report
- Worker performance summary
- Healdec activity log
- Identity mapping

**Key Metrics:**
- Exports generated per day
- Export size (bytes)
- Generation time
- Download rate

**Common Issues:**
- Large export timeouts
- Memory constraints
- Format compatibility

---

### 9. AuditWorker

**Purpose:** Compliance logging and change tracking

**Responsibilities:**
- Log all data changes
- Track user actions
- Maintain audit trail
- Generate compliance reports

**Schedule:** Real-time (triggered on events)

**Configuration:**
```typescript
{
  type: 'AuditWorker',
  events: [
    'repository.updated',
    'alert.created',
    'worker.stopped',
    'config.changed'
  ],
  retention: 2555,  // 7 years
  encryption: true
}
```

**Logged Events:**
- Configuration changes
- Worker lifecycle events
- Alert modifications
- User actions

**Key Metrics:**
- Audit entries per day
- Log retention size
- Query performance
- Compliance coverage

**Common Issues:**
- Log volume growth
- Query performance
- Retention policy enforcement

---

### 10. RepairWorker

**Purpose:** Fixes data inconsistencies and errors

**Responsibilities:**
- Validate data integrity
- Correct malformed records
- Rebuild indexes
- Reconcile conflicts

**Schedule:** Every 6 hours

**Configuration:**
```typescript
{
  type: 'RepairWorker',
  checks: [
    'orphaned_records',
    'duplicate_identities',
    'missing_health_scores',
    'invalid_references'
  ],
  autoFix: true
}
```

**Repair Types:**
- Orphaned record cleanup
- Duplicate merge
- Missing data backfill
- Relationship validation

**Key Metrics:**
- Issues detected per run
- Auto-fixes applied
- Manual review required
- Repair success rate

**Common Issues:**
- Cannot auto-fix all issues
- Repair conflicts
- Performance impact

---

### 11. BackfillWorker

**Purpose:** Populates historical data

**Responsibilities:**
- Fill missing historical metrics
- Rebuild historical trends
- Import legacy data
- Reconstruct timelines

**Schedule:** On-demand (manual trigger)

**Configuration:**
```typescript
{
  type: 'BackfillWorker',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  batchSize: 100,
  priority: 'low'
}
```

**Backfill Types:**
- Health score history
- Contributor statistics
- Event timelines
- Metric aggregations

**Key Metrics:**
- Records backfilled
- Completion percentage
- Time remaining
- Error rate

**Common Issues:**
- API rate limits
- Data unavailable
- Long runtime

---

### 12. MaintenanceWorker

**Purpose:** Database optimization and system health

**Responsibilities:**
- Rebuild indexes
- Vacuum tables
- Update statistics
- Optimize queries

**Schedule:** Weekly (Sunday 3:00 AM UTC)

**Configuration:**
```typescript
{
  type: 'MaintenanceWorker',
  tasks: [
    'vacuum',
    'reindex',
    'analyze',
    'optimize'
  ],
  maintenanceWindow: 3600000 // 1 hour
}
```

**Maintenance Tasks:**
- Index rebuilding
- Table vacuuming
- Statistics update
- Cache warming

**Key Metrics:**
- Maintenance duration
- Performance improvement
- Errors encountered
- Space reclaimed

**Common Issues:**
- Maintenance window too short
- Lock contention
- Performance degradation during maintenance

---

## Worker Lifecycle

### States

```
┌─────────┐
│ STOPPED │
└────┬────┘
     │ start()
     ▼
┌─────────┐
│  IDLE   │◄────────────┐
└────┬────┘             │
     │ assign job       │
     ▼                  │ job complete
┌─────────┐             │
│ RUNNING │─────────────┘
└────┬────┘
     │ error
     ▼
┌─────────┐
│  ERROR  │
└─────────┘
```

### Lifecycle Methods

```typescript
interface Worker {
  // Initialization
  initialize(): Promise<void>;
  
  // Execution
  start(): Promise<void>;
  processJob(job: Job): Promise<JobResult>;
  stop(): Promise<void>;
  
  // Health
  healthCheck(): Promise<boolean>;
  heartbeat(): void;
  
  // Error handling
  handleError(error: Error): Promise<void>;
  recover(): Promise<void>;
}
```

## Job Processing

### Job Structure

```typescript
interface Job {
  id: string;
  type: string;
  priority: number;
  payload: any;
  metadata: {
    createdAt: Date;
    attempts: number;
    timeout: number;
  };
}
```

### Processing Flow

1. **Job Arrival** - Job added to queue
2. **Worker Selection** - Orchestrator assigns to available worker
3. **Job Execution** - Worker processes job
4. **Result Publishing** - Worker publishes result
5. **Cleanup** - Job removed from queue

### Error Handling

When a job fails:
1. Worker reports error to orchestrator
2. Healdec analyzes error type
3. Recovery strategy selected
4. Strategy executed (retry, restart, etc.)
5. Outcome logged

## Monitoring

### Health Checks

Each worker performs health checks:
- **Heartbeat** - Every 30 seconds
- **Self-test** - Every 5 minutes
- **Deep check** - Every 30 minutes

### Metrics Collected

Per worker:
- Jobs processed
- Success rate
- Average processing time
- Error count
- Queue depth

System-wide:
- Total throughput
- Overall success rate
- Healdec action rate
- API quota usage

### Alerting

Alerts triggered on:
- Worker stopped unexpectedly
- Success rate <95%
- Processing time >5x baseline
- Queue depth >100
- No heartbeat for 2 minutes

## Configuration

### Worker Configuration File

```typescript
// worker.config.ts
export const workerConfig = {
  workers: [
    {
      type: 'IndexWorker',
      enabled: true,
      concurrency: 1,
      priority: 8,
      schedule: '*/5 * * * *',
      config: { /* worker-specific */ }
    },
    // ... other workers
  ],
  orchestrator: {
    maxConcurrentJobs: 50,
    jobTimeout: 300000,
    retryLimit: 3
  }
};
```

### Environment Variables

```bash
# Worker configuration
WORKER_CONCURRENCY=12
WORKER_TIMEOUT=300000
WORKER_RETRY_LIMIT=3

# Resource limits
WORKER_MAX_MEMORY=512MB
WORKER_MAX_CPU=80%

# Monitoring
WORKER_HEALTH_CHECK_INTERVAL=30000
WORKER_METRICS_ENABLED=true
```

## Best Practices

### Performance
- Keep jobs small and focused
- Use batch processing where possible
- Implement caching
- Monitor resource usage

### Reliability
- Handle errors gracefully
- Implement retries with backoff
- Use idempotent operations
- Log all activities

### Scalability
- Design stateless workers
- Use message queues
- Implement load balancing
- Monitor performance metrics

## Troubleshooting

### Worker Not Starting
1. Check worker configuration
2. Verify dependencies available
3. Review initialization logs
4. Check resource constraints

### High Error Rate
1. Review error logs
2. Check API rate limits
3. Verify data quality
4. Analyze error patterns

### Poor Performance
1. Monitor resource usage
2. Check for bottlenecks
3. Review job queue depth
4. Optimize queries

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Healdec Engine](./healdec.md)
- [Monitoring Guide](./monitoring.md)
- [Troubleshooting](./troubleshooting.md)

---

**Next:** Learn about the [Healdec Auto-Healing Engine](./healdec.md).
