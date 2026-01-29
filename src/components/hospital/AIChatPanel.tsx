import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/but
import { X, Sparkle, User, PaperPlaneRight, Git
import { ScrollArea } from '@/components/ui/scroll-area'

  id: string
  content: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  repoContext?: string
 

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  repositories: Repository[]
}

export function AIChatPanel({ isOpen, onClose, repositories }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
    const userMessage: Message = {
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
     
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return


      }
    } finally {
    }

    i


      id: Date.n
      content: `Analyz

    setMe

      const promptText = `You are a repository health analyst. Analyze this repository 
Repository: ${currentRepo.name}

- Open PRs: ${currentRepo.metrics?.openPRs || 0}

- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
Provid
2. Key concerns or issues
        id: (Date.now() + 1).toString(),

        content: response,
        id: (Date.now() + 1).toStr
      }
      
      setMessages(prev => [...prev, assistantMessage])
      const errorMess
        role: 'assistant',
      }
    } finally {
    }

    if (e.key === 'Enter' && !e.shiftKey) {
    } finally {
  }
    }
  r

          <Sparkle size={20} weight="
        </div>

          onClick={onClose}
        >


        <Select value={selectedR
            <Select
          <SelectContent>
              <SelectItem key={r
     

                      'bg-success'
                  />

         
        </Select>

            variant="outline"
            className="w-full"
            disabled={isLoading
            <Sparkle size={14} />
          </Button>

          <div className="text-xs text-muted-foreground 
            {repositories.find(r => r.id === selectedRepo)?
        )}

        
            <div
              className={
              {message.role === 'assistant'

              )}

                  message.role === 'user'
      
              >
              </div>
              {message.rol
                  <User si
              )}
       
      
              <div className="w-8 h-8 rounded-full bg-
              </div>
                <div className="flex 
                  <span className="w-2 h
                </div>
            </div>
       

        <div cl
            placeholder="
     
   

            disabled={isLoading || !input.trim()}
          >
          </Button>
      </div>
  )









          <h3 className="font-semibold">AI Health Assistant</h3>

        <Button





          <X size={18} />































            onClick={handleAnalyze}

          >





        {selectedRepo && (



          </div>

      </div>





              key={message.id}

            >






              <div





              >

              </div>




                </div>

            </div>


          {isLoading && (



              </div>

                <div className="flex gap-1">





            </div>

        </div>






            value={input}



          />



            size="icon"
          >

          </Button>

      </div>

  )

