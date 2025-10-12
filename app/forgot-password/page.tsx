"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordForm, type ResetPasswordForm } from "@/lib/validations"
import { forgotPassword, resetPassword } from "@/lib/api"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { useToast } from "@/hooks/use-simple-toast"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"forgot" | "reset">("forgot")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    clearErrors: clearErrorsForgot,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
    clearErrors: clearErrorsReset,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmitForgot = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError(null)
    clearErrorsForgot()

    try {
      console.log("Forgot password request:", data)
      const result = await forgotPassword(data)
      console.log("Forgot password response:", result)
      
      if (result.success) {
        setUserEmail(data.email)
        setStep("reset")
        toast({
          title: "Reset Code Sent!",
          description: "A password reset code has been sent to your email.",
          variant: "default",
        })
      }
    } catch (err: any) {
      console.error("Forgot password error:", err)
      setError(err.message || "Failed to send reset code. Please try again.")
      toast({
        title: "Reset Failed",
        description: err.message || "Failed to send reset code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitReset = async (data: ResetPasswordForm) => {
    setIsLoading(true)
    setError(null)
    clearErrorsReset()

    try {
      console.log("Reset password request:", {
        email: userEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      })
      
      const result = await resetPassword({
        email: userEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      })
      
      console.log("Reset password response:", result)
      
      if (result.success) {
        setSuccess(true)
      toast({
          title: "Password Reset Successful!",
          description: "Your password has been reset successfully.",
          variant: "default",
        })
        
        // Store token and redirect to dashboard
        if (result.access_token) {
          localStorage.setItem("amapi_token", result.access_token)
        }
        
        // Store additional token information if available
        if (result.refresh_token) {
          localStorage.setItem("amapi_refresh_token", result.refresh_token)
        }
        if (result.expires_in) {
          localStorage.setItem("amapi_token_expires", (Date.now() + result.expires_in * 1000).toString())
        }
        
        // Create user object from available data since API doesn't return user info
        const userData = {
          id: "user_" + Date.now(), // Generate a temporary ID
          email: userEmail,
          name: userEmail.split('@')[0], // Use email prefix as name
        }
        
        localStorage.setItem("amapi_user", JSON.stringify(userData))
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Reset password error:", err)
      setError(err.message || "Password reset failed. Please try again.")
      toast({
        title: "Reset Failed",
        description: err.message || "Password reset failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Password Reset!
            </h1>
            <p className="text-slate-600">
              Your password has been successfully reset.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-slate-900">
                Welcome back!
              </h2>
              <p className="text-slate-600">
                Redirecting you to the dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "reset") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="w-full max-w-md">
          {/* Reset Password Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-slate-600">
              Enter the verification code and your new password
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-6">
              {/* Email Display (read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600">
                  {userEmail}
                </div>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    {...registerReset("otp")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      e.target.value = value
                      registerReset("otp").onChange(e)
                    }}
                    className={`pl-10 ${errorsReset.otp ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    maxLength={6}
                  />
                </div>
                {errorsReset.otp && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errorsReset.otp.message}
                  </div>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...registerReset("newPassword")}
                    className={`pl-10 pr-10 ${errorsReset.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                {errorsReset.newPassword && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errorsReset.newPassword.message}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    {...registerReset("confirmPassword")}
                    className={`pl-10 pr-10 ${errorsReset.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errorsReset.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errorsReset.confirmPassword.message}
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
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
              
              {/* Back to Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  ← Back to forgot password
                </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    )
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
            Forgot Password
          </h1>
          <p className="text-slate-600">
            Enter your email to receive a reset code
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmitForgot(onSubmitForgot)} className="space-y-6">
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
                  {...registerForgot("email")}
                  className={`pl-10 ${errorsForgot.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errorsForgot.email && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errorsForgot.email.message}
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
                  Sending...
                </div>
              ) : (
                "Send Reset Code"
              )}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              <div className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link 
                  href="/login" 
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                >
                  Sign in
                </Link>
              </div>
              <div className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}