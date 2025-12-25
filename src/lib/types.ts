export interface Token {
  id: string
  symbol: string
  name: string
  address: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  liquidity: number
  holders: number
  lastUpdated: number
}

export interface Alert {
  id: string
  tokenId: string
  tokenSymbol: string
  condition: 'above' | 'below' | 'change_up' | 'change_down' | 'volume_spike'
  threshold: number
  isActive: boolean
  createdAt: number
  triggeredAt?: number
}

export interface PriceHistory {
  timestamp: number
  price: number
  volume: number
}

export interface ChartDataPoint {
  timestamp: number
  price: number
  volume: number
  high?: number
  low?: number
  open?: number
  close?: number
}

export type ChartTimeframe = '1H' | '24H' | '7D' | '30D' | '90D' | '1Y'

export interface ChartConfig {
  timeframe: ChartTimeframe
  showVolume: boolean
  showMA: boolean
  maLength: number
}

export type UserRole = 'user' | 'admin' | 'developer'

export interface RpcEndpoint {
  id: string
  name: string
  url: string
  isActive: boolean
  responseTime: number
  successRate: number
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: number
  lastUsed?: number
  requestCount: number
}
