import { SystemMetrics, WorkerStatus } from '@/lib/hospitalTypes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Code, Key, Globe, Terminal } from '@phosphor-icons/react'
import { useState } from 'react'

interface DeveloperPanelProps {
  systemMetrics: SystemMetrics
  workers: WorkerStatus[]
}

export function DeveloperPanel({ systemMetrics, workers }: DeveloperPanelProps) {
  const [apiKey] = useState('bdh_v4_' + Math.random().toString(36).substring(2, 15))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Code size={32} weight="fill" className="text-accent" />
        <div>
          <h2 className="text-2xl font-bold">Developer Portal</h2>
          <p className="text-sm text-muted-foreground">API access and integration tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={20} className="text-accent" />
              API Key
            </CardTitle>
            <CardDescription>Use this key to authenticate API requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all glow-border">
              {apiKey}
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(apiKey)}>
              Copy API Key
            </Button>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} className="text-accent" />
              API Endpoints
            </CardTitle>
            <CardDescription>Available endpoints for integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">GET /api/v1/repos</div>
                  <div className="text-xs text-muted-foreground">List all repositories</div>
                </div>
                <Badge variant="outline" className="text-success">200</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">GET /api/v1/repos/:id</div>
                  <div className="text-xs text-muted-foreground">Get repository details</div>
                </div>
                <Badge variant="outline" className="text-success">200</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">GET /api/v1/workers</div>
                  <div className="text-xs text-muted-foreground">Worker status</div>
                </div>
                <Badge variant="outline" className="text-success">200</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">GET /api/v1/metrics</div>
                  <div className="text-xs text-muted-foreground">System metrics</div>
                </div>
                <Badge variant="outline" className="text-success">200</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal size={20} className="text-accent" />
            API Playground
          </CardTitle>
          <CardDescription>Test API endpoints in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-accent">GET</Badge>
                <span className="font-mono text-sm">/api/v1/metrics</span>
              </div>
              <div className="p-3 bg-background rounded border border-border font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">{JSON.stringify(systemMetrics, null, 2)}</pre>
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-accent">GET</Badge>
                <span className="font-mono text-sm">/api/v1/workers</span>
              </div>
              <div className="p-3 bg-background rounded border border-border font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                <pre className="text-muted-foreground">{JSON.stringify(workers.slice(0, 3), null, 2)}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glow-border">
        <CardHeader>
          <CardTitle>SDK Examples</CardTitle>
          <CardDescription>Code snippets for quick integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Node.js / TypeScript</div>
              <div className="p-3 bg-background rounded border border-border font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">{`import { BrainDoctorClient } from '@algobrain/sdk'

const client = new BrainDoctorClient({
  apiKey: '${apiKey}'
})

const repos = await client.repos.list()
const metrics = await client.metrics.get()`}</pre>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Python</div>
              <div className="p-3 bg-background rounded border border-border font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">{`from braindoctor import Client

client = Client(api_key="${apiKey}")

repos = client.repos.list()
metrics = client.metrics.get()`}</pre>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">cURL</div>
              <div className="p-3 bg-background rounded border border-border font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">{`curl -X GET "https://api.braindoctor.dev/v1/repos" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
