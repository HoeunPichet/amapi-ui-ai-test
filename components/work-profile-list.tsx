"use client"

import { useState, useEffect } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { useToast } from "@/hooks/use-simple-toast"
import { WorkProfile, Department, WorkProfileSearchParams } from "@/types"
import { WorkProfileStatusModal } from "@/components/work-profile-status-modal"
import { Pagination } from "@/components/pagination"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  MoreVertical,
  Filter,
  X,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface WorkProfileListProps {
  workProfiles: WorkProfile[]
  departments: Department[]
  onEdit: (profile: WorkProfile) => void
  onCreate: () => void
  onDelete: (id: string) => Promise<void>
  onToggleStatus: (id: string, status: "Active" | "Disabled") => Promise<void>
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
}

export function WorkProfileList({ 
  workProfiles, 
  departments, 
  onEdit, 
  onCreate, 
  onDelete, 
  onToggleStatus,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange
}: WorkProfileListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Active" | "Disabled">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<WorkProfile | null>(null)
  const [statusAction, setStatusAction] = useState<"enable" | "disable">("disable")

  const filteredProfiles = Array.isArray(workProfiles) ? workProfiles.filter(profile => {
    const matchesSearch = profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "" || profile.departmentId === selectedDepartment
    const matchesStatus = selectedStatus === "All" || profile.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  }) : []

  const handleDelete = async (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete the work profile for ${username}?`)) {
      try {
        await onDelete(id)
        toast({
          title: "Success",
          description: "Work profile deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete work profile",
          variant: "destructive"
        })
      }
    }
  }

  const handleToggleStatus = (profile: WorkProfile) => {
    const action = profile.status === "Active" ? "disable" : "enable"
    setSelectedProfile(profile)
    setStatusAction(action)
    setStatusModalOpen(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!selectedProfile) return
    
    try {
      const newStatus = statusAction === "enable" ? "Active" : "Disabled"
      await onToggleStatus(selectedProfile.id, newStatus)
      toast({
        title: "Success",
        description: `Work profile ${statusAction}d successfully`
      })
      setStatusModalOpen(false)
      setSelectedProfile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${statusAction} work profile`,
        variant: "destructive"
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartment("")
    setSelectedStatus("All")
  }

  const getDepartmentName = (departmentId: string) => {
    if (!Array.isArray(departments)) return "Unknown Department"
    const department = departments.find(dept => dept.id === departmentId)
    return department?.name || "Unknown Department"
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by username, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:bg-primary-50 hover:text-primary-700"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-800"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as "All" | "Active" | "Disabled")}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-800"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} work profiles
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Profile List */}
      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading work profiles...</p>
          </div>
        ) : !Array.isArray(workProfiles) || workProfiles.length === 0 ? (
          <div className="p-6 text-center">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No work profiles found</p>
            <p className="text-sm text-slate-500 mt-1">
              {searchTerm || selectedDepartment || selectedStatus !== "All" 
                ? "Try adjusting your search criteria" 
                : "Create your first work profile to get started"}
            </p>
          </div>
        ) : (
          Array.isArray(workProfiles) && workProfiles.map((profile) => (
            <div key={profile.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">@{profile.username}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        profile.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {profile.status === "Active" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {profile.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getDepartmentName(profile.departmentId)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(profile)}
                    className="text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(profile)}
                    className={`text-slate-600 hover:bg-orange-50 hover:text-orange-600 ${
                      profile.status === "Active" ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {profile.status === "Active" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(profile.id, profile.username)}
                    className="text-slate-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedProfile(
                      expandedProfile === profile.id ? null : profile.id
                    )}
                    className="text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedProfile === profile.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Email</p>
                        <p className="text-sm text-slate-600">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Phone</p>
                        <p className="text-sm text-slate-600">{profile.phoneNumber}</p>
                      </div>
                    </div>
                    {profile.homeAddress && (
                      <div className="flex items-start gap-3 md:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Home Address</p>
                          <p className="text-sm text-slate-600">{profile.homeAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Created: {new Date(profile.createdAt).toLocaleDateString()} • 
                      Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}

      {/* Status Modal */}
      <WorkProfileStatusModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false)
          setSelectedProfile(null)
        }}
        onConfirm={handleConfirmStatusChange}
        workProfile={selectedProfile}
        action={statusAction}
        isLoading={isLoading}
      />
    </div>
  )
}
