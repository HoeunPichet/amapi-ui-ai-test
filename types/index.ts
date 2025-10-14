export interface User {
  id: string
  name: string
  email: string
  position: "Administrator" | "Manager" | "Employee" | "Viewer"
  status: "Active" | "Inactive"
  loginMethod: "email" | "google" | "github"
  departmentId?: string
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  description?: string
  managerId?: string
  userCount: number
  status: "Active" | "Inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Device {
  id: string
  name: string
  model: string
  serialNumber: string
  status: "Active" | "Inactive" | "pending"
  osVersion: string
  lastSync?: Date
  batteryLevel?: number
  storageUsed?: number
  storageTotal?: number
  enterpriseId: string
  userId?: string
  createdAt: Date
  updatedAt: Date
  // Enhanced device information
  imei?: string
  macId?: string
  ipAddress?: string
  hostName?: string
  groupName?: string
  workProfile?: string
  mode?: "BYOD" | "COBO" | "COPE"
  osName?: string
  kernelVersion?: string
  imageBuildNo?: string
  deviceModel?: string
  processor?: string
  ramTotal?: number
  ramAvailable?: number
  storageFree?: number
  enrollmentToken?: string
}

export interface Policy {
  id: string
  name: string
  description: string
  type: "security" | "compliance" | "app_management"
  isActive: boolean
  rules: PolicyRule[]
  appliedDevices: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PolicyRule {
  id: string
  name: string
  type: string
  value: any
  description: string
}

export interface Enterprise {
  id: string
  name: string
  domain: string
  adminEmail: string
  status: "Active" | "Inactive" | "pending"
  deviceCount: number
  userCount: number
  subscription: "basic" | "premium" | "enterprise"
  createdAt: Date
  updatedAt: Date
}


export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalDevices: number
  totalUsers: number
  activeUsers: number
  totalPolicies: number
  totalEnterprises: number
  totalApplications?: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: "device_added" | "policy_applied" | "user_created" | "enterprise_created"
  description: string
  userId?: string
  deviceId?: string
  policyId?: string
  enterpriseId?: string
  timestamp: Date
}

export interface Application {
  id: string
  name: string
  type: "Public App" | "Private App" | "Web App"
  packageName: string
  autoUpdateMode: "disabled" | "enabled" | "wifi_only"
  description?: string
  version?: string
  iconUrl?: string
  downloadUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApplicationCollection {
  id: string
  name: string
  description?: string
  applicationIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  homeAddress?: string
  email: string
  departmentId: string
  departmentName?: string
  status: "Active" | "Disabled"
  createdAt: Date
  updatedAt: Date
}

export interface WorkProfileFormData {
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  homeAddress?: string
  email: string
  departmentId: string
}

export interface WorkProfileSearchParams {
  username?: string
  departmentId?: string
  status?: "Active" | "Disabled"
}