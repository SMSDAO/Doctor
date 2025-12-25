import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RpcEndpoint } from '@/lib/types'
import { Users, Shield, ChartBar, Database } from '@phosphor-icons/react'
import { MetricCard } from '@/components/MetricCard'

interface AdminPanelProps {
  rpcEndpoints: RpcEndpoint[]
  onToggleEndpoint: (id: string) => void
}

export function AdminPanel({ rpcEndpoints, onToggleEndpoint }: AdminPanelProps) {
  const activeEndpoints = rpcEndpoints.filter(e => e.isActive).length
  const avgResponseTime = rpcEndpoints.reduce((sum, e) => sum + e.responseTime, 0) / rpcEndpoints.length
  const avgSuccessRate = rpcEndpoints.reduce((sum, e) => sum + e.successRate, 0) / rpcEndpoints.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 glow-text">Admin Panel</h1>
        <p className="text-muted-foreground">System configuration and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value="1,247"
          change={12.5}
          icon={<Users size={20} />}
        />
        <MetricCard
          title="RPC Endpoints"
          value={`${activeEndpoints}/${rpcEndpoints.length}`}
          icon={<Database size={20} />}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseTime.toFixed(0)}ms`}
          icon={<ChartBar size={20} />}
        />
        <MetricCard
          title="Success Rate"
          value={`${avgSuccessRate.toFixed(1)}%`}
          icon={<Shield size={20} />}
        />
      </div>

      <Card className="glow-border">
        <CardHeader>
          <CardTitle>RPC Endpoint Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rpcEndpoints.map(endpoint => (
              <div key={endpoint.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:glow-blue transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{endpoint.name}</h3>
                    <Badge variant={endpoint.isActive ? 'default' : 'secondary'} className={endpoint.isActive ? 'glow-purple' : ''}>
                      {endpoint.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{endpoint.url}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Response: <span className="data-font font-medium">{endpoint.responseTime}ms</span>
                    </span>
                    <span className="text-muted-foreground">
                      Success: <span className="data-font font-medium text-success">{endpoint.successRate}%</span>
                    </span>
                  </div>
                </div>
                <Button
                  variant={endpoint.isActive ? 'destructive' : 'default'}
                  onClick={() => onToggleEndpoint(endpoint.id)}
                  className={endpoint.isActive ? '' : 'glow-accent'}
                >
                  {endpoint.isActive ? 'Disable' : 'Enable'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Database</span>
              <Badge className="bg-success text-success-foreground">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cache</span>
              <Badge className="bg-success text-success-foreground">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">API</span>
              <Badge className="bg-success text-success-foreground">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Background Jobs</span>
              <Badge className="bg-success text-success-foreground">Running</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New users today</span>
                <span className="font-semibold data-font">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alerts triggered</span>
                <span className="font-semibold data-font">1,203</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API calls (24h)</span>
                <span className="font-semibold data-font">847,293</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed requests</span>
                <span className="font-semibold data-font">127</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
