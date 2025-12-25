import { Alert, Token } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatTimeAgo } from '@/lib/formatters'
import { Bell, SpeakerHigh } from '@phosphor-icons/react'

interface AlertHistoryProps {
  alerts: Alert[]
  tokens: Token[]
}

export function AlertHistory({ alerts, tokens }: AlertHistoryProps) {
  const triggeredAlerts = alerts
    .filter(a => a.triggeredAt)
    .sort((a, b) => (b.triggeredAt || 0) - (a.triggeredAt || 0))
    .slice(0, 5)

  if (triggeredAlerts.length === 0) {
    return null
  }

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell size={20} weight="fill" className="text-accent" />
          Recent Alert Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {triggeredAlerts.map(alert => {
            const token = tokens.find(t => t.id === alert.tokenId)
            return (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {alert.soundEnabled !== false && (
                    <SpeakerHigh size={16} className="text-accent" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.tokenSymbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.condition.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.triggeredAt && formatTimeAgo(alert.triggeredAt)}
                    </p>
                  </div>
                </div>
                {token && (
                  <div className="text-right">
                    <div className="data-font font-semibold text-sm">
                      {formatPrice(token.price)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
