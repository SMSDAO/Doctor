import {
  Repository,
  WorkerStatus,
  HealdecAction,
  Identity,
  Job,
  ScanResult,
  SystemMetrics
} from './hospitalTypes'

const mockRepoNames = [
  ['Algodons', 'AlgoBrainDoctor'],
  ['vercel', 'next.js'],
  ['facebook', 'react'],
  ['microsoft', 'vscode'],
  ['nodejs', 'node'],
  ['golang', 'go'],
  ['rust-lang', 'rust'],
  ['python', 'cpython'],
  ['kubernetes', 'kubernetes'],
  ['docker', 'docker'],
  ['hashicorp', 'terraform'],
  ['apache', 'kafka'],
]

const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'PHP', 'C++']
const frameworks = ['React', 'Next.js', 'Express', 'Django', 'FastAPI', 'Spring Boot', 'Laravel', 'Vue']

export function generateMockRepositories(): Repository[] {
  return mockRepoNames.map(([owner, name], i) => {
    const healthScore = Math.floor(Math.random() * 40) + 60
    const status = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical'
    
    return {
      id: `repo-${i + 1}`,
      name,
      owner,
      fullName: `${owner}/${name}`,
      url: `https://github.com/${owner}/${name}`,
      healthScore,
      scoreChange24h: (Math.random() - 0.5) * 10,
      lastScanned: Date.now() - Math.random() * 3600000,
      status,
      language: languages[Math.floor(Math.random() * languages.length)],
      stars: Math.floor(Math.random() * 100000),
      forks: Math.floor(Math.random() * 20000),
      openIssues: Math.floor(Math.random() * 500),
      lastCommit: Date.now() - Math.random() * 86400000,
    }
  })
}

export function updateRepositoryScores(repos: Repository[]): Repository[] {
  return repos.map(repo => ({
    ...repo,
    healthScore: Math.max(0, Math.min(100, repo.healthScore + (Math.random() - 0.5) * 2)),
    scoreChange24h: (Math.random() - 0.5) * 10,
    lastScanned: Date.now(),
  }))
}

export const mockWorkers: WorkerStatus[] = [
  {
    id: 'worker-1',
    name: 'IndexWorker-01',
    type: 'indexer',
    status: 'running',
    lastHeartbeat: Date.now(),
    jobsProcessed: 1247,
    successRate: 99.8,
    avgProcessingTime: 450,
    currentJob: 'Indexing Algodons/AlgoBrainDoctor',
  },
  {
    id: 'worker-2',
    name: 'IdentityWorker-01',
    type: 'identity',
    status: 'running',
    lastHeartbeat: Date.now() - 5000,
    jobsProcessed: 3421,
    successRate: 99.5,
    avgProcessingTime: 320,
  },
  {
    id: 'worker-3',
    name: 'ScoreWorker-01',
    type: 'scorer',
    status: 'running',
    lastHeartbeat: Date.now() - 2000,
    jobsProcessed: 5678,
    successRate: 99.9,
    avgProcessingTime: 680,
    currentJob: 'Computing health score for vercel/next.js',
  },
  {
    id: 'worker-4',
    name: 'IngestWorker-01',
    type: 'ingest',
    status: 'idle',
    lastHeartbeat: Date.now() - 1000,
    jobsProcessed: 890,
    successRate: 100,
    avgProcessingTime: 120,
  },
  {
    id: 'worker-5',
    name: 'SyncWorker-01',
    type: 'sync',
    status: 'running',
    lastHeartbeat: Date.now() - 3000,
    jobsProcessed: 2341,
    successRate: 98.7,
    avgProcessingTime: 540,
  },
  {
    id: 'worker-6',
    name: 'GCWorker-01',
    type: 'gc',
    status: 'idle',
    lastHeartbeat: Date.now() - 8000,
    jobsProcessed: 156,
    successRate: 100,
    avgProcessingTime: 2300,
  },
  {
    id: 'worker-7',
    name: 'AlertWorker-01',
    type: 'alert',
    status: 'running',
    lastHeartbeat: Date.now(),
    jobsProcessed: 4567,
    successRate: 99.6,
    avgProcessingTime: 230,
  },
  {
    id: 'worker-8',
    name: 'ExportWorker-01',
    type: 'export',
    status: 'idle',
    lastHeartbeat: Date.now() - 15000,
    jobsProcessed: 234,
    successRate: 99.1,
    avgProcessingTime: 1800,
  },
  {
    id: 'worker-9',
    name: 'AuditWorker-01',
    type: 'audit',
    status: 'running',
    lastHeartbeat: Date.now() - 1000,
    jobsProcessed: 8901,
    successRate: 100,
    avgProcessingTime: 95,
  },
  {
    id: 'worker-10',
    name: 'RepairWorker-01',
    type: 'repair',
    status: 'error',
    lastHeartbeat: Date.now() - 45000,
    jobsProcessed: 67,
    successRate: 94.2,
    avgProcessingTime: 3200,
  },
  {
    id: 'worker-11',
    name: 'BackfillWorker-01',
    type: 'backfill',
    status: 'running',
    lastHeartbeat: Date.now() - 2000,
    jobsProcessed: 345,
    successRate: 98.9,
    avgProcessingTime: 4500,
    currentJob: 'Backfilling identity claims',
  },
  {
    id: 'worker-12',
    name: 'MaintenanceWorker-01',
    type: 'maintenance',
    status: 'idle',
    lastHeartbeat: Date.now() - 120000,
    jobsProcessed: 45,
    successRate: 100,
    avgProcessingTime: 8900,
  },
]

export function generateMockHealdecActions(count: number = 10): HealdecAction[] {
  const strategies: HealdecAction['strategy'][] = ['retry', 'restart', 'quarantine', 'rollback', 'escalate']
  const outcomes: HealdecAction['outcome'][] = ['success', 'failed', 'pending']
  const errorTypes = [
    'RateLimitExceeded',
    'DatabaseTimeout',
    'InvalidPayload',
    'WorkerCrash',
    'NetworkError',
    'MemoryOverflow',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `healdec-${i + 1}`,
    timestamp: Date.now() - Math.random() * 86400000,
    jobId: `job-${Math.floor(Math.random() * 1000)}`,
    workerId: mockWorkers[Math.floor(Math.random() * mockWorkers.length)].id,
    errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
    strategy: strategies[Math.floor(Math.random() * strategies.length)],
    outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
    details: 'Auto-healing action initiated by Healdec engine',
  }))
}

export function generateMockIdentities(count: number = 20): Identity[] {
  const names = [
    'Sarah Chen',
    'Alex Rodriguez',
    'Jamie Park',
    'Morgan Taylor',
    'Casey Wright',
    'Jordan Lee',
    'Riley Johnson',
    'Drew Mitchell',
    'Avery Brown',
    'Quinn Davis',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `identity-${i + 1}`,
    login: `dev${i + 1}`,
    email: `dev${i + 1}@example.com`,
    name: names[i % names.length],
    avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
    type: Math.random() > 0.9 ? 'bot' : 'user',
    contributionCount: Math.floor(Math.random() * 5000),
    reposClaimed: Math.floor(Math.random() * 50),
    lastSeen: Date.now() - Math.random() * 2592000000,
  }))
}

export function generateMockJobs(count: number = 15): Job[] {
  const types = ['scan', 'score', 'index', 'sync', 'alert', 'export', 'repair']
  const statuses: Job['status'][] = ['pending', 'processing', 'completed', 'failed', 'quarantined']

  return Array.from({ length: count }, (_, i) => ({
    id: `job-${i + 1}`,
    repoId: `repo-${Math.floor(Math.random() * 12) + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    workerId: Math.random() > 0.3 ? mockWorkers[Math.floor(Math.random() * mockWorkers.length)].id : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: Math.floor(Math.random() * 10) + 1,
    payload: { repoId: `repo-${Math.floor(Math.random() * 12) + 1}` },
    createdAt: Date.now() - Math.random() * 3600000,
    startedAt: Math.random() > 0.2 ? Date.now() - Math.random() * 1800000 : undefined,
    completedAt: Math.random() > 0.5 ? Date.now() - Math.random() * 900000 : undefined,
    error: Math.random() > 0.8 ? 'Connection timeout' : undefined,
    retries: Math.floor(Math.random() * 3),
    retryCount: Math.floor(Math.random() * 3),
    maxRetries: 3,
  }))
}

export function generateMockScanResults(repoId: string): ScanResult {
  return {
    id: `scan-${Date.now()}`,
    repoId,
    timestamp: Date.now(),
    frameworks: frameworks.slice(0, Math.floor(Math.random() * 3) + 1),
    vulnerabilities: Math.floor(Math.random() * 10),
    dependencies: Math.floor(Math.random() * 200) + 50,
    outdatedDeps: Math.floor(Math.random() * 30),
    testCoverage: Math.floor(Math.random() * 40) + 60,
    lintIssues: Math.floor(Math.random() * 50),
  }
}

export function generateMockSystemMetrics(): SystemMetrics {
  return {
    timestamp: Date.now(),
    activeWorkers: Math.floor(Math.random() * 10) + 5,
    queuedJobs: Math.floor(Math.random() * 50) + 10,
    queueDepth: Math.floor(Math.random() * 150),
    completedJobs24h: Math.floor(Math.random() * 1000) + 500,
    failureRate: Math.random() * 5,
    workerUtilization: Math.floor(Math.random() * 30) + 70,
    dbConnections: Math.floor(Math.random() * 40) + 40,
    avgApiLatency: Math.floor(Math.random() * 200) + 200,
    healdecActionRate: Math.random() * 5,
    totalRepos: 12,
    healthyRepos: Math.floor(Math.random() * 6) + 6,
    criticalRepos: Math.floor(Math.random() * 3),
  }
}
