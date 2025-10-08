export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  status: "active" | "inactive"
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Device {
  id: string
  name: string
  model: string
  serialNumber: string
  status: "active" | "inactive" | "pending"
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
  status: "active" | "inactive" | "pending"
  deviceCount: number
  userCount: number
  subscription: "basic" | "premium" | "enterprise"
  createdAt: Date
  updatedAt: Date
}

export interface Token {
  id: string
  name: string
  token: string
  type: "api" | "service"
  permissions: string[]
  isActive: boolean
  expiresAt?: Date
  lastUsed?: Date
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
  activeDevices: number
  totalUsers: number
  activeUsers: number
  totalPolicies: number
  activePolicies: number
  totalEnterprises: number
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
