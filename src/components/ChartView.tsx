import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PriceChart } from '@/components/PriceChart'
import { CandlestickChart } from '@/components/CandlestickChart'
import { IndicatorChart } from '@/components/IndicatorChart'
import { Token, ChartTimeframe, ChartDataPoint } from '@/lib/types'
import { generateHistoricalData } from '@/lib/mockData'
import { ChartLine, ChartLineUp, ChartBar } from '@phosphor-icons/react'

interface ChartViewProps {
  tokens: Token[]
}

export function ChartView({ tokens }: ChartViewProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<string>(tokens[0]?.id ?? '')
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('24H')
  const [showVolume, setShowVolume] = useState(true)
  const [showMA, setShowMA] = useState(false)
  const [maLength, setMaLength] = useState(20)

  const selectedToken = tokens.find(t => t.id === selectedTokenId)
  const chartData: ChartDataPoint[] = selectedToken 
    ? generateHistoricalData(selectedToken.price, timeframe) 
    : []

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <ChartLine size={48} className="mb-4 opacity-50" />
          <p>No tokens available to chart</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <ChartLine size={24} />
            Advanced Chart
          </CardTitle>
          <Select value={selectedTokenId} onValueChange={setSelectedTokenId}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map(token => (
                <SelectItem key={token.id} value={token.id}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">{token.symbol}</span>
                    <span className="text-muted-foreground text-xs">{token.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="line" className="w-full">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <ChartLine size={16} />
                Line Chart
              </TabsTrigger>
              <TabsTrigger value="candle" className="flex items-center gap-2">
                <ChartLineUp size={16} />
                Candlestick
              </TabsTrigger>
              <TabsTrigger value="indicators" className="flex items-center gap-2">
                <ChartBar size={16} />
                Indicators
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-volume"
                  checked={showVolume}
                  onCheckedChange={setShowVolume}
                />
                <Label htmlFor="show-volume" className="text-sm">Show Volume</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="show-ma"
                  checked={showMA}
                  onCheckedChange={setShowMA}
                />
                <Label htmlFor="show-ma" className="text-sm">Moving Average</Label>
              </div>

              {showMA && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="ma-length" className="text-sm">MA Period:</Label>
                  <Select value={maLength.toString()} onValueChange={(v) => setMaLength(parseInt(v))}>
                    <SelectTrigger className="w-24" id="ma-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="line" className="mt-0">
            <PriceChart
              data={chartData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              showVolume={showVolume}
              showMA={showMA}
              maLength={maLength}
              tokenSymbol={selectedToken?.symbol}
            />
          </TabsContent>

          <TabsContent value="candle" className="mt-0">
            <CandlestickChart
              data={chartData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              tokenSymbol={selectedToken?.symbol}
            />
          </TabsContent>

          <TabsContent value="indicators" className="mt-0">
            <IndicatorChart
              data={chartData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              tokenSymbol={selectedToken?.symbol}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
