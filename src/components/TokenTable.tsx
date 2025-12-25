import { useState } from 'react'
import { Token } from '@/lib/types'
import { formatPrice, formatVolume, formatPercentage, formatAddress, formatTimeAgo, getChangeColor } from '@/lib/formatters'
import { Star, TrendUp, TrendDown, Bell, Eye } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TokenTableProps {
  tokens: Token[]
  watchlist: Set<string>
  onToggleWatchlist: (tokenId: string) => void
  onCreateAlert: (token: Token) => void
  onViewDetails: (token: Token) => void
}

type SortKey = 'symbol' | 'price' | 'priceChange24h' | 'volume24h' | 'marketCap'
type SortDirection = 'asc' | 'desc'

export function TokenTable({ tokens, watchlist, onToggleWatchlist, onCreateAlert, onViewDetails }: TokenTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('marketCap')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedTokens = [...tokens].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier
    }
    return ((aVal as number) - (bVal as number)) * modifier
  })

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left">
              <div className="w-6" />
            </th>
            <th 
              className="px-4 py-3 text-left cursor-pointer hover:text-accent transition-colors"
              onClick={() => handleSort('symbol')}
            >
              <div className="flex items-center gap-2">
                Token
                {sortKey === 'symbol' && (
                  sortDirection === 'desc' ? <TrendDown size={14} /> : <TrendUp size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right cursor-pointer hover:text-accent transition-colors"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center justify-end gap-2">
                Price
                {sortKey === 'price' && (
                  sortDirection === 'desc' ? <TrendDown size={14} /> : <TrendUp size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right cursor-pointer hover:text-accent transition-colors"
              onClick={() => handleSort('priceChange24h')}
            >
              <div className="flex items-center justify-end gap-2">
                24h Change
                {sortKey === 'priceChange24h' && (
                  sortDirection === 'desc' ? <TrendDown size={14} /> : <TrendUp size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right cursor-pointer hover:text-accent transition-colors"
              onClick={() => handleSort('volume24h')}
            >
              <div className="flex items-center justify-end gap-2">
                24h Volume
                {sortKey === 'volume24h' && (
                  sortDirection === 'desc' ? <TrendDown size={14} /> : <TrendUp size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right cursor-pointer hover:text-accent transition-colors"
              onClick={() => handleSort('marketCap')}
            >
              <div className="flex items-center justify-end gap-2">
                Market Cap
                {sortKey === 'marketCap' && (
                  sortDirection === 'desc' ? <TrendDown size={14} /> : <TrendUp size={14} />
                )}
              </div>
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token) => {
            const isWatched = watchlist.has(token.id)
            const changeColor = getChangeColor(token.priceChange24h)
            
            return (
              <tr 
                key={token.id} 
                className="border-b border-border hover:bg-card/50 hover:border-l-4 hover:border-l-accent hover:glow-border transition-all group cursor-pointer"
                onClick={() => onViewDetails(token)}
              >
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleWatchlist(token.id)
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={20} 
                      weight={isWatched ? 'fill' : 'regular'}
                      className={isWatched ? 'text-accent glow-blue' : 'text-muted-foreground hover:text-accent'}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">{token.symbol}</span>
                    <span className="text-sm text-muted-foreground">{token.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right data-font font-medium">
                  {formatPrice(token.price)}
                </td>
                <td className={`px-4 py-3 text-right data-font font-medium ${changeColor}`}>
                  <div className="flex items-center justify-end gap-1">
                    {token.priceChange24h > 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                    {formatPercentage(token.priceChange24h)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right data-font">
                  {formatVolume(token.volume24h)}
                </td>
                <td className="px-4 py-3 text-right data-font">
                  {formatVolume(token.marketCap)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCreateAlert(token)
                      }}
                      className="hover:glow-blue"
                    >
                      <Bell size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDetails(token)
                      }}
                      className="hover:glow-purple"
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
