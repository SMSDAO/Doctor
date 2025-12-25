import { useEffect, useRef } from 'react'
import { Token, Alert } from '@/lib/types'
import { playNotificationSound } from '@/lib/audioNotifications'
import { toast } from 'sonner'
import { formatPrice, formatPercentage } from '@/lib/formatters'

interface AlertMonitorProps {
  tokens: Token[]
  alerts: Alert[]
  onAlertTriggered: (alertId: string, triggeredAt: number) => void
}

interface TokenPriceHistory {
  [tokenId: string]: {
    price: number
    volume: number
    timestamp: number
  }
}

export function useAlertMonitor({ tokens, alerts, onAlertTriggered }: AlertMonitorProps) {
  const priceHistoryRef = useRef<TokenPriceHistory>({})
  const triggeredAlertsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const activeAlerts = alerts.filter(alert => alert.isActive)
    if (activeAlerts.length === 0) return

    tokens.forEach(token => {
      const previousData = priceHistoryRef.current[token.id]
      
      priceHistoryRef.current[token.id] = {
        price: token.price,
        volume: token.volume24h,
        timestamp: token.lastUpdated,
      }

      if (!previousData) return

      const tokenAlerts = activeAlerts.filter(alert => alert.tokenId === token.id)
      
      tokenAlerts.forEach(alert => {
        if (triggeredAlertsRef.current.has(alert.id)) return

        let shouldTrigger = false
        let message = ''
        let soundType: 'alert' | 'warning' | 'critical' = 'alert'

        switch (alert.condition) {
          case 'above':
            if (token.price > alert.threshold && previousData.price <= alert.threshold) {
              shouldTrigger = true
              message = `${alert.tokenSymbol} price crossed above ${formatPrice(alert.threshold)}`
              soundType = 'alert'
            }
            break

          case 'below':
            if (token.price < alert.threshold && previousData.price >= alert.threshold) {
              shouldTrigger = true
              message = `${alert.tokenSymbol} price dropped below ${formatPrice(alert.threshold)}`
              soundType = 'warning'
            }
            break

          case 'change_up':
            const changeUp = ((token.price - previousData.price) / previousData.price) * 100
            if (changeUp >= alert.threshold) {
              shouldTrigger = true
              message = `${alert.tokenSymbol} increased by ${formatPercentage(changeUp)}`
              soundType = 'alert'
            }
            break

          case 'change_down':
            const changeDown = ((previousData.price - token.price) / previousData.price) * 100
            if (changeDown >= alert.threshold) {
              shouldTrigger = true
              message = `${alert.tokenSymbol} decreased by ${formatPercentage(-changeDown)}`
              soundType = 'critical'
            }
            break

          case 'volume_spike':
            const volumeRatio = token.volume24h / previousData.volume
            if (volumeRatio >= alert.threshold) {
              shouldTrigger = true
              message = `${alert.tokenSymbol} volume spike detected (${volumeRatio.toFixed(1)}x)`
              soundType = 'warning'
            }
            break
        }

        if (shouldTrigger) {
          triggeredAlertsRef.current.add(alert.id)
          
          if (alert.soundEnabled !== false) {
            playNotificationSound(soundType)
          }
          
          toast.success('Price Alert Triggered!', {
            description: message,
            duration: 8000,
          })
          
          onAlertTriggered(alert.id, Date.now())

          setTimeout(() => {
            triggeredAlertsRef.current.delete(alert.id)
          }, 60000)
        }
      })
    })
  }, [tokens, alerts, onAlertTriggered])

  return null
}
