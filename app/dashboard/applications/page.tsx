"use client"

import { useState, useEffect } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { amapiService } from "@/services/amapi.service"
import { Application } from "@/types"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Globe, 
  Smartphone,
  MoreVertical,
  Filter,
  Download,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-simple-toast"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "Public App" as "Public App" | "Private App" | "Web App",
    packageName: "",
    autoUpdateMode: "disabled" as "disabled" | "enabled" | "wifi_only",
    description: "",
    version: "",
    iconUrl: "",
    downloadUrl: "",
    isActive: true
  })

  useEffect(() => {
    loadApplications()
  }, [currentPage, searchTerm])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await amapiService.getApplications({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      })

      if (response.success && response.data) {
        setApplications(response.data.data)
        setTotalPages(response.data.totalPages)
      } else {
        toast({ title: "Error", description: "Failed to load applications", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error loading applications", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingApplication) {
        const response = await amapiService.updateApplication(editingApplication.id, formData)
        if (response.success) {
          toast({ title: "Success", description: "Application updated successfully", variant: "success" })
          setShowAddModal(false)
          setEditingApplication(null)
          resetForm()
          loadApplications()
        } else {
          toast({ title: "Error", description: response.error || "Failed to update application", variant: "destructive" })
        }
      } else {
        const response = await amapiService.createApplication(formData)
        if (response.success) {
          toast({ title: "Success", description: "Application created successfully", variant: "success" })
          setShowAddModal(false)
          resetForm()
          loadApplications()
        } else {
          toast({ title: "Error", description: response.error || "Failed to create application", variant: "destructive" })
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Error saving application", variant: "destructive" })
    }
  }

  const handleEdit = (application: Application) => {
    setEditingApplication(application)
    setFormData({
      name: application.name,
      type: application.type,
      packageName: application.packageName,
      autoUpdateMode: application.autoUpdateMode,
      description: application.description || "",
      version: application.version || "",
      iconUrl: application.iconUrl || "",
      downloadUrl: application.downloadUrl || "",
      isActive: application.isActive
    })
    setShowAddModal(true)
  }

  const handleDelete = async () => {
    if (!applicationToDelete) return

    try {
      const response = await amapiService.deleteApplication(applicationToDelete.id)
      if (response.success) {
        toast({ title: "Success", description: "Application deleted successfully", variant: "success" })
        setShowDeleteModal(false)
        setApplicationToDelete(null)
        loadApplications()
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete application", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error deleting application", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Public App",
      packageName: "",
      autoUpdateMode: "disabled",
      description: "",
      version: "",
      iconUrl: "",
      downloadUrl: "",
      isActive: true
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Public App":
        return <Smartphone className="w-4 h-4" />
      case "Private App":
        return <Package className="w-4 h-4" />
      case "Web App":
        return <Globe className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Public App":
        return "bg-green-100 text-green-700"
      case "Private App":
        return "bg-blue-100 text-blue-700"
      case "Web App":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getUpdateModeColor = (mode: string) => {
    switch (mode) {
      case "enabled":
        return "bg-green-100 text-green-700"
      case "wifi_only":
        return "bg-yellow-100 text-yellow-700"
      case "disabled":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-600 mt-1">Manage applications for device deployment</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setEditingApplication(null)
              setShowAddModal(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Application</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Package Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Auto Update</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {application.iconUrl ? (
                          <img
                            src={application.iconUrl}
                            alt={application.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(application.type)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{application.name}</div>
                          {application.description && (
                            <div className="text-sm text-slate-500">{application.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(application.type)}`}>
                        {getTypeIcon(application.type)}
                        {application.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-slate-400 text-white px-2 py-1 rounded font-mono">
                        {application.packageName}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getUpdateModeColor(application.autoUpdateMode)}`}>
                        {application.autoUpdateMode.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        application.isActive 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {application.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(application)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setApplicationToDelete(application)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingApplication ? "Edit Application" : "Add New Application"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Gmail, Morningmate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="Public App">Public App</option>
                    <option value="Private App">Private App</option>
                    <option value="Web App">Web App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Package Name *
                  </label>
                  <Input
                    value={formData.packageName}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    placeholder="e.g., com.google.android.gm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Auto Update Mode *
                  </label>
                  <select
                    value={formData.autoUpdateMode}
                    onChange={(e) => setFormData({ ...formData, autoUpdateMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
                    <option value="wifi_only">WiFi Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Version
                  </label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., 1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Icon URL
                  </label>
                  <Input
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                    placeholder="https://example.com/icon.png"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Download URL
                  </label>
                  <Input
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Application description..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingApplication(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingApplication ? "Update Application" : "Create Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && applicationToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Delete Application</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{applicationToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setApplicationToDelete(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
