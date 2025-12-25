import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Token, Alert, UserRole, RpcEndpoint, ApiKey } from '@/lib/types'
import { generateMockTokens, updateTokenPrices, mockRpcEndpoints } from '@/lib/mockData'
import { useAlertMonitor } from '@/hooks/useAlertMonitor'
import { UserDashboard } from '@/components/panels/UserDashboard'
import { AdminPanel } from '@/components/panels/AdminPanel'
import { DeveloperPanel } from '@/components/panels/DeveloperPanel'
import { CreateAlertDialog } from '@/components/CreateAlertDialog'
import { TokenDetailDialog } from '@/components/TokenDetailDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lightning, User, ShieldCheck, Code, Bell } from '@phosphor-icons/react'

function App() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [watchlist, setWatchlist] = useKV<string[]>('watchlist', [])
  const [alerts, setAlerts] = useKV<Alert[]>('alerts', [])
  const [apiKeys, setApiKeys] = useKV<ApiKey[]>('api-keys', [])
  const [userRole, setUserRole] = useKV<UserRole>('user-role', 'user')
  const [rpcEndpoints, setRpcEndpoints] = useState<RpcEndpoint[]>(mockRpcEndpoints)
  
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const safeWatchlist = watchlist ?? []
  const safeAlerts = alerts ?? []
  const safeApiKeys = apiKeys ?? []

  useEffect(() => {
    setTokens(generateMockTokens())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => updateTokenPrices(prev))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTokens(prev => updateTokenPrices(prev))
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('Prices updated')
    }, 500)
  }

  const handleToggleWatchlist = (tokenId: string) => {
    setWatchlist(current => {
      const currentList = current ?? []
      const set = new Set(currentList)
      if (set.has(tokenId)) {
        set.delete(tokenId)
        toast.success('Removed from watchlist')
      } else {
        set.add(tokenId)
        toast.success('Added to watchlist')
      }
      return Array.from(set)
    })
  }

  const handleCreateAlert = (token: Token) => {
    setSelectedToken(token)
    setAlertDialogOpen(true)
  }

  const handleSaveAlert = (alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    setAlerts(current => [...(current ?? []), newAlert])
    toast.success('Alert created successfully')
  }

  const handleToggleAlert = (alertId: string) => {
    setAlerts(current =>
      (current ?? []).map(a => a.id === alertId ? { ...a, isActive: !a.isActive } : a)
    )
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(current => (current ?? []).filter(a => a.id !== alertId))
    toast.success('Alert deleted')
  }

  const handleAlertTriggered = (alertId: string, triggeredAt: number) => {
    setAlerts(current =>
      (current ?? []).map(a => 
        a.id === alertId ? { ...a, triggeredAt, isActive: false } : a
      )
    )
  }

  const handleViewDetails = (token: Token) => {
    setSelectedToken(token)
    setDetailDialogOpen(true)
  }

  const handleToggleRpcEndpoint = (id: string) => {
    setRpcEndpoints(prev =>
      prev.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e)
    )
    toast.success('RPC endpoint updated')
  }

  const handleCreateApiKey = (name: string) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name,
      key: `jsk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: Date.now(),
      requestCount: 0,
    }
    setApiKeys(current => [...(current ?? []), newKey])
  }

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(current => (current ?? []).filter(k => k.id !== id))
    toast.success('API key deleted')
  }

  const watchlistSet = new Set(safeWatchlist)
  const activeAlertCount = safeAlerts.filter(a => a.isActive).length

  useAlertMonitor({
    tokens,
    alerts: safeAlerts,
    onAlertTriggered: handleAlertTriggered,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Lightning size={32} weight="fill" className="text-accent" />
                <h1 className="text-2xl font-bold glow-text">Jupiter Scan</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Beta
              </Badge>
              {activeAlertCount > 0 && (
                <Badge variant="outline" className="hidden sm:inline-flex border-accent/50 text-accent">
                  <Bell size={14} weight="fill" className="mr-1 animate-pulse" />
                  {activeAlertCount} Alert{activeAlertCount > 1 ? 's' : ''} Active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <Lightning size={16} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>

              <Select value={userRole ?? 'user'} onValueChange={(value) => setUserRole(value as UserRole)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="developer">
                    <div className="flex items-center gap-2">
                      <Code size={16} />
                      Developer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8">
        {userRole === 'user' && (
          <UserDashboard
            tokens={tokens}
            watchlist={watchlistSet}
            alerts={safeAlerts}
            onToggleWatchlist={handleToggleWatchlist}
            onCreateAlert={handleCreateAlert}
            onViewDetails={handleViewDetails}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
          />
        )}

        {userRole === 'admin' && (
          <AdminPanel
            rpcEndpoints={rpcEndpoints}
            onToggleEndpoint={handleToggleRpcEndpoint}
          />
        )}

        {userRole === 'developer' && (
          <DeveloperPanel
            apiKeys={safeApiKeys}
            onCreateApiKey={handleCreateApiKey}
            onDeleteApiKey={handleDeleteApiKey}
          />
        )}
      </main>

      <CreateAlertDialog
        token={selectedToken}
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        onCreateAlert={handleSaveAlert}
      />

      <TokenDetailDialog
        token={selectedToken}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onCreateAlert={handleCreateAlert}
        isWatched={selectedToken ? watchlistSet.has(selectedToken.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <Toaster position="top-right" theme="dark" richColors />
    </div>
  )
}

export default App