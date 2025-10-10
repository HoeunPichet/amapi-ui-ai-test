"use client"

import { useEffect, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Department } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Pagination } from "@/components/pagination"
import { Building2, Search, Edit, Trash2, Plus, Users } from "lucide-react"
import DepartmentModal from "@/components/department-modal"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await amapiService.getDepartments({ 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || undefined 
      })
      if (res.success && res.data) {
        setDepartments(res.data.data)
        setTotalItems(res.data.total)
        setTotalPages(res.data.totalPages)
      }
      setLoading(false)
    }
    load()
  }, [currentPage, searchTerm])

  const loadDepartments = async () => {
    const res = await amapiService.getDepartments({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: searchTerm || undefined 
    })
    if (res.success && res.data) {
      setDepartments(res.data.data)
      setTotalItems(res.data.total)
      setTotalPages(res.data.totalPages)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAdd = () => {
    setEditingDepartment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  const handleSave = async (departmentData: Omit<Department, "id" | "createdAt" | "updatedAt">) => {
    try {
      let res
      if (editingDepartment) {
        res = await amapiService.updateDepartment(editingDepartment.id, departmentData)
      } else {
        res = await amapiService.createDepartment(departmentData)
      }

      if (res.success) {
        toast({
          title: "Success",
          description: editingDepartment 
            ? "Department updated successfully" 
            : "Department created successfully",
          variant: "success"
        })
        await loadDepartments()
      } else {
        throw new Error(res.error || "Failed to save department")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save department",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    const res = await amapiService.deleteDepartment(id)
    if (res.success) {
      toast({
        title: "Success",
        description: "Department deleted successfully",
        variant: "success"
      })
      await loadDepartments()
    } else {
      toast({
        title: "Error",
        description: res.error || "Failed to delete department",
        variant: "destructive"
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingDepartment(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Departments</h1>
          <p className="text-secondary-600 mt-1">Manage organizational departments</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Department
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
        <Input 
          placeholder="Search departments..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10" 
        />
      </div>

      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-secondary-600 mt-2">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-secondary-600">No departments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="text-left p-4 font-medium text-secondary-900">Department</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Description</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Users</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Status</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary-700" />
                        </div>
                        <span className="font-medium text-secondary-900">{dept.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-secondary-700">
                      {dept.description || "No description"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary-500" />
                        <span className="text-secondary-700">{dept.userCount}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        dept.status === 'Active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-secondary-100 text-secondary-800 border-secondary-200'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(dept)}
                        >
                          <Edit className="w-4 h-4 mr-2" /> 
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={loading}
      />

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        department={editingDepartment}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
      />
    </div>
  )
}
