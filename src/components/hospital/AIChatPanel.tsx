import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, PaperPlaneRight, Sparkle, User } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  content: s
}
interface AIChatP
  onClose: () => vo


      id: '1',
      content: 'H
    }
 

  useEffect(() => {
      scrollAreaRef.current.scrollTop = scrollAreaRef.c
  }, 
  const handle

      id: Date.now().toString(),
      content: input.trim()
    }
    
    setIsLoading(true)
    try {
      const response = await spark.llm(prompt)

        role: 'assi
        timestamp: Date.now()

    }
      console.er

  }
  const handleKeyPress = (e: 

    }


    <Card className="fixed b
        <div className="fle
     

    setMessages((prev) => [...prev, userMessage])
    setInput('')


         
      const prompt = spark.llmPrompt`You are a helpful repository health assistant. Answer this question about repository health and code quality: ${userMessage.content}`
      const response = await spark.llm(prompt)

      const assistantMessage: Message = {
              >
        role: 'assistant',
        content: response,
        timestamp: Date.now()
       

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
                <div className="flex gap-1">
                  <div className="w-2 h-2 ro
               
            </div>
     


            value={input}
            onKeyDown={handleKeyPress}
            disabled={is
          />
     
   

        </div>

}
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col shadow-2xl z-50">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent" />
          <h3 className="font-semibold">Repo-Doctor AI</h3>
        </div>
        <Button











































































