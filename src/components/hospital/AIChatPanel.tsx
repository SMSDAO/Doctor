/// <reference path="../../vite-end.d.ts" />
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/but
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
}
interface AIChatPanelProps {

}
export defau
    {
      role: 'assi
    }
}


    if (scrollAre
    }

    if (!input.trim()) return

    const userMessage: Message = {
  const [messages, setMessages] = useState<Message[]>([
      role: 'user',
      id: '1',
      repoContext: selectedRepo
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const contextInfo = currentRepo
        ? `
Repository: ${currentRepo.fullName}
Health Score: ${currentRepo.healthScore}
Status: ${currentRepo.status}
Open Issues: ${currentRepo.openIssues || 0}
Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
Language: ${currentRepo.language}
`
        : 'No repository selected.'

      const conversationHistory = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      
      const prompt = spark.llmPrompt`You are AlgoBrainDoctor AI, an expert in repository health monitoring and code quality analysis. 

Context:
    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const contextInfo = currentRepo
        ? `
Repository: ${currentRepo.fullName}
Health Score: ${currentRepo.healthScore}
Status: ${currentRepo.status}
Open Issues: ${currentRepo.openIssues || 0}
Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
Language: ${currentRepo.language}
`
        : 'No repository selected.'

      const conversationHistory = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      
      const prompt = spark.llmPrompt`You are AlgoBrainDoctor AI, an expert in repository health monitoring and code quality analysis. 

Context:
    if (e.key 

    }
${conversationHistory}

User question: ${input}

Provide helpful, concise advice about repository health, code quality, or suggest actions. Keep responses under 150 words.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        <div className="flex items-cente
    }
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
      </div>
      console.error('AI chat error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-96 flex flex-col shadow-2xl z-50 bg-card/95 backdrop-blur-sm glow-border border-primary/20">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-accent" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </div>

      <div className="p-3 border-b border-border space-y-2">
        <div className="flex gap-2">
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map(repo => (
                <SelectItem key={repo.id} value={repo.id}>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={repo.status === 'healthy' ? 'default' : repo.status === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {repo.status}
                    </Badge>
                    {repo.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={!selectedRepo}
          >
            Analyze
          </Button>
        </div>
        {selectedRepo && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitBranch size={12} />
            <span className="truncate">
              {repositories.find(r => r.id === selectedRepo)?.fullName}
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle size={16} weight="fill" className="text-accent" />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={16} weight="fill" className="text-primary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkle size={16} weight="fill" className="text-accent" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about repository health..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          size="sm"
        >
          <PaperPlaneRight size={16} weight="fill" />
        </Button>
      </div>
    </Card>
  )
}
