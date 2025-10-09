"use client"

import { useState, useEffect } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { amapiService } from "@/services/amapi.service"
import { ApplicationCollection, Application } from "@/types"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  MoreVertical,
  Filter,
  Users,
  Package,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-simple-toast"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<ApplicationCollection[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<ApplicationCollection | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<ApplicationCollection | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingCollection, setViewingCollection] = useState<ApplicationCollection | null>(null)
  const [viewingApplications, setViewingApplications] = useState<Application[]>([])
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    applicationIds: [] as string[],
    isActive: true
  })

  useEffect(() => {
    loadCollections()
    loadApplications()
  }, [currentPage, searchTerm])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const response = await amapiService.getApplicationCollections({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      })

      if (response.success && response.data) {
        setCollections(response.data.data)
        setTotalPages(response.data.totalPages)
      } else {
        toast({ title: "Error", description: "Failed to load collections", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error loading collections", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const loadApplications = async () => {
    try {
      const response = await amapiService.getApplications()
      if (response.success && response.data) {
        setApplications(response.data.data)
      }
    } catch (error) {
      console.error("Error loading applications:", error)
    }
  }

  const loadCollectionApplications = async (collection: ApplicationCollection) => {
    try {
      const appPromises = collection.applicationIds.map(id => 
        amapiService.getApplication(id)
      )
      const responses = await Promise.all(appPromises)
      const apps = responses
        .filter(response => response.success && response.data)
        .map(response => response.data!)
      setViewingApplications(apps)
    } catch (error) {
      console.error("Error loading collection applications:", error)
      setViewingApplications([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCollection) {
        const response = await amapiService.updateApplicationCollection(editingCollection.id, formData)
        if (response.success) {
          toast({ title: "Success", description: "Collection updated successfully", variant: "success" })
          setShowAddModal(false)
          setEditingCollection(null)
          resetForm()
          loadCollections()
        } else {
          toast({ title: "Error", description: response.error || "Failed to update collection", variant: "destructive" })
        }
      } else {
        const response = await amapiService.createApplicationCollection(formData)
        if (response.success) {
          toast({ title: "Success", description: "Collection created successfully", variant: "success" })
          setShowAddModal(false)
          resetForm()
          loadCollections()
        } else {
          toast({ title: "Error", description: response.error || "Failed to create collection", variant: "destructive" })
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Error saving collection", variant: "destructive" })
    }
  }

  const handleEdit = (collection: ApplicationCollection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || "",
      applicationIds: [...collection.applicationIds],
      isActive: collection.isActive
    })
    setShowAddModal(true)
  }

  const handleView = async (collection: ApplicationCollection) => {
    setViewingCollection(collection)
    await loadCollectionApplications(collection)
    setShowViewModal(true)
  }

  const handleDelete = async () => {
    if (!collectionToDelete) return

    try {
      const response = await amapiService.deleteApplicationCollection(collectionToDelete.id)
      if (response.success) {
        toast({ title: "Success", description: "Collection deleted successfully", variant: "success" })
        setShowDeleteModal(false)
        setCollectionToDelete(null)
        loadCollections()
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete collection", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error deleting collection", variant: "destructive" })
    }
  }

  const handleRemoveApplication = async (applicationId: string) => {
    if (!editingCollection) return

    try {
      const response = await amapiService.removeApplicationFromCollection(editingCollection.id, applicationId)
      if (response.success) {
        toast({ title: "Success", description: "Application removed from collection", variant: "success" })
        setFormData({
          ...formData,
          applicationIds: formData.applicationIds.filter(id => id !== applicationId)
        })
        loadCollections()
      } else {
        toast({ title: "Error", description: response.error || "Failed to remove application", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error removing application", variant: "destructive" })
    }
  }

  const handleAddApplication = async (applicationId: string) => {
    if (!editingCollection) return

    try {
      const response = await amapiService.addApplicationToCollection(editingCollection.id, applicationId)
      if (response.success) {
        toast({ title: "Success", description: "Application added to collection", variant: "success" })
        setFormData({
          ...formData,
          applicationIds: [...formData.applicationIds, applicationId]
        })
        loadCollections()
      } else {
        toast({ title: "Error", description: response.error || "Failed to add application", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error adding application", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      applicationIds: [],
      isActive: true
    })
  }

  const getApplicationName = (id: string) => {
    const app = applications.find(a => a.id === id)
    return app?.name || "Unknown App"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Application Collections</h1>
          <p className="text-slate-600 mt-1">Organize applications into collections for easy management</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setEditingCollection(null)
              setShowAddModal(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search collections..."
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

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
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
                    onClick={() => handleView(collection)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(collection)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCollectionToDelete(collection)
                      setShowDeleteModal(true)
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
                      {getApplicationName(appId)}
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
                  collection.isActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {collection.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCollection ? "Edit Collection" : "Create New Collection"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Collection Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Tools, My Work Apps"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            checked={formData.applicationIds.includes(app.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  applicationIds: [...formData.applicationIds, app.id]
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  applicationIds: formData.applicationIds.filter(id => id !== app.id)
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
                    setEditingCollection(null)
                    resetForm()
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
      {showViewModal && viewingCollection && (
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
                    setShowViewModal(false)
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && collectionToDelete && (
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
                    setShowDeleteModal(false)
                    setCollectionToDelete(null)
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
