"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { otpService } from "@/services/otp.service"
import { registerSchema, type RegisterForm } from "@/lib/validations"

// Simple icons without external dependencies
const ShieldIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
const EyeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
const SmsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
const LockIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const MailIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form")
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterForm>>({})
  const [otpError, setOtpError] = useState("")
  const [countdown, setCountdown] = useState(0)

  const { register, isAuthenticated, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "otp") {
      setOtp(value)
      setOtpError("")
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear error when user starts typing
      if (errors[name as keyof RegisterForm]) {
        setErrors(prev => ({ ...prev, [name]: undefined }))
      }
    }
  }

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Partial<RegisterForm> = {}
      error.errors?.forEach((err: any) => {
        if (err.path) {
          newErrors[err.path[0] as keyof RegisterForm] = err.message
        }
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleSendOtp = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await otpService.generateOtp(formData.email)
      if (response.success) {
        setStep("otp")
        setCountdown(60) // 60 seconds countdown
        toast({
          title: "OTP Sent! 📧",
          description: `We've sent a verification code to ${formData.email}`,
          variant: "success"
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send OTP",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await otpService.resendOtp(formData.email)
      if (response.success) {
        setCountdown(60)
        toast({
          title: "OTP Resent! 🔄",
          description: "A new verification code has been sent",
          variant: "success"
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to resend OTP",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await otpService.verifyOtp(formData.email, otp)
      if (response.success && response.verified) {
        // Proceed with registration
        const success = await register(formData)
        if (success) {
          toast({
            title: "Welcome to AMAPI! 🎉",
            description: "Your account has been created successfully.",
            variant: "success"
          })
          router.push("/home")
        } else {
          toast({
            title: "Registration Failed",
            description: "Failed to create account. Please try again.",
            variant: "destructive"
          })
        }
      } else {
        setOtpError(response.message || "Invalid OTP")
        toast({
          title: "Verification Failed",
          description: response.message || "Invalid OTP",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToForm = () => {
    setStep("form")
    setOtp("")
    setOtpError("")
    setCountdown(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <ShieldIcon />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Join AMAPI
          </h1>
          <p className="text-secondary-600">
            {step === "form" ? "Create your account to get started" : "Verify your email address"}
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-200 p-8">
          {step === "form" ? (
            <form className="space-y-6">
              {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-secondary-700">
                Full Name <span className="text-red-500">*</span>
              </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    <UserIcon />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 bg-white ${errors.name ? 'border-accent-500 focus:border-accent-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-accent-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-secondary-700">
                Email Address <span className="text-red-500">*</span>
              </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    <MailIcon />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 bg-white ${errors.email ? 'border-accent-500 focus:border-accent-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-accent-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-secondary-700">
                Password <span className="text-red-500">*</span>
              </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    <LockIcon />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 bg-white ${errors.password ? 'border-accent-500 focus:border-accent-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-accent-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-secondary-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    <LockIcon />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 bg-white ${errors.confirmPassword ? 'border-accent-500 focus:border-accent-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-accent-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSendOtp}
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          ) : (
            /* OTP Verification Form */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailIcon />
                </div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-secondary-600 text-sm">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-primary-600 font-medium">
                  {formData.email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-secondary-700">
                  Verification Code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={handleInputChange}
                  className={`text-center text-2xl font-mono tracking-widest ${otpError ? 'border-accent-500 focus:border-accent-500' : ''}`}
                  maxLength={6}
                  disabled={isLoading}
                />
                {otpError && (
                  <p className="text-sm text-accent-600">{otpError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToForm}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    className="flex-1"
                    disabled={isLoading || countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Development Helper */}
          {process.env.NODE_ENV === "development" && step === "otp" && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium mb-1">Development Mode:</p>
              <p className="text-xs text-yellow-700">
                OTP: {otpService.getOtpForEmail(formData.email) || "Not found"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-secondary-500">
            © 2024 AMAPI Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
