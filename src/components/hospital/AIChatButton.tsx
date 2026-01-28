import { Button } from '@/components/ui/button'
import { ChatCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface AIChatButtonProps {
  onClick: () => void
}

export function AIChatButton({ onClick }: AIChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        size="lg"
        onClick={onClick}
        className="h-14 w-14 rounded-full shadow-2xl glow-accent hover:scale-110 transition-transform"
      >
        <ChatCircle size={24} weight="fill" />
      </Button>
      <Badge
        variant="default"
        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs border-2 border-background animate-pulse"
      >
        AI
      </Badge>
    </div>
  )
}
