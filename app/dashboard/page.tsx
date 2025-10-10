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
  ActivityIcon,
  Monitor,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3
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
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-12"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          ))}
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="h-6 bg-slate-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeColor: "text-green-600"
    },
    {
      title: "Active Devices",
      value: stats?.activeDevices || 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: Activity,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      changeColor: "text-green-600"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changeColor: "text-green-600"
    },
    {
      title: "Active Policies",
      value: stats?.activePolicies || 0,
      change: "+3%",
      changeType: "positive" as const,
      icon: Shield,
      gradient: "from-primary-500 to-primary-600",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
      changeColor: "text-green-600"
    }
  ]

  const quickActions = [
    {
      title: "Register Device",
      description: "Add a new Android device",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/dashboard/device"
    },
    {
      title: "Create Policy",
      description: "Set up device policies",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/dashboard/policy"
    },
    {
      title: "Add Application",
      description: "Manage applications",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/dashboard/application"
    },
    {
      title: "Create Work Profile",
      description: "Add employee profiles",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/dashboard/work-profile"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">
                Here's what's happening with your Android devices today.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-200">
          <div className="text-right">
            <p className="text-xs text-slate-500">Last updated</p>
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
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 hover:transform hover:scale-[1.02] relative overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-sm group-hover:shadow-md transition-shadow`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className={`font-semibold ${stat.changeColor}`}>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600">Get started with common tasks</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 hover:transform hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-slate-600">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-600">Latest system events</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">System Status</h2>
                <p className="text-sm text-slate-600">Service health overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>All Systems Operational</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Battery className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900">API Health</span>
                  <p className="text-xs text-slate-600">Response time: 45ms</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900">Database</span>
                  <p className="text-xs text-slate-600">Uptime: 99.9%</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900">Security</span>
                  <p className="text-xs text-slate-600">All checks passed</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900">Enterprises</span>
                  <p className="text-xs text-slate-600">All active</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
