import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/butto
import { Badge } from '@/components/ui/badge'
import { X, PaperPlaneRight, Sparkle, User 
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
  const scrollAreaRef
 

  }, [messages])
  const handleSend = async () => {

      id: Date
      content: input.tri
    }
    setMessages(prev => [...
    se
    




        id: (Date.n
        content: response,
      }
     
      toast.erro

    }


      handleSend()
      id: Date.now().toString(),
  if (!isOpen) retu
  return (
      <div className="flex i
    }

        <Button
          varian
    setIsLoading(true)

    try {
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>

              key={message.id}

                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">

              <div

                    : 'bg-card border bor
        id: (Date.now() + 1).toString(),
              </div>
                <div class
                </div>
      }

              <div className="flex-shrink-0 w-8 h-8 ro
              </div>
      toast.error('Failed to get AI response. Please try again.')
      console.error('AI chat error:', error)
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

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col shadow-2xl glow-accent border-accent/20">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent" />
          <h3 className="font-semibold">Repo-Doctor AI</h3>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkle size={16} weight="fill" className="text-accent" />


              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={16} weight="fill" className="text-primary" />



          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about repo health..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <PaperPlaneRight size={20} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>

}
