import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ChartDataPoint, ChartTimeframe } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CandlestickChartProps {
  data: ChartDataPoint[]
  timeframe: ChartTimeframe
  onTimeframeChange: (timeframe: ChartTimeframe) => void
  tokenSymbol?: string
}

const timeframes: ChartTimeframe[] = ['1H', '24H', '7D', '30D', '90D', '1Y']

export function CandlestickChart({
  data,
  timeframe,
  onTimeframeChange,
  tokenSymbol = '',
}: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width,
          height: 480,
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

    const margin = { top: 20, right: 60, bottom: 140, left: 60 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom
    const volumeHeight = 100
    const candleHeight = height - volumeHeight - 20

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, width])
      .padding(0.3)

    const yPriceScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => d.low ?? d.price)! * 0.995,
        d3.max(data, d => d.high ?? d.price)! * 1.005,
      ])
      .range([candleHeight, 0])

    const yVolumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.volume)!])
      .range([volumeHeight, 0])

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(
        xScale.domain().filter((_, i) => {
          const step = Math.ceil(data.length / 8)
          return i % step === 0
        })
      )
      .tickFormat((d) => {
        const index = parseInt(d as string)
        const date = new Date(data[index].timestamp)
        if (timeframe === '1H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '24H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '7D') return d3.timeFormat('%m/%d')(date)
        return d3.timeFormat('%m/%d')(date)
      })

    const yPriceAxis = d3
      .axisRight(yPriceScale)
      .ticks(8)
      .tickFormat(d => `$${d3.format('.4f')(d as number)}`)

    g.append('g')
      .attr('transform', `translate(0,${candleHeight})`)
      .call(xAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    g.append('g')
      .attr('transform', `translate(${width},0)`)
      .call(yPriceAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    g.selectAll('.axis path, .axis line')
      .style('stroke', 'oklch(0.25 0.04 290)')
      .style('stroke-width', '1px')

    const gridlines = g.append('g').attr('class', 'grid')

    gridlines
      .selectAll('line.horizontal')
      .data(yPriceScale.ticks(8))
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

    const candleGroup = g.append('g')

    data.forEach((d, i) => {
      const x = xScale(i.toString())!
      const open = d.open ?? d.price
      const close = d.close ?? d.price
      const high = d.high ?? d.price
      const low = d.low ?? d.price

      const isBullish = close >= open
      const color = isBullish ? 'oklch(0.65 0.18 150)' : 'oklch(0.60 0.22 25)'
      const bodyTop = Math.max(open, close)
      const bodyBottom = Math.min(open, close)

      const candleWidth = xScale.bandwidth()

      candleGroup
        .append('line')
        .attr('x1', x + candleWidth / 2)
        .attr('x2', x + candleWidth / 2)
        .attr('y1', yPriceScale(high))
        .attr('y2', yPriceScale(low))
        .style('stroke', color)
        .style('stroke-width', 1)

      candleGroup
        .append('rect')
        .attr('x', x)
        .attr('y', yPriceScale(bodyTop))
        .attr('width', candleWidth)
        .attr('height', Math.max(1, yPriceScale(bodyBottom) - yPriceScale(bodyTop)))
        .style('fill', color)
        .style('stroke', color)
        .style('stroke-width', 1)
        .style('rx', 1)
        .on('mouseenter', function() {
          d3.select(this)
            .style('opacity', 0.8)
            .style('filter', 'drop-shadow(0 0 4px currentColor)')
          setHoveredPoint(d)
        })
        .on('mouseleave', function() {
          d3.select(this)
            .style('opacity', 1)
            .style('filter', 'none')
          setHoveredPoint(null)
        })
    })

    const volumeG = g
      .append('g')
      .attr('transform', `translate(0,${candleHeight + 20})`)

    data.forEach((d, i) => {
      const x = xScale(i.toString())!
      const isBullish = i === 0 ? true : d.price >= data[i - 1].price

      volumeG
        .append('rect')
        .attr('x', x)
        .attr('y', yVolumeScale(d.volume))
        .attr('width', xScale.bandwidth())
        .attr('height', volumeHeight - yVolumeScale(d.volume))
        .attr('fill', isBullish ? 'oklch(0.65 0.18 150 / 0.3)' : 'oklch(0.60 0.22 25 / 0.3)')
        .attr('rx', 1)
    })
  }, [data, dimensions, timeframe])

  const firstPrice = data[0]?.price ?? 0
  const lastPoint = data[data.length - 1]
  const lastPrice = lastPoint?.price ?? 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              {hoveredPoint ? 'OHLC at point' : 'Current Price'}
            </div>
            {hoveredPoint ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 data-font text-sm">
                  <span className="text-muted-foreground">O:</span>
                  <span>${hoveredPoint.open?.toFixed(4) ?? hoveredPoint.price.toFixed(4)}</span>
                  <span className="text-muted-foreground">H:</span>
                  <span>${hoveredPoint.high?.toFixed(4) ?? hoveredPoint.price.toFixed(4)}</span>
                  <span className="text-muted-foreground">L:</span>
                  <span>${hoveredPoint.low?.toFixed(4) ?? hoveredPoint.price.toFixed(4)}</span>
                  <span className="text-muted-foreground">C:</span>
                  <span>${hoveredPoint.close?.toFixed(4) ?? hoveredPoint.price.toFixed(4)}</span>
                </div>
                <div className="text-xs text-muted-foreground data-font">
                  {new Date(hoveredPoint.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold data-font">
                ${lastPrice.toFixed(4)}
              </div>
            )}
          </div>
          {!hoveredPoint && (
            <div className={cn(
              'flex items-center gap-1 data-font text-sm font-semibold',
              priceChange >= 0 ? 'text-success' : 'text-destructive'
            )}>
              <span>{priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeframeChange(tf)}
              className={cn(
                'data-font text-xs h-8 px-3',
                timeframe === tf && 'bg-primary text-primary-foreground'
              )}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative bg-card border border-border rounded-lg p-4 glow-border">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        />
      </div>

      {hoveredPoint && (
        <div className="text-xs text-muted-foreground data-font">
          Volume: ${hoveredPoint.volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
      )}
    </div>
  )
}
