import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { ChartDataPoint, ChartTimeframe } from '@/lib/types'
import { calculateRSI, calculateMACD, calculateBollingerBands, RSIData, MACDData, BollingerBands } from '@/lib/technicalIndicators'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IndicatorChartProps {
  data: ChartDataPoint[]
  timeframe: ChartTimeframe
  onTimeframeChange: (timeframe: ChartTimeframe) => void
  tokenSymbol?: string
}

const timeframes: ChartTimeframe[] = ['1H', '24H', '7D', '30D', '90D', '1Y']

export function IndicatorChart({
  data,
  timeframe,
  onTimeframeChange,
  tokenSymbol = '',
}: IndicatorChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)

  const rsiData = useMemo(() => calculateRSI(data, 14), [data])
  const macdData = useMemo(() => calculateMACD(data, 12, 26, 9), [data])
  const bbData = useMemo(() => calculateBollingerBands(data, 20, 2), [data])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width,
          height: 800,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.length || !dimensions.width) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 80, bottom: 40, left: 60 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const priceHeight = height * 0.45
    const rsiHeight = height * 0.18
    const macdHeight = height * 0.18
    const spacing = 20

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width])

    const yPriceScale = d3
      .scaleLinear()
      .domain([
        Math.min(d3.min(data, d => d.low ?? d.price)!, d3.min(bbData, d => d.lower) ?? Infinity) * 0.995,
        Math.max(d3.max(data, d => d.high ?? d.price)!, d3.max(bbData, d => d.upper) ?? -Infinity) * 1.005,
      ])
      .range([priceHeight, 0])

    const priceG = g.append('g').attr('class', 'price-chart')

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat(d => {
        const date = d as Date
        if (timeframe === '1H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '24H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '7D') return d3.timeFormat('%m/%d')(date)
        return d3.timeFormat('%m/%d')(date)
      })

    const yPriceAxis = d3.axisRight(yPriceScale).ticks(6).tickFormat(d => `$${d3.format('.4f')(d as number)}`)

    priceG
      .append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(xAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    priceG
      .append('g')
      .attr('transform', `translate(${width},0)`)
      .call(yPriceAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    priceG.selectAll('.axis path, .axis line').style('stroke', 'oklch(0.25 0.04 290)')

    const priceGridlines = priceG.append('g').attr('class', 'grid')
    priceGridlines
      .selectAll('line.horizontal')
      .data(yPriceScale.ticks(6))
      .enter()
      .append('line')
      .attr('class', 'horizontal')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yPriceScale(d))
      .attr('y2', d => yPriceScale(d))
      .style('stroke', 'oklch(0.25 0.04 290)')
      .style('stroke-width', '0.5px')
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3)

    if (bbData.length > 0) {
      const bbArea = d3
        .area<BollingerBands>()
        .x(d => xScale(new Date(d.timestamp)))
        .y0(d => yPriceScale(d.lower))
        .y1(d => yPriceScale(d.upper))
        .curve(d3.curveMonotoneX)

      priceG
        .append('path')
        .datum(bbData)
        .attr('fill', 'oklch(0.50 0.25 285 / 0.1)')
        .attr('d', bbArea)

      const bbUpperLine = d3
        .line<BollingerBands>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yPriceScale(d.upper))
        .curve(d3.curveMonotoneX)

      const bbMiddleLine = d3
        .line<BollingerBands>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yPriceScale(d.middle))
        .curve(d3.curveMonotoneX)

      const bbLowerLine = d3
        .line<BollingerBands>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yPriceScale(d.lower))
        .curve(d3.curveMonotoneX)

      priceG
        .append('path')
        .datum(bbData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.50 0.25 285 / 0.5)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('d', bbUpperLine)

      priceG
        .append('path')
        .datum(bbData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.65 0.20 240)')
        .attr('stroke-width', 1.5)
        .attr('d', bbMiddleLine)

      priceG
        .append('path')
        .datum(bbData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.50 0.25 285 / 0.5)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('d', bbLowerLine)
    }

    const priceLine = d3
      .line<ChartDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yPriceScale(d.price))
      .curve(d3.curveMonotoneX)

    priceG
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.75 0.15 195)')
      .attr('stroke-width', 2)
      .attr('d', priceLine)

    if (rsiData.length > 0) {
      const rsiG = g.append('g').attr('transform', `translate(0,${priceHeight + spacing})`)

      const yRSIScale = d3.scaleLinear().domain([0, 100]).range([rsiHeight, 0])

      const yRSIAxis = d3.axisRight(yRSIScale).ticks(4)

      rsiG
        .append('g')
        .attr('transform', `translate(${width},0)`)
        .call(yRSIAxis)
        .attr('class', 'axis')
        .selectAll('text')
        .style('fill', 'oklch(0.55 0.02 290)')
        .style('font-size', '11px')
        .style('font-family', 'var(--font-mono)')

      rsiG.selectAll('.axis path, .axis line').style('stroke', 'oklch(0.25 0.04 290)')

      rsiG
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yRSIScale(70))
        .attr('y2', yRSIScale(70))
        .style('stroke', 'oklch(0.60 0.22 25)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '2,2')
        .style('opacity', 0.5)

      rsiG
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yRSIScale(30))
        .attr('y2', yRSIScale(30))
        .style('stroke', 'oklch(0.65 0.18 150)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '2,2')
        .style('opacity', 0.5)

      const rsiLine = d3
        .line<RSIData>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yRSIScale(d.value))
        .curve(d3.curveMonotoneX)

      rsiG
        .append('path')
        .datum(rsiData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.65 0.20 240)')
        .attr('stroke-width', 2)
        .attr('d', rsiLine)

      rsiG
        .append('text')
        .attr('x', -10)
        .attr('y', rsiHeight / 2)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .style('fill', 'oklch(0.65 0.20 240)')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text('RSI(14)')
    }

    if (macdData.length > 0) {
      const macdG = g.append('g').attr('transform', `translate(0,${priceHeight + spacing + rsiHeight + spacing})`)

      const macdMax = Math.max(
        d3.max(macdData, d => Math.max(d.macd, d.signal))!,
        d3.max(macdData, d => Math.abs(d.histogram))!
      )
      const macdMin = Math.min(
        d3.min(macdData, d => Math.min(d.macd, d.signal))!,
        -d3.max(macdData, d => Math.abs(d.histogram))!
      )

      const yMACDScale = d3
        .scaleLinear()
        .domain([macdMin * 1.1, macdMax * 1.1])
        .range([macdHeight, 0])

      const yMACDAxis = d3.axisRight(yMACDScale).ticks(4).tickFormat(d => d3.format('.4f')(d as number))

      macdG
        .append('g')
        .attr('transform', `translate(${width},0)`)
        .call(yMACDAxis)
        .attr('class', 'axis')
        .selectAll('text')
        .style('fill', 'oklch(0.55 0.02 290)')
        .style('font-size', '11px')
        .style('font-family', 'var(--font-mono)')

      macdG.selectAll('.axis path, .axis line').style('stroke', 'oklch(0.25 0.04 290)')

      macdG
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yMACDScale(0))
        .attr('y2', yMACDScale(0))
        .style('stroke', 'oklch(0.35 0.04 290)')
        .style('stroke-width', 1)

      const barWidth = width / macdData.length
      macdData.forEach((d, i) => {
        const x = xScale(new Date(d.timestamp))
        const y = d.histogram >= 0 ? yMACDScale(d.histogram) : yMACDScale(0)
        const height = Math.abs(yMACDScale(0) - yMACDScale(d.histogram))
        const color = d.histogram >= 0 ? 'oklch(0.65 0.18 150 / 0.5)' : 'oklch(0.60 0.22 25 / 0.5)'

        macdG
          .append('rect')
          .attr('x', x - barWidth / 2)
          .attr('y', y)
          .attr('width', barWidth * 0.8)
          .attr('height', height)
          .attr('fill', color)
      })

      const macdLine = d3
        .line<MACDData>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yMACDScale(d.macd))
        .curve(d3.curveMonotoneX)

      const signalLine = d3
        .line<MACDData>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yMACDScale(d.signal))
        .curve(d3.curveMonotoneX)

      macdG
        .append('path')
        .datum(macdData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.75 0.15 195)')
        .attr('stroke-width', 2)
        .attr('d', macdLine)

      macdG
        .append('path')
        .datum(macdData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.58 0.24 25)')
        .attr('stroke-width', 2)
        .attr('d', signalLine)

      macdG
        .append('text')
        .attr('x', -10)
        .attr('y', macdHeight / 2)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .style('fill', 'oklch(0.75 0.15 195)')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text('MACD')
    }

    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', priceHeight)
      .attr('y2', priceHeight)
      .style('stroke', 'oklch(0.35 0.04 290)')
      .style('stroke-width', 2)

    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', priceHeight + spacing + rsiHeight)
      .attr('y2', priceHeight + spacing + rsiHeight)
      .style('stroke', 'oklch(0.35 0.04 290)')
      .style('stroke-width', 2)
  }, [data, dimensions, rsiData, macdData, bbData, timeframe])

  const firstPrice = data[0]?.price ?? 0
  const lastPrice = data[data.length - 1]?.price ?? 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0

  const lastRSI = rsiData[rsiData.length - 1]?.value
  const lastMACD = macdData[macdData.length - 1]

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-2xl font-bold data-font">${lastPrice.toFixed(4)}</div>
            <div
              className={cn(
                'flex items-center gap-1 data-font text-sm font-semibold',
                priceChange >= 0 ? 'text-success' : 'text-destructive'
              )}
            >
              <span>
                {priceChange >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {lastRSI !== undefined && (
            <div>
              <div className="text-sm text-muted-foreground">RSI(14)</div>
              <div
                className={cn(
                  'text-xl font-bold data-font',
                  lastRSI > 70 ? 'text-destructive' : lastRSI < 30 ? 'text-success' : 'text-accent'
                )}
              >
                {lastRSI.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {lastRSI > 70 ? 'Overbought' : lastRSI < 30 ? 'Oversold' : 'Neutral'}
              </div>
            </div>
          )}

          {lastMACD && (
            <div>
              <div className="text-sm text-muted-foreground">MACD</div>
              <div
                className={cn(
                  'text-xl font-bold data-font',
                  lastMACD.histogram >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {lastMACD.histogram.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                {lastMACD.histogram >= 0 ? 'Bullish' : 'Bearish'}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {timeframes.map(tf => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeframeChange(tf)}
              className={cn('data-font text-xs h-8 px-3', timeframe === tf && 'bg-primary text-primary-foreground')}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative bg-card border border-border rounded-lg p-4 glow-border">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="font-semibold text-accent mb-2">Bollinger Bands</div>
          <div className="space-y-1 text-muted-foreground text-xs">
            <p>Volatility bands around moving average</p>
            <p>Purple shaded area shows price range</p>
            <p>Breakouts signal potential trend changes</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="font-semibold text-accent mb-2">RSI (14)</div>
          <div className="space-y-1 text-muted-foreground text-xs">
            <p>Momentum oscillator (0-100)</p>
            <p>&gt;70 = Overbought (potential sell)</p>
            <p>&lt;30 = Oversold (potential buy)</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="font-semibold text-accent mb-2">MACD</div>
          <div className="space-y-1 text-muted-foreground text-xs">
            <p>Trend-following momentum indicator</p>
            <p>Histogram: difference between MACD and signal</p>
            <p>Crossovers indicate trend changes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
