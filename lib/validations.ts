import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

export type LoginForm = z.infer<typeof loginSchema>
export type DeviceForm = z.infer<typeof deviceSchema>
export type PolicyForm = z.infer<typeof policySchema>
export type EnterpriseForm = z.infer<typeof enterpriseSchema>
export type UserForm = z.infer<typeof userSchema>
