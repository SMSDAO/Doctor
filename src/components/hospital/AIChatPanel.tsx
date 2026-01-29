import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import type { Repository } from '@/lib/hospitalTypes'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  repoContext?: string
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  repositories: Repository[]
}

export function AIChatPanel({ isOpen, onClose, repositories }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI repository health assistant. Select a repository to analyze or ask me questions about repository health, best practices, and optimization strategies.'
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
      content: input,
      repoContext: selectedRepo
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const contextInfo = currentRepo
        ? `\n\nRepository Context:\n- Name: ${currentRepo.fullName}\n- Health Score: ${currentRepo.healthScore}\n- Status: ${currentRepo.status}\n- Language: ${currentRepo.language}\n- Open Issues: ${currentRepo.metrics?.openIssues || 0}\n- Contributors: ${currentRepo.metrics?.contributors || 0}\n`
        : ''

      const promptText = `You are a repository health assistant. Answer the following question about software development and repository management.${contextInfo}\n\nUser question: ${input}`
      const response = await window.spark.llm(promptText, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        repoContext: selectedRepo
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAnalyze = async () => {
    if (!selectedRepo) return

    const currentRepo = repositories.find(r => r.id === selectedRepo)
    if (!currentRepo) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Analyze this repository',
      repoContext: selectedRepo
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const promptText = `Analyze the following repository and provide a comprehensive health assessment:

Repository Details:
- Name: ${currentRepo.fullName}
- Health Score: ${currentRepo.healthScore}
- Status: ${currentRepo.status}
- Language: ${currentRepo.language}
- Open Issues: ${currentRepo.metrics?.openIssues || 0}
- Open PRs: ${currentRepo.metrics?.openPRs || 0}
- Contributors: ${currentRepo.metrics?.contributors || 0}
- Code Quality: ${currentRepo.metrics?.codeQuality || 0}
- Test Coverage: ${currentRepo.metrics?.testCoverage || 0}%
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}

Provide a comprehensive health analysis with:
1. Current status assessment
2. Key concerns or issues
3. Recommendations for improvement
4. Auto-healing suggestions if applicable
5. Priority actions to take`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the repository. Please try again.',
        repoContext: selectedRepo
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="fixed top-4 right-4 w-96 h-[600px] flex flex-col shadow-2xl border-2 border-accent/20 z-50 glow-accent">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent" />
          <h3 className="font-semibold">AI Health Assistant</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X size={18} />
        </Button>
      </div>
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex gap-2">
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map(repo => (
                <SelectItem key={repo.id} value={repo.id}>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className="text-xs"
                      variant={repo.status === 'healthy' ? 'default' : repo.status === 'warning' ? 'secondary' : 'destructive'}
                    >
                      {repo.status}
                    </Badge>
                    {repo.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            disabled={!selectedRepo || isLoading}
            onClick={handleAnalyze}
            className="glow-accent"
          >
            Analyze
          </Button>
        </div>
        {selectedRepo && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitBranch size={12} />
            <span className="truncate">
              {repositories.find(r => r.id === selectedRepo)?.fullName}
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle size={16} weight="fill" className="text-accent" />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                <Sparkle size={16} weight="fill" className="text-accent" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about repository health..."
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
