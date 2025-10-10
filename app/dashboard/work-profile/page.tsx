"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-simple-toast"
import { amapiService } from "@/services/amapi.service"
import { WorkProfile, Department, WorkProfileFormData } from "@/types"
import { WorkProfileList } from "@/components/work-profile-list"
import { WorkProfileForm } from "@/components/work-profile-form"
import { 
  Users, 
  UserPlus
} from "lucide-react"
import { Button } from "@/ui/button"

export default function WorkProfilesPage() {
  const { toast } = useToast()
  const [workProfiles, setWorkProfiles] = useState<WorkProfile[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState<WorkProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [currentPage])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [profilesResponse, departmentsResponse] = await Promise.all([
        amapiService.getWorkProfiles({
          page: currentPage,
          limit: itemsPerPage
        }),
        amapiService.getDepartments()
      ])

      if (profilesResponse.success && profilesResponse.data) {
        setWorkProfiles(profilesResponse.data.data)
        setTotalItems(profilesResponse.data.total)
        setTotalPages(profilesResponse.data.totalPages)
      }

      if (departmentsResponse.success && departmentsResponse.data) {
        setDepartments(departmentsResponse.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load work profiles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProfile(null)
    setShowForm(true)
  }

  const handleEdit = (profile: WorkProfile) => {
    setEditingProfile(profile)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProfile(null)
  }

  const handleSave = async (data: WorkProfileFormData) => {
    try {
      setIsSubmitting(true)
      
      if (editingProfile) {
        const response = await amapiService.updateWorkProfile(editingProfile.id, data)
        if (response.success && response.data) {
          setWorkProfiles(prev => 
            prev.map(profile => 
              profile.id === editingProfile.id ? response.data! : profile
            )
          )
        } else {
          throw new Error(response.error || "Failed to update work profile")
        }
      } else {
        const response = await amapiService.createWorkProfile(data)
        if (response.success && response.data) {
          // Refresh the current page
          fetchData()
        } else {
          throw new Error(response.error || "Failed to create work profile")
        }
      }
      
      setShowForm(false)
      setEditingProfile(null)
    } catch (error) {
      console.error("Failed to save work profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save work profile",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await amapiService.deleteWorkProfile(id)
      if (response.success) {
        // Refresh the current page
        fetchData()
      } else {
        throw new Error(response.error || "Failed to delete work profile")
      }
    } catch (error) {
      console.error("Failed to delete work profile:", error)
      throw error
    }
  }

  const handleToggleStatus = async (id: string, status: "Active" | "Disabled") => {
    try {
      const response = await amapiService.toggleWorkProfileStatus(id, status)
      if (response.success && response.data) {
        setWorkProfiles(prev => 
          prev.map(profile => 
            profile.id === id ? response.data! : profile
          )
        )
      } else {
        throw new Error(response.error || "Failed to update work profile status")
      }
    } catch (error) {
      console.error("Failed to toggle work profile status:", error)
      throw error
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <WorkProfileForm
          workProfile={editingProfile}
          departments={departments}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Work Profiles</h1>
            <p className="text-slate-600">Manage employee work profiles and information</p>
          </div>
        </div>
        
        <Button
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Work Profile
        </Button>
      </div>

      {/* Work Profile List */}
      <WorkProfileList
        workProfiles={workProfiles}
        departments={departments}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
