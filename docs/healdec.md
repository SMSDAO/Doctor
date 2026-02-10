# Healdec Auto-Healing Engine

The Healdec (Health Decision) Engine is an autonomous recovery system that detects, analyzes, and remediates failures without human intervention. This document provides comprehensive documentation on how Healdec works.

## Overview

Healdec is the self-healing brain of AlgoBrainDoctor, continuously monitoring the system and automatically recovering from failures using intelligent strategies.

### Key Features

- 🔄 **Autonomous** - No human intervention required
- 🎯 **Intelligent** - Selects optimal recovery strategy
- 📊 **Observable** - All actions logged and tracked
- ⚡ **Fast** - Sub-second decision making
- 🔧 **Adaptive** - Learns from past recoveries

### Design Philosophy

1. **Fail Fast** - Detect issues quickly
2. **Recover Smart** - Choose best strategy
3. **Learn Always** - Improve over time
4. **Escalate When Needed** - Know when to ask for help

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                  HEALDEC ENGINE                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    │
│  │ Monitor  │───▶│ Analyzer │───▶│ Executor │    │
│  └──────────┘    └──────────┘    └──────────┘    │
│       │               │                │           │
│       ▼               ▼                ▼           │
│  ┌─────────────────────────────────────────────┐  │
│  │         Strategy Selection Engine           │  │
│  │  (Retry│Restart│Quarantine│Rollback│Escalate)│  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│                      ▼                             │
│            ┌──────────────────┐                   │
│            │  Action Logger   │                   │
│            └──────────────────┘                   │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **Detection** - Monitor identifies anomaly
2. **Analysis** - Analyzer classifies issue type
3. **Selection** - Strategy engine chooses approach
4. **Execution** - Executor applies recovery action
5. **Verification** - Confirm recovery success
6. **Logging** - Record action and outcome

## Recovery Strategies

### 1. Retry Strategy

**Use Case:** Transient network or API failures

**When to Apply:**
- HTTP 5xx errors
- Network timeouts
- Rate limit errors (429)
- Temporary service unavailability

**Implementation:**

```typescript
class RetryStrategy implements RecoveryStrategy {
  async execute(context: RecoveryContext): Promise<RecoveryResult> {
    const { job, error, attempt } = context;
    
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = Math.min(1000 * Math.pow(2, attempt), 16000);
    
    await sleep(delay);
    
    try {
      const result = await job.execute();
      return { success: true, strategy: 'retry', attempts: attempt + 1 };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        return this.execute({ ...context, attempt: attempt + 1 });
      }
      throw error;
    }
  }
}
```

**Configuration:**
```typescript
{
  maxAttempts: 5,
  backoffMultiplier: 2,
  maxDelay: 16000,      // 16 seconds
  jitterEnabled: true   // Add randomness
}
```

**Success Rate:** ~85%

**Typical Duration:** 1-30 seconds

**Example Log:**
```
[Healdec] Retry strategy applied
  Job: IndexWorker-fetch-repos
  Error: HTTP 503 Service Unavailable
  Attempt: 2/5
  Delay: 2000ms
  Outcome: Success after 2 attempts
```

---

### 2. Restart Strategy

**Use Case:** Worker crashes, deadlocks, or unrecoverable state

**When to Apply:**
- Worker process crashed
- Memory leak detected
- Deadlock condition
- Corrupted worker state

**Implementation:**

```typescript
class RestartStrategy implements RecoveryStrategy {
  async execute(context: RecoveryContext): Promise<RecoveryResult> {
    const { worker, error } = context;
    
    // 1. Save current state
    const state = await worker.saveState();
    
    // 2. Graceful shutdown
    await worker.stop();
    
    // 3. Wait for cleanup
    await sleep(COOLDOWN_PERIOD);
    
    // 4. Restart worker
    await worker.start();
    
    // 5. Restore state
    await worker.restoreState(state);
    
    return { 
      success: true, 
      strategy: 'restart',
      downtime: Date.now() - context.startTime
    };
  }
}
```

**Configuration:**
```typescript
{
  cooldownPeriod: 30000,  // 30 seconds
  maxRestarts: 3,         // Per hour
  gracefulTimeout: 5000,  // Wait for jobs to finish
  preserveState: true
}
```

**Success Rate:** ~75%

**Typical Duration:** 30-60 seconds

**Example Log:**
```
[Healdec] Restart strategy applied
  Worker: ScoreWorker-01
  Error: Process crashed (SIGSEGV)
  Downtime: 45s
  Jobs in progress: 3 (completed before restart)
  Outcome: Worker restarted successfully
```

---

### 3. Quarantine Strategy

**Use Case:** Corrupted data or malformed jobs

**When to Apply:**
- Invalid data format
- Schema validation failure
- Corrupted job payload
- Unhandleable edge case

**Implementation:**

```typescript
class QuarantineStrategy implements RecoveryStrategy {
  async execute(context: RecoveryContext): Promise<RecoveryResult> {
    const { job, error } = context;
    
    // 1. Move job to quarantine queue
    await quarantineQueue.add({
      job,
      error,
      timestamp: Date.now(),
      metadata: {
        originalQueue: job.queue,
        workerType: job.workerType,
        attempts: job.attempts
      }
    });
    
    // 2. Tag for manual review
    await tagForReview(job.id, error.message);
    
    // 3. Continue processing other jobs
    return {
      success: true,
      strategy: 'quarantine',
      requiresManualReview: true
    };
  }
}
```

**Configuration:**
```typescript
{
  reviewPeriod: 86400000,    // 24 hours
  autoRetryAfter: 604800000, // 7 days
  notifyAdmin: true,
  preserveForAnalysis: true
}
```

**Success Rate:** ~60% (after manual fix)

**Typical Duration:** Immediate (queued for review)

**Example Log:**
```
[Healdec] Quarantine strategy applied
  Job: IngestWorker-webhook-123
  Error: Invalid JSON payload
  Quarantined: Yes
  Review URL: /admin/quarantine/123
  Outcome: Job isolated, admin notified
```

---

### 4. Rollback Strategy

**Use Case:** Partial transactions or inconsistent state

**When to Apply:**
- Database transaction failed midway
- Multi-step operation incomplete
- State inconsistency detected
- Cascading update failed

**Implementation:**

```typescript
class RollbackStrategy implements RecoveryStrategy {
  async execute(context: RecoveryContext): Promise<RecoveryResult> {
    const { transaction, error } = context;
    
    // 1. Identify compensating actions
    const compensations = transaction.getCompensations();
    
    // 2. Execute in reverse order
    for (const compensation of compensations.reverse()) {
      try {
        await compensation.execute();
      } catch (compensationError) {
        // Log but continue rolling back
        logError('Compensation failed', compensationError);
      }
    }
    
    // 3. Mark transaction as rolled back
    await transaction.markRolledBack();
    
    return {
      success: true,
      strategy: 'rollback',
      stepsReverted: compensations.length
    };
  }
}
```

**Configuration:**
```typescript
{
  maxRollbackSteps: 50,
  timeoutPerStep: 10000,     // 10 seconds
  continueOnCompensationError: true,
  verifyConsistency: true
}
```

**Success Rate:** ~90%

**Typical Duration:** 5-30 seconds

**Example Log:**
```
[Healdec] Rollback strategy applied
  Transaction: health-score-update-batch
  Error: Database constraint violation
  Steps completed: 12/15
  Steps reverted: 12
  Outcome: State restored to consistent point
```

---

### 5. Escalate Strategy

**Use Case:** Critical failures requiring human intervention

**When to Apply:**
- All other strategies failed
- Data corruption detected
- Security incident
- System-wide failure

**Implementation:**

```typescript
class EscalateStrategy implements RecoveryStrategy {
  async execute(context: RecoveryContext): Promise<RecoveryResult> {
    const { error, severity } = context;
    
    // 1. Create incident
    const incident = await createIncident({
      severity,
      error,
      context,
      timestamp: Date.now()
    });
    
    // 2. Page on-call engineer
    await notifyOnCall({
      incidentId: incident.id,
      severity,
      message: error.message,
      channel: 'pagerduty'
    });
    
    // 3. Gather diagnostic info
    const diagnostics = await gatherDiagnostics();
    await incident.attachDiagnostics(diagnostics);
    
    // 4. Enter safe mode
    await enterSafeMode();
    
    return {
      success: true,
      strategy: 'escalate',
      incidentId: incident.id,
      responseTime: null // Pending human response
    };
  }
}
```

**Configuration:**
```typescript
{
  onCallRotation: 'pagerduty',
  severityLevels: ['P0', 'P1', 'P2'],
  escalationTimeout: 300000,    // 5 minutes
  automaticSafeMode: true,
  gatherDiagnostics: true
}
```

**Success Rate:** ~95% (with human intervention)

**Typical Duration:** 5-60 minutes (human response time)

**Example Log:**
```
[Healdec] Escalate strategy applied
  Error: Database connection pool exhausted
  Severity: P1
  Incident: INC-2024-0123
  On-call: engineer@example.com
  Safe mode: Enabled
  Outcome: Incident created, awaiting response
```

## Decision Logic

### Strategy Selection Algorithm

```typescript
function selectStrategy(error: Error, context: Context): Strategy {
  // Check if transient
  if (isTransientError(error) && context.attempts < MAX_RETRIES) {
    return new RetryStrategy();
  }
  
  // Check if worker crashed
  if (isWorkerCrashed(error)) {
    return new RestartStrategy();
  }
  
  // Check if data issue
  if (isDataCorrupted(error) || isValidationError(error)) {
    return new QuarantineStrategy();
  }
  
  // Check if state inconsistent
  if (isInconsistentState(error) && hasCompensations(context)) {
    return new RollbackStrategy();
  }
  
  // Default to escalate for critical or unknown errors
  return new EscalateStrategy();
}
```

### Error Classification

```typescript
enum ErrorType {
  TRANSIENT = 'transient',         // Retry
  CRASH = 'crash',                 // Restart
  DATA_CORRUPTION = 'data',        // Quarantine
  STATE_INCONSISTENT = 'state',    // Rollback
  CRITICAL = 'critical'            // Escalate
}

function classifyError(error: Error): ErrorType {
  if (error instanceof NetworkError) return ErrorType.TRANSIENT;
  if (error instanceof WorkerCrashed) return ErrorType.CRASH;
  if (error instanceof ValidationError) return ErrorType.DATA_CORRUPTION;
  if (error instanceof TransactionError) return ErrorType.STATE_INCONSISTENT;
  return ErrorType.CRITICAL;
}
```

## Monitoring & Observability

### Metrics

Track these key metrics:

| Metric | Target | Description |
|--------|--------|-------------|
| Action Rate | <5% | Percentage of jobs requiring Healdec |
| Success Rate | >90% | Percentage of successful recoveries |
| MTTR | <2 min | Mean time to recovery |
| Strategy Distribution | Balanced | Usage of each strategy |
| Escalation Rate | <1% | Percentage requiring escalation |

### Dashboard

The Healdec dashboard shows:
- Recent actions (last 100)
- Strategy success rates
- Error type distribution
- Recovery time trends
- Active incidents

### Logs

All Healdec actions are logged:

```typescript
interface HealdecLog {
  timestamp: Date;
  strategy: StrategyType;
  error: Error;
  context: RecoveryContext;
  outcome: RecoveryResult;
  duration: number;
  success: boolean;
}
```

### Alerts

Alerts triggered on:
- Escalation required (immediate)
- Recovery failed 3+ times (5 min)
- MTTR exceeds threshold (hourly)
- Unusual error pattern (daily)

## Configuration

### Global Settings

```typescript
// healdec.config.ts
export const healdecConfig = {
  enabled: true,
  strategies: {
    retry: {
      enabled: true,
      maxAttempts: 5,
      backoffMultiplier: 2
    },
    restart: {
      enabled: true,
      maxRestarts: 3,
      cooldownPeriod: 30000
    },
    quarantine: {
      enabled: true,
      reviewPeriod: 86400000
    },
    rollback: {
      enabled: true,
      maxSteps: 50
    },
    escalate: {
      enabled: true,
      onCallRotation: 'pagerduty'
    }
  },
  monitoring: {
    logLevel: 'info',
    metricsEnabled: true,
    alertsEnabled: true
  }
};
```

### Per-Worker Settings

```typescript
// Override Healdec behavior per worker
const workerConfig = {
  type: 'ScoreWorker',
  healdec: {
    retryAttempts: 3,        // Lower than default
    restartEnabled: false,   // Disable restarts
    quarantineThreshold: 5   // Quarantine after 5 errors
  }
};
```

## Best Practices

### 1. Design for Idempotency
Ensure operations can be safely retried:
```typescript
// Good: Idempotent
async function updateHealthScore(repoId: string, score: number) {
  await db.update('repositories', { id: repoId }, { healthScore: score });
}

// Bad: Not idempotent
async function incrementHealthScore(repoId: string, delta: number) {
  const current = await db.get('repositories', repoId);
  await db.update('repositories', { id: repoId }, { 
    healthScore: current.healthScore + delta 
  });
}
```

### 2. Add Compensations
Define rollback logic for multi-step operations:
```typescript
const transaction = new Transaction();

transaction.addStep(
  async () => await createRepository(data),
  async () => await deleteRepository(data.id) // Compensation
);

transaction.addStep(
  async () => await indexRepository(data.id),
  async () => await removeFromIndex(data.id) // Compensation
);

await transaction.execute();
```

### 3. Classify Errors Properly
Help Healdec choose the right strategy:
```typescript
class InvalidDataError extends Error {
  readonly type = ErrorType.DATA_CORRUPTION;
}

class NetworkTimeoutError extends Error {
  readonly type = ErrorType.TRANSIENT;
}
```

### 4. Monitor Recovery Patterns
Track which errors occur frequently and optimize:
```typescript
// If retry always fails after 3 attempts, reduce max retries
if (getRetrySuccessRate('IndexWorker') < 0.3) {
  updateConfig({ maxRetryAttempts: 2 });
}
```

## Troubleshooting

### High Action Rate (>10%)
**Problem:** Too many jobs requiring recovery

**Possible Causes:**
- Upstream API unstable
- Worker configuration issues
- Resource constraints
- Data quality problems

**Solutions:**
1. Check upstream service health
2. Review worker logs for patterns
3. Increase worker resources
4. Improve data validation

### Low Success Rate (<80%)
**Problem:** Recoveries frequently failing

**Possible Causes:**
- Wrong strategy selection
- Insufficient retry attempts
- Missing compensations
- Critical system issues

**Solutions:**
1. Review error classifications
2. Adjust strategy thresholds
3. Add missing compensations
4. Investigate root causes

### Frequent Escalations
**Problem:** Many incidents require human intervention

**Possible Causes:**
- Complex errors not handled
- Missing recovery strategies
- System instability
- Configuration issues

**Solutions:**
1. Add custom strategies
2. Improve error handling
3. Stabilize infrastructure
4. Review Healdec config

## Testing

### Unit Tests

Test strategy selection:
```typescript
describe('Healdec Strategy Selection', () => {
  it('should select retry for transient errors', () => {
    const error = new NetworkTimeoutError();
    const strategy = selectStrategy(error, { attempts: 0 });
    expect(strategy).toBeInstanceOf(RetryStrategy);
  });
  
  it('should escalate after max retries', () => {
    const error = new NetworkTimeoutError();
    const strategy = selectStrategy(error, { attempts: 5 });
    expect(strategy).toBeInstanceOf(EscalateStrategy);
  });
});
```

### Integration Tests

Test end-to-end recovery:
```typescript
describe('Healdec Recovery', () => {
  it('should recover from transient API failure', async () => {
    const job = createMockJob();
    mockAPI.failOnce();
    
    const result = await healdec.handle(job);
    
    expect(result.success).toBe(true);
    expect(result.strategy).toBe('retry');
    expect(result.attempts).toBe(2);
  });
});
```

## Related Documentation

- [Worker System](./workers.md) - Worker architecture
- [Architecture](./architecture.md) - System design
- [Monitoring](./architecture.md) - Observability
- [Troubleshooting](./troubleshooting.md) - Common issues

---

**Next:** Explore the [API Reference](./api-reference.md) for integration details.
