import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Token, Alert } from '@/lib/types'
import { formatPrice } from '@/lib/formatters'
import { SpeakerHigh } from '@phosphor-icons/react'
import { playNotificationSound } from '@/lib/audioNotifications'

interface CreateAlertDialogProps {
  token: Token | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void
}

export function CreateAlertDialog({ token, open, onOpenChange, onCreateAlert }: CreateAlertDialogProps) {
  const [condition, setCondition] = useState<Alert['condition']>('above')
  const [threshold, setThreshold] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !threshold) return

    const thresholdNum = parseFloat(threshold)
    if (isNaN(thresholdNum)) return

    onCreateAlert({
      tokenId: token.id,
      tokenSymbol: token.symbol,
      condition,
      threshold: thresholdNum,
      isActive: true,
      soundEnabled,
    })

    setThreshold('')
    setCondition('above')
    setSoundEnabled(true)
    onOpenChange(false)
  }

  const handleTestSound = () => {
    playNotificationSound('alert')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            {token && `Set up an alert for ${token.symbol} (${token.name})`}
          </DialogDescription>
        </DialogHeader>
        
        {token && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Price</Label>
              <div className="text-2xl font-bold data-font text-accent">
                {formatPrice(token.price)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={(value) => setCondition(value as Alert['condition'])}>
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price goes above</SelectItem>
                  <SelectItem value="below">Price goes below</SelectItem>
                  <SelectItem value="change_up">% increase exceeds</SelectItem>
                  <SelectItem value="change_down">% decrease exceeds</SelectItem>
                  <SelectItem value="volume_spike">Volume spike above</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">
                Threshold {condition.includes('change') ? '(%)' : '($)'}
              </Label>
              <Input
                id="threshold"
                type="number"
                step="any"
                placeholder={condition.includes('change') ? '10' : formatPrice(token.price)}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <SpeakerHigh size={20} className="text-accent" />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="sound-enabled" className="cursor-pointer">
                    Sound Notification
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Play sound when alert triggers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleTestSound}
                  className="h-8"
                >
                  Test
                </Button>
                <Switch
                  id="sound-enabled"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Alert</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
