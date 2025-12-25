import { Token, Alert } from '@/lib/types'
import { TokenTable } from '@/components/TokenTable'
import { MetricCard } from '@/components/MetricCard'
import { ChartView } from '@/components/ChartView'
import { AlertHistory } from '@/components/AlertHistory'
import { VolumeAnalysis } from '@/components/VolumeAnalysis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatVolume, formatPercentage, formatPrice, formatTimeAgo } from '@/lib/formatters'
import { generateHistoricalData } from '@/lib/mockData'
import { ChartBar, Bell, Star, TrendUp, Lightning, ChartLine, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
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
  const triggeredAlerts = alerts.filter(a => a.triggeredAt)

  const getConditionLabel = (condition: Alert['condition']) => {
    switch (condition) {
      case 'above': return 'Price above'
      case 'below': return 'Price below'
      case 'change_up': return 'Increase by'
      case 'change_down': return 'Decrease by'
      case 'volume_spike': return 'Volume spike'
      default: return condition
    }
  }

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

      {triggeredAlerts.length > 0 && (
        <AlertHistory alerts={alerts} tokens={tokens} />
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="all">
            All Tokens ({tokens.length})
          </TabsTrigger>
          <TabsTrigger value="watchlist">
            Watchlist ({watchlist.size})
          </TabsTrigger>
          <TabsTrigger value="charts">
            <ChartLine size={16} className="mr-1" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="volume">
            <ChartBar size={16} className="mr-1" />
            Volume
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

        <TabsContent value="charts" className="space-y-4">
          <ChartView tokens={tokens} />
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          {tokens.length > 0 && (
            <VolumeAnalysis
              data={generateHistoricalData(tokens[0].price, '7D')}
              tokenSymbol={tokens[0].symbol}
            />
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bell size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts configured</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create alerts to get notified about price changes with sound notifications
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {triggeredAlerts.length > 0 && (
                <Card className="border-accent/50 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-accent">
                      <Bell size={20} weight="fill" />
                      Recently Triggered Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {triggeredAlerts.slice(0, 3).map(alert => {
                      const token = tokens.find(t => t.id === alert.tokenId)
                      return (
                        <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{alert.tokenSymbol}</span>
                              <Badge variant="outline" className="text-xs">
                                {getConditionLabel(alert.condition)} {alert.threshold}{alert.condition.includes('change') ? '%' : ''}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Triggered {alert.triggeredAt && formatTimeAgo(alert.triggeredAt)}
                            </p>
                          </div>
                          {token && (
                            <div className="text-right">
                              <div className="data-font font-semibold">{formatPrice(token.price)}</div>
                              <div className={`text-xs ${token.priceChange24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {formatPercentage(token.priceChange24h)}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
              
              <div className="grid gap-4">
                {alerts.map(alert => {
                  const token = tokens.find(t => t.id === alert.tokenId)
                  return (
                    <Card key={alert.id} className={alert.triggeredAt ? 'border-accent/30' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold">{alert.tokenSymbol}</h3>
                              <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                                {alert.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {alert.triggeredAt && (
                                <Badge variant="outline" className="border-accent text-accent">
                                  Triggered
                                </Badge>
                              )}
                              {alert.soundEnabled !== false ? (
                                <SpeakerHigh size={16} className="text-accent" />
                              ) : (
                                <SpeakerSlash size={16} className="text-muted-foreground" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                {getConditionLabel(alert.condition)}: <span className="font-medium data-font">
                                  {alert.threshold}{alert.condition.includes('change') ? '%' : alert.condition === 'volume_spike' ? 'x' : ''}
                                </span>
                              </p>
                              {token && (
                                <p className="text-sm">
                                  Current price: <span className="data-font font-medium text-accent">{formatPrice(token.price)}</span>
                                </p>
                              )}
                              {alert.triggeredAt && (
                                <p className="text-xs text-muted-foreground">
                                  Last triggered {formatTimeAgo(alert.triggeredAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => onToggleAlert(alert.id)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
