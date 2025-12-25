import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Token, ChartTimeframe, ChartDataPoint } from '@/lib/types'
import { formatPrice, formatVolume, formatPercentage, formatAddress, getChangeColor } from '@/lib/formatters'
import { generateHistoricalData } from '@/lib/mockData'
import { PriceChart } from '@/components/PriceChart'
import { Copy, Bell, Star, TrendUp, TrendDown } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TokenDetailDialogProps {
  token: Token | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAlert: (token: Token) => void
  isWatched: boolean
  onToggleWatchlist: (tokenId: string) => void
}

export function TokenDetailDialog({ token, open, onOpenChange, onCreateAlert, isWatched, onToggleWatchlist }: TokenDetailDialogProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D')

  useEffect(() => {
    if (token) {
      setChartData(generateHistoricalData(token.price, timeframe))
    }
  }, [token, timeframe])

  if (!token) return null

  const changeColor = getChangeColor(token.priceChange24h)

  const copyAddress = () => {
    navigator.clipboard.writeText(token.address)
    toast.success('Address copied to clipboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">{token.symbol}</h2>
                <Badge variant="secondary">{token.name}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatAddress(token.address, 8, 8)}</span>
                <Button size="sm" variant="ghost" onClick={copyAddress}>
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleWatchlist(token.id)}
              >
                <Star size={18} weight={isWatched ? 'fill' : 'regular'} />
                {isWatched ? 'Watching' : 'Watch'}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onCreateAlert(token)
                  onOpenChange(false)
                }}
              >
                <Bell size={18} />
                Create Alert
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold data-font">{formatPrice(token.price)}</div>
              <div className={`flex items-center gap-1 text-xl font-medium data-font pb-2 ${changeColor}`}>
                {token.priceChange24h > 0 ? <TrendUp size={20} /> : <TrendDown size={20} />}
                {formatPercentage(token.priceChange24h)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Market Cap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold data-font">{formatVolume(token.marketCap)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">24h Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold data-font">{formatVolume(token.volume24h)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold data-font">{formatVolume(token.liquidity)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Holders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold data-font">{token.holders.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart
                data={chartData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                showVolume={true}
                showMA={false}
                tokenSymbol={token.symbol}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Liquidity Risk</span>
                  <Badge variant="secondary" className="text-success">Low</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volatility</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Verified</span>
                  <Badge variant="secondary" className="text-success">Yes</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trading Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DEX</span>
                  <span>Raydium, Orca</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pair</span>
                  <span>{token.symbol}/USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool Fee</span>
                  <span>0.25%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
