"use client"

import { useEffect, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { User, Department } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Users, Search, Edit, Trash2, Shield, Building2 } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [usersRes, departmentsRes] = await Promise.all([
        amapiService.getUsers({ page: 1, limit: 20, search: searchTerm || undefined }),
        amapiService.getDepartments({ page: 1, limit: 100 })
      ])
      if (usersRes.success && usersRes.data) setUsers(usersRes.data.data)
      if (departmentsRes.success && departmentsRes.data) setDepartments(departmentsRes.data.data)
      setLoading(false)
    }
    load()
  }, [searchTerm])

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "No Department"
    const department = departments.find(d => d.id === departmentId)
    return department?.name || "Unknown Department"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Users</h1>
          <p className="text-secondary-600 mt-1">Manage access and roles</p>
        </div>
        <Button>New User</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
        <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-secondary-600 mt-2">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-secondary-600">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="text-left p-4 font-medium text-secondary-900">User</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Email</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Department</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Role</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Status</th>
                  <th className="text-left p-4 font-medium text-secondary-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">{u.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-secondary-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-secondary-700">{u.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-secondary-500" />
                        <span className="text-secondary-700">{getDepartmentName(u.departmentId)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full border bg-secondary-100 text-secondary-800 border-secondary-200 uppercase">{u.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${u.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary-100 text-secondary-800 border-secondary-200'}`}>{u.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

