import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, PaperPlaneRight, Sparkle, User } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the Repo-Doctor AI assistant. I can help you with repository diagnostics, health checks, MERMEDA protocol questions, and Healdec strategies. How can I assist you today?',
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const prompt = spark.llmPrompt`You are the Repo-Doctor AI assistant, an expert in repository health, MERMEDA protocol, Healdec auto-healing strategies, and GitOps best practices.

User question: ${userMessage.content}

Provide a helpful, concise response focused on repository diagnostics, health monitoring, and auto-healing strategies.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[90vh] max-h-[800px] flex flex-col glow-border border-accent/30">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
          <div className="flex items-center gap-2">
            <Sparkle size={24} weight="fill" className="text-accent" />
            <CardTitle className="text-xl">AI Assistant</CardTitle>
            <Badge variant="outline" className="ml-2 border-accent/50 text-accent text-xs">
              Repo-Doctor
            </Badge>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            size="icon"
            className="h-8 w-8"
          >
            <X size={18} />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div ref={scrollAreaRef} className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                      <Sparkle size={16} weight="fill" className="text-accent" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground glow-purple'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <User size={16} weight="fill" className="text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                    <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about repos, MERMEDA, Healdec..."
                disabled={isLoading}
                className="flex-1 glow-border"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="glow-accent shrink-0"
              >
                <PaperPlaneRight size={18} weight="fill" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
