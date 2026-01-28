export interface Repository {
  id: string
  name: string
  owner: string
  fullName: string
  url: string
  healthScore: number
  scoreChange24h: number
  lastScanned: number
  status: 'healthy' | 'warning' | 'critical' | 'scanning'
  language: string
  stars: number
  forks: number
  openIssues: number
  lastCommit: number
}

export interface HealthScore {
  repoId: string
  timestamp: number
  overall: number
  breakdown: {
    codeQuality: number
    documentation: number
    security: number
    activity: number
    community: number
  }
}

export interface Identity {
  id: string
  login: string
  email?: string
  name?: string
  avatarUrl: string
  type: 'user' | 'bot' | 'organization'
  contributionCount: number
  reposClaimed: number
  lastSeen: number
}

export interface IdentityClaim {
  id: string
  identityId: string
  repoId: string
  role: 'owner' | 'maintainer' | 'contributor' | 'viewer'
  contributionPercent: number
  claimedAt: number
  verifiedAt?: number
}

export interface WorkerStatus {
  id: string
  name: string
  type: 'indexer' | 'identity' | 'scorer' | 'ingest' | 'sync' | 'gc' | 'alert' | 'export' | 'audit' | 'repair' | 'backfill' | 'maintenance'
  status: 'running' | 'idle' | 'error' | 'stopped'
  lastHeartbeat: number
  jobsProcessed: number
  successRate: number
  avgProcessingTime: number
  currentJob?: string
}

export interface Job {
  id: string
  type: string
  workerId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'quarantined'
  priority: number
  payload: any
  createdAt: number
  startedAt?: number
  completedAt?: number
  error?: string
  retryCount: number
  maxRetries: number
}

export interface HealdecAction {
  id: string
  timestamp: number
  jobId: string
  workerId: string
  errorType: string
  strategy: 'retry' | 'restart' | 'quarantine' | 'rollback' | 'escalate'
  outcome: 'success' | 'failed' | 'pending'
  details: string
}

export interface Alert {
  id: string
  repoId: string
  repoName: string
  severity: 'info' | 'warning' | 'critical'
  type: 'health_drop' | 'security_issue' | 'activity_spike' | 'worker_failure'
  message: string
  isActive: boolean
  createdAt: number
  triggeredAt?: number
  resolvedAt?: number
}

export type UserRole = 'operator' | 'admin' | 'analyst' | 'developer' | 'validator'

export interface SystemMetrics {
  timestamp: number
  queueDepth: number
  workerUtilization: number
  dbConnections: number
  avgApiLatency: number
  healdecActionRate: number
  totalRepos: number
  healthyRepos: number
  criticalRepos: number
}

export interface ScanResult {
  id: string
  repoId: string
  timestamp: number
  frameworks: string[]
  vulnerabilities: number
  dependencies: number
  outdatedDeps: number
  testCoverage?: number
  lintIssues?: number
}
