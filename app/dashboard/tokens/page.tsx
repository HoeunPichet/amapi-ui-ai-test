"use client"

import { useEffect, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Token } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Key, Plus, Search, Eye, EyeOff, Trash2 } from "lucide-react"

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await amapiService.getTokens({ page: 1, limit: 20, search: searchTerm || undefined })
      if (res.success && res.data) setTokens(res.data.data)
      setLoading(false)
    }
    load()
  }, [searchTerm])

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast({ title: "Copied", description: "Token copied to clipboard", variant: "success" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Tokens</h1>
          <p className="text-secondary-600 mt-1">Manage API and service tokens</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Token
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
        <Input placeholder="Search tokens..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-secondary-200 animate-pulse h-24" />
          ))
        ) : tokens.length === 0 ? (
          <div className="text-center p-12 bg-white border border-secondary-200 rounded-xl">
            <Key className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-secondary-600">No tokens found.</p>
          </div>
        ) : (
          tokens.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-6 border border-secondary-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-secondary-500">{t.name}</p>
                <p className="font-mono text-secondary-900 truncate">
                  {showSecret[t.id] ? t.token : `${t.token.slice(0, 8)}••••••••••••••••`}
                </p>
                <p className="text-xs text-secondary-500 mt-1">{t.type.toUpperCase()} • {t.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSecret(prev => ({ ...prev, [t.id]: !prev[t.id] }))}>
                  {showSecret[t.id] ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" /> Show
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCopy(t.token)}>Copy</Button>
                <Button variant="ghost" size="sm" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

