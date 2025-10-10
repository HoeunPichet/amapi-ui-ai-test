import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  userName: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const deviceSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  model: z.string().min(1, "Device model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  status: z.enum(["active", "inactive", "pending"]),
})

export const policySchema = z.object({
  name: z.string().min(1, "Policy name is required"),
  description: z.string().min(1, "Policy description is required"),
  type: z.enum(["security", "compliance", "app_management"]),
  isActive: z.boolean(),
})

export const enterpriseSchema = z.object({
  name: z.string().min(1, "Enterprise name is required"),
  domain: z.string().min(1, "Domain is required"),
  adminEmail: z.string().email("Please enter a valid admin email"),
  status: z.enum(["active", "inactive", "pending"]),
})

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "user", "viewer"]),
  status: z.enum(["active", "inactive"]),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z.object({
  otp: z.string().min(6, "Verification code must be 6 digits").max(6, "Verification code must be 6 digits"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>
export type DeviceForm = z.infer<typeof deviceSchema>
export type PolicyForm = z.infer<typeof policySchema>
export type EnterpriseForm = z.infer<typeof enterpriseSchema>
export type UserForm = z.infer<typeof userSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
