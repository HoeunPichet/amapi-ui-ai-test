"use client"

import { useState, useEffect } from "react"
import { Button } from "@/ui/button"
import { FormInput } from "@/ui/form-input"
import { FormSelect } from "@/ui/form-select"
import { FormTextarea } from "@/ui/form-textarea"
import { useToast } from "@/hooks/use-simple-toast"
import { WorkProfile, WorkProfileFormData, Department } from "@/types"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Save, 
  X
} from "lucide-react"

interface WorkProfileFormProps {
  workProfile?: WorkProfile | null
  departments: Department[]
  onSave: (data: WorkProfileFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function WorkProfileForm({ 
  workProfile, 
  departments, 
  onSave, 
  onCancel, 
  isLoading = false 
}: WorkProfileFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<WorkProfileFormData>({
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    homeAddress: "",
    email: "",
    departmentId: ""
  })
  const [errors, setErrors] = useState<Partial<WorkProfileFormData>>({})

  useEffect(() => {
    if (workProfile) {
      setFormData({
        username: workProfile.username,
        firstName: workProfile.firstName,
        lastName: workProfile.lastName,
        phoneNumber: workProfile.phoneNumber,
        homeAddress: workProfile.homeAddress || "",
        email: workProfile.email,
        departmentId: workProfile.departmentId
      })
    }
  }, [workProfile])

  const validateForm = (): boolean => {
    const newErrors: Partial<WorkProfileFormData> = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Department validation
    if (!formData.departmentId) {
      newErrors.departmentId = "Please select a department"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      })
      return
    }

    try {
      await onSave(formData)
      toast({
        title: "Success",
        description: workProfile ? "Work profile updated successfully" : "Work profile created successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save work profile",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: keyof WorkProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {workProfile ? "Edit Work Profile" : "Create Work Profile"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <FormInput
            type="text"
            label="Username"
            icon={<User className="w-4 h-4" />}
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Enter username"
            error={errors.username}
            required
            disabled={isLoading}
          />

          {/* Email */}
          <FormInput
            type="email"
            label="Email"
            icon={<Mail className="w-4 h-4" />}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
            required
            disabled={isLoading}
          />

          {/* First Name */}
          <FormInput
            type="text"
            label="First Name"
            icon={<User className="w-4 h-4" />}
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter first name"
            error={errors.firstName}
            required
            disabled={isLoading}
          />

          {/* Last Name */}
          <FormInput
            type="text"
            label="Last Name"
            icon={<User className="w-4 h-4" />}
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter last name"
            error={errors.lastName}
            required
            disabled={isLoading}
          />

          {/* Phone Number */}
          <FormInput
            type="tel"
            label="Phone Number"
            icon={<Phone className="w-4 h-4" />}
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Enter phone number"
            error={errors.phoneNumber}
            required
            disabled={isLoading}
          />

          {/* Department */}
          <FormSelect
            label="Department"
            icon={<Building2 className="w-4 h-4" />}
            value={formData.departmentId}
            onChange={(e) => handleInputChange("departmentId", e.target.value)}
            placeholder="Select a department"
            error={errors.departmentId}
            required
            disabled={isLoading}
            options={Array.isArray(departments) ? departments.map(dept => ({
              value: dept.id,
              label: dept.name
            })) : []}
          />
        </div>

        {/* Home Address */}
        <FormTextarea
          label="Home Address"
          icon={<MapPin className="w-4 h-4" />}
          value={formData.homeAddress}
          onChange={(e) => handleInputChange("homeAddress", e.target.value)}
          placeholder="Enter home address"
          rows={3}
          disabled={isLoading}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-600 hover:bg-slate-100 hover:text-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : workProfile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}
