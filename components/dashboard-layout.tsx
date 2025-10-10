"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Smartphone, 
  Shield, 
  Building, 
  Building2,
  Users,
  User,
  Menu,
  Search,
  Bell,
  Plus,
  LogOut,
  X,
  ActivityIcon,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  Settings,
  ChevronDown
} from "lucide-react"

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: ActivityIcon, color: "text-blue-600" },
    { name: "Device", href: "/dashboard/device", icon: Smartphone, color: "text-green-600" },
    { name: "Policy", href: "/dashboard/policy", icon: Shield, color: "text-purple-600" },
    { name: "Application", href: "/dashboard/application", icon: Grid3X3, color: "text-emerald-600" },
    { name: "Department", href: "/dashboard/department", icon: Building2, color: "text-indigo-600" },
    { name: "Work Profile", href: "/dashboard/work-profile", icon: Users, color: "text-cyan-600" },
    { name: "Setting", href: "/dashboard/setting", icon: Settings, color: "text-pink-600" },
  ]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  
  // Check if enterprise exists (skip check for create-enterprise page)
  useEffect(() => {
    if (pathname === "/dashboard/create-enterprise") return
    
    const existingEnterprise = localStorage.getItem("enterprise_data")
    if (!existingEnterprise) {
      router.push("/dashboard/create-enterprise")
    }
  }, [router, pathname])
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout()
  }

  const handleNavigationClick = (href: string, e: React.MouseEvent) => {
    // Check if enterprise exists
    const existingEnterprise = localStorage.getItem("enterprise_data")
    
    // Allow navigation to dashboard and create-enterprise
    if (href === "/dashboard" || href === "/dashboard/create-enterprise") {
      return
    }
    
    // Show alert for other modules if enterprise doesn't exist
    if (!existingEnterprise) {
      e.preventDefault()
      toast({
        title: "Enterprise Required",
        description: "Please create your enterprise first before accessing other modules.",
        variant: "destructive"
      })
      router.push("/dashboard/create-enterprise")
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl border-r border-slate-200 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-primary-600">
                  AMAPI
                </span>
                <p className="text-xs text-slate-500">Management Hub</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-red-50 hover:text-red-500 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Mobile Search */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-500 flex-1"
              />
            </div>
          </div>
          
          {/* Scrollable navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavigationClick(item.href, e)
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]",
                      isActive
                        ? "bg-primary-500 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <IconComponent 
                      className={cn(
                        "w-5 h-5 transition-colors flex-shrink-0",
                        isActive ? "text-white" : item.color
                      )} 
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* Mobile User Profile */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:bg-white/95 lg:backdrop-blur-xl lg:border-r lg:border-white/20 lg:shadow-2xl transition-all duration-300",
        sidebarCollapsed ? "lg:w-16" : "lg:w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-primary-200">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="font-bold text-2xl text-primary-600">
                    AMAPI
                  </span>
                  <p className="text-sm text-slate-500">Management Hub</p>
                </div>
              )}
            </Link>
          </div>

          {/* Toggle Button */}
          <div className="absolute top-6 right-0 transform translate-x-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-8 h-8 bg-white border border-primary-200 shadow-md hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              )}
            </Button>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className={sidebarCollapsed ? "py-4 px-2 space-y-2" : "p-4 space-y-2"}>
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavigationClick(item.href, e)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-500 text-white shadow-lg transform scale-[1.02]"
                        : "text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md hover:transform hover:scale-[1.01]",
                      sidebarCollapsed && "justify-center"
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <IconComponent 
                      className={cn(
                        "w-5 h-5 transition-colors flex-shrink-0",
                        isActive ? "text-white" : sidebarCollapsed ? "text-slate-700" : item.color
                      )} 
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-72"
      )}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary-50 hover:text-primary-600 transition-colors p-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Search */}
              <div className="hidden sm:flex items-center gap-3 bg-white rounded-2xl px-4 py-2 min-w-64 sm:min-w-96 border border-primary-200 shadow-sm">
                <Search className="w-4 h-4 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search devices, policies, users..."
                  className="bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-500 flex-1"
                />
                <div className="px-2 py-1 bg-primary-100 rounded-lg">
                  <span className="text-xs font-medium text-primary-600">⌘K</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Actions */}
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary-50 hover:text-primary-600 transition-colors p-2">
                <Plus className="w-5 h-5 text-slate-600" />
              </Button>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-primary-50 hover:text-primary-600 transition-colors p-2">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User menu */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px]"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize truncate">{user?.position}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full min-h-[44px]"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
