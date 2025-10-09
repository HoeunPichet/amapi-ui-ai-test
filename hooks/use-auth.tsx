"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "@/types"
import { authService, LoginCredentials, GoogleLoginCredentials, RegisterCredentials, ProfileUpdateCredentials, PasswordChangeCredentials } from "@/services/auth.service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  loginWithGoogle: (credentials: GoogleLoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  updateProfile: (credentials: ProfileUpdateCredentials) => Promise<boolean>
  changePassword: (credentials: PasswordChangeCredentials) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (role: User["role"]) => boolean
  hasAnyRole: (roles: User["role"][]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
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
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (role: User["role"]): boolean => {
    return authService.hasRole(role)
  }

  const hasAnyRole = (roles: User["role"][]): boolean => {
    return authService.hasAnyRole(roles)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    updateProfile,
    changePassword,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
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
