import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'

  id: string
  content: string
}

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
      scrollAr
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
        role: 'assistant',
     


      toast.error('Failed to get A
      const errorMessage: Message = {

        timestamp: Date.now(),
      setMessages(prev => [...pr
      setIsLoading(
  }
  const handleKeyPress = (e:
     



    <div className="fi

         
            <Badge variant="outline" className="ml-2 border-accent/50 text-accent text-xs">

        
            size="icon"
            className="h-8 w-8"
            <X size={18} />
        </CardHeader>
        <CardContent className="p-0 flex flex-col" style={{ height

          >

                  key={message.id}

                    <div className="flex-shrink-0 w-8 h-8 rou

                  
                    className={`max-w-[8
                        ? 
                    }`}
                    <p classNa
       

                  {message.role === 'user' && (
                     
                  )}
              ))}
      
                  <div className="fle
                  </div>
                    <div c
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animatio
                    </div>
       
            </div>

            <div classNam
     
   

              />
                onClick={handleSend}
                size="ic
              >
     
   

        </CardContent>

}








































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
