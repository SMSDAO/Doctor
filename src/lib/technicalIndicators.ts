import { ChartDataPoint } from './types'

export interface RSIData {
  timestamp: number
  value: number
}

export interface BollingerBands {
  timestamp: number
  upper: number
  middle: number
  lower: number
}

export interface MACDData {
  timestamp: number
  macd: number
  signal: number
  histogram: number
}

export interface EMAData {
  timestamp: number
  value: number
}

export interface SMAData {
  timestamp: number
  value: number
}

export interface VolumeProfile {
  price: number
  volume: number
  percentage: number
}

export interface StochasticData {
  timestamp: number
  k: number
  d: number
}

export interface ATRData {
  timestamp: number
  value: number
}

export function calculateSMA(data: ChartDataPoint[], period: number): SMAData[] {
  if (data.length < period) return []
  
  const result: SMAData[] = []
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const avg = slice.reduce((sum, d) => sum + d.price, 0) / period
    
    result.push({
      timestamp: data[i].timestamp,
      value: avg
    })
  }
  
  return result
}

export function calculateEMA(data: ChartDataPoint[], period: number): EMAData[] {
  if (data.length < period) return []
  
  const result: EMAData[] = []
  const multiplier = 2 / (period + 1)
  
  let ema = data.slice(0, period).reduce((sum, d) => sum + d.price, 0) / period
  
  result.push({
    timestamp: data[period - 1].timestamp,
    value: ema
  })
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i].price - ema) * multiplier + ema
    result.push({
      timestamp: data[i].timestamp,
      value: ema
    })
  }
  
  return result
}

export function calculateRSI(data: ChartDataPoint[], period: number = 14): RSIData[] {
  if (data.length < period + 1) return []
  
  const changes: number[] = []
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].price - data[i - 1].price)
  }
  
  const result: RSIData[] = []
  
  for (let i = period; i < changes.length; i++) {
    const slice = changes.slice(i - period, i)
    const gains = slice.filter(c => c > 0)
    const losses = slice.filter(c => c < 0).map(Math.abs)
    
    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    
    result.push({
      timestamp: data[i].timestamp,
      value: rsi
    })
  }
  
  return result
}

export function calculateBollingerBands(data: ChartDataPoint[], period: number = 20, stdDev: number = 2): BollingerBands[] {
  const sma = calculateSMA(data, period)
  if (sma.length === 0) return []
  
  const result: BollingerBands[] = []
  
  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1
    const slice = data.slice(dataIndex - period + 1, dataIndex + 1)
    
    const variance = slice.reduce((sum, d) => {
      const diff = d.price - sma[i].value
      return sum + diff * diff
    }, 0) / period
    
    const standardDeviation = Math.sqrt(variance)
    
    result.push({
      timestamp: sma[i].timestamp,
      upper: sma[i].value + (standardDeviation * stdDev),
      middle: sma[i].value,
      lower: sma[i].value - (standardDeviation * stdDev)
    })
  }
  
  return result
}

export function calculateMACD(
  data: ChartDataPoint[], 
  fastPeriod: number = 12, 
  slowPeriod: number = 26, 
  signalPeriod: number = 9
): MACDData[] {
  const fastEMA = calculateEMA(data, fastPeriod)
  const slowEMA = calculateEMA(data, slowPeriod)
  
  if (fastEMA.length === 0 || slowEMA.length === 0) return []
  
  const macdLine: { timestamp: number; value: number }[] = []
  const startIndex = slowPeriod - fastPeriod
  
  for (let i = startIndex; i < fastEMA.length; i++) {
    const slowIndex = i - startIndex
    if (slowIndex < slowEMA.length) {
      macdLine.push({
        timestamp: fastEMA[i].timestamp,
        value: fastEMA[i].value - slowEMA[slowIndex].value
      })
    }
  }
  
  if (macdLine.length < signalPeriod) return []
  
  const multiplier = 2 / (signalPeriod + 1)
  const signalEMA: number[] = []
  
  let signal = macdLine.slice(0, signalPeriod).reduce((sum, d) => sum + d.value, 0) / signalPeriod
  signalEMA.push(signal)
  
  for (let i = signalPeriod; i < macdLine.length; i++) {
    signal = (macdLine[i].value - signal) * multiplier + signal
    signalEMA.push(signal)
  }
  
  const result: MACDData[] = []
  for (let i = 0; i < signalEMA.length; i++) {
    const macdIndex = i + signalPeriod - 1
    result.push({
      timestamp: macdLine[macdIndex].timestamp,
      macd: macdLine[macdIndex].value,
      signal: signalEMA[i],
      histogram: macdLine[macdIndex].value - signalEMA[i]
    })
  }
  
  return result
}

export function calculateVolumeProfile(data: ChartDataPoint[], bins: number = 20): VolumeProfile[] {
  if (data.length === 0) return []
  
  const minPrice = Math.min(...data.map(d => d.price))
  const maxPrice = Math.max(...data.map(d => d.price))
  const priceRange = maxPrice - minPrice
  const binSize = priceRange / bins
  
  const volumeByPrice = new Map<number, number>()
  
  data.forEach(d => {
    const binIndex = Math.floor((d.price - minPrice) / binSize)
    const binPrice = minPrice + (binIndex * binSize) + (binSize / 2)
    volumeByPrice.set(binPrice, (volumeByPrice.get(binPrice) || 0) + (d.volume || 0))
  })
  
  const totalVolume = Array.from(volumeByPrice.values()).reduce((a, b) => a + b, 0)
  
  return Array.from(volumeByPrice.entries())
    .map(([price, volume]) => ({
      price,
      volume,
      percentage: (volume / totalVolume) * 100
    }))
    .sort((a, b) => a.price - b.price)
}

export function detectSupportResistance(data: ChartDataPoint[], threshold: number = 0.02): number[] {
  if (data.length < 3) return []
  
  const levels: number[] = []
  
  for (let i = 1; i < data.length - 1; i++) {
    const current = data[i].price
    const prev = data[i - 1].price
    const next = data[i + 1].price
    
    if ((current > prev && current > next) || (current < prev && current < next)) {
      const isDuplicate = levels.some(level => Math.abs(level - current) / current < threshold)
      
      if (!isDuplicate) {
        levels.push(current)
      }
    }
  }
  
  return levels.sort((a, b) => b - a)
}

export function calculateStochastic(data: ChartDataPoint[], period: number = 14, smoothK: number = 3, smoothD: number = 3): StochasticData[] {
  if (data.length < period + smoothK + smoothD) return []
  
  const kValues: { timestamp: number; value: number }[] = []
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const high = Math.max(...slice.map(d => d.high ?? d.price))
    const low = Math.min(...slice.map(d => d.low ?? d.price))
    const close = data[i].price
    
    const k = low === high ? 50 : ((close - low) / (high - low)) * 100
    
    kValues.push({
      timestamp: data[i].timestamp,
      value: k
    })
  }
  
  const smoothedK: number[] = []
  for (let i = smoothK - 1; i < kValues.length; i++) {
    const slice = kValues.slice(i - smoothK + 1, i + 1)
    const avg = slice.reduce((acc, v) => acc + v.value, 0) / smoothK
    smoothedK.push(avg)
  }
  
  const result: StochasticData[] = []
  for (let i = smoothD - 1; i < smoothedK.length; i++) {
    const slice = smoothedK.slice(i - smoothD + 1, i + 1)
    const d = slice.reduce((acc, v) => acc + v, 0) / smoothD
    const originalIndex = i + period + smoothK - 2
    
    result.push({
      timestamp: data[originalIndex].timestamp,
      k: smoothedK[i],
      d: d
    })
  }
  
  return result
}

export function calculateATR(data: ChartDataPoint[], period: number = 14): ATRData[] {
  if (data.length < period + 1) return []
  
  const trueRanges: number[] = []
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high ?? data[i].price
    const low = data[i].low ?? data[i].price
    const prevClose = data[i - 1].price
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )
    
    trueRanges.push(tr)
  }
  
  const result: ATRData[] = []
  for (let i = period - 1; i < trueRanges.length; i++) {
    const slice = trueRanges.slice(i - period + 1, i + 1)
    const atr = slice.reduce((acc, v) => acc + v, 0) / period
    
    result.push({
      timestamp: data[i + 1].timestamp,
      value: atr
    })
  }
  
  return result
}
