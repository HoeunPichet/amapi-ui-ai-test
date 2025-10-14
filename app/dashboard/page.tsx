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
  Activity,
  Battery,
  HardDrive,
  Monitor,
  Clock,
  Zap,
  Globe,
  CheckCircle,
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
      icon: Smartphone,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Registered Android devices"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "System users"
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: Globe,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      description: "Managed applications"
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
    <div className="min-h-screen">
      <div className="max-w-7xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    Welcome back,{' '}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </h1>
                  <p className="text-lg text-slate-600 mt-2 font-medium">
                    Here's your AMAPI management overview
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Last updated</p>
                  <p className="text-lg font-bold text-slate-800">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-700 hover:transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-all duration-700`}></div>
                
                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full group-hover:scale-125 transition-transform duration-1000 delay-100"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                    </div>
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{stat.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{stat.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-10 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-6 mb-10">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Quick Actions</h2>
                <p className="text-lg text-slate-600 font-medium">Streamline your workflow with these common tasks</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="group relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:transform hover:scale-[1.03] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                      <action.icon className={`w-8 h-8 ${action.color}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-slate-800 transition-colors duration-300">{action.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                  <p className="text-slate-600 font-medium">Latest system events</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {stats?.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-md">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-semibold leading-relaxed">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Monitor className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">System Status</h2>
                  <p className="text-slate-600 font-medium">Service health overview</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">All Operational</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Battery className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">API Health</span>
                    <p className="text-xs text-slate-600 font-medium">Response time: 45ms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">Database</span>
                    <p className="text-xs text-slate-600 font-medium">Uptime: 99.9%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">Security</span>
                    <p className="text-xs text-slate-600 font-medium">All checks passed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Secure</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">Enterprises</span>
                    <p className="text-xs text-slate-600 font-medium">All active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
