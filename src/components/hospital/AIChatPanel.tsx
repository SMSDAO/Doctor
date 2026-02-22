import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { X, Sparkle, User, PaperPlaneRight } from '@phosphor-icons/react'
import { Repository } from '@/lib/hospitalTypes'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  repositories: Repository[]
}

export function AIChatPanel({ isOpen, onClose, repositories }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const repoContext = currentRepo
        ? `
Repository: ${currentRepo.name}
Health Score: ${currentRepo.healthScore}
Status: ${currentRepo.status}
Language: ${currentRepo.language}
Open Issues: ${currentRepo.metrics?.openIssues || 0}
Open PRs: ${currentRepo.metrics?.openPRs || 0}
Contributors: ${currentRepo.metrics?.contributors || 0}
Recent Commits: ${currentRepo.metrics?.commits || 0}
Code Quality: ${currentRepo.metrics?.codeQuality || 0}
Test Coverage: ${currentRepo.metrics?.testCoverage || 0}%
Auto-healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
`
        : 'General repository health consultation'

      const prompt = (window as any).spark.llmPrompt`You are a repository health expert assistant. 

Context: ${repoContext}

Previous conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

User question: ${userMessage.content}

Provide helpful, specific advice about repository health, code quality, and best practices. If a specific repository is selected, tailor your response to that repository's metrics and status.`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedRepo) return

    const currentRepo = repositories.find(r => r.id === selectedRepo)
    if (!currentRepo) return

    const analysisMessage = `Please provide a comprehensive health analysis for ${currentRepo.name}.`
    setInput(analysisMessage)

    setTimeout(() => {
      handleSend()
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-purple">
            <Sparkle size={16} weight="fill" className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">AI Repository Assistant</h3>
            <p className="text-xs text-muted-foreground">
              Powered by GPT-4
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="p-4 border-b border-border space-y-3">
        <Select value={selectedRepo} onValueChange={setSelectedRepo}>
          <SelectTrigger>
            <SelectValue placeholder="Select a repository" />
          </SelectTrigger>
          <SelectContent>
            {repositories.map(repo => (
              <SelectItem key={repo.id} value={repo.id}>
                <div className="flex items-center gap-2">
                  <span>{repo.name}</span>
                  <Badge
                    variant={
                      repo.status === 'healthy'
                        ? 'default'
                        : repo.status === 'warning'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-xs"
                  >
                    {repo.healthScore}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAnalyze}
          disabled={!selectedRepo || isLoading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Analyze Repository
        </Button>

        {selectedRepo && (
          <div className="text-xs text-muted-foreground">
            Selected: {repositories.find(r => r.id === selectedRepo)?.name}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkle size={16} weight="fill" className="text-primary-foreground" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <User size={16} weight="fill" className="text-accent-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkle size={16} weight="fill" className="text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about repository health..."
          className="resize-none"
          rows={2}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          size="icon"
          disabled={isLoading || !input.trim()}
        >
          <PaperPlaneRight size={18} />
        </Button>
      </div>
    </div>
  )
}
