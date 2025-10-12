"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { amapiService } from "@/services/amapi.service"
import { Application, ApplicationCollection } from "@/types"
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
  Upload,
  Eye,
  EyeOff,
  FolderOpen
} from "lucide-react"
import { useToast } from "@/hooks/use-simple-toast"

export default function ApplicationsPage() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<"application" | "collection">("application")
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

  // Collections state
  const [collections, setCollections] = useState<ApplicationCollection[]>([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [collectionsCurrentPage, setCollectionsCurrentPage] = useState(1)
  const [collectionsTotalPages, setCollectionsTotalPages] = useState(1)
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<ApplicationCollection | null>(null)
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<ApplicationCollection | null>(null)
  const [showViewCollectionModal, setShowViewCollectionModal] = useState(false)
  const [viewingCollection, setViewingCollection] = useState<ApplicationCollection | null>(null)
  const [viewingApplications, setViewingApplications] = useState<Application[]>([])
  const [collectionFormData, setCollectionFormData] = useState({
    name: "",
    description: "",
    applicationIds: [] as string[],
    isActive: true
  })

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
    if (activeTab === "application") {
      loadApplications()
    }
  }, [activeTab, currentPage, searchTerm])

  useEffect(() => {
    if (activeTab === "collection") {
      loadCollections()
      loadAllApplicationsForPicker()
    }
  }, [activeTab, collectionsCurrentPage])

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
  // Collections logic
  const loadCollections = async () => {
    try {
      setCollectionsLoading(true)
      const response = await amapiService.getApplicationCollections({
        page: collectionsCurrentPage,
        limit: 10,
        search: undefined
      })
      if (response.success && response.data) {
        setCollections(response.data.data)
        setCollectionsTotalPages(response.data.totalPages)
      } else {
        toast({ title: "Error", description: "Failed to load collections", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error loading collections", variant: "destructive" })
    } finally {
      setCollectionsLoading(false)
    }
  }

  const loadAllApplicationsForPicker = async () => {
    try {
      const response = await amapiService.getApplications()
      if (response.success && response.data) {
        setApplications(response.data.data)
      }
    } catch (error) {
      // no-op
    }
  }

  const loadCollectionApplications = async (collection: ApplicationCollection) => {
    try {
      const appPromises = collection.applicationIds.map(id => amapiService.getApplication(id))
      const responses = await Promise.all(appPromises)
      const apps = responses.filter(r => r.success && r.data).map(r => r.data!)
      setViewingApplications(apps)
    } catch (error) {
      setViewingApplications([])
    }
  }

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCollection) {
        const response = await amapiService.updateApplicationCollection(editingCollection.id, collectionFormData)
        if (response.success) {
          toast({ title: "Success", description: "Collection updated successfully", variant: "success" })
          setShowAddCollectionModal(false)
          setEditingCollection(null)
          resetCollectionForm()
          loadCollections()
        } else {
          toast({ title: "Error", description: response.error || "Failed to update collection", variant: "destructive" })
        }
      } else {
        const response = await amapiService.createApplicationCollection(collectionFormData)
        if (response.success) {
          toast({ title: "Success", description: "Collection created successfully", variant: "success" })
          setShowAddCollectionModal(false)
          resetCollectionForm()
          loadCollections()
        } else {
          toast({ title: "Error", description: response.error || "Failed to create collection", variant: "destructive" })
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Error saving collection", variant: "destructive" })
    }
  }

  const handleEditCollection = (collection: ApplicationCollection) => {
    setEditingCollection(collection)
    setCollectionFormData({
      name: collection.name,
      description: collection.description || "",
      applicationIds: [...collection.applicationIds],
      isActive: collection.isActive
    })
    setShowAddCollectionModal(true)
  }

  const handleViewCollection = async (collection: ApplicationCollection) => {
    setViewingCollection(collection)
    await loadCollectionApplications(collection)
    setShowViewCollectionModal(true)
  }

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return
    try {
      const response = await amapiService.deleteApplicationCollection(collectionToDelete.id)
      if (response.success) {
        toast({ title: "Success", description: "Collection deleted successfully", variant: "success" })
        setShowDeleteCollectionModal(false)
        setCollectionToDelete(null)
        loadCollections()
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete collection", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error deleting collection", variant: "destructive" })
    }
  }

  const resetCollectionForm = () => {
    setCollectionFormData({
      name: "",
      description: "",
      applicationIds: [],
      isActive: true
    })
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
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary-600" />
            Application
          </h1>
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

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 inline-flex">
        <button
          onClick={() => setActiveTab("application")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "application" ? "bg-primary-600 text-white" : "text-slate-700 hover:bg-primary-50"
          }`}
        >
          Application
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          className={`ml-1 px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "collection" ? "bg-primary-600 text-white" : "text-slate-700 hover:bg-primary-50"
          }`}
        >
          Collection
        </button>
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

      {activeTab === "application" && (
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
      )}

      {activeTab === "collection" && (
        <>
          {/* Collection header actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Application Collections</h2>
              <p className="text-slate-600 mt-1">Organize applications into collections for easy management</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetCollectionForm()
                  setEditingCollection(null)
                  setShowAddCollectionModal(true)
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Collection
              </Button>
            </div>
          </div>


          {/* Collections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))
            ) : collections.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No collections found</p>
              </div>
            ) : (
              collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{collection.name}</h3>
                        <p className="text-sm text-slate-500">{collection.applicationIds.length} apps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCollection(collection)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCollection(collection)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCollectionToDelete(collection)
                          setShowDeleteCollectionModal(true)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {collection.description && (
                    <p className="text-sm text-slate-600 mb-4">{collection.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Package className="w-4 h-4" />
                      <span>Applications:</span>
                    </div>
                    <div className="space-y-1">
                      {collection.applicationIds.slice(0, 3).map((appId) => (
                        <div key={appId} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
                          {applications.find(a => a.id === appId)?.name || "Unknown App"}
                        </div>
                      ))}
                      {collection.applicationIds.length > 3 && (
                        <div className="text-sm text-slate-500">
                          +{collection.applicationIds.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      collection.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {collection.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Collections Pagination */}
          {collectionsTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Page {collectionsCurrentPage} of {collectionsTotalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCollectionsCurrentPage(Math.max(1, collectionsCurrentPage - 1))}
                  disabled={collectionsCurrentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCollectionsCurrentPage(Math.min(collectionsTotalPages, collectionsCurrentPage + 1))}
                  disabled={collectionsCurrentPage === collectionsTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Add/Edit Collection Modal */}
          {showAddCollectionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editingCollection ? "Edit Collection" : "Create New Collection"}
                  </h2>
                </div>
                <form onSubmit={handleCollectionSubmit} className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Collection Name *
                      </label>
                      <Input
                        value={collectionFormData.name}
                        onChange={(e) => setCollectionFormData({ ...collectionFormData, name: e.target.value })}
                        placeholder="e.g., Tools, My Work Apps"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={collectionFormData.description}
                        onChange={(e) => setCollectionFormData({ ...collectionFormData, description: e.target.value })}
                        placeholder="Collection description..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Applications
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-3">
                        {applications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={collectionFormData.applicationIds.includes(app.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCollectionFormData({
                                      ...collectionFormData,
                                      applicationIds: [...collectionFormData.applicationIds, app.id]
                                    })
                                  } else {
                                    setCollectionFormData({
                                      ...collectionFormData,
                                      applicationIds: collectionFormData.applicationIds.filter(id => id !== app.id)
                                    })
                                  }
                                }}
                                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              />
                              <div>
                                <div className="font-medium text-slate-900">{app.name}</div>
                                <div className="text-sm text-slate-500">{app.packageName}</div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              app.type === "Public App" ? "bg-green-100 text-green-700" :
                              app.type === "Private App" ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            }`}>
                              {app.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={collectionFormData.isActive}
                          onChange={(e) => setCollectionFormData({ ...collectionFormData, isActive: e.target.checked })}
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
                        setShowAddCollectionModal(false)
                        setEditingCollection(null)
                        resetCollectionForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCollection ? "Update Collection" : "Create Collection"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Collection Modal */}
          {showViewCollectionModal && viewingCollection && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">{viewingCollection.name}</h2>
                  {viewingCollection.description && (
                    <p className="text-slate-600 mt-2">{viewingCollection.description}</p>
                  )}
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Package className="w-4 h-4" />
                      <span>Applications ({viewingApplications.length})</span>
                    </div>
                    <div className="space-y-3">
                      {viewingApplications.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No applications in this collection</p>
                      ) : (
                        viewingApplications.map((app) => (
                          <div key={app.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{app.name}</div>
                              <div className="text-sm text-slate-500">{app.packageName}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              app.type === "Public App" ? "bg-green-100 text-green-700" :
                              app.type === "Private App" ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            }`}>
                              {app.type}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowViewCollectionModal(false)
                        setViewingCollection(null)
                        setViewingApplications([])
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Collection Modal */}
          {showDeleteCollectionModal && collectionToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Delete Collection</h2>
                  <p className="text-slate-600 mb-6">
                    Are you sure you want to delete "{collectionToDelete.name}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteCollectionModal(false)
                        setCollectionToDelete(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteCollection}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-3 border-b border-slate-200 bg-primary-700">
              <h2 className="text-xl font-semibold text-white">
                {editingApplication ? "Edit Application" : "Add New Application"}
              </h2>
            </div>
            <div className="p-6">
              {/* Google Play Work Embedded Search */}
              <div>
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    overflow: "hidden"
                  }}
                >
                  <iframe
                    src="https://play.google.com/work/embedded/search?token=YOUR_TOKEN"
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                    title="Google Play Work Applications"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Browse and select applications from Google Play Work. Selected apps will be automatically added.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
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
              <Button 
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingApplication(null)
                  resetForm()
                  toast({
                    title: "Success",
                    description: "Application added successfully",
                    variant: "success"
                  })
                }}
              >
                {editingApplication ? "Update Application" : "Create Application"}
              </Button>
            </div>
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
