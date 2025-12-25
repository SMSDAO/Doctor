const audioContext = typeof window !== 'undefined' ? new AudioContext() : null

export type NotificationSoundType = 'success' | 'alert' | 'warning' | 'critical'

export function playNotificationSound(type: NotificationSoundType = 'alert') {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  const now = audioContext.currentTime
  
  switch (type) {
    case 'success':
      oscillator.frequency.setValueAtTime(800, now)
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1)
      gainNode.gain.setValueAtTime(0.3, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      oscillator.start(now)
      oscillator.stop(now + 0.2)
      break
      
    case 'alert':
      oscillator.frequency.setValueAtTime(600, now)
      oscillator.frequency.setValueAtTime(900, now + 0.1)
      oscillator.frequency.setValueAtTime(600, now + 0.2)
      gainNode.gain.setValueAtTime(0.3, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      oscillator.start(now)
      oscillator.stop(now + 0.3)
      break
      
    case 'warning':
      oscillator.frequency.setValueAtTime(700, now)
      oscillator.frequency.setValueAtTime(500, now + 0.15)
      gainNode.gain.setValueAtTime(0.3, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      oscillator.start(now)
      oscillator.stop(now + 0.3)
      break
      
    case 'critical':
      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain)
        gain.connect(audioContext.destination)
        
        const startTime = now + (i * 0.2)
        osc.frequency.setValueAtTime(400, startTime)
        osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.1)
        gain.gain.setValueAtTime(0.4, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
        osc.start(startTime)
        osc.stop(startTime + 0.15)
      }
      return
  }
}

export function playCustomTone(frequency: number, duration: number = 0.2) {
  if (!audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  const now = audioContext.currentTime
  
  oscillator.frequency.setValueAtTime(frequency, now)
  gainNode.gain.setValueAtTime(0.3, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)
  
  oscillator.start(now)
  oscillator.stop(now + duration)
}
