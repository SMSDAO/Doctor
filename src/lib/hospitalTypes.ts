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
  type: 'user' 
  reposClaimed: num
}
export interface IdentityCl
  identityId: string
  role: 'owner' | 
 

export interface WorkerStatus {
  name: stri
  status: 'running' 
  jobsProcessed:
  avgProcessingTime: number
}
export interface Jo
  type: string
 

  startedAt?: number
  error?: st
  maxRetries: 

  id: string
  jobId: string
  errorType: string
  outcome: 'success' 
}
export interface Aler
 

  message: string
  createdAt:
  resolvedAt?:


  timestamp: numbe
  workerUtiliz
  avgApiLatency: nu
  totalRepos: number
  criticalRepos: numbe

  id: string
  timestamp: number
 

  lintIssues?: number
















































