import { Repository, WorkerStatus, Job, Identity } from '@/lib/hospitalTypes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { ShieldCheck, User, Database, Play, Stop } from '@phosphor-icons/react'

interface AdminPanelProps {
  repos: Repository[]
  workers: WorkerStatus[]
  jobs: Job[]
  identities: Identity[]
  onTriggerWorker: (workerId: string, action: string) => void
}

export function AdminPanel({ repos, workers, jobs, identities }: AdminPanelProps) {
  const totalIdentities = identities.length
  const verifiedIdentities = identities.filter(i => i.type === 'user').length
  const botIdentities = identities.filter(i => i.type === 'bot').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck size={32} weight="fill" className="text-accent" />
        <div>
          <h2 className="text-2xl font-bold">Admin Control Center</h2>
          <p className="text-sm text-muted-foreground">System administration and monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Identities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIdentities}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {verifiedIdentities} users • {botIdentities} bots
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{jobs.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {jobs.filter(j => j.status === 'pending').length} pending
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workers.filter(w => w.status === 'running').length}/12</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {workers.filter(w => w.status === 'error').length} errors
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="glow-border">
          <TabsTrigger value="workers">Worker Management</TabsTrigger>
          <TabsTrigger value="identities">Identities</TabsTrigger>
          <TabsTrigger value="jobs">Job Queue</TabsTrigger>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle>Worker Control Panel</CardTitle>
              <CardDescription>Manage and monitor all 12 parallel workers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jobs Processed</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map(worker => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{worker.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            worker.status === 'running' ? 'default' :
                            worker.status === 'error' ? 'destructive' : 'secondary'
                          }
                        >
                          {worker.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="data-font">{worker.jobsProcessed.toLocaleString()}</TableCell>
                      <TableCell className="data-font text-success">{worker.successRate.toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" disabled={worker.status === 'running'}>
                            <Play size={14} />
                          </Button>
                          <Button size="sm" variant="outline" disabled={worker.status !== 'running'}>
                            <Stop size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identities" className="space-y-4">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle>Developer Identities</CardTitle>
              <CardDescription>Track and manage developer identity claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contributions</TableHead>
                    <TableHead>Repos Claimed</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {identities.slice(0, 15).map(identity => (
                    <TableRow key={identity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-accent" />
                          <div>
                            <div className="font-medium">{identity.login}</div>
                            {identity.name && (
                              <div className="text-xs text-muted-foreground">{identity.name}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={identity.type === 'bot' ? 'secondary' : 'default'}>
                          {identity.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="data-font">{identity.contributionCount.toLocaleString()}</TableCell>
                      <TableCell className="data-font">{identity.reposClaimed}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(identity.lastSeen, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle>Job Queue</CardTitle>
              <CardDescription>Monitor and manage queued jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.slice(0, 15).map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="data-font">{job.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === 'completed' ? 'default' :
                            job.status === 'failed' || job.status === 'quarantined' ? 'destructive' : 'secondary'
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="data-font">{job.priority}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {job.workerId || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repos" className="space-y-4">
          <Card className="glow-border">
            <CardHeader>
              <CardTitle>Repository Management</CardTitle>
              <CardDescription>View and manage all tracked repositories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Health Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Last Scanned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repos.map(repo => (
                    <TableRow key={repo.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Database size={16} className="text-accent" />
                          <div>
                            <div className="font-medium">{repo.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              {repo.stars.toLocaleString()} stars
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="data-font font-bold text-accent">{repo.healthScore}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            repo.status === 'healthy' ? 'default' :
                            repo.status === 'critical' ? 'destructive' : 'secondary'
                          }
                        >
                          {repo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{repo.language}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(repo.lastScanned, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
