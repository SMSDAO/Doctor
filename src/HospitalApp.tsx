import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import {
  Repository,
  WorkerStatus,
  HealdecAction,
  Alert,
  UserRole,
  Identity,
  Job,
  SystemMetrics,
} from '@/lib/hospitalTypes'
import {
  generateMockRepositories,
  updateRepositoryScores,
  mockWorkers,
  generateMockHealdecActions,
  generateMockIdentities,
  generateMockJobs,
  generateMockSystemMetrics,
} from '@/lib/hospitalMockData'
import { OperatorDashboard } from '@/components/hospital/OperatorDashboard'
import { AdminPanel } from '@/components/hospital/AdminPanel'
import { AnalystPanel } from '@/components/hospital/AnalystPanel'
import { DeveloperPanel } from '@/components/hospital/DeveloperPanel'
import { GitHubConnect } from '@/components/hospital/GitHubConnect'
import AIChatPanel from '@/components/hospital/AIChatPanel'
import { AIChatButton } from '@/components/hospital/AIChatButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pulse, User, ShieldCheck, Code, ChartLine, CheckCircle, GithubLogo } from '@phosphor-icons/react'
import { githubService } from '@/lib/githubService'

function HospitalApp() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [workers, setWorkers] = useState<WorkerStatus[]>(mockWorkers)
  const [healdecActions, setHealdecActions] = useState<HealdecAction[]>([])
  const [identities, setIdentities] = useState<Identity[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(generateMockSystemMetrics())
  
  const [watchlist, setWatchlist] = useKV<string[]>('hospital-watchlist', [])
  const [alerts, setAlerts] = useKV<Alert[]>('hospital-alerts', [])
  const [userRole, setUserRole] = useKV<UserRole>('hospital-user-role', 'operator')
  const [githubUser, setGithubUser] = useKV<any>('hospital-github-user', null)
  const [useRealRepos, setUseRealRepos] = useKV<boolean>('hospital-use-real-repos', false)
  
  const [isScanning, setIsScanning] = useState(false)
  const [isLoadingGithub, setIsLoadingGithub] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const safeWatchlist = watchlist ?? []
  const safeAlerts = alerts ?? []
  const isGithubConnected = githubUser !== null

  useEffect(() => {
    setRepos(generateMockRepositories())
    setHealdecActions(generateMockHealdecActions(20))
    setIdentities(generateMockIdentities(30))
    setJobs(generateMockJobs(25))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setRepos(prev => updateRepositoryScores(prev))
      setSystemMetrics(generateMockSystemMetrics())
      
      setWorkers(prev =>
        prev.map(w => ({
          ...w,
          lastHeartbeat: w.status !== 'error' ? Date.now() - Math.random() * 10000 : w.lastHeartbeat,
          jobsProcessed: w.jobsProcessed + (w.status === 'running' ? 1 : 0),
        }))
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleScan = async () => {
    setIsScanning(true)
    
    if (useRealRepos && isGithubConnected) {
      try {
        const realRepos = await githubService.fetchAndMapRepositories()
        setRepos(realRepos)
        toast.success(`Scanned ${realRepos.length} real repositories from GitHub`)
      } catch (error) {
        console.error('Failed to scan GitHub repos:', error)
        toast.error('Failed to fetch GitHub repositories')
        setRepos(prev => updateRepositoryScores(prev))
      }
    } else {
      setRepos(prev => updateRepositoryScores(prev))
      toast.success('Repository scan completed')
    }
    
    setTimeout(() => {
      setIsScanning(false)
    }, 1500)
  }

  const handleGithubUserChange = (user: any) => {
    setGithubUser(user)
    if (user && useRealRepos) {
      handleScan()
    }
  }

  const handleToggleRealRepos = async () => {
    const newValue = !useRealRepos
    setUseRealRepos(newValue)
    
    if (newValue && isGithubConnected) {
      setIsLoadingGithub(true)
      try {
        const realRepos = await githubService.fetchAndMapRepositories()
        setRepos(realRepos)
        toast.success(`Loaded ${realRepos.length} repositories from GitHub`)
      } catch (error) {
        console.error('Failed to load GitHub repos:', error)
        toast.error('Failed to load GitHub repositories')
      } finally {
        setIsLoadingGithub(false)
      }
    } else if (!newValue) {
      setRepos(generateMockRepositories())
      toast.success('Switched to demo data')
    }
  }

  const handleToggleWatchlist = (repoId: string) => {
    setWatchlist(current => {
      const currentList = current ?? []
      const set = new Set(currentList)
      if (set.has(repoId)) {
        set.delete(repoId)
        toast.success('Removed from watchlist')
      } else {
        set.add(repoId)
        toast.success('Added to watchlist')
      }
      return Array.from(set)
    })
  }

  const handleCreateAlert = (alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    setAlerts(current => [...(current ?? []), newAlert])
    toast.success('Alert created successfully')
  }

  const handleToggleAlert = (alertId: string) => {
    setAlerts(current =>
      (current ?? []).map(a => a.id === alertId ? { ...a, isActive: !a.isActive } : a)
    )
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(current => (current ?? []).filter(a => a.id !== alertId))
    toast.success('Alert deleted')
  }

  const handleTriggerWorker = (workerId: string, action: string) => {
    toast.success(`${action} worker ${workerId}`)
    
    setWorkers(prev =>
      prev.map(w =>
        w.id === workerId
          ? { ...w, status: action === 'Start' ? 'running' : 'stopped', lastHeartbeat: Date.now() }
          : w
      )
    )
  }

  const handleHealdecAction = (jobId: string, strategy: HealdecAction['strategy']) => {
    const newAction: HealdecAction = {
      id: `healdec-${Date.now()}`,
      timestamp: Date.now(),
      jobId,
      workerId: workers[0].id,
      errorType: 'ManualIntervention',
      strategy,
      outcome: 'pending',
      details: `Manual ${strategy} action initiated`,
    }
    
    setHealdecActions(prev => [newAction, ...prev])
    toast.success(`Healdec ${strategy} action initiated`)
  }

  const watchlistSet = new Set(safeWatchlist)
  const activeAlertCount = safeAlerts.filter(a => a.isActive).length
  const criticalRepoCount = repos.filter(r => r.status === 'critical').length
  const runningWorkers = workers.filter(w => w.status === 'running').length

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 glow-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Pulse size={32} weight="fill" className="text-accent glow-blue" />
                  <h1 className="text-2xl font-bold glow-text text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                    Brain-Doctor Hospital
                  </h1>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex glow-purple">
                  V4
                </Badge>
                {criticalRepoCount > 0 && (
                  <Badge variant="outline" className="hidden sm:inline-flex border-destructive/50 text-destructive">
                    {criticalRepoCount} Critical
                  </Badge>
                )}
                {activeAlertCount > 0 && (
                  <Badge variant="outline" className="hidden sm:inline-flex border-accent/50 text-accent glow-blue">
                    {activeAlertCount} Alert{activeAlertCount > 1 ? 's' : ''} Active
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-success" weight="fill" />
                  {runningWorkers}/12 Workers
                </div>

                {isGithubConnected && (
                  <Button
                    variant={useRealRepos ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleRealRepos}
                    disabled={isLoadingGithub}
                    className={useRealRepos ? "glow-accent" : ""}
                  >
                    <GithubLogo size={16} weight="fill" />
                    {isLoadingGithub ? 'Loading...' : useRealRepos ? 'GitHub Data' : 'Demo Data'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="glow-accent"
                >
                  <Pulse size={16} className={isScanning ? 'animate-spin' : ''} />
                  Scan
                </Button>

                <Select value={userRole ?? 'operator'} onValueChange={(value) => setUserRole(value as UserRole)}>
                  <SelectTrigger className="w-40 glow-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">
                      <div className="flex items-center gap-2">
                        <Pulse size={16} />
                        Operator
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="analyst">
                      <div className="flex items-center gap-2">
                        <ChartLine size={16} />
                        Analyst
                      </div>
                    </SelectItem>
                    <SelectItem value="developer">
                      <div className="flex items-center gap-2">
                        <Code size={16} />
                        Developer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 lg:px-6 py-8">
          <div className="mb-6">
            <GitHubConnect onUserChange={handleGithubUserChange} />
          </div>

          {userRole === 'operator' && (
            <OperatorDashboard
              repos={repos}
              workers={workers}
              healdecActions={healdecActions}
              jobs={jobs}
              systemMetrics={systemMetrics}
              watchlist={watchlistSet}
              alerts={safeAlerts}
              onToggleWatchlist={handleToggleWatchlist}
              onCreateAlert={handleCreateAlert}
              onToggleAlert={handleToggleAlert}
              onDeleteAlert={handleDeleteAlert}
              onTriggerWorker={handleTriggerWorker}
              onHealdecAction={handleHealdecAction}
            />
          )}

          {userRole === 'admin' && (
            <AdminPanel
              repos={repos}
              workers={workers}
              jobs={jobs}
              identities={identities}
              onTriggerWorker={handleTriggerWorker}
            />
          )}

          {userRole === 'analyst' && (
            <AnalystPanel
              repos={repos}
              healdecActions={healdecActions}
              systemMetrics={systemMetrics}
            />
          )}

          {userRole === 'developer' && (
            <DeveloperPanel
              systemMetrics={systemMetrics}
              workers={workers}
            />
          )}
        </main>
      </div>

      {!isChatOpen && <AIChatButton onClick={() => setIsChatOpen(true)} />}
      <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Toaster position="top-right" theme="dark" richColors />
    </div>
  )
}

export default HospitalApp
