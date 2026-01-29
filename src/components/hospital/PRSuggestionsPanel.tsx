import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  GitPullRequest, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Clock,
  Target,
  TrendUp,
  Bug,
  Sparkle,
  Books,
  Flask,
  Lightning
} from '@phosphor-icons/react'
import type { PRSuggestion } from '@/lib/hospitalTypes'

interface PRSuggestionsPanelProps {
  suggestions: PRSuggestion[] | undefined
  repoName: string
}

export function PRSuggestionsPanel({ suggestions, repoName }: PRSuggestionsPanelProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest size={20} />
            PR Suggestions
          </CardTitle>
          <CardDescription>
            AI-powered pull request recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No suggestions available. Generate PR suggestions to see recommendations.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryIcon = (category: PRSuggestion['category']) => {
    switch (category) {
      case 'bug-fix': return <Bug size={16} weight="fill" />
      case 'feature': return <Sparkle size={16} weight="fill" />
      case 'refactor': return <TrendUp size={16} weight="fill" />
      case 'documentation': return <Books size={16} weight="fill" />
      case 'testing': return <Flask size={16} weight="fill" />
      case 'performance': return <Lightning size={16} weight="fill" />
    }
  }

  const getPriorityIcon = (priority: PRSuggestion['priority']) => {
    switch (priority) {
      case 'high': return <ArrowUp size={16} weight="bold" className="text-destructive" />
      case 'medium': return <Minus size={16} weight="bold" className="text-yellow-500" />
      case 'low': return <ArrowDown size={16} weight="bold" className="text-muted-foreground" />
    }
  }

  const getEffortBadge = (effort: PRSuggestion['effort']) => {
    const colors = {
      small: 'bg-green-500/20 text-green-500 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      large: 'bg-orange-500/20 text-orange-500 border-orange-500/30'
    }
    return (
      <Badge variant="outline" className={colors[effort]}>
        <Clock size={12} className="mr-1" />
        {effort}
      </Badge>
    )
  }

  const getImpactBadge = (impact: PRSuggestion['impact']) => {
    const colors = {
      high: 'bg-accent/20 text-accent border-accent/30',
      medium: 'bg-primary/20 text-primary border-primary/30',
      low: 'bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30'
    }
    return (
      <Badge variant="outline" className={colors[impact]}>
        <Target size={12} className="mr-1" />
        {impact} impact
      </Badge>
    )
  }

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    const impactWeight = { high: 3, medium: 2, low: 1 }
    
    const aScore = priorityWeight[a.priority] * 2 + impactWeight[a.impact]
    const bScore = priorityWeight[b.priority] * 2 + impactWeight[b.impact]
    
    return bScore - aScore
  })

  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest size={20} />
          PR Suggestions
        </CardTitle>
        <CardDescription>
          {suggestions.length} AI-generated pull request recommendations for {repoName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sortedSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-border hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getCategoryIcon(suggestion.category)}
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {suggestion.title}
                        </CardTitle>
                      </div>
                    </div>
                    {getPriorityIcon(suggestion.priority)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {getCategoryIcon(suggestion.category)}
                      <span className="ml-1">{suggestion.category.replace('-', ' ')}</span>
                    </Badge>
                    {getEffortBadge(suggestion.effort)}
                    {getImpactBadge(suggestion.impact)}
                  </div>

                  {suggestion.files.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Files to modify:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.files.map((file, index) => (
                          <code 
                            key={index} 
                            className="text-xs px-2 py-1 rounded bg-muted font-mono"
                          >
                            {file}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 glow-border"
                  >
                    <GitPullRequest size={16} className="mr-2" />
                    Create Draft PR
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
