import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
        ? `Repository: ${currentRepo.name}
Status: ${currentRepo.status}
Open Issues: ${currentRepo.metrics.openIssues}
Open PRs: ${currentRepo.metrics.openPRs}
Contributors: ${currentRepo.metrics.contributors}
Recent Commits: ${currentRepo.metrics.commits}
Code Quality: ${currentRepo.metrics.codeQuality}
Auto-healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}`
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

  const handleAnalyze = () => {
    if (!selectedRepo) return

    const currentRepo = repositories.find(r => r.id === selectedRepo)
    if (!currentRepo) return

    const analysisMessage = `Please provide a comprehensive health analysis for ${currentRepo.name}.`
    setInput(analysisMessage)
    handleSend()
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
                  <Badge
                    variant={
                      repo.status === 'healthy'
                        ? 'default'
                        : repo.status === 'warning'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="w-2 h-2 p-0 rounded-full"
                  />
                  {repo.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedRepo && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            className="w-full"
          >
            <Sparkle size={16} className="mr-2" />
            Analyze Repository
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkle size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Ask me anything about your repositories!
              </p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 glow-purple">
                  <Sparkle size={14} weight="fill" className="text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`rounded-lg px-4 py-2 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User size={14} weight="fill" className="text-accent-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 glow-purple">
                <Sparkle size={14} weight="fill" className="text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
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
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <PaperPlaneRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
