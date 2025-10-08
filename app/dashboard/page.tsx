"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { amapiService } from "@/services/amapi.service"
import { DashboardStats } from "@/types"
import { 
  Smartphone, 
  Users, 
  Shield, 
  Building2, 
  TrendingUp, 
  Activity,
  Battery,
  HardDrive,
  ActivityIcon
} from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await amapiService.getDashboardStats()
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-secondary-200">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Devices",
      value: stats?.totalDevices || 0,
      change: "+12%",
      changeType: "positive" as const,
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Active Devices",
      value: stats?.activeDevices || 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Active Policies",
      value: stats?.activePolicies || 0,
      change: "+3%",
      changeType: "positive" as const,
      icon: Shield,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-200"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Here's what's happening with your Android devices today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Last updated</p>
            <p className="text-sm font-semibold text-slate-700">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-semibold">{stat.change}</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
            <ActivityIcon name="Activity" size="20" className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {stats?.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-900">{activity.description}</p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">System Status</h2>
            <ActivityIcon name="Monitor" size="20" className="text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="w-5 h-5 text-green-500" />
                <span className="text-sm text-secondary-900">API Health</span>
              </div>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-secondary-900">Database</span>
              </div>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-secondary-900">Security</span>
              </div>
              <span className="text-sm font-medium text-green-600">Secure</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-secondary-900">Enterprises</span>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Smartphone className="w-8 h-8" />
            <span className="text-primary-100 text-sm">Devices</span>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">{stats?.totalDevices || 0}</p>
            <p className="text-primary-100 text-sm">Total managed devices</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-blue-100 text-sm">Users</span>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-blue-100 text-sm">Active users</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8" />
            <span className="text-purple-100 text-sm">Policies</span>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">{stats?.activePolicies || 0}</p>
            <p className="text-purple-100 text-sm">Active policies</p>
          </div>
        </div>
      </div>
    </div>
  )
}
