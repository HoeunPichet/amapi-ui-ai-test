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
import { LoginGoogleButton } from "@/components/button/login-google-button"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, loginWithGoogle, loginWithGitHub } = useAuth()

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
      const response = await loginUser({ ...data, rememberMe: true })
      
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
          position: "Administrator" as const,
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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate Google OAuth flow - in a real app, this would integrate with Google OAuth
      const googleCredentials = {
        email: "demo.google@gmail.com",
        name: "Google User",
        googleId: "google_" + Date.now()
      }
      
      const success = await loginWithGoogle(googleCredentials)
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "Successfully logged in with Google.",
          variant: "success"
        })
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError("Google login failed")
        toast({
          title: "Google login failed",
          description: "Unable to sign in with Google. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "Google login failed"
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

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate GitHub OAuth flow - in a real app, this would integrate with GitHub OAuth
      const githubCredentials = {
        email: "demo.github@gmail.com",
        name: "GitHub User",
        githubId: "github_" + Date.now()
      }
      
      const success = await loginWithGitHub(githubCredentials)
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "Successfully logged in with GitHub.",
          variant: "success"
        })
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError("GitHub login failed")
        toast({
          title: "GitHub login failed",
          description: "Unable to sign in with GitHub. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "GitHub login failed"
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

        <LoginGoogleButton />

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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

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
