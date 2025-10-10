"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

// Simple icons without external dependencies
const BuildingIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
const LinkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
const SyncIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
const SaveIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>

interface EnterpriseForm {
  name: string
  domain: string
  adminEmail: string
  subscription: "basic" | "premium" | "enterprise"
}

interface LinkForm {
  name: string
  url: string
  description: string
}

interface SyncForm {
  frequency: "hourly" | "daily" | "weekly"
  autoSync: boolean
  lastSync?: Date
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"enterprise" | "links" | "sync">("enterprise")
  const [isLoading, setIsLoading] = useState(false)

  // Enterprise form state
  const [enterpriseForm, setEnterpriseForm] = useState<EnterpriseForm>({
    name: "",
    domain: "",
    adminEmail: "",
    subscription: "basic"
  })

  // Links form state
  const [linksForm, setLinksForm] = useState<LinkForm>({
    name: "",
    url: "",
    description: ""
  })

  // Sync form state
  const [syncForm, setSyncForm] = useState<SyncForm>({
    frequency: "daily",
    autoSync: true,
    lastSync: new Date()
  })

  const [links, setLinks] = useState<LinkForm[]>([
    {
      name: "Company Website",
      url: "https://company.com",
      description: "Main company website"
    },
    {
      name: "Support Portal",
      url: "https://support.company.com",
      description: "Customer support portal"
    }
  ])

  const [errors, setErrors] = useState<Partial<EnterpriseForm & LinkForm>>({})

  useEffect(() => {
    // Load existing enterprise data
    const existingEnterprise = localStorage.getItem("enterprise_data")
    if (existingEnterprise) {
      setEnterpriseForm(JSON.parse(existingEnterprise))
    } else {
      // Set default values
      setEnterpriseForm({
        name: "AMAPI Enterprise",
        domain: "amapi.com",
        adminEmail: user?.email || "",
        subscription: "premium"
      })
    }
  }, [user])

  const validateEnterpriseForm = (): boolean => {
    const newErrors: Partial<EnterpriseForm> = {}
    
    // Enterprise name validation
    if (!enterpriseForm.name.trim()) {
      newErrors.name = "Enterprise name is required"
    } else if (enterpriseForm.name.trim().length < 2) {
      newErrors.name = "Enterprise name must be at least 2 characters"
    } else if (enterpriseForm.name.trim().length > 100) {
      newErrors.name = "Enterprise name must be less than 100 characters"
    } else if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(enterpriseForm.name.trim())) {
      newErrors.name = "Enterprise name contains invalid characters"
    }
    
    // Domain validation
    if (!enterpriseForm.domain.trim()) {
      newErrors.domain = "Domain is required"
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.?[a-zA-Z]{2,}$/.test(enterpriseForm.domain.trim())) {
      newErrors.domain = "Please enter a valid domain (e.g., company.com)"
    } else if (enterpriseForm.domain.trim().length > 253) {
      newErrors.domain = "Domain must be less than 253 characters"
    }
    
    // Email validation
    if (!enterpriseForm.adminEmail.trim()) {
      newErrors.adminEmail = "Admin email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enterpriseForm.adminEmail.trim())) {
      newErrors.adminEmail = "Please enter a valid email address"
    } else if (enterpriseForm.adminEmail.trim().length > 254) {
      newErrors.adminEmail = "Email must be less than 254 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEnterpriseForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem("enterprise_data", JSON.stringify(enterpriseForm))
      
      toast({
        title: "Enterprise Updated! ✅",
        description: "Enterprise details have been saved successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enterprise details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateLinkForm = (): boolean => {
    const newErrors: Partial<LinkForm> = {}
    
    // Link name validation
    if (!linksForm.name.trim()) {
      newErrors.name = "Link name is required"
    } else if (linksForm.name.trim().length < 2) {
      newErrors.name = "Link name must be at least 2 characters"
    } else if (linksForm.name.trim().length > 100) {
      newErrors.name = "Link name must be less than 100 characters"
    }
    
    // URL validation
    if (!linksForm.url.trim()) {
      newErrors.url = "URL is required"
    } else {
      try {
        new URL(linksForm.url.trim())
        if (!linksForm.url.trim().startsWith('http://') && !linksForm.url.trim().startsWith('https://')) {
          newErrors.url = "URL must start with http:// or https://"
        }
      } catch {
        newErrors.url = "Please enter a valid URL"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateLinkForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setLinks([...links, linksForm])
      setLinksForm({ name: "", url: "", description: "" })
      setErrors({})
      
      toast({
        title: "Link Added! 🔗",
        description: "New link has been added successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
    toast({
      title: "Link Removed",
      description: "Link has been removed successfully.",
      variant: "success"
    })
  }

  const handleSyncUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Sync Settings Updated! 🔄",
        description: "Synchronization settings have been saved successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sync settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = async () => {
    setIsLoading(true)
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSyncForm(prev => ({ ...prev, lastSync: new Date() }))
      
      toast({
        title: "Sync Complete! ✅",
        description: "Data synchronization completed successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your enterprise configuration and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("enterprise")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "enterprise"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <BuildingIcon />
              Enterprise Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "links"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <LinkIcon />
              Links
            </div>
          </button>
          <button
            onClick={() => setActiveTab("sync")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "sync"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <SyncIcon />
              Sync
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "enterprise" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Enterprise Information</h2>
              <form onSubmit={handleEnterpriseSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Enterprise Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <BuildingIcon />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter enterprise name"
                        value={enterpriseForm.name}
                        onChange={(e) => {
                          setEnterpriseForm(prev => ({ ...prev, name: e.target.value }))
                          setErrors(prev => ({ ...prev, name: undefined }))
                        }}
                        className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="domain" className="text-sm font-medium text-slate-700">
                      Domain <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <Input
                        id="domain"
                        name="domain"
                        type="text"
                        placeholder="Enter domain"
                        value={enterpriseForm.domain}
                        onChange={(e) => {
                          setEnterpriseForm(prev => ({ ...prev, domain: e.target.value }))
                          setErrors(prev => ({ ...prev, domain: undefined }))
                        }}
                        className={`pl-10 ${errors.domain ? 'border-red-500 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="domain" className="text-sm font-medium text-slate-700">
                      Domain <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <Input
                        id="domain"
                        name="domain"
                        type="text"
                        placeholder="Enter domain"
                        value={enterpriseForm.domain}
                        onChange={(e) => {
                          setEnterpriseForm(prev => ({ ...prev, domain: e.target.value }))
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
                </div>

                <div className="space-y-2">
                  <label htmlFor="adminEmail" className="text-sm font-medium text-slate-700">
                    Admin Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="Enter admin email"
                      value={enterpriseForm.adminEmail}
                      onChange={(e) => {
                        setEnterpriseForm(prev => ({ ...prev, adminEmail: e.target.value }))
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

                <div className="space-y-2">
                  <label htmlFor="subscription" className="text-sm font-medium text-slate-700">
                    Subscription Plan
                  </label>
                  <select
                    id="subscription"
                    name="subscription"
                    value={enterpriseForm.subscription}
                    onChange={(e) => setEnterpriseForm(prev => ({ ...prev, subscription: e.target.value as "basic" | "premium" | "enterprise" }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-800"
                    disabled={isLoading}
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SaveIcon />
                      Save Enterprise Details
                    </div>
                  )}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-6">
              {/* Add Link Form */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Add New Link</h2>
                <form onSubmit={handleAddLink} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="linkName" className="text-sm font-medium text-slate-700">
                      Link Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="linkName"
                      name="name"
                      type="text"
                      placeholder="Enter link name"
                      value={linksForm.name}
                      onChange={(e) => {
                        setLinksForm(prev => ({ ...prev, name: e.target.value }))
                        setErrors(prev => ({ ...prev, name: undefined }))
                      }}
                      className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="linkUrl" className="text-sm font-medium text-slate-700">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="linkUrl"
                      name="url"
                      type="url"
                      placeholder="https://example.com"
                      value={linksForm.url}
                      onChange={(e) => {
                        setLinksForm(prev => ({ ...prev, url: e.target.value }))
                        setErrors(prev => ({ ...prev, url: undefined }))
                      }}
                      className={errors.url ? 'border-red-500 focus:border-red-500' : ''}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="linkDescription" className="text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <textarea
                      id="linkDescription"
                      name="description"
                      placeholder="Enter link description"
                      value={linksForm.description}
                      onChange={(e) => setLinksForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                  {errors.url && (
                    <p className="text-sm text-red-600">{errors.url}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LinkIcon />
                        Add Link
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Links List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Existing Links</h2>
                <div className="space-y-4">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{link.name}</h3>
                        <p className="text-sm text-slate-600">{link.description}</p>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {link.url}
                        </a>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sync" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Synchronization Settings</h2>
              <form onSubmit={handleSyncUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium text-slate-700">
                    Sync Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={syncForm.frequency}
                    onChange={(e) => setSyncForm(prev => ({ ...prev, frequency: e.target.value as "hourly" | "daily" | "weekly" }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-800"
                    disabled={isLoading}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="autoSync"
                    name="autoSync"
                    type="checkbox"
                    checked={syncForm.autoSync}
                    onChange={(e) => setSyncForm(prev => ({ ...prev, autoSync: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="autoSync" className="text-sm font-medium text-slate-700">
                    Enable automatic synchronization
                  </label>
                </div>

                {syncForm.lastSync && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <strong>Last Sync:</strong> {syncForm.lastSync.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SaveIcon />
                        Save Settings
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleManualSync}
                    className="flex-1 h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                        Syncing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SyncIcon />
                        Sync Now
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("enterprise")}
              >
                <BuildingIcon />
                Enterprise Details
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("links")}
              >
                <LinkIcon />
                Manage Links
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("sync")}
              >
                <SyncIcon />
                Sync Settings
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Information</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>Configure your enterprise settings, manage external links, and set up data synchronization preferences.</p>
              <p>Changes are saved automatically and applied immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
