import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatVolume } from '@/lib/formatters'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  isLoading?: boolean
}

export function MetricCard({ title, value, change, icon, isLoading }: MetricCardProps) {
  const hasPositiveChange = change !== undefined && change > 0
  const hasNegativeChange = change !== undefined && change < 0

  return (
    <Card className="overflow-hidden relative glow-border hover:glow-blue transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {icon && <span className="text-accent glow-blue">{icon}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-end justify-between">
          <motion.div 
            className="text-3xl font-bold data-font"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
          >
            {isLoading ? (
              <div className="h-9 w-32 bg-muted animate-pulse rounded glow-purple" />
            ) : (
              value
            )}
          </motion.div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium data-font ${
              hasPositiveChange ? 'text-success' : hasNegativeChange ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {hasPositiveChange && <TrendUp size={16} />}
              {hasNegativeChange && <TrendDown size={16} />}
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
