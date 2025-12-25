import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ApiKey } from '@/lib/types'
import { Code, Key, Lightning, Copy } from '@phosphor-icons/react'
import { MetricCard } from '@/components/MetricCard'
import { toast } from 'sonner'

interface DeveloperPanelProps {
  apiKeys: ApiKey[]
  onCreateApiKey: (name: string) => void
  onDeleteApiKey: (id: string) => void
}

export function DeveloperPanel({ apiKeys, onCreateApiKey, onDeleteApiKey }: DeveloperPanelProps) {
  const [newKeyName, setNewKeyName] = useState('')
  const [testEndpoint, setTestEndpoint] = useState('getAccountInfo')
  const [testParams, setTestParams] = useState('{}')
  const [testResult, setTestResult] = useState('')

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }
    onCreateApiKey(newKeyName)
    setNewKeyName('')
    toast.success('API key created successfully')
  }

  const handleTestEndpoint = () => {
    setTestResult(JSON.stringify({
      success: true,
      data: {
        lamports: 1000000000,
        owner: "11111111111111111111111111111111",
        executable: false
      },
      timestamp: new Date().toISOString()
    }, null, 2))
    toast.success('Test request successful')
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const totalRequests = apiKeys.reduce((sum, k) => sum + k.requestCount, 0)
  const activeKeys = apiKeys.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Developer Panel</h1>
        <p className="text-muted-foreground">API management and testing tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active API Keys"
          value={activeKeys}
          icon={<Key size={20} />}
        />
        <MetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          icon={<Lightning size={20} />}
        />
        <MetricCard
          title="Rate Limit"
          value="1000/min"
          icon={<Code size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Create New API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="keyName"
                  placeholder="Key name (e.g., Production)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <Button onClick={handleCreateKey}>Create</Button>
              </div>
            </div>

            <div className="space-y-3">
              {apiKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No API keys yet. Create one to get started.
                </p>
              ) : (
                apiKeys.map(key => (
                  <div key={key.id} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold">{key.name}</h3>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {key.key}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyApiKey(key.key)}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Requests: {key.requestCount.toLocaleString()} | 
                          Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteApiKey(key.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Playground</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
                placeholder="e.g., getAccountInfo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="params">Parameters (JSON)</Label>
              <Textarea
                id="params"
                value={testParams}
                onChange={(e) => setTestParams(e.target.value)}
                placeholder='{"address": "..."}'
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <Button onClick={handleTestEndpoint} className="w-full">
              <Lightning size={18} />
              Test Request
            </Button>

            {testResult && (
              <div className="space-y-2">
                <Label>Response</Label>
                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-64">
                  {testResult}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Include your API key in the <code className="bg-muted px-1 py-0.5 rounded text-xs">X-API-Key</code> header
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-auto">
{`curl -H "X-API-Key: your_api_key_here" \\
  https://api.jupitercan.io/v1/tokens`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Available Endpoints</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">GET</Badge>
                <code className="text-xs">/v1/tokens</code>
                <span className="text-muted-foreground">List all tokens</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">GET</Badge>
                <code className="text-xs">/v1/tokens/:address</code>
                <span className="text-muted-foreground">Get token details</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">GET</Badge>
                <code className="text-xs">/v1/prices</code>
                <span className="text-muted-foreground">Get current prices</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">POST</Badge>
                <code className="text-xs">/v1/alerts</code>
                <span className="text-muted-foreground">Create price alert</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
