import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/butto
import { Select, SelectContent, SelectItem, Sel
import { X, Sparkle, User, PaperPlaneRight, G

  id: string
  content: string
}

  onClose: () => vo
}
export function AIChatPanel(
    {
      role: 'assistant
 

  const [selectedRepo, setSe

    if (scrollAreaRef
    }


    if (!input.trim()) return
    const userMessage: Message = {
     
      repoCont

    setInput('')

    
        ? `\n\nRepository Context:\n- Na

      const response = await window.spark.llm(promptText, 'gpt
      const assistantMessage: Message = {

        repoContext

    } catch (error) {
     
        content:

      setIsLoading(false)

  const handleKeyPress = (e: React
      e.preventDefault()


    if (!selectedRepo) return
    const currentRe

      id: Date.now().toString()
     

    setMessages(prev => [...prev, userMessage])

      const promptText

- Health 
- Language: ${currentRepo.language}
- Open PRs: ${currentRepo.metrics?.op
- Code Quality: ${currentRepo.metrics?.codeQuality || 0}
- Auto-Heali

2. Key concerns or issues



        id: (Date.now() + 1).toString(),
        content: response,
      }
      setMessages(prev => 
      setMessages(prev => [...pre
       

    } finally {
    }

    <Card className="fixed top-4 right-4
        <div className="fl
          <h3 className="font-semibold">AI Health Assistant</h3>
        <Button
         
          class
          <X size={18} />
     
   

            </SelectTrigger>
              {repositories.map(repo => (
                  <div c
                  
     
   

              ))}
          </Select>

            onClick={handleAnalyze}
          >

        {selectedRepo && (
            <GitBranch size={12}
              {repo
          </div>
      </div>
     

              key={message.id}
            >

         
              <div

                   
              >
              </div>
                <div className=
                </div>
            </div>
          {isLoading && (
              <div className="w-8 h-8 rounded-full bg-acc
              </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground roun

            </div>
        </div>

        <div className="flex gap-2
            value={input}
            onKeyPress={hand

          />

            size="icon"
          >
          </Button>
      </div>
  )












































































































































