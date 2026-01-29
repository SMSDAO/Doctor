import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bug, Warning, Note, Lightning, Wrench, Target } from '@phosphor-icons/react'
import type { AdmonitionScan, AdmonitionItem } from '@/lib/hospitalTypes'

interface AdmonitionsPanelProps {
  scan: AdmonitionScan | undefined
  repoName: string
}

export function AdmonitionsPanel({ scan, repoName }: AdmonitionsPanelProps) {
  if (!scan) {
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug size={20} />
            Code Admonitions
          </CardTitle>
          <CardDescription>
            Scan repository for TODO, FIXME, and other code markers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No scan data available. Run a scan to view admonitions.</p>
        </CardContent>
      </Card>
    )
  }

  const getIconForType = (type: AdmonitionItem['type']) => {
    switch (type) {
      case 'FIXME': return <Bug size={16} weight="fill" className="text-destructive" />
      case 'HACK': return <Warning size={16} weight="fill" className="text-orange-500" />
      case 'WARNING': return <Warning size={16} weight="fill" className="text-yellow-500" />
      case 'OPTIMIZE': return <Lightning size={16} weight="fill" className="text-accent" />
      case 'NOTE': return <Note size={16} weight="fill" className="text-muted-foreground" />
      case 'TODO': return <Target size={16} weight="fill" className="text-primary" />
    }
  }

  const getVariantForType = (type: AdmonitionItem['type']): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'FIXME': return 'destructive'
      case 'HACK': return 'outline'
      case 'WARNING': return 'outline'
      case 'OPTIMIZE': return 'secondary'
      case 'NOTE': return 'secondary'
      case 'TODO': return 'default'
    }
  }

  const filterByType = (type: AdmonitionItem['type'] | 'ALL') => {
    if (type === 'ALL') return scan.items
    return scan.items.filter(item => item.type === type)
  }

  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug size={20} />
          Code Admonitions
        </CardTitle>
        <CardDescription>
          {scan.totalCount} markers found in {repoName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {Object.entries(scan.byType).map(([type, count]) => (
            <div key={type} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1">
                {getIconForType(type as AdmonitionItem['type'])}
                <span className="text-xs font-medium">{type}</span>
              </div>
              <span className="text-lg font-bold">{count}</span>
            </div>
          ))}
        </div>

        <Tabs defaultValue="ALL" className="w-full">
          <TabsList className="w-full grid grid-cols-7">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="FIXME">FIXME</TabsTrigger>
            <TabsTrigger value="HACK">HACK</TabsTrigger>
            <TabsTrigger value="WARNING">WARN</TabsTrigger>
            <TabsTrigger value="OPTIMIZE">OPT</TabsTrigger>
            <TabsTrigger value="TODO">TODO</TabsTrigger>
            <TabsTrigger value="NOTE">NOTE</TabsTrigger>
          </TabsList>

          {['ALL', 'FIXME', 'HACK', 'WARNING', 'OPTIMIZE', 'TODO', 'NOTE'].map(tabType => (
            <TabsContent key={tabType} value={tabType}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filterByType(tabType as AdmonitionItem['type'] | 'ALL').map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant={getVariantForType(item.type)} className="flex items-center gap-1">
                          {getIconForType(item.type)}
                          {item.type}
                        </Badge>
                        {item.author && (
                          <span className="text-xs text-muted-foreground">@{item.author}</span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{item.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="px-1.5 py-0.5 rounded bg-muted font-mono">{item.file}</code>
                        <span>:</span>
                        <span>line {item.line}</span>
                      </div>
                    </div>
                  ))}
                  {filterByType(tabType as AdmonitionItem['type'] | 'ALL').length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No {tabType === 'ALL' ? '' : tabType} items found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
