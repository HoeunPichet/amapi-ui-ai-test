"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Grid3X3,
  FolderOpen,
  Key,
  Building,
  Zap,
  Rocket,
  Star,
  Heart,
  Sparkles,
  Crown,
  Gamepad2,
  Music,
  Coffee,
  Sun,
  Moon,
  Clock,
  Calendar,
  ArrowRight,
  Play,
  Target,
  Award,
  Flame,
  Sparkle,
  Gift,
  Crown as CrownIcon
} from "lucide-react"

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
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
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return "🌙"
    if (hour < 12) return "🌅"
    if (hour < 17) return "☀️"
    if (hour < 20) return "🌇"
    return "🌙"
  }

  const modules = [
    {
      name: "Devices",
      description: "Manage all your Android devices",
      icon: Smartphone,
      href: "/dashboard/devices",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      emoji: "📱",
      stats: stats?.totalDevices || 0,
      trend: "+12%",
      isPopular: true,
      category: "Core"
    },
    {
      name: "Applications",
      description: "Deploy and manage apps",
      icon: Grid3X3,
      href: "/dashboard/applications",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      emoji: "📦",
      stats: "3",
      trend: "+5%",
      isNew: true,
      category: "Apps"
    },
    {
      name: "Collections",
      description: "Organize apps into groups",
      icon: FolderOpen,
      href: "/dashboard/collections",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      emoji: "📁",
      stats: "2",
      trend: "+8%",
      isNew: true,
      category: "Apps"
    },
    {
      name: "Policies",
      description: "Security and compliance rules",
      icon: Shield,
      href: "/dashboard/policies",
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      emoji: "🛡️",
      stats: stats?.activePolicies || 0,
      trend: "+3%",
      category: "Security"
    },
    {
      name: "Users",
      description: "Manage team members",
      icon: Users,
      href: "/dashboard/users",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      emoji: "👥",
      stats: stats?.totalUsers || 0,
      trend: "+5%",
      category: "People"
    },
    {
      name: "Departments",
      description: "Organize your teams",
      icon: Building2,
      href: "/dashboard/departments",
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      emoji: "🏢",
      stats: "3",
      trend: "+2%",
      category: "People"
    },
    {
      name: "Enterprises",
      description: "Company management",
      icon: Building,
      href: "/dashboard/enterprises",
      color: "from-slate-500 to-gray-600",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
      emoji: "🏭",
      stats: stats?.totalEnterprises || 0,
      trend: "+1%",
      category: "Organization"
    },
    {
      name: "Tokens",
      description: "API access management",
      icon: Key,
      href: "/dashboard/tokens",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      emoji: "🔑",
      stats: "1",
      trend: "0%",
      category: "Security"
    }
  ]

  const quickActions = [
    {
      name: "Add Device",
      description: "Register a new device",
      icon: Smartphone,
      href: "/dashboard/devices",
      color: "from-green-400 to-emerald-500",
      emoji: "➕"
    },
    {
      name: "Create Policy",
      description: "Set up security rules",
      icon: Shield,
      href: "/dashboard/policies",
      color: "from-red-400 to-rose-500",
      emoji: "🔒"
    },
    {
      name: "Add App",
      description: "Deploy new application",
      icon: Grid3X3,
      href: "/dashboard/applications",
      color: "from-purple-400 to-pink-500",
      emoji: "📱"
    },
    {
      name: "Invite User",
      description: "Add team member",
      icon: Users,
      href: "/dashboard/users",
      color: "from-blue-400 to-cyan-500",
      emoji: "👤"
    }
  ]

  const achievements = [
    {
      title: "Device Master",
      description: "Managed 10+ devices",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
      progress: 80,
      unlocked: true
    },
    {
      title: "Policy Pro",
      description: "Created 5+ policies",
      icon: Shield,
      color: "from-blue-400 to-cyan-500",
      progress: 60,
      unlocked: true
    },
    {
      title: "App Deployer",
      description: "Deployed 3+ applications",
      icon: Rocket,
      color: "from-purple-400 to-pink-500",
      progress: 100,
      unlocked: true
    },
    {
      title: "Team Builder",
      description: "Managed 5+ users",
      icon: Users,
      color: "from-green-400 to-emerald-500",
      progress: 40,
      unlocked: false
    }
  ]

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl w-1/3 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 border border-indigo-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-rose-200/30 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{getGreetingEmoji()}</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-slate-600 text-lg mt-1">
                Ready to manage your devices like a pro? Let's go! 🚀
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.totalDevices || 0}</p>
              <p className="text-emerald-100 text-sm">Devices</p>
            </div>
            <Smartphone className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-blue-100 text-sm">Users</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.activePolicies || 0}</p>
              <p className="text-purple-100 text-sm">Policies</p>
            </div>
            <Shield className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.totalEnterprises || 0}</p>
              <p className="text-orange-100 text-sm">Enterprises</p>
            </div>
            <Building className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                  {action.emoji}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-slate-700">{action.name}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Modules */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-indigo-500" />
          All Modules
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {modules.length} available
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <Link
              key={index}
              href={module.href}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden"
            >
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {module.isNew && (
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {module.isPopular && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    🔥 HOT
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 ${module.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{module.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-slate-700">{module.name}</h3>
                  <p className="text-sm text-slate-500">{module.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">{module.stats}</span>
                  <span className="text-sm text-slate-500">items</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-semibold">{module.trend}</span>
                </div>
              </div>

              {/* Category */}
              <div className="mt-3">
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {module.category}
                </span>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Your Achievements
          <span className="text-sm font-normal text-slate-500 bg-yellow-100 px-3 py-1 rounded-full">
            {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'hover:shadow-lg hover:shadow-yellow-200/50' 
                  : 'opacity-60'
              }`}
            >
              {/* Achievement Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
                  {achievement.unlocked ? (
                    <achievement.icon className="w-7 h-7" />
                  ) : (
                    <CrownIcon className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{achievement.title}</h3>
                  <p className="text-sm text-slate-500">{achievement.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-semibold text-slate-900">{achievement.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4">
                {achievement.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <Sparkle className="w-3 h-3" />
                    Unlocked!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <Target className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">{activity.description}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun Footer */}
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500" /> for Gen Z admins
          <span className="text-lg">✨</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Powered by</span>
          <Flame className="w-3 h-3 text-orange-500" />
          <span>AMAPI</span>
          <span>•</span>
          <span>Built for the future</span>
        </div>
      </div>
    </div>
  )
}
