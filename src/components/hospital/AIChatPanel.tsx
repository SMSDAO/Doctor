import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, Sel
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Sparkle, User, PaperPlaneRight } from '
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { X, Sparkle, User, PaperPlaneRight } from '@phosphor-icons/react'
import { Repository } from '@/lib/hospitalTypes'

  repositories: Rep

  const [messages, setMessag
  const [isLoadin
 

      scrollAreaRef.current.
  }, [messages])
  const handleSend = 
  repositories: Repository[]
}

export function AIChatPanel({ isOpen, onClose, repositories }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)

    try {
      const currentRepo = repositories.find(r => r.id === selectedRepo)
      const repoContext = currentRepo

Repository: ${currentRepo.name}
      const assistantMessage: Message = 
Status: ${currentRepo.status}
Language: ${currentRepo.language}
Open Issues: ${currentRepo.metrics.openIssues}
Open PRs: ${currentRepo.metrics.openPRs}
Contributors: ${currentRepo.metrics.contributors}
Recent Commits: ${currentRepo.metrics.commits}
Code Quality: ${currentRepo.metrics.codeQuality}
        content: 'Sorry, I encountered an error. Pl
Auto-healing: ${currentRepo.autoHealing ? 'Enabled' : 'Disabled'}
 
        : 'General repository health consultation'

      const prompt = (window as any).spark.llmPrompt`You are a repository health expert assistant. 

Context: ${repoContext}

Previous conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

User question: ${userMessage.content}

Provide helpful, specific advice about repository health, code quality, and best practices. If a specific repository is selected, tailor your response to that repository's metrics and status.`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),

        content: response,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
            <h3 className="font-semibold">AI
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
   

              <SelectItem key={repo.i
    if (!selectedRepo) return

    const currentRepo = repositories.find(r => r.id === selectedRepo)
                        ? 'd

    const analysisMessage = `Please provide a comprehensive health analysis for ${currentRepo.name}.`
    setInput(analysisMessage)

    setTimeout(() => {
                </
    }, 100)
   

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
          variant="outli
      handleSend()
     
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-purple">
            <Sparkle size={16} weight="fill" className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">AI Repository Assistant</h3>
                <div className="w-8 h-8 rounded-full bg-p
              Powered by GPT-4
            </p>
          </div>
              
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
            

      <div className="p-4 border-b border-border space-y-3">
        <Select value={selectedRepo} onValueChange={setSelectedRepo}>
          <SelectTrigger>
            <SelectValue placeholder="Select a repository" />
          {isLoading && (
          <SelectContent>
            {repositories.map(repo => (
              <SelectItem key={repo.id} value={repo.id}>








































































































