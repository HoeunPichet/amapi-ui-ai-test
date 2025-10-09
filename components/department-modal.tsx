"use client"

import { useState, useEffect } from "react"
import { Department } from "@/types"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { X } from "lucide-react"

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (department: Omit<Department, "id" | "createdAt" | "updatedAt">) => Promise<void>
  department?: Department | null
  title: string
}

export default function DepartmentModal({
  isOpen,
  onClose,
  onSave,
  department,
  title
}: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "",
    userCount: 0,
    status: "active" as "active" | "inactive"
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || "",
        managerId: department.managerId || "",
        userCount: department.userCount,
        status: department.status
      })
    } else {
      setFormData({
        name: "",
        description: "",
        managerId: "",
        userCount: 0,
        status: "active"
      })
    }
    setErrors({})
  }, [department, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Department name is required"
    }
    
    if (formData.userCount < 0) {
      newErrors.userCount = "User count cannot be negative"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving department:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl border border-secondary-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-secondary-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Department Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter department name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter department description"
              rows={3}
              className="flex w-full rounded-lg border border-primary-300 bg-white px-3 py-2 text-sm text-slate-800 ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Manager ID
            </label>
            <Input
              value={formData.managerId}
              onChange={(e) => handleInputChange("managerId", e.target.value)}
              placeholder="Enter manager user ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              User Count
            </label>
            <Input
              type="number"
              value={formData.userCount}
              onChange={(e) => handleInputChange("userCount", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className={errors.userCount ? "border-red-500" : ""}
            />
            {errors.userCount && (
              <p className="text-red-500 text-xs mt-1">{errors.userCount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value as "active" | "inactive")}
              className="flex h-10 w-full rounded-lg border border-primary-300 bg-white px-3 py-2 text-sm text-slate-800 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
