export interface Repository {
  id: string
  name: string
  owner: string
  fullName: string
  healthScore: number
  status: 'healthy' | 'warning' | 'critical' | 'scanning'
  lastScan: number
  issues: {
    critical: number
    warning: number
    info: number
  }
  metrics: {
    commits: number
    contributors: number
    openPRs: number
    openIssues: number
    codeQuality: number
    testCoverage: number
  }
  lastCommit: number
  autoHealing: boolean
  language: string
  description: string
  stars: number
  forks: number
}

export interface WorkerStatus {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error'
  lastHeartbeat: number
  jobsProcessed: number
  avgProcessingTime: number
  currentJob?: string
}

export interface HealdecAction {
  id: string
  timestamp: number
  jobId: string
  workerId: string
  errorType: string
  strategy: 'retry' | 'rollback' | 'escalate' | 'ignore'
  outcome: 'success' | 'failed' | 'pending'
  details: string
}

export interface Alert {
  id: string
  repoId: string
  type: 'critical' | 'warning' | 'info'
  message: string
  createdAt: number
  isActive: boolean
  threshold?: number
}

export interface Identity {
  id: string
  login: string
  email?: string
  avatarUrl: string
  type: 'user' | 'bot' | 'org'
  reposClaimed: number
  lastSeen: number
}

export interface Job {
  id: string
  repoId: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: number
  startedAt?: number
  completedAt?: number
  workerId?: string
  error?: string
  retries: number
  maxRetries: number
}

export interface SystemMetrics {
  timestamp: number
  activeWorkers: number
  queuedJobs: number
  completedJobs24h: number
  failureRate: number
  workerUtilization: number
  avgApiLatency: number
  totalRepos: number
  criticalRepos: number
  healthyRepos: number
}

export interface RepoScanResult {
  id: string
  repoId: string
  timestamp: number
  healthScore: number
  issues: Array<{
    type: 'critical' | 'warning' | 'info'
    message: string
    file?: string
    line?: number
  }>
  securityIssues?: number
  lintIssues?: number
  testCoverage?: number
  dependencies?: {
    outdated: number
    vulnerable: number
  }
}

export type UserRole = 'operator' | 'admin' | 'analyst' | 'developer'
