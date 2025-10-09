export interface OtpResponse {
  success: boolean
  message?: string
  otpId?: string
}

export interface VerifyOtpResponse {
  success: boolean
  message?: string
  verified?: boolean
}

class OtpService {
  private otpStorage: Map<string, { otp: string; expires: number; attempts: number }> = new Map()
  private readonly OTP_EXPIRY_MINUTES = 5
  private readonly MAX_ATTEMPTS = 3

  constructor() {
    // Clean up expired OTPs every minute
    setInterval(() => {
      this.cleanupExpiredOtps()
    }, 60000)
  }

  async generateOtp(email: string): Promise<OtpResponse> {
    try {
      // Check if there's already a valid OTP for this email
      const existingOtp = this.otpStorage.get(email)
      if (existingOtp && existingOtp.expires > Date.now()) {
        return {
          success: false,
          message: "OTP already sent. Please wait before requesting a new one."
        }
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000)
      const otpId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store OTP
      this.otpStorage.set(email, {
        otp,
        expires,
        attempts: 0
      })

      // In a real application, you would send this OTP via email/SMS
      console.log(`OTP for ${email}: ${otp}`) // For development only

      return {
        success: true,
        message: `OTP sent to ${email}`,
        otpId
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to generate OTP. Please try again."
      }
    }
  }

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const storedOtp = this.otpStorage.get(email)

      if (!storedOtp) {
        return {
          success: false,
          message: "No OTP found for this email. Please request a new one.",
          verified: false
        }
      }

      // Check if OTP has expired
      if (storedOtp.expires < Date.now()) {
        this.otpStorage.delete(email)
        return {
          success: false,
          message: "OTP has expired. Please request a new one.",
          verified: false
        }
      }

      // Check attempts limit
      if (storedOtp.attempts >= this.MAX_ATTEMPTS) {
        this.otpStorage.delete(email)
        return {
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
          verified: false
        }
      }

      // Increment attempts
      storedOtp.attempts++

      // Verify OTP
      if (storedOtp.otp === otp) {
        // Remove OTP after successful verification
        this.otpStorage.delete(email)
        return {
          success: true,
          message: "OTP verified successfully",
          verified: true
        }
      } else {
        // Update attempts
        this.otpStorage.set(email, storedOtp)
        return {
          success: false,
          message: `Invalid OTP. ${this.MAX_ATTEMPTS - storedOtp.attempts} attempts remaining.`,
          verified: false
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify OTP. Please try again.",
        verified: false
      }
    }
  }

  async resendOtp(email: string): Promise<OtpResponse> {
    try {
      // Remove existing OTP
      this.otpStorage.delete(email)
      
      // Generate new OTP
      return await this.generateOtp(email)
    } catch (error) {
      return {
        success: false,
        message: "Failed to resend OTP. Please try again."
      }
    }
  }

  private cleanupExpiredOtps(): void {
    const now = Date.now()
    for (const [email, otpData] of this.otpStorage.entries()) {
      if (otpData.expires < now) {
        this.otpStorage.delete(email)
      }
    }
  }

  // Development helper method
  getOtpForEmail(email: string): string | null {
    const storedOtp = this.otpStorage.get(email)
    if (storedOtp && storedOtp.expires > Date.now()) {
      return storedOtp.otp
    }
    return null
  }
}

// Export singleton instance
export const otpService = new OtpService()
