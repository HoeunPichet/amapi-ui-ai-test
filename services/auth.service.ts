import { User } from "@/types"

// Static credentials as specified
const STATIC_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

class AuthService {
  private currentUser: User | null = null
  private token: string | null = null

  constructor() {
    // Check for existing session on initialization
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("amapi_user")
      const storedToken = localStorage.getItem("amapi_token")
      
      if (storedUser && storedToken) {
        this.currentUser = JSON.parse(storedUser)
        this.token = storedToken
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check static credentials
    if (
      credentials.email === STATIC_CREDENTIALS.email &&
      credentials.password === STATIC_CREDENTIALS.password
    ) {
      const user: User = {
        id: "1",
        name: "Admin User",
        email: credentials.email,
        role: "admin",
        status: "active",
        avatar: "/avatars/admin.png",
        lastLogin: new Date(),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date()
      }

      const token = this.generateToken()

      this.currentUser = user
      this.token = token

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("amapi_user", JSON.stringify(user))
        localStorage.setItem("amapi_token", token)
      }

      return {
        success: true,
        user,
        token
      }
    }

    return {
      success: false,
      message: "Invalid email or password"
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    this.token = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("amapi_user")
      localStorage.removeItem("amapi_token")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null
  }

  hasRole(role: User["role"]): boolean {
    return this.currentUser?.role === role
  }

  hasAnyRole(roles: User["role"][]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false
  }

  private generateToken(): string {
    // Generate a simple JWT-like token
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(JSON.stringify({ 
      userId: "1", 
      email: STATIC_CREDENTIALS.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }))
    const signature = btoa("amapi-secret-key")
    
    return `${header}.${payload}.${signature}`
  }

  async refreshToken(): Promise<string | null> {
    if (!this.isAuthenticated()) {
      return null
    }

    // Generate new token
    const newToken = this.generateToken()
    this.token = newToken

    if (typeof window !== "undefined") {
      localStorage.setItem("amapi_token", newToken)
    }

    return newToken
  }
}

// Export singleton instance
export const authService = new AuthService()
