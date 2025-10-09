"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

// Simple icons without external dependencies
const BuildingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>

interface EnterpriseForm {
  name: string
  domain: string
  adminEmail: string
  subscription: "basic" | "premium" | "enterprise"
}

export default function CreateEnterprisePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<EnterpriseForm>({
    name: "",
    domain: "",
    adminEmail: user?.email || "",
    subscription: "premium"
  })
  const [errors, setErrors] = useState<Partial<EnterpriseForm>>({})

  useEffect(() => {
    // Check if enterprise already exists
    const existingEnterprise = localStorage.getItem("enterprise_data")
    if (existingEnterprise) {
      // Enterprise already exists, redirect to dashboard
      router.push("/dashboard")
    }
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: Partial<EnterpriseForm> = {}
    
    // Enterprise name validation
    if (!form.name.trim()) {
      newErrors.name = "Enterprise name is required"
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Enterprise name must be at least 2 characters"
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Enterprise name must be less than 100 characters"
    } else if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(form.name.trim())) {
      newErrors.name = "Enterprise name contains invalid characters"
    }
    
    // Domain validation
    if (!form.domain.trim()) {
      newErrors.domain = "Domain is required"
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.?[a-zA-Z]{2,}$/.test(form.domain.trim())) {
      newErrors.domain = "Please enter a valid domain (e.g., company.com)"
    } else if (form.domain.trim().length > 253) {
      newErrors.domain = "Domain must be less than 253 characters"
    }
    
    // Email validation
    if (!form.adminEmail.trim()) {
      newErrors.adminEmail = "Admin email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail.trim())) {
      newErrors.adminEmail = "Please enter a valid email address"
    } else if (form.adminEmail.trim().length > 254) {
      newErrors.adminEmail = "Email must be less than 254 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save enterprise data
      localStorage.setItem("enterprise_data", JSON.stringify(form))
      
      toast({
        title: "Enterprise Created! 🎉",
        description: "Your enterprise has been set up successfully. Welcome to AMAPI!",
        variant: "success"
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create enterprise. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <ShieldIcon />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Create Your Enterprise
          </h1>
          <p className="text-secondary-600">
            Set up your enterprise to get started with AMAPI management platform
          </p>
        </div>

        {/* Enterprise Creation Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enterprise Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-secondary-700">
                Enterprise Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  <BuildingIcon />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your enterprise name"
                  value={form.name}
                  onChange={(e) => {
                    setForm(prev => ({ ...prev, name: e.target.value }))
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium text-secondary-700">
                Domain <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="example.com"
                  value={form.domain}
                  onChange={(e) => {
                    setForm(prev => ({ ...prev, domain: e.target.value }))
                    setErrors(prev => ({ ...prev, domain: undefined }))
                  }}
                  className={`pl-10 ${errors.domain ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.domain && (
                <p className="text-sm text-red-600">{errors.domain}</p>
              )}
            </div>

            {/* Admin Email */}
            <div className="space-y-2">
              <label htmlFor="adminEmail" className="text-sm font-medium text-secondary-700">
                Admin Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.adminEmail}
                  onChange={(e) => {
                    setForm(prev => ({ ...prev, adminEmail: e.target.value }))
                    setErrors(prev => ({ ...prev, adminEmail: undefined }))
                  }}
                  className={`pl-10 ${errors.adminEmail ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.adminEmail && (
                <p className="text-sm text-red-600">{errors.adminEmail}</p>
              )}
            </div>

            {/* Subscription Plan */}
            <div className="space-y-2">
              <label htmlFor="subscription" className="text-sm font-medium text-secondary-700">
                Subscription Plan
              </label>
              <select
                id="subscription"
                name="subscription"
                value={form.subscription}
                onChange={(e) => setForm(prev => ({ ...prev, subscription: e.target.value as "basic" | "premium" | "enterprise" }))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-800"
                disabled={isLoading}
              >
                <option value="basic">Basic - $29/month</option>
                <option value="premium">Premium - $79/month</option>
                <option value="enterprise">Enterprise - $199/month</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Enterprise...
                </div>
              ) : (
                "Create Enterprise"
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Getting Started</p>
                <p>You can modify these settings later in the Settings section. Your enterprise will be ready to use immediately after creation.</p>
              </div>
            </div>
          </div>
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
