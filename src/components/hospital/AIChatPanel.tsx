import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import { toast } from 'sonner'

declare const spark: {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
  llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
}

interface Repository {
  id: string
  fullName: string
  owner: string
  name: string
  status: string
  metrics?: {
    commits: number
    openIssues: number
    testCoverage: number
  }
  autoHealing?: boolean
}

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

export default function AIChatPanel({ isOpen, onClose, repositories = [] }: AIChatPanelProps) {
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
  const [selectedRepo, setSelectedRepo] = useState<string>('')
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
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      
      const contextInfo = currentRepo
        ? `Repository Context: ${currentRepo.fullName}
Status: ${currentRepo.status}
${currentRepo.metrics ? `- Commits: ${currentRepo.metrics.commits}
- Open Issues: ${currentRepo.metrics.openIssues}
- Test Coverage: ${currentRepo.metrics.testCoverage}%
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}` : ''}
`
        : 'No repositories currently loaded.'

      const conversationHistory = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')

      const prompt = spark.llmPrompt`You are Repo-Doctor AI, an expert in repository health analysis and code quality.

${contextInfo}

Previous conversation:
${conversationHistory}

User question: ${input.trim()}

Provide a helpful, concise response focused on repository health, code quality, and actionable recommendations.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        repoContext: currentRepo?.fullName
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast.error('Failed to get response from AI')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAnalyze = async () => {
    const repo = repositories.find(r => r.id === selectedRepo)
    if (!repo) return

    setInput(`Analyze the health of ${repo.fullName} and provide recommendations`)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-96 flex flex-col shadow-2xl glow-border z-50">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent glow-blue" />
          <span className="font-semibold">Repo-Doctor AI</span>
          {repositories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {repositories.length} repos
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X size={18} />
        </Button>
      </div>

      {repositories.length > 0 && (
        <div className="p-3 border-b border-border space-y-2">
          <div className="flex gap-2">
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} />
                      <span className="truncate">{repo.fullName}</span>
                      <Badge 
                        variant={repo.status === 'healthy' ? 'default' : 'destructive'}
                        className="ml-auto text-xs"
                      >
                        {repo.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={!selectedRepo || isLoading}
            >
              Analyze
            </Button>
          </div>
          {selectedRepo && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GitBranch size={12} />
              <span className="truncate">{repositories.find(r => r.id === selectedRepo)?.fullName}</span>
              <Badge 
                variant="outline"
                className="text-xs"
              >
                {repositories.find(r => r.id === selectedRepo)?.status}
              </Badge>
            </div>
          )}
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle size={16} weight="fill" className="text-accent" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[75%]">
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                {message.repoContext && (
                  <span className="text-xs text-muted-foreground px-1">
                    Context: {message.repoContext}
                  </span>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={16} weight="fill" className="text-primary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted text-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about repository health..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="glow-accent"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
