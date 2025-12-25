import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { ChartDataPoint, ChartTimeframe } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PriceChartProps {
  data: ChartDataPoint[]
  timeframe: ChartTimeframe
  onTimeframeChange: (timeframe: ChartTimeframe) => void
  showVolume?: boolean
  showMA?: boolean
  maLength?: number
  tokenSymbol?: string
}

const timeframes: ChartTimeframe[] = ['1H', '24H', '7D', '30D', '90D', '1Y']

export function PriceChart({
  data,
  timeframe,
  onTimeframeChange,
  showVolume = false,
  showMA = false,
  maLength = 20,
  tokenSymbol = '',
}: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)

  const maData = useMemo(() => {
    if (!showMA || data.length === 0) return []

    const ma: Array<{ timestamp: number; value: number }> = []
    for (let i = maLength - 1; i < data.length; i++) {
      const slice = data.slice(i - maLength + 1, i + 1)
      const avg = slice.reduce((sum, d) => sum + d.price, 0) / maLength
      ma.push({ timestamp: data[i].timestamp, value: avg })
    }
    return ma
  }, [data, showMA, maLength])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width,
          height: showVolume ? 520 : 400,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [showVolume])

  useEffect(() => {
    if (!svgRef.current || !data.length || !dimensions.width) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 60, bottom: showVolume ? 120 : 40, left: 60 }
    const width = dimensions.width - margin.left - margin.right
    const volumeHeight = showVolume ? 80 : 0
    const height = dimensions.height - margin.top - margin.bottom
    const priceHeight = height - volumeHeight - (showVolume ? 20 : 0)

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
        d3.min(data, d => d.low ?? d.price)! * 0.995,
        d3.max(data, d => d.high ?? d.price)! * 1.005,
      ])
      .range([priceHeight, 0])

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => {
        const date = d as Date
        if (timeframe === '1H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '24H') return d3.timeFormat('%H:%M')(date)
        if (timeframe === '7D') return d3.timeFormat('%m/%d')(date)
        return d3.timeFormat('%m/%d')(date)
      })

    const yPriceAxis = d3.axisRight(yPriceScale).ticks(6).tickFormat(d => `$${d3.format('.4f')(d as number)}`)

    g.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
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

    const area = d3
      .area<ChartDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(priceHeight)
      .y1(d => yPriceScale(d.price))
      .curve(d3.curveMonotoneX)

    const line = d3
      .line<ChartDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yPriceScale(d.price))
      .curve(d3.curveMonotoneX)

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'price-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'oklch(0.75 0.15 195)')
      .attr('stop-opacity', 0.3)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'oklch(0.75 0.15 195)')
      .attr('stop-opacity', 0)

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#price-gradient)')
      .attr('d', area)

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.75 0.15 195)')
      .attr('stroke-width', 2)
      .attr('d', line)

    if (showMA && maData.length > 0) {
      const maLine = d3
        .line<{ timestamp: number; value: number }>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yPriceScale(d.value))
        .curve(d3.curveMonotoneX)

      g.append('path')
        .datum(maData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.65 0.18 150)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('d', maLine)
    }

    if (showVolume) {
      const volumeG = g
        .append('g')
        .attr('transform', `translate(0,${priceHeight + 20})`)

      const yVolumeScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.volume)!])
        .range([volumeHeight, 0])

      data.forEach((d, i) => {
        const isBullish = i === 0 ? true : d.price >= data[i - 1].price

        volumeG
          .append('rect')
          .attr('x', xScale(new Date(d.timestamp)) - 2)
          .attr('y', yVolumeScale(d.volume))
          .attr('width', 4)
          .attr('height', volumeHeight - yVolumeScale(d.volume))
          .attr('fill', isBullish ? 'oklch(0.65 0.18 150 / 0.3)' : 'oklch(0.60 0.22 25 / 0.3)')
          .attr('rx', 1)
      })
    }

    const focus = g
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none')

    focus
      .append('circle')
      .attr('r', 4)
      .attr('fill', 'oklch(0.75 0.15 195)')
      .attr('stroke', 'oklch(0.12 0.01 285)')
      .attr('stroke-width', 2)

    focus
      .append('line')
      .attr('class', 'crosshair-x')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .style('stroke', 'oklch(0.75 0.15 195 / 0.5)')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '2,2')

    const bisect = d3.bisector<ChartDataPoint, Date>((d) => new Date(d.timestamp)).left

    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        focus.style('display', null)
      })
      .on('mouseout', () => {
        focus.style('display', 'none')
        setHoveredPoint(null)
      })
      .on('mousemove', function(event) {
        const [xPos] = d3.pointer(event, this)
        const x0 = xScale.invert(xPos)
        const i = bisect(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        
        if (!d0 || !d1) return
        
        const d = x0.getTime() - new Date(d0.timestamp).getTime() > new Date(d1.timestamp).getTime() - x0.getTime() ? d1 : d0

        focus.attr('transform', `translate(${xScale(new Date(d.timestamp))},${yPriceScale(d.price)})`)
        setHoveredPoint(d)
      })
  }, [data, dimensions, showVolume, showMA, maData, timeframe])

  const firstPrice = data[0]?.price ?? 0
  const lastPrice = data[data.length - 1]?.price ?? 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              {hoveredPoint ? 'Price at point' : 'Current Price'}
            </div>
            <div className="text-2xl font-bold data-font">
              ${hoveredPoint ? hoveredPoint.price.toFixed(4) : lastPrice.toFixed(4)}
            </div>
            {hoveredPoint && (
              <div className="text-xs text-muted-foreground data-font">
                {new Date(hoveredPoint.timestamp).toLocaleString()}
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

      {showVolume && hoveredPoint && (
        <div className="text-xs text-muted-foreground data-font">
          Volume: ${hoveredPoint.volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
      )}
    </div>
  )
}
