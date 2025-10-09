import { 
  Device, 
  Policy, 
  Enterprise, 
  User, 
  Department,
  Token, 
  DashboardStats, 
  Activity,
  Application,
  ApplicationCollection,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from "@/types"

class AmapiService {
  private baseUrl = "/api/amapi"

  // Mock data for development
  private mockDevices: Device[] = [
    {
      id: "1",
      name: "Samsung Galaxy S24",
      model: "SM-S921B",
      serialNumber: "R58M123ABC",
      status: "active",
      osVersion: "Android 14",
      lastSync: new Date("2024-01-15T10:30:00Z"),
      batteryLevel: 85,
      storageUsed: 64,
      storageTotal: 128,
      enterpriseId: "ent-1",
      userId: "user-1",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T10:30:00Z")
    },
    {
      id: "2",
      name: "Google Pixel 8 Pro",
      model: "G1MNW",
      serialNumber: "1A2B3C4D5E",
      status: "inactive",
      osVersion: "Android 14",
      lastSync: new Date("2024-01-10T15:45:00Z"),
      batteryLevel: 42,
      storageUsed: 89,
      storageTotal: 256,
      enterpriseId: "ent-1",
      userId: "user-2",
      createdAt: new Date("2024-01-05T00:00:00Z"),
      updatedAt: new Date("2024-01-10T15:45:00Z")
    }
  ]

  private mockPolicies: Policy[] = [
    {
      id: "1",
      name: "Security Policy",
      description: "Basic security requirements for all devices",
      type: "security",
      isActive: true,
      rules: [
        {
          id: "rule-1",
          name: "Screen Lock",
          type: "screen_lock",
          value: true,
          description: "Require screen lock on all devices"
        }
      ],
      appliedDevices: ["1", "2"],
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    }
  ]

  private mockEnterprises: Enterprise[] = [
    {
      id: "ent-1",
      name: "TechCorp Inc",
      domain: "techcorp.com",
      adminEmail: "admin@techcorp.com",
      status: "active",
      deviceCount: 2,
      userCount: 5,
      subscription: "premium",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    }
  ]

  private mockDepartments: Department[] = [
    {
      id: "dept-1",
      name: "Engineering",
      description: "Software development and technical operations",
      managerId: "user-1",
      userCount: 15,
      status: "active",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    },
    {
      id: "dept-2",
      name: "Marketing",
      description: "Marketing and communications team",
      managerId: "user-2",
      userCount: 8,
      status: "active",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    },
    {
      id: "dept-3",
      name: "Human Resources",
      description: "HR and employee relations",
      userCount: 5,
      status: "active",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    }
  ]

  private mockUsers: User[] = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@techcorp.com",
      role: "user",
      status: "active",
      departmentId: "dept-1",
      lastLogin: new Date("2024-01-15T09:00:00Z"),
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T09:00:00Z")
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@techcorp.com",
      role: "user",
      status: "active",
      departmentId: "dept-2",
      lastLogin: new Date("2024-01-14T16:30:00Z"),
      createdAt: new Date("2024-01-02T00:00:00Z"),
      updatedAt: new Date("2024-01-14T16:30:00Z")
    }
  ]

  private mockTokens: Token[] = [
    {
      id: "token-1",
      name: "API Access Token",
      token: "amapi_sk_1234567890abcdef",
      type: "api",
      permissions: ["read:devices", "write:devices", "read:policies"],
      isActive: true,
      lastUsed: new Date("2024-01-15T08:00:00Z"),
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T08:00:00Z")
    }
  ]

  private mockApplications: Application[] = [
    {
      id: "app-1",
      name: "Gmail",
      type: "Public App",
      packageName: "com.google.android.gm",
      autoUpdateMode: "enabled",
      description: "Google's email client",
      version: "2024.01.15",
      iconUrl: "https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w240-h480-rw",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.google.android.gm",
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    },
    {
      id: "app-2",
      name: "Morningmate",
      type: "Private App",
      packageName: "com.morningmate.app",
      autoUpdateMode: "wifi_only",
      description: "Team communication and productivity app",
      version: "2.1.0",
      isActive: true,
      createdAt: new Date("2024-01-05T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    },
    {
      id: "app-3",
      name: "Company Portal",
      type: "Web App",
      packageName: "com.company.portal",
      autoUpdateMode: "disabled",
      description: "Internal company web application",
      version: "1.0.0",
      isActive: true,
      createdAt: new Date("2024-01-10T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    }
  ]

  private mockApplicationCollections: ApplicationCollection[] = [
    {
      id: "collection-1",
      name: "Tools",
      description: "Essential productivity tools",
      applicationIds: ["app-1", "app-2"],
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    },
    {
      id: "collection-2",
      name: "My Work Apps",
      description: "Applications for work productivity",
      applicationIds: ["app-1", "app-3"],
      isActive: true,
      createdAt: new Date("2024-01-05T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    }
  ]

  // Simulate API delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.delay()
    
    const stats: DashboardStats = {
      totalDevices: this.mockDevices.length,
      activeDevices: this.mockDevices.filter(d => d.status === "active").length,
      totalUsers: this.mockUsers.length,
      activeUsers: this.mockUsers.filter(u => u.status === "active").length,
      totalPolicies: this.mockPolicies.length,
      activePolicies: this.mockPolicies.filter(p => p.isActive).length,
      totalEnterprises: this.mockEnterprises.length,
      recentActivity: [
        {
          id: "act-1",
          type: "device_added",
          description: "New device Samsung Galaxy S24 added",
          deviceId: "1",
          timestamp: new Date("2024-01-15T10:30:00Z")
        },
        {
          id: "act-2",
          type: "policy_applied",
          description: "Security Policy applied to device",
          policyId: "1",
          deviceId: "1",
          timestamp: new Date("2024-01-15T09:15:00Z")
        }
      ]
    }

    return { success: true, data: stats }
  }

  // Devices
  async getDevices(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Device>>> {
    await this.delay()
    
    let devices = [...this.mockDevices]
    
    if (params?.search) {
      devices = devices.filter(d => 
        d.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        d.model.toLowerCase().includes(params.search!.toLowerCase()) ||
        d.serialNumber.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = devices.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: devices.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getDevice(id: string): Promise<ApiResponse<Device>> {
    await this.delay()
    const device = this.mockDevices.find(d => d.id === id)
    
    if (!device) {
      return { success: false, error: "Device not found" }
    }

    return { success: true, data: device }
  }

  async createDevice(deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Device>> {
    await this.delay()
    
    const newDevice: Device = {
      ...deviceData,
      id: `device-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockDevices.push(newDevice)
    return { success: true, data: newDevice }
  }

  async updateDevice(id: string, deviceData: Partial<Device>): Promise<ApiResponse<Device>> {
    await this.delay()
    
    const index = this.mockDevices.findIndex(d => d.id === id)
    if (index === -1) {
      return { success: false, error: "Device not found" }
    }

    this.mockDevices[index] = {
      ...this.mockDevices[index],
      ...deviceData,
      updatedAt: new Date()
    }

    return { success: true, data: this.mockDevices[index] }
  }

  async deleteDevice(id: string): Promise<ApiResponse<void>> {
    await this.delay()
    
    const index = this.mockDevices.findIndex(d => d.id === id)
    if (index === -1) {
      return { success: false, error: "Device not found" }
    }

    this.mockDevices.splice(index, 1)
    return { success: true }
  }

  // Policies
  async getPolicies(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Policy>>> {
    await this.delay()
    
    let policies = [...this.mockPolicies]
    
    if (params?.search) {
      policies = policies.filter(p => 
        p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        p.description.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = policies.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: policies.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async createPolicy(policyData: Omit<Policy, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Policy>> {
    await this.delay()
    
    const newPolicy: Policy = {
      ...policyData,
      id: `policy-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockPolicies.push(newPolicy)
    return { success: true, data: newPolicy }
  }

  async updatePolicy(id: string, policyData: Partial<Policy>): Promise<ApiResponse<Policy>> {
    await this.delay()
    
    const index = this.mockPolicies.findIndex(p => p.id === id)
    if (index === -1) {
      return { success: false, error: "Policy not found" }
    }

    this.mockPolicies[index] = {
      ...this.mockPolicies[index],
      ...policyData,
      updatedAt: new Date()
    }

    return { success: true, data: this.mockPolicies[index] }
  }

  async deletePolicy(id: string): Promise<ApiResponse<void>> {
    await this.delay()
    
    const index = this.mockPolicies.findIndex(p => p.id === id)
    if (index === -1) {
      return { success: false, error: "Policy not found" }
    }

    this.mockPolicies.splice(index, 1)
    return { success: true }
  }

  // Enterprises
  async getEnterprises(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Enterprise>>> {
    await this.delay()
    
    let enterprises = [...this.mockEnterprises]
    
    if (params?.search) {
      enterprises = enterprises.filter(e => 
        e.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        e.domain.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = enterprises.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: enterprises.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // Users
  async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    await this.delay()
    
    let users = [...this.mockUsers]
    
    if (params?.search) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        u.email.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = users.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: users.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // Departments
  async getDepartments(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Department>>> {
    await this.delay()
    
    let departments = [...this.mockDepartments]
    
    if (params?.search) {
      departments = departments.filter(d => 
        d.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        d.description?.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = departments.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: departments.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getDepartment(id: string): Promise<ApiResponse<Department>> {
    await this.delay()
    const department = this.mockDepartments.find(d => d.id === id)
    
    if (!department) {
      return { success: false, error: "Department not found" }
    }

    return { success: true, data: department }
  }

  async createDepartment(departmentData: Omit<Department, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Department>> {
    await this.delay()
    
    const newDepartment: Department = {
      ...departmentData,
      id: `dept-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockDepartments.push(newDepartment)
    return { success: true, data: newDepartment }
  }

  async updateDepartment(id: string, departmentData: Partial<Department>): Promise<ApiResponse<Department>> {
    await this.delay()
    
    const index = this.mockDepartments.findIndex(d => d.id === id)
    if (index === -1) {
      return { success: false, error: "Department not found" }
    }

    this.mockDepartments[index] = {
      ...this.mockDepartments[index],
      ...departmentData,
      updatedAt: new Date()
    }

    return { success: true, data: this.mockDepartments[index] }
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    await this.delay()
    
    const index = this.mockDepartments.findIndex(d => d.id === id)
    if (index === -1) {
      return { success: false, error: "Department not found" }
    }

    this.mockDepartments.splice(index, 1)
    return { success: true }
  }

  // Tokens
  async getTokens(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Token>>> {
    await this.delay()
    
    let tokens = [...this.mockTokens]
    
    if (params?.search) {
      tokens = tokens.filter(t => 
        t.name.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = tokens.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: tokens.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // Applications
  async getApplications(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Application>>> {
    await this.delay()
    
    let applications = [...this.mockApplications]
    
    if (params?.search) {
      applications = applications.filter(a => 
        a.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        a.packageName.toLowerCase().includes(params.search!.toLowerCase()) ||
        a.description?.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = applications.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: applications.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getApplication(id: string): Promise<ApiResponse<Application>> {
    await this.delay()
    const application = this.mockApplications.find(a => a.id === id)
    
    if (!application) {
      return { success: false, error: "Application not found" }
    }

    return { success: true, data: application }
  }

  async createApplication(applicationData: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Application>> {
    await this.delay()
    
    const newApplication: Application = {
      ...applicationData,
      id: `app-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockApplications.push(newApplication)
    return { success: true, data: newApplication }
  }

  async updateApplication(id: string, applicationData: Partial<Application>): Promise<ApiResponse<Application>> {
    await this.delay()
    
    const index = this.mockApplications.findIndex(a => a.id === id)
    if (index === -1) {
      return { success: false, error: "Application not found" }
    }

    this.mockApplications[index] = {
      ...this.mockApplications[index],
      ...applicationData,
      updatedAt: new Date()
    }

    return { success: true, data: this.mockApplications[index] }
  }

  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    await this.delay()
    
    const index = this.mockApplications.findIndex(a => a.id === id)
    if (index === -1) {
      return { success: false, error: "Application not found" }
    }

    this.mockApplications.splice(index, 1)
    
    // Remove from collections
    this.mockApplicationCollections.forEach(collection => {
      collection.applicationIds = collection.applicationIds.filter(appId => appId !== id)
    })

    return { success: true }
  }

  // Application Collections
  async getApplicationCollections(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<ApplicationCollection>>> {
    await this.delay()
    
    let collections = [...this.mockApplicationCollections]
    
    if (params?.search) {
      collections = collections.filter(c => 
        c.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        c.description?.toLowerCase().includes(params.search!.toLowerCase())
      )
    }

    const total = collections.length
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      success: true,
      data: {
        data: collections.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getApplicationCollection(id: string): Promise<ApiResponse<ApplicationCollection>> {
    await this.delay()
    const collection = this.mockApplicationCollections.find(c => c.id === id)
    
    if (!collection) {
      return { success: false, error: "Application collection not found" }
    }

    return { success: true, data: collection }
  }

  async createApplicationCollection(collectionData: Omit<ApplicationCollection, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<ApplicationCollection>> {
    await this.delay()
    
    const newCollection: ApplicationCollection = {
      ...collectionData,
      id: `collection-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockApplicationCollections.push(newCollection)
    return { success: true, data: newCollection }
  }

  async updateApplicationCollection(id: string, collectionData: Partial<ApplicationCollection>): Promise<ApiResponse<ApplicationCollection>> {
    await this.delay()
    
    const index = this.mockApplicationCollections.findIndex(c => c.id === id)
    if (index === -1) {
      return { success: false, error: "Application collection not found" }
    }

    this.mockApplicationCollections[index] = {
      ...this.mockApplicationCollections[index],
      ...collectionData,
      updatedAt: new Date()
    }

    return { success: true, data: this.mockApplicationCollections[index] }
  }

  async deleteApplicationCollection(id: string): Promise<ApiResponse<void>> {
    await this.delay()
    
    const index = this.mockApplicationCollections.findIndex(c => c.id === id)
    if (index === -1) {
      return { success: false, error: "Application collection not found" }
    }

    this.mockApplicationCollections.splice(index, 1)
    return { success: true }
  }

  async addApplicationToCollection(collectionId: string, applicationId: string): Promise<ApiResponse<ApplicationCollection>> {
    await this.delay()
    
    const collection = this.mockApplicationCollections.find(c => c.id === collectionId)
    if (!collection) {
      return { success: false, error: "Application collection not found" }
    }

    const application = this.mockApplications.find(a => a.id === applicationId)
    if (!application) {
      return { success: false, error: "Application not found" }
    }

    if (!collection.applicationIds.includes(applicationId)) {
      collection.applicationIds.push(applicationId)
      collection.updatedAt = new Date()
    }

    return { success: true, data: collection }
  }

  async removeApplicationFromCollection(collectionId: string, applicationId: string): Promise<ApiResponse<ApplicationCollection>> {
    await this.delay()
    
    const collection = this.mockApplicationCollections.find(c => c.id === collectionId)
    if (!collection) {
      return { success: false, error: "Application collection not found" }
    }

    collection.applicationIds = collection.applicationIds.filter(id => id !== applicationId)
    collection.updatedAt = new Date()

    return { success: true, data: collection }
  }
}

// Export singleton instance
export const amapiService = new AmapiService()
