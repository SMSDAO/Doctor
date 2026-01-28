import { Repository, HealdecAction, SystemMetrics } from '@/lib/hospitalTypes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChartLine, TrendUp, TrendDown } from '@phosphor-icons/react'

interface AnalystPanelProps {
  repos: Repository[]
  healdecActions: HealdecAction[]
  systemMetrics: SystemMetrics
}

export function AnalystPanel({ repos, healdecActions, systemMetrics }: AnalystPanelProps) {
  const avgHealthScore = repos.reduce((acc, r) => acc + r.healthScore, 0) / repos.length
  const healthTrend = repos.reduce((acc, r) => acc + (r.scoreChange24h ?? 0), 0) / repos.length
  const successfulActions = healdecActions.filter(a => a.outcome === 'success').length
  const actionSuccessRate = (successfulActions / healdecActions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ChartLine size={32} weight="fill" className="text-accent" />
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">System health metrics and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{avgHealthScore.toFixed(1)}</div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {healthTrend >= 0 ? (
                <>
                  <TrendUp size={14} className="text-success" weight="bold" />
                  <span className="text-success">+{healthTrend.toFixed(1)}% trend</span>
                </>
              ) : (
                <>
                  <TrendDown size={14} className="text-destructive" weight="bold" />
                  <span className="text-destructive">{healthTrend.toFixed(1)}% trend</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Worker Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemMetrics.workerUtilization}%</div>
            <Progress value={systemMetrics.workerUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">API Latency (p95)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold data-font">{systemMetrics.avgApiLatency}ms</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: {'<'}500ms
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Healdec Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{actionSuccessRate.toFixed(1)}%</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {successfulActions}/{healdecActions.length} actions
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle>Repository Health Distribution</CardTitle>
            <CardDescription>Health score breakdown across all repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success">Healthy (80-100)</span>
                  <span className="text-sm data-font">{repos.filter(r => r.healthScore >= 80).length} repos</span>
                </div>
                <Progress
                  value={(repos.filter(r => r.healthScore >= 80).length / repos.length) * 100}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent">Warning (60-79)</span>
                  <span className="text-sm data-font">{repos.filter(r => r.healthScore >= 60 && r.healthScore < 80).length} repos</span>
                </div>
                <Progress
                  value={(repos.filter(r => r.healthScore >= 60 && r.healthScore < 80).length / repos.length) * 100}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-destructive">Critical ({'<'}60)</span>
                  <span className="text-sm data-font">{repos.filter(r => r.healthScore < 60).length} repos</span>
                </div>
                <Progress
                  value={(repos.filter(r => r.healthScore < 60).length / repos.length) * 100}
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle>Healdec Strategy Distribution</CardTitle>
            <CardDescription>Auto-healing actions by strategy type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['retry', 'restart', 'quarantine', 'rollback', 'escalate'].map(strategy => {
                const count = healdecActions.filter(a => a.strategy === strategy).length
                const percentage = (count / healdecActions.length) * 100
                
                return (
                  <div key={strategy}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{strategy}</span>
                      <span className="text-sm data-font">{count} actions</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glow-border">
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
          <CardDescription>Real-time operational metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">Queue Depth</div>
              <div className="text-2xl font-bold data-font">{systemMetrics.queueDepth}</div>
              <div className="mt-2 text-xs text-muted-foreground">Target: {'<'}100</div>
            </div>

            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">DB Connections</div>
              <div className="text-2xl font-bold data-font">{systemMetrics.dbConnections}</div>
              <div className="mt-2 text-xs text-muted-foreground">Pool: 100</div>
            </div>

            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">Healdec Action Rate</div>
              <div className="text-2xl font-bold data-font">{(systemMetrics.healdecActionRate ?? 0).toFixed(2)}%</div>
              <div className="mt-2 text-xs text-muted-foreground">Target: {'<'}5%</div>
            </div>

            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">Total Repositories</div>
              <div className="text-2xl font-bold data-font">{systemMetrics.totalRepos}</div>
            </div>

            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">Healthy Repositories</div>
              <div className="text-2xl font-bold data-font text-success">{systemMetrics.healthyRepos}</div>
            </div>

            <div className="p-4 border border-border rounded-lg glow-border">
              <div className="text-sm text-muted-foreground mb-1">Critical Repositories</div>
              <div className="text-2xl font-bold data-font text-destructive">{systemMetrics.criticalRepos}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
