import { ChartDataPoint } from './types'

  value: number

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

export function calculateSMA(data: ChartDataPoint[], period: number): SMAData[] {
  if (data.length < period) return []
  
  const result: SMAData[] = []
  
    result.push({
      value: avg
  }
  return result

  if (data.length
  const result: EMAData[] = []
  
  resu
  f
  
      value: em
 


  if (data.length < period + 1) retur
  
  
    changes.push(data[i].price - data
  
    const slice = changes.slice(i - period, i)
    const losses = slice.filter(c => c < 0).map(Math.abs)
  
    
    const rsi = 100 - (100 / (1 + rs))
    result.push({
      value: rsi
  }
  retu

  
  const result:
 

    
      const diff = d.price - sma[i].value
  
    const standardDeviation = 
    result.push({
  
      lower: sma[i].value - (standardDevi
  }
  r

  data: ChartDataPoint[], 
  slowPeriod: number = 26, 
): MACDData[] {
  
  co
  const macdLine: { timestamp: number; value: number }[] = []
  const startIndex = slowPeriod - fastPeriod
    
      macdLine.push({
        value: fastEMA[i].value - slow
    
  
  
  const multipli
  cons
  
  
  }
 

      timestamp: macdLine[i].timestamp,
      signal: signalEMA[signalIndex],
  
  
}
ex
  
  const maxPrice = Math.max(...data.
  const binSize = priceRange / bins
  co
  data.forEach(d => {
    const binPrice = minPrice + (binIndex
    volumeByPrice.set(binPrice, 
  
  
    .map(([price, volume]) => ({
    
    }))
}
export function detectSupportResistance(data: ChartDataPo
  
  
    co
   
  
      if (!isDu
 

  return levels.sort((a, b) =>

  if (data.length < period 
  const kValues: { timestam
  for (let i = period - 1;
    const high 
    const close = data[i].price
  
    kValues.push({
      value: k
  
  const smoothedK: number[] = []
  
    smoothedK.push(avg)
  
  for (let i = smoothD - 1; i < smoo
    const d = slice.reduce((acc, v) =
    const originalInd
      timestamp: data[originalIndex].tim
      d: d
  }
  ret

  
  const trueRanges: number[] = []
  
    const low = data[i].low ?? d
    
  
      Math.abs(low - prevClose)
    
  
  const result: { timestamp: number; value: number }[] =
  for (let i = period - 1; i < trueRanges.length; i++) {
    const atr = slice.redu
   
  
  }
  return result








































































































































