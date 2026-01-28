import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { X, PaperPlaneRight, Sparkle, User } fr
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, PaperPlaneRight, Sparkle, User } from '@phosphor-icons/react'
import { toast } from 'sonner'

  onClose: () => vo

  const [messages, setMessag
      id: '1',
      content: 'Hel
 

  const scrollAreaRef = useR
  useEffect(() =>
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
      handleSend()
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
     

    setMessages(prev => [...prev, userMessage])
    setInput('')
          </div>

         
      const prompt = spark.llmPrompt`You are the Repo-Doctor AI assistant, an expert in repository health, MERMEDA protocol, Healdec auto-healing strategies, and GitOps best practices.

User question: ${userMessage.content}

Provide a helpful, concise response focused on repository diagnostics, health monitoring, and auto-healing strategies.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
                  <div
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
       

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
                    </div>
                </div>
              
                <div class
                    <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />
                  <div classNa
       
                      <div className="w-2 h-2 roun
               
              )}
     
   

                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about repo
                classNam
              <But
     
   

            </div>

          
      </Card>
  )




























                    </div>


















                    </div>

                </div>

              



                    <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />









              )}







                onChange={(e) => setInput(e.target.value)}













            </div>





      </Card>

  )

