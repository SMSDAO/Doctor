import { Token, RpcEndpoint } from './types'

export const generateMockTokens = (): Token[] => {
  const tokens = [
    { symbol: 'SOL', name: 'Solana', address: 'So11111111111111111111111111111111111111112' },
    { symbol: 'USDC', name: 'USD Coin', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    { symbol: 'RAY', name: 'Raydium', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
    { symbol: 'SRM', name: 'Serum', address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt' },
    { symbol: 'ORCA', name: 'Orca', address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE' },
    { symbol: 'MNGO', name: 'Mango', address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac' },
    { symbol: 'COPE', name: 'Cope', address: '8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh' },
    { symbol: 'STEP', name: 'Step Finance', address: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT' },
    { symbol: 'FIDA', name: 'Bonfida', address: 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp' },
    { symbol: 'MEDIA', name: 'Media Network', address: 'ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs' },
    { symbol: 'ROPE', name: 'Rope', address: '8PMHT4swUMtBzgHnh5U564N5sjPSiUz2cjEQzFnnP1Fo' },
    { symbol: 'MER', name: 'Mercurial', address: 'MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K' },
    { symbol: 'TULIP', name: 'Tulip Protocol', address: 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs' },
    { symbol: 'SAMO', name: 'Samoyedcoin', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
    { symbol: 'PORT', name: 'Port Finance', address: 'PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y' },
  ]

  return tokens.map((token, index) => ({
    id: token.address,
    ...token,
    price: Math.random() * 100 + 0.01,
    priceChange24h: (Math.random() - 0.5) * 30,
    volume24h: Math.random() * 10000000 + 100000,
    marketCap: Math.random() * 1000000000 + 1000000,
    liquidity: Math.random() * 50000000 + 500000,
    holders: Math.floor(Math.random() * 100000) + 1000,
    lastUpdated: Date.now() - Math.floor(Math.random() * 60000),
  }))
}

export const generatePriceHistory = (currentPrice: number, days: number = 7): Array<{ timestamp: number; price: number; volume: number }> => {
  const history: Array<{ timestamp: number; price: number; volume: number }> = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  for (let i = days; i >= 0; i--) {
    const volatility = 0.05
    const change = (Math.random() - 0.5) * volatility
    const price = currentPrice * (1 + change * i / days)
    
    history.push({
      timestamp: now - (i * dayMs),
      price: price,
      volume: Math.random() * 1000000 + 100000,
    })
  }
  
  return history
}

export const mockRpcEndpoints: RpcEndpoint[] = [
  {
    id: '1',
    name: 'Mainnet Beta (Primary)',
    url: 'https://api.mainnet-beta.solana.com',
    isActive: true,
    responseTime: 145,
    successRate: 99.8,
  },
  {
    id: '2',
    name: 'QuickNode',
    url: 'https://example.solana-mainnet.quiknode.pro',
    isActive: true,
    responseTime: 89,
    successRate: 99.9,
  },
  {
    id: '3',
    name: 'Ankr',
    url: 'https://rpc.ankr.com/solana',
    isActive: false,
    responseTime: 210,
    successRate: 97.5,
  },
]

export const updateTokenPrices = (tokens: Token[]): Token[] => {
  return tokens.map(token => ({
    ...token,
    price: token.price * (1 + (Math.random() - 0.5) * 0.01),
    priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 0.5,
    volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.05),
    lastUpdated: Date.now(),
  }))
}
