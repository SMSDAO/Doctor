import { useState } from 'react'
import { Repository, WorkerStatus, HealdecAction, Job, Alert, SystemMetrics } from '@/lib/hospitalTypes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow } from 'date-fns'
import {
  Heartbeat,
  GitBranch,
  Eye,
  Bell,
  Lightning,
  CheckCircle,
  WarningCircle,
  XCircle,
  Pulse,
  Database,
  Clock,
  Sparkle,
  Bug,
  GitPullRequest,
} from '@phosphor-icons/react'
import { AdmonitionsPanel } from './AdmonitionsPanel'
import { PRSuggestionsPanel } from './PRSuggestionsPanel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface OperatorDashboardProps {
  repos: Repository[]
  workers: WorkerStatus[]
  healdecActions: HealdecAction[]
  jobs: Job[]
  systemMetrics: SystemMetrics
  watchlist: Set<string>
  alerts: Alert[]
  onToggleWatchlist: (repoId: string) => void
  onCreateAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void
  onToggleAlert: (alertId: string) => void
  onDeleteAlert: (alertId: string) => void
  onTriggerWorker: (workerId: string, action: string) => void
  onHealdecAction: (jobId: string, strategy: HealdecAction['strategy']) => void
  onAnalyzeRepo: (repoId: string) => Promise<void>
}

export function OperatorDashboard({
  repos,
  workers,
  healdecActions,
  jobs,
  systemMetrics,
  watchlist,
  alerts,
  onToggleWatchlist,
  onAnalyzeRepo,
}: OperatorDashboardProps) {
  const [selectedRepoForAnalysis, setSelectedRepoForAnalysis] = useState<Repository | null>(null)
  const healthyRepos = repos.filter(r => r.status === 'healthy').length
  const warningRepos = repos.filter(r => r.status === 'warning').length
  const criticalRepos = repos.filter(r => r.status === 'critical').length
  const runningWorkers = workers.filter(w => w.status === 'running').length
  const errorWorkers = workers.filter(w => w.status === 'error').length
  const recentActions = healdecActions.slice(0, 10)
  const pendingJobs = jobs.filter(j => j.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GitBranch size={16} />
              Total Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{repos.length}</div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="text-success flex items-center gap-1">
                <CheckCircle size={12} weight="fill" />
                {healthyRepos} healthy
              </span>
              <span className="text-destructive flex items-center gap-1">
                <WarningCircle size={12} weight="fill" />
                {criticalRepos} critical
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heartbeat size={16} />
              Worker Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{runningWorkers}/12</div>
            <div className="mt-2">
              <Progress value={(runningWorkers / 12) * 100} className="h-2" />
            </div>
            {errorWorkers > 0 && (
              <div className="mt-2 text-xs text-destructive flex items-center gap-1">
                <XCircle size={12} weight="fill" />
                {errorWorkers} error{errorWorkers > 1 ? 's' : ''}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database size={16} />
              Queue Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingJobs}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {systemMetrics.queueDepth} total in queue
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lightning size={16} />
              Healdec Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{healdecActions.length}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {(systemMetrics.healdecActionRate ?? 0).toFixed(1)}% action rate
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="repositories" className="w-full">
        <TabsList className="glow-border">
          <TabsTrigger value="repositories">All Repositories</TabsTrigger>
          <TabsTrigger value="watchlist">
            Watchlist ({watchlist.size})
          </TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="healdec">Healdec Log</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts ({alerts.filter(a => a.isActive).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repositories" className="space-y-4">
          <div className="grid gap-4">
            {repos.map(repo => (
              <Card key={repo.id} className="glow-border hover:border-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch size={20} className="text-accent" />
                        {repo.fullName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {repo.language} • {repo.stars.toLocaleString()} stars • {repo.forks.toLocaleString()} forks
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={repo.status === 'healthy' ? 'default' : repo.status === 'warning' ? 'secondary' : 'destructive'}
                        className="glow-accent"
                      >
                        {repo.healthScore}/100
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleWatchlist(repo.id)}
                        className={watchlist.has(repo.id) ? 'text-accent' : ''}
                      >
                        <Eye size={16} weight={watchlist.has(repo.id) ? 'fill' : 'regular'} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Health Score</span>
                        <span className="data-font text-accent">{repo.healthScore}%</span>
                      </div>
                      <Progress value={repo.healthScore} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Scanned {formatDistanceToNow(repo.lastScanned ?? Date.now(), { addSuffix: true })}
                      </span>
                      <span className={(repo.scoreChange24h ?? 0) >= 0 ? 'text-success' : 'text-destructive'}>
                        {(repo.scoreChange24h ?? 0) >= 0 ? '+' : ''}{(repo.scoreChange24h ?? 0).toFixed(1)}% 24h
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              if (!repo.admonitions || !repo.prSuggestions) {
                                onAnalyzeRepo(repo.id)
                              }
                              setSelectedRepoForAnalysis(repo)
                            }}
                          >
                            <Sparkle size={16} className="mr-1" />
                            {repo.admonitions && repo.prSuggestions ? 'View Analysis' : 'Analyze'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <GitBranch size={20} />
                              {repo.fullName}
                            </DialogTitle>
                            <DialogDescription>
                              Repository analysis and improvement suggestions
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="admonitions" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="admonitions" className="flex items-center gap-2">
                                <Bug size={16} />
                                Admonitions
                              </TabsTrigger>
                              <TabsTrigger value="pr-suggestions" className="flex items-center gap-2">
                                <GitPullRequest size={16} />
                                PR Suggestions
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="admonitions">
                              <AdmonitionsPanel scan={repo.admonitions} repoName={repo.name} />
                            </TabsContent>
                            <TabsContent value="pr-suggestions">
                              <PRSuggestionsPanel suggestions={repo.prSuggestions} repoName={repo.name} />
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          {watchlist.size === 0 ? (
            <Card className="glow-border">
              <CardContent className="py-8 text-center text-muted-foreground">
                No repositories in watchlist. Click the eye icon to add repositories.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {repos.filter(r => watchlist.has(r.id)).map(repo => (
                <Card key={repo.id} className="glow-border hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <GitBranch size={20} className="text-accent" />
                          {repo.fullName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Health Score: {repo.healthScore}/100
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleWatchlist(repo.id)}
                        className="text-accent"
                      >
                        <Eye size={16} weight="fill" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <div className="grid gap-4">
            {workers.map(worker => (
              <Card key={worker.id} className="glow-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Pulse size={20} className={worker.status === 'running' ? 'text-success animate-pulse' : 'text-muted-foreground'} weight="fill" />
                        {worker.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Type: {worker.type} • Processed: {worker.jobsProcessed.toLocaleString()} jobs
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        worker.status === 'running' ? 'default' :
                        worker.status === 'error' ? 'destructive' : 'secondary'
                      }
                    >
                      {worker.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="data-font text-success">{(worker.successRate ?? 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Processing Time</span>
                      <span className="data-font">{worker.avgProcessingTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Heartbeat</span>
                      <span className="data-font">{formatDistanceToNow(worker.lastHeartbeat, { addSuffix: true })}</span>
                    </div>
                    {worker.currentJob && (
                      <div className="pt-2 border-t border-border">
                        <span className="text-muted-foreground">Current Job: </span>
                        <span className="text-accent">{worker.currentJob}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="healdec" className="space-y-4">
          <div className="grid gap-3">
            {recentActions.map(action => (
              <Card key={action.id} className="glow-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightning size={16} className="text-accent" weight="fill" />
                        {action.strategy.toUpperCase()}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        Job: {action.jobId} • Worker: {action.workerId}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        action.outcome === 'success' ? 'default' :
                        action.outcome === 'failed' ? 'destructive' : 'secondary'
                      }
                    >
                      {action.outcome}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Type:</span>
                      <span className="data-font text-destructive">{action.errorType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="data-font">{formatDistanceToNow(action.timestamp, { addSuffix: true })}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border text-muted-foreground">
                      {action.details}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="glow-border">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Bell size={32} className="mx-auto mb-2" />
                <p>No alerts configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {alerts.map(alert => (
                <Card key={alert.id} className="glow-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bell size={16} className={alert.isActive ? 'text-accent' : 'text-muted-foreground'} weight={alert.isActive ? 'fill' : 'regular'} />
                          {alert.repoName}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">
                          {alert.type.replace('_', ' ')} • {alert.severity}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'warning' ? 'secondary' : 'default'}
                      >
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
