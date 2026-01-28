import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { GithubLogo, SignOut, CheckCircle, XCircle } from '@phosphor-icons/react'

interface GitHubUser {
  login: string
  avatarUrl: string
  email?: string
  isOwner: boolean
}

interface GitHubConnectProps {
  onUserChange: (user: GitHubUser | null) => void
}

export function GitHubConnect({ onUserChange }: GitHubConnectProps) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const sparkUser = await (window as any).spark.user()
      
      if (sparkUser && sparkUser.login) {
        const userData: GitHubUser = {
          login: sparkUser.login,
          avatarUrl: sparkUser.avatarUrl,
          email: sparkUser.email,
          isOwner: sparkUser.isOwner,
        }
        setUser(userData)
        onUserChange(userData)
      } else {
        setUser(null)
        onUserChange(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      onUserChange(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6 glow-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-3 bg-muted rounded animate-pulse w-48" />
          </div>
        </div>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="p-6 glow-border bg-card/50 backdrop-blur">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center glow-purple">
            <GithubLogo size={32} weight="fill" className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Connect GitHub</h3>
            <p className="text-sm text-muted-foreground">
              This app uses your GitHub account to scan your repositories
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <XCircle size={14} className="text-destructive" />
            Not connected
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 glow-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-accent/50 glow-blue">
            <AvatarImage src={user.avatarUrl} alt={user.login} />
            <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{user.login}</p>
              {user.isOwner && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 glow-purple">
                  Owner
                </Badge>
              )}
            </div>
            {user.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle size={14} weight="fill" />
            Connected
          </div>
        </div>
      </div>
    </Card>
  )
}
