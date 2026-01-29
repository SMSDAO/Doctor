import { useState, useEffect, useRef } from 
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Sparkle, User, PaperPlaneRight, GitBranch } from '@phosphor-icons/react'
import type { Repository } from '@/lib/hospitalTypes'

interface Message {
  isOpen: bo
  role: 'user' | 'assistant'
}
  repoContext?: string
 

  if (!isOpen) return null
  const handleSen

      id: Date.now().toStrin
 

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    try {
      const contextInfo = currentRepo
Repository: ${currentRepo.fullName}
Status: ${currentRepo.status}

`



${contextInfo}






        content: response,
      }
      setMessages(p
      setMessages(pre
        role: 'assistant',
     

    }

    if (e.key === 'Ent

  }
  const handleAnalyze = async () => {

    if (!cu
    const userMessage: Message = {
      role: 'user',
      repoContext: selectedRe

    setInput('')

 
Repository Details:

- Open Issues: ${currentRepo.openIssues || 0}

Provide a comprehensive health analysis with:

4. Auto-
      const re

        role: 'assista
        repoContext: s

    } catch (error) {

        content: 'Sorry, I encountered an error analyzing the repository. Please try aga

      setIsLoading(false)

  return (
      <div className="flex items-center 
          <Sparkle size={2
        </div>
          variant="ghost"
       

      </div>
      <div className=
          <Select value={selectedRepo
              <SelectValue placeholder="
            <SelectContent
                <SelectItem key={repo.id} value={repo.id}>
                    <Badge 
         
               
                    {repo
     
   

            size="sm"
            disabled={!selectedRepo}
            Analyze
        </div>
     
   

        )}


            <div
              className={`fl

                  <Sparkle size={1
              )}
                cla
                    ? 'bg-primary text-primary-foreground'
                }`}
     

                  <User size={16} weight="fill"
              )}
          ))}

         
              <div className="px-3 py-2 rounded-lg bg-muted">

Repository Details:
- Name: ${currentRepo.fullName}
- Health Score: ${currentRepo.healthScore}
- Status: ${currentRepo.status}
- Open Issues: ${currentRepo.openIssues || 0}
- Auto-Healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
- Language: ${currentRepo.language}

Provide a comprehensive health analysis with:
1. Current status assessment
2. Key concerns or issues
3. Recommendations for improvement
4. Auto-healing suggestions if applicable`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        repoContext: selectedRepo
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the repository. Please try again.',
        repoContext: selectedRepo
      }])
    } finally {
      setIsLoading(false)
    }
  }

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





























