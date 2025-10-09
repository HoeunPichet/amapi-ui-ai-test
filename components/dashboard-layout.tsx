"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/ui/button"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Smartphone, 
  Shield, 
  Key, 
  Building, 
  Building2,
  Users,
  Menu,
  Search,
  Bell,
  Plus,
  LogOut,
  X,
  ActivityIcon,
  Grid3X3,
  FolderOpen
} from "lucide-react"

const navigation = [
  { name: "Home", href: "/home", icon: Home, color: "text-blue-500" },
  { name: "Dashboard", href: "/dashboard", icon: ActivityIcon, color: "text-slate-500" },
  { name: "Devices", href: "/dashboard/devices", icon: Smartphone, color: "text-green-500" },
  { name: "Policies", href: "/dashboard/policies", icon: Shield, color: "text-purple-500" },
  { name: "Applications", href: "/dashboard/applications", icon: Grid3X3, color: "text-emerald-500" },
  { name: "Collections", href: "/dashboard/collections", icon: FolderOpen, color: "text-teal-500" },
  { name: "Tokens", href: "/dashboard/tokens", icon: Key, color: "text-orange-500" },
  { name: "Enterprises", href: "/dashboard/enterprises", icon: Building, color: "text-pink-500" },
  { name: "Departments", href: "/dashboard/departments", icon: Building2, color: "text-indigo-500" },
  { name: "Users", href: "/dashboard/users", icon: Users, color: "text-cyan-500" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

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
        <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20">
          <div className="flex items-center justify-between p-6 border-b border-primary-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-primary-600">
                  AMAPI
                </span>
                <p className="text-xs text-slate-500">Management Hub</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md hover:transform hover:scale-[1.01]"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-colors",
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
      </div>

      {/* Desktop sidebar */}
      <div className="lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:bg-white/95 lg:backdrop-blur-xl lg:border-r lg:border-white/20 lg:shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-primary-200">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl text-primary-600">
                AMAPI
              </span>
              <p className="text-sm text-slate-500">Management Hub</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md hover:transform hover:scale-[1.01]"
                  )}
                >
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-colors",
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

          {/* User section */}
          <div className="p-4 border-t border-primary-200">
            <div className="flex items-center gap-3 mb-4 p-3 bg-primary-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <ActivityIcon name="Logout" size="16" className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary-50 hover:text-primary-600 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-4 py-2 min-w-96 border border-primary-200 shadow-sm">
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

            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <Button variant="ghost" size="icon" className="hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Plus className="w-5 h-5" />
              </Button>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User menu (mobile) */}
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
