"use client"

import { useEffect, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Policy } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Shield, Plus, Search, Edit, Trash2 } from "lucide-react"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await amapiService.getPolicies({ page: 1, limit: 10, search: searchTerm || undefined })
      if (res.success && res.data) setPolicies(res.data.data)
      setLoading(false)
    }
    load()
  }, [searchTerm])

  const handleDelete = async (id: string) => {
    const res = await amapiService.deletePolicy(id)
    if (res.success) {
      toast({ title: "Policy deleted", description: "Policy removed successfully", variant: "success" })
      setPolicies(prev => prev.filter(p => p.id !== id))
    } else {
      toast({ title: "Error", description: res.error || "Failed to delete policy", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Policies</h1>
          <p className="text-secondary-600 mt-1">Create and manage device policies</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Policy
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
        <Input placeholder="Search policies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-secondary-200 animate-pulse h-36" />
          ))
        ) : policies.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white border border-secondary-200 rounded-xl">
            <Shield className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-secondary-600">No policies found.</p>
          </div>
        ) : (
          policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-xl p-6 border border-secondary-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">{policy.name}</h3>
                  <p className="text-sm text-secondary-600 mt-1 line-clamp-2">{policy.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${policy.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary-100 text-secondary-800 border-secondary-200'}`}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50" onClick={() => handleDelete(policy.id)}>
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

