"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Shield, User, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { registerSchema, type RegisterForm } from "@/lib/validations"
import { registerUser, verifyOtp, resendOtp } from "@/lib/api"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { useToast } from "@/hooks/use-simple-toast"

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userName: "", email: "", firstName: "", lastName: "", password: "", confirmPassword: "" },
  })

  const password = watch("password")

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    clearErrors()

    try {
      const response = await registerUser({
        userName: data.userName,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      
      if (response.success) {
        setUserEmail(data.email)
        setStep("otp")
        toast({
          title: "Registration Successful!",
          description: "Please check your email for the verification code.",
          variant: "default"
        })
      } else {
        setError(response.message || "Registration failed")
        toast({
          title: "Registration failed",
          description: response.message || "Failed to create account. Please try again.",
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

  const onVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the verification code")
      return
    }

    setIsLoading(true)
    setOtpError("")

    try {
      const result = await verifyOtp({ email: userEmail, otp: otp.trim() })
      
      if (result.success) {
        setSuccess(true)
        toast({
          title: "Verification Successful!",
          description: "Your account has been verified successfully.",
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
        
        // setTimeout(() => {
        //   router.push("/login")
        // }, 2000)
      }
    } catch (err: any) {
      console.error("OTP verification error:", err)
      setOtpError(err.message || "Verification failed. Please try again.")
      toast({
        title: "Verification Failed",
        description: err.message || "Verification failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onResendOtp = async () => {
    setIsResendingOtp(true)
    setOtpError("")

    try {
      const result = await resendOtp({ email: userEmail })
      
      if (result.success) {
        toast({
          title: "Code Sent!",
          description: "A new verification code has been sent to your email.",
          variant: "default",
        })
        
        // Start cooldown timer (60 seconds)
        setResendCooldown(60)
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err)
      setOtpError(err.message || "Failed to resend code. Please try again.")
      toast({
        title: "Resend Failed",
        description: err.message || "Failed to resend code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResendingOtp(false)
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
              Account Verified!
            </h1>
            <p className="text-slate-600">
              Your account has been successfully verified.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-slate-900">
                Welcome to AMAPI!
              </h2>
              <p className="text-slate-600">
                Redirecting you to the login...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="w-full max-w-md">
          {/* OTP Verification Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-600">
              We've sent a verification code to <strong>{userEmail}</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={(e) => { e.preventDefault(); onVerifyOtp(); }} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                      setOtpError("")
                    }}
                    className={`pl-4 pr-4 ${otpError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    maxLength={6}
                  />
                </div>
                {otpError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {otpError}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !otp.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {/* Resend OTP Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isResendingOtp || resendCooldown > 0}
                  className="text-sm text-primary-600 hover:text-primary-700 underline disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {isResendingOtp ? (
                    "Sending..."
                  ) : resendCooldown > 0 ? (
                    `Resend code in ${resendCooldown}s`
                  ) : (
                    "Didn't receive the code? Resend"
                  )}
                </button>
              </div>

              {/* Back to Registration */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  ← Back to registration
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
            Join AMAPI
          </h1>
          <p className="text-slate-600">
            Create your account to get started
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your username"
                  {...register("userName")}
                  className={`pl-10 ${errors.userName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.userName && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.userName.message}
                </div>
              )}
            </div>

            {/* First Name Field */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                  className={`pl-10 ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.firstName && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName.message}
                </div>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                  className={`pl-10 ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.lastName && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName.message}
                </div>
              )}
            </div>

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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
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
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              <div className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}