import { Token, Alert } from '@/lib/types'
import { TokenTable } from '@/components/TokenTable'
import { MetricCard } from '@/components/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatVolume, formatPercentage, formatPrice } from '@/lib/formatters'
import { ChartBar, Bell, Star, TrendUp, Coins, Lightning } from '@phosphor-icons/react'
import { Switch } from '@/components/ui/switch'

interface UserDashboardProps {
  tokens: Token[]
  watchlist: Set<string>
  alerts: Alert[]
  onToggleWatchlist: (tokenId: string) => void
  onCreateAlert: (token: Token) => void
  onViewDetails: (token: Token) => void
  onToggleAlert: (alertId: string) => void
  onDeleteAlert: (alertId: string) => void
}

export function UserDashboard({
  tokens,
  watchlist,
  alerts,
  onToggleWatchlist,
  onCreateAlert,
  onViewDetails,
  onToggleAlert,
  onDeleteAlert,
}: UserDashboardProps) {
  const watchedTokens = tokens.filter(t => watchlist.has(t.id))
  const totalMarketCap = tokens.reduce((sum, t) => sum + t.marketCap, 0)
  const totalVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0)
  const avgPriceChange = tokens.reduce((sum, t) => sum + t.priceChange24h, 0) / tokens.length
  const activeAlerts = alerts.filter(a => a.isActive)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor Solana ecosystem tokens in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Market Cap"
          value={formatVolume(totalMarketCap)}
          icon={<ChartBar size={20} />}
        />
        <MetricCard
          title="24h Volume"
          value={formatVolume(totalVolume)}
          icon={<Lightning size={20} />}
        />
        <MetricCard
          title="Avg Price Change"
          value={formatPercentage(avgPriceChange)}
          change={avgPriceChange}
          icon={<TrendUp size={20} />}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={<Bell size={20} />}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All Tokens ({tokens.length})
          </TabsTrigger>
          <TabsTrigger value="watchlist">
            Watchlist ({watchlist.size})
          </TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts ({alerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenTable
                tokens={tokens}
                watchlist={watchlist}
                onToggleWatchlist={onToggleWatchlist}
                onCreateAlert={onCreateAlert}
                onViewDetails={onViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          {watchedTokens.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Star size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tokens in watchlist</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Click the star icon on any token to add it to your watchlist
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <TokenTable
                  tokens={watchedTokens}
                  watchlist={watchlist}
                  onToggleWatchlist={onToggleWatchlist}
                  onCreateAlert={onCreateAlert}
                  onViewDetails={onViewDetails}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bell size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts configured</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create alerts to get notified about price changes
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {alerts.map(alert => {
                const token = tokens.find(t => t.id === alert.tokenId)
                return (
                  <Card key={alert.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{alert.tokenSymbol}</h3>
                            <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                              {alert.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {alert.triggeredAt && (
                              <Badge variant="destructive">Triggered</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Alert when {alert.condition.replace('_', ' ')} {alert.threshold}
                            {alert.condition.includes('change') ? '%' : ''}
                          </p>
                          {token && (
                            <p className="text-sm">
                              Current price: <span className="data-font font-medium">{formatPrice(token.price)}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => onToggleAlert(alert.id)}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeleteAlert(alert.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
