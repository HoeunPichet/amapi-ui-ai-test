import { User } from "@/types"
import { changePassword } from "@/lib/api"

// Static credentials as specified
const STATIC_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123"
}

const GOOGLE_CREDENTIALS = {
  email: "admin.google@gmail.com",
  name: "Google Admin"
}

const GITHUB_CREDENTIALS = {
  email: "admin.github@gmail.com",
  name: "GitHub Admin"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface GoogleLoginCredentials {
  email: string
  name: string
  googleId: string
}

export interface GitHubLoginCredentials {
  email: string
  name: string
  githubId: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface ProfileUpdateCredentials {
  name: string
  email: string
}

export interface PasswordChangeCredentials {
  currentPassword: string
  newPassword: string
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
        position: "Administrator",
        status: "Active",
        loginMethod: "email",
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

  async loginWithGoogle(credentials: GoogleLoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate Google login - accept any Google credentials for demo
    const user: User = {
      id: "2",
      name: credentials.name,
      email: credentials.email,
      position: "Administrator",
      status: "Active",
      loginMethod: "google",
      avatar: "/avatars/google-admin.png",
      lastLogin: new Date(),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date()
    }
    
    const token = this.generateToken()
    this.currentUser = user
    this.token = token
    
    if (typeof window !== "undefined") {
      localStorage.setItem("amapi_user", JSON.stringify(user))
      localStorage.setItem("amapi_token", token)
    }
    
    return { success: true, user, token }
  }

  async loginWithGitHub(credentials: GitHubLoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate GitHub login - accept any GitHub credentials for demo
    const user: User = {
      id: "3",
      name: credentials.name,
      email: credentials.email,
      position: "Administrator",
      status: "Active",
      loginMethod: "github",
      avatar: "/avatars/github-admin.png",
      lastLogin: new Date(),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date()
    }
    
    const token = this.generateToken()
    this.currentUser = user
    this.token = token
    
    if (typeof window !== "undefined") {
      localStorage.setItem("amapi_user", JSON.stringify(user))
      localStorage.setItem("amapi_token", token)
    }
    
    return { success: true, user, token }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if email already exists (in a real app, this would be a database check)
    if (credentials.email === STATIC_CREDENTIALS.email) {
      return {
        success: false,
        message: "An account with this email already exists"
      }
    }

    // Create new user
    const user: User = {
      id: Date.now().toString(), // Simple ID generation
      name: credentials.name,
      email: credentials.email,
      position: "Administrator", // Default position for new registrations
      status: "Active",
      loginMethod: "email",
      avatar: "/avatars/default.png",
      lastLogin: new Date(),
      createdAt: new Date(),
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

  async updateProfile(credentials: ProfileUpdateCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (!this.currentUser) {
      return {
        success: false,
        message: "No user logged in"
      }
    }

    // Check if email is being changed and if it already exists
    if (credentials.email !== this.currentUser.email && credentials.email === STATIC_CREDENTIALS.email) {
      return {
        success: false,
        message: "An account with this email already exists"
      }
    }

    // Update user information
    const updatedUser: User = {
      ...this.currentUser,
      name: credentials.name,
      email: credentials.email,
      updatedAt: new Date()
    }

    this.currentUser = updatedUser

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("amapi_user", JSON.stringify(updatedUser))
    }

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully"
    }
  }

  async changePassword(credentials: PasswordChangeCredentials): Promise<AuthResponse> {
    if (!this.currentUser) {
      return {
        success: false,
        message: "No user logged in"
      }
    }

    // Google users cannot change password
    if (this.currentUser.loginMethod === "google") {
      return {
        success: false,
        message: "Google users cannot change password through this system"
      }
    }

    // Get the current token
    const token = this.getToken()
    if (!token) {
      return {
        success: false,
        message: "No authentication token found"
      }
    }

    try {
      // Use the API endpoint to change password
      const response = await changePassword({
        currentPassword: credentials.currentPassword,
        newPassword: credentials.newPassword
      })

      if (response.success) {
        // Update user timestamp
        const updatedUser: User = {
          ...this.currentUser,
          updatedAt: new Date()
        }

        this.currentUser = updatedUser

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("amapi_user", JSON.stringify(updatedUser))
        }

        return {
          success: true,
          user: updatedUser,
          message: response.message || "Password changed successfully"
        }
      } else {
        return {
          success: false,
          message: response.message || "Password change failed"
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Password change failed"
      }
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

  hasPosition(position: User["position"]): boolean {
    return this.currentUser?.position === position
  }

  hasAnyPosition(positions: User["position"][]): boolean {
    return this.currentUser ? positions.includes(this.currentUser.position) : false
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
