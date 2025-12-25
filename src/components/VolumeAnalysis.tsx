import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { ChartDataPoint } from '@/lib/types'
import { calculateVolumeProfile } from '@/lib/technicalIndicators'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartBar } from '@phosphor-icons/react'

interface VolumeAnalysisProps {
  data: ChartDataPoint[]
  tokenSymbol?: string
}

export function VolumeAnalysis({ data, tokenSymbol = '' }: VolumeAnalysisProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const volumeProfile = useMemo(() => calculateVolumeProfile(data, 15), [data])
  
  const totalVolume = useMemo(() => data.reduce((sum, d) => sum + d.volume, 0), [data])
  const avgVolume = useMemo(() => totalVolume / data.length, [totalVolume, data.length])
  const maxVolume = useMemo(() => Math.max(...data.map(d => d.volume)), [data])
  
  const highVolumePoints = useMemo(() => {
    return data.filter(d => d.volume > avgVolume * 1.5).length
  }, [data, avgVolume])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width,
          height: 400,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !volumeProfile.length || !dimensions.width) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 80, bottom: 40, left: 80 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(volumeProfile, d => d.volume)!])
      .range([0, width])

    const yScale = d3
      .scaleBand()
      .domain(volumeProfile.map(d => d.price.toFixed(4)))
      .range([0, height])
      .padding(0.1)

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => `${d3.format('.2s')(d as number)}`)

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(yScale.domain().filter((_, i) => i % 2 === 0))
      .tickFormat(d => `$${d}`)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    g.append('g')
      .call(yAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .style('fill', 'oklch(0.55 0.02 290)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')

    g.selectAll('.axis path, .axis line')
      .style('stroke', 'oklch(0.25 0.04 290)')

    const maxPercentage = d3.max(volumeProfile, d => d.percentage)!

    volumeProfile.forEach(d => {
      const color = d3.interpolateRgb('oklch(0.65 0.20 240)', 'oklch(0.50 0.25 285)')(d.percentage / maxPercentage)
      
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(d.price.toFixed(4))!)
        .attr('width', xScale(d.volume))
        .attr('height', yScale.bandwidth())
        .attr('fill', color)
        .attr('opacity', 0.7)
        .on('mouseenter', function() {
          d3.select(this)
            .attr('opacity', 1)
            .style('filter', 'drop-shadow(0 0 6px currentColor)')
        })
        .on('mouseleave', function() {
          d3.select(this).attr('opacity', 0.7).style('filter', 'none')
        })
        .append('title')
        .text(`Price: $${d.price.toFixed(4)}\nVolume: ${d.volume.toLocaleString()}\n${d.percentage.toFixed(2)}% of total`)
    })

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .attr('text-anchor', 'middle')
      .style('fill', 'oklch(0.65 0.02 290)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Volume')

    g.append('text')
      .attr('x', -height / 2)
      .attr('y', -60)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'oklch(0.65 0.02 290)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Price Level')
  }, [volumeProfile, dimensions])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar size={24} />
          Volume Profile Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Volume</div>
            <div className="text-xl font-bold data-font text-accent">
              ${totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Avg Volume</div>
            <div className="text-xl font-bold data-font text-accent">
              ${avgVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Max Volume</div>
            <div className="text-xl font-bold data-font text-accent">
              ${maxVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">High Volume Bars</div>
            <div className="text-xl font-bold data-font text-accent">
              {highVolumePoints}
            </div>
          </div>
        </div>

        <div ref={containerRef} className="relative bg-card border border-border rounded-lg p-4 glow-border">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full" />
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="font-semibold text-accent mb-2">Volume Profile Interpretation</div>
          <div className="space-y-2 text-muted-foreground text-xs">
            <p>• Horizontal bars show volume traded at each price level</p>
            <p>• Longer bars indicate higher trading activity at those prices</p>
            <p>• High-volume nodes often act as support/resistance</p>
            <p>• Color intensity represents volume concentration</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
