"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "@/types"
import { authService, LoginCredentials, GoogleLoginCredentials, GitHubLoginCredentials, RegisterCredentials, ProfileUpdateCredentials, PasswordChangeCredentials } from "@/services/auth.service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  loginWithGoogle: (credentials: GoogleLoginCredentials) => Promise<boolean>
  loginWithGitHub: (credentials: GitHubLoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  updateProfile: (credentials: ProfileUpdateCredentials) => Promise<boolean>
  changePassword: (credentials: PasswordChangeCredentials) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasPosition: (position: User["position"]) => boolean
  hasAnyPosition: (positions: User["position"][]) => boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state - check both old auth service and new API token
    const currentUser = authService.getCurrentUser()
    
    // Also check for new API-based authentication
    if (typeof window !== "undefined") {
      const apiToken = localStorage.getItem("amapi_token")
      const apiUser = localStorage.getItem("amapi_user")
      
      if (apiToken && apiUser) {
        try {
          const parsedUser = JSON.parse(apiUser)
          // Map API user to local User type
          const mappedUser = {
            id: parsedUser.id,
            name: parsedUser.name || parsedUser.username || parsedUser.email,
            email: parsedUser.email,
            position: "Administrator" as const,
            status: "Active" as const,
            loginMethod: "email" as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setUser(mappedUser)
          setLoading(false)
          return
        } catch (error) {
          console.error("Error parsing API user data:", error)
        }
      }
    }
    
    setUser(currentUser)
    setLoading(false)
  }, [])

  // Listen for localStorage changes to update auth state
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "amapi_user" && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue)
          const mappedUser = {
            id: parsedUser.id,
            name: parsedUser.name || parsedUser.username || parsedUser.email,
            email: parsedUser.email,
            position: "Administrator" as const,
            status: "Active" as const,
            loginMethod: "email" as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setUser(mappedUser)
        } catch (error) {
          console.error("Error parsing user data from storage event:", error)
        }
      } else if (e.key === "amapi_user" && !e.newValue) {
        setUser(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (credentials: GoogleLoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.loginWithGoogle(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Google login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGitHub = async (credentials: GitHubLoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.loginWithGitHub(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("GitHub login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.register(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (credentials: ProfileUpdateCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.updateProfile(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (credentials: PasswordChangeCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await authService.changePassword(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Password change error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)
    try {
      // Clear old auth service
      await authService.logout()
      
      // Clear new API-based authentication
      if (typeof window !== "undefined") {
        localStorage.removeItem("amapi_token")
        localStorage.removeItem("amapi_refresh_token")
        localStorage.removeItem("amapi_token_expires")
        localStorage.removeItem("amapi_user")
      }
      
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasPosition = (position: User["position"]): boolean => {
    return authService.hasPosition(position)
  }

  const hasAnyPosition = (positions: User["position"][]): boolean => {
    return authService.hasAnyPosition(positions)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithGitHub,
    register,
    updateProfile,
    changePassword,
    logout,
    isAuthenticated: !!user,
    hasPosition,
    hasAnyPosition,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
