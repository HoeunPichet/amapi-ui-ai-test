"use client"

import { useEffect, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Enterprise } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Building2, Plus, Users } from "lucide-react"
import { Button } from "@/ui/button"

export default function EnterprisesPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await amapiService.getEnterprises({ page: 1, limit: 20 })
      if (res.success && res.data) setEnterprises(res.data.data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Enterprises</h1>
          <p className="text-secondary-600 mt-1">Registered organizations and usage</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Enterprise
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-secondary-200 animate-pulse h-40" />
          ))}
        </div>
      ) : enterprises.length === 0 ? (
        <div className="text-center p-12 bg-white border border-secondary-200 rounded-xl">
          <Building2 className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
          <p className="text-secondary-600">No enterprises found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enterprises.map((e) => (
            <div key={e.id} className="bg-white rounded-xl p-6 border border-secondary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-900">{e.name}</p>
                  <p className="text-sm text-secondary-600">{e.domain}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-secondary-700">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> Users: {e.userCount}
                </span>
                <span>Devices: {e.deviceCount}</span>
                <span className="uppercase">{e.subscription}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

