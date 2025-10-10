"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from "lucide-react"
import { loginSchema, type LoginForm } from "@/lib/validations"
import { loginUser } from "@/lib/api"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { useToast } from "@/hooks/use-simple-toast"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)
    clearErrors()

    try {
      const response = await loginUser({ ...data, rememberMe: false })
      
      if (response.success && response.access_token) {
        localStorage.setItem("amapi_token", response.access_token)
        
        // Store additional token information if available
        if (response.refresh_token) {
          localStorage.setItem("amapi_refresh_token", response.refresh_token)
        }
        if (response.expires_in) {
          localStorage.setItem("amapi_token_expires", (Date.now() + response.expires_in * 1000).toString())
        }
        
        // Create user object from available data since API doesn't return user info
        const userData = {
          id: "user_" + Date.now(), // Generate a temporary ID
          email: data.email,
          name: data.email.split('@')[0], // Use email prefix as name
        }
        
        localStorage.setItem("amapi_user", JSON.stringify(userData))
        
        // Map API user to local User type
        const mappedUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          position: "Employee" as const,
          status: "Active" as const,
          loginMethod: "email" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setUser(mappedUser)

        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
          variant: "success"
        })

        // Add a small delay to ensure auth context is updated
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError(response.message || "Login failed")
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            AMAPI Dashboard
          </h1>
          <p className="text-slate-600">
            Sign in to manage your Android devices
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              <div className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                >
                  Register
                </Link>
              </div>
              <div>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
