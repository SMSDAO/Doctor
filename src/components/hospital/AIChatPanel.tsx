import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui
import { X, Sparkle, User, PaperPlaneRight, G
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import { toast } from 'sonner'
  SelectItem,
  Select

  llmPrompt: (st
}
interface Messag
  role: 'user'
  timestamp: number

declare const spark: {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
  llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
 

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  repoContext?: string
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  repositories?: Repository[]
}

export default function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Repo-Doctor AI. I can help you analyze repository health, suggest improvements, and answer questions about your codebase. How can I assist you today?',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) return null

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
${currentRepo.metrics ? `- Commits: ${currentRepo.metrics.commits}
- Open
- Test Coverage: ${cur
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'D

      const repoSummary = re

` : 'No repositories currently loaded.'

${contextInfo}

Previous conversation:




       

        repoContext: currentRepo?.fullName

    } catch (error) {
      toast.error('Failed to get response from AI')
      setIsLoad
  }
  con
   

    const repo = repositories.find(r => r.id === selectedRepo)

    setTimeout(() => han

    i
   

  return (
      <div className="flex items-center justify-between p-4 border-b border-border">
          <Sparkle size={20} weight="fill" className="text-accent glow-blue" />
          {repositories.length > 0 && (
              {repositories.length} repos
          )}
        <Butto
          size=
          className="h-8 
          <X size={18
      </div>
      {repositories.length > 
         
            <Select value
                <
            

                      <GitBranch size={14} />
                      <Badge 
                        className="ml-
                
                    </div>
                ))}
            <
              size="sm"
              disabled={!selectedRepo || isLoading}
            >
            </Button>
          {selec
              <Git
                {repositories.find(r => r.id === selected
              <Badge 
                className="text-xs"
                {repositories.fi
            </div>
        </div>

        <div classNa
            <div
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              {message.role === 'assistant' && (
                  <Spa
              )}
                {m
             
                  </div>
                <div
                    message.role === 'user'
                      : 'bg-muted'
                >
                </div>
              {message.role === 'user' && (
                  <User size={16} weight="fill" className="text-primary" />
              )}
          ))}
            <div class
                <Spa
              <div
            
              
              </div

      </ScrollArea>
      <div className="p-4 border-t b
          <Input
            value={input}
            onKeyDown={ha
            className="flex-1"
          <Button
            disabled={!input.tri
            className="glow-ac
            
        </div>
    </Card>
}









