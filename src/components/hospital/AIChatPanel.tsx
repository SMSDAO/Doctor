import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Repository } from '@/lib/hospitalTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

declare const spark: {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
  llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
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
      content: 'Hello! I\'m Repo-Doctor AI. I can help you analyze repository health, suggest improvements, and answer questions about your codebase. Select a repository to analyze or ask me anything!',
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

    const currentRepo = repositories.find(r => r.id === selectedRepo)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      repoContext: currentRepo?.fullName
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let contextInfo = ''
      
      if (currentRepo) {
        contextInfo = `
Current Repository Being Analyzed: ${currentRepo.fullName}
- Health Score: ${currentRepo.healthScore}/100
- Status: ${currentRepo.status}
- Language: ${currentRepo.language}
- Description: ${currentRepo.description || 'No description'}
- Stars: ${currentRepo.stars}, Forks: ${currentRepo.forks}
- Open Issues: ${currentRepo.issues?.warning || currentRepo.openIssues || 0}
- Critical Issues: ${currentRepo.issues?.critical || 0}
${currentRepo.metrics ? `- Commits: ${currentRepo.metrics.commits}
- Contributors: ${currentRepo.metrics.contributors}
- Open PRs: ${currentRepo.metrics.openPRs}
- Code Quality: ${currentRepo.metrics.codeQuality}/100
- Test Coverage: ${currentRepo.metrics.testCoverage}%` : ''}
- Last Commit: ${new Date(currentRepo.lastCommit).toLocaleDateString()}
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
`
      }

      const repoSummary = repositories.length > 0 ? `
Available repositories (${repositories.length} total):
${repositories.slice(0, 10).map(r => `- ${r.fullName} (Health: ${r.healthScore}, Status: ${r.status})`).join('\n')}
${repositories.length > 10 ? `... and ${repositories.length - 10} more` : ''}
` : 'No repositories currently loaded.'

      const prompt = spark.llmPrompt`You are Repo-Doctor AI, an expert in repository health monitoring and code analysis. 

${contextInfo}

${repoSummary}
      
Previous conversation:
${messages.map(m => `${m.role}${m.repoContext ? ` [analyzing: ${m.repoContext}]` : ''}: ${m.content}`).join('\n')}

User${currentRepo ? ` [analyzing: ${currentRepo.fullName}]` : ''}: ${userMessage.content}

Provide a helpful, insightful response about repository health, code quality, or development best practices. If a specific repository is being analyzed, provide tailored recommendations based on its metrics and health score. Be concise but thorough.`

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
      console.error('Error sending message:', error)
      toast.error('Failed to get response from AI')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeRepo = () => {
    if (!selectedRepo) {
      toast.error('Please select a repository first')
      return
    }
    
    const repo = repositories.find(r => r.id === selectedRepo)
    if (!repo) return

    setInput(`Analyze the health of this repository and provide recommendations`)
    setTimeout(() => handleSend(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[450px] h-[700px] flex flex-col shadow-2xl z-50 glow-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent glow-blue" />
          <h3 className="font-semibold">Repo-Doctor AI</h3>
          {repositories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {repositories.length} repos
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X size={18} />
        </Button>
      </div>

      {repositories.length > 0 && (
        <div className="p-4 border-b border-border space-y-2 bg-muted/30">
          <label className="text-sm text-muted-foreground">Select Repository to Analyze</label>
          <div className="flex gap-2">
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a repository..." />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} />
                      <span className="truncate max-w-[280px]">{repo.fullName}</span>
                      <Badge 
                        variant={repo.status === 'healthy' ? 'default' : repo.status === 'warning' ? 'secondary' : 'destructive'}
                        className="ml-auto text-xs"
                      >
                        {repo.healthScore}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleAnalyzeRepo}
              disabled={!selectedRepo || isLoading}
              className="glow-accent"
            >
              Analyze
            </Button>
          </div>
          {selectedRepo && repositories.find(r => r.id === selectedRepo) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <GitBranch size={12} />
              <span className="truncate">
                {repositories.find(r => r.id === selectedRepo)?.fullName}
              </span>
              <Badge 
                variant={repositories.find(r => r.id === selectedRepo)?.status === 'healthy' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {repositories.find(r => r.id === selectedRepo)?.healthScore}
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
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 glow-blue">
                  <Sparkle size={16} weight="fill" className="text-accent" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                {message.repoContext && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground px-3">
                    <GitBranch size={10} />
                    <span className="truncate">{message.repoContext}</span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground glow-purple'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
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
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 glow-blue">
                <Sparkle size={16} weight="fill" className="text-accent" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder={selectedRepo ? "Ask about this repository..." : "Ask about repository health..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="glow-accent"
          >
            <PaperPlaneRight size={18} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
