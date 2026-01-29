export interface Repository {
  id: string
  name: string
  owner: string
  fullName: string
  healthScore: number
  status: 'healthy' | 'warning' | 'critical' | 'scanning'
  lastScan?: number
  lastScanned?: number
  scoreChange24h?: number
  url?: string
  issues?: {
    critical: number
    warning: number
    info: number
  }
  metrics?: {
    commits: number
    contributors: number
    openPRs: number
    openIssues: number
    codeQuality: number
    testCoverage: number
  }
  openIssues?: number
  lastCommit: number
  autoHealing?: boolean
  language: string
  description?: string
  stars: number
  forks: number
  admonitions?: AdmonitionScan
  prSuggestions?: PRSuggestion[]
}

export interface AdmonitionScan {
  timestamp: number
  totalCount: number
  byType: {
    TODO: number
    FIXME: number
    HACK: number
    WARNING: number
    NOTE: number
    OPTIMIZE: number
  }
  items: AdmonitionItem[]
}

export interface AdmonitionItem {
  type: 'TODO' | 'FIXME' | 'HACK' | 'WARNING' | 'NOTE' | 'OPTIMIZE'
  message: string
  file: string
  line: number
  author?: string
}

export interface PRSuggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'bug-fix' | 'feature' | 'refactor' | 'documentation' | 'testing' | 'performance'
  effort: 'small' | 'medium' | 'large'
  impact: 'high' | 'medium' | 'low'
  files: string[]
  createdAt: number
}

export interface WorkerStatus {
  id: string
  name: string
  type?: string
  status: 'running' | 'stopped' | 'error' | 'idle'
  lastHeartbeat: number
  jobsProcessed: number
  successRate?: number
  avgProcessingTime: number
  currentJob?: string
}

export interface HealdecAction {
  id: string
  timestamp: number
  jobId: string
  workerId: string
  errorType: string
  strategy: 'retry' | 'rollback' | 'escalate' | 'ignore' | 'restart' | 'quarantine'
  outcome: 'success' | 'failed' | 'pending'
  details: string
}

export interface Alert {
  id: string
  repoId: string
  repoName?: string
  type: 'critical' | 'warning' | 'info'
  severity?: 'critical' | 'warning' | 'info'
  message: string
  createdAt: number
  isActive: boolean
  threshold?: number
}

export interface Identity {
  id: string
  login: string
  email?: string
  name?: string
  avatarUrl: string
  type: 'user' | 'bot' | 'org'
  reposClaimed: number
  contributionCount?: number
  lastSeen: number
}

export interface Job {
  id: string
  repoId: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'processing' | 'quarantined'
  priority?: number
  payload?: any
  createdAt: number
  startedAt?: number
  completedAt?: number
  workerId?: string
  error?: string
  retries: number
  retryCount?: number
  maxRetries: number
}

export interface SystemMetrics {
  timestamp: number
  activeWorkers: number
  queuedJobs: number
  queueDepth?: number
  completedJobs24h: number
  failureRate: number
  workerUtilization: number
  avgApiLatency: number
  dbConnections?: number
  healdecActionRate?: number
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

export interface ScanResult {
  id: string
  repoId: string
  timestamp: number
  frameworks?: string[]
  vulnerabilities?: number
  dependencies?: number
  outdatedDeps?: number
  testCoverage?: number
  lintIssues?: number
}

export type UserRole = 'operator' | 'admin' | 'analyst' | 'developer'
