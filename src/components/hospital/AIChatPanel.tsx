import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkle, X, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import { spark } from '@github/spark'

interface Repository {
  id: string
  name: string
  status?: string
  autoHealing?: boolean
  metrics?: {
    openPRs?: number
  }
}

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
      repoContext: selectedRepo
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const promptText = spark.llmPrompt`You are a repository health analyst. Analyze this repository and provide insights.

Repository: ${currentRepo?.name || 'General'}
Open PRs: ${currentRepo?.metrics?.openPRs || 0}
Auto-Healing: ${currentRepo?.autoHealing ? 'Enabled' : 'Disabled'}
Status: ${currentRepo?.status || 'Unknown'}

User Question: ${input}

Provide a helpful, concise response with:
1. Key insights
2. Concerns or issues
3. Recommendations`

      const response = await spark.llm(promptText)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Analyze repository: ${currentRepo.name}`
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const promptText = spark.llmPrompt`You are a repository health analyst. Analyze this repository and provide insights.

Repository: ${currentRepo.name}
Open PRs: ${currentRepo.metrics?.openPRs || 0}
Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
Status: ${currentRepo.status}

Provide a comprehensive health analysis with:
1. Overall health assessment
2. Specific issues identified
3. Recommendations for improvement`

      const response = await spark.llm(promptText)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the repository. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkle size={20} weight="fill" className="text-primary" />
            <h3 className="font-semibold">AI Health Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="p-4 border-b border-border space-y-3">
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map(repo => (
                <SelectItem key={repo.id} value={repo.id}>
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} />
                    {repo.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            disabled={isLoading || !selectedRepo}
            onClick={handleAnalyze}
          >
            Analyze Repository
          </Button>

          {selectedRepo && (
            <div className="text-xs text-muted-foreground">
              Selected: {repositories.find(r => r.id === selectedRepo)?.name}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
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
                <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-lg">
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
    </div>
  )
}
