import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Repository } from '@/lib/hospitalTypes'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  repoContext?: string
}

interface AIChatPanelProps {
  isOpen: boolean
}
export function AIChatPanel(
 

    }
  const [input, setInput] = useState('')
  con

    if (scrollAreaRef.cu
    }

    
    const userMessage: Message = {
      role: 'user',
      repoContext: selectedRepo,



      const currentRepo = reposi
      let contextInfo = ''
     
Repository Conte

- Language: ${currentRepo.language
- Code Quality: ${currentRepo

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      repoContext: selectedRepo,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const promptText = window.spark.llmPrompt`You are a repository health assistant. 
${currentRepo ? `\n\nRepository Context:\n- Name: ${currentRepo.name}\n- Health Score: ${currentRepo.healthScore}\n- Status: ${currentRepo.status}\n- Language: ${currentRepo.language}\n- Open PRs: ${currentRepo.metrics?.openPRs || 0}\n- Code Quality: ${currentRepo.metrics?.codeQuality || 0}\n- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}\n\n` : ''}User Question: ${input}

Provide a helpful, concise response about the repository or general repository health topics. If discussing specific metrics, reference the context provided.`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const assistantMessage: Message = {
      }
        role: 'assistant',
      setIsLoading(false)
        repoContext: selectedRepo,

      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    setIsLoadin
      setIsLoading(false)
     
  }

  const handleAnalyze = async () => {
    if (!selectedRepo) return

    const currentRepo = repositories.find(r => r.id === selectedRepo)
    if (!currentRepo) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Analyze ${currentRepo.name}`,
      repoContext: selectedRepo,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const promptText = window.spark.llmPrompt`You are a repository health analyst. Analyze this repository and provide key insights:

Repository: ${currentRepo.name}
- Health Score: ${currentRepo.healthScore}/100
- Status: ${currentRepo.status}
- Language: ${currentRepo.language}
- Open PRs: ${currentRepo.metrics?.openPRs || 0}
- Open Issues: ${currentRepo.metrics?.openIssues || 0}
- Code Quality: ${currentRepo.metrics?.codeQuality || 0}
- Test Coverage: ${currentRepo.metrics?.testCoverage || 0}%
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}

Provide:
1. Overall health assessment
2. Key concerns or issues
3. Specific recommendations for improvement

Keep the response concise and actionable.`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo,
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the repository. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
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
    <Card className="fixed top-4 right-4 w-[440px] h-[600px] z-50 flex flex-col shadow-2xl glow-accent">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent" />
                      repo.status === 'warning' ? 'bg-yellow-500
        </div>
               
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <Button
        </Button>
      </div>

      <div className="p-4 border-b border-border space-y-3">
        <Select value={selectedRepo} onValueChange={setSelectedRepo}>
          <SelectTrigger>
            <SelectValue placeholder="Select repository..." />
          </SelectTrigger>
          <SelectContent>
            {repositories.map(repo => (
              <SelectItem key={repo.id} value={repo.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      repo.status === 'critical' ? 'bg-destructive' : 
                      repo.status === 'warning' ? 'bg-yellow-500' : 
                      'bg-success'
                    }`}
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
            className="w-full"
            </div>
            disabled={isLoading}
           
            <Sparkle size={14} />
            Analyze Repository
          </Button>
        )}

                  <span cl
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <GitBranch size={12} />
            {repositories.find(r => r.id === selectedRepo)?.fullName}

        )}
          <I

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.map(message => (
            <div
            disabled={isLoadin
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            <
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle size={16} weight="fill" className="text-accent" />
                </div>
              )}

                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}

                <div className="text-sm whitespace-pre-wrap">{message.content}</div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={16} weight="fill" className="text-primary" />

              )}

          ))}

            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkle size={16} weight="fill" className="text-accent animate-pulse" />

              <div className="bg-muted rounded-lg p-3">

                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>

          )}

      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about repository health..."

            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}

          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}


            <PaperPlaneRight size={18} weight="fill" />

        </div>

    </Card>

}
