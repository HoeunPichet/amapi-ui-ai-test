# Authentication System Documentation

## Overview
This authentication system integrates with the Swagger API endpoints from `https://auth.amapi.site/swagger-ui/index.html` to provide secure login and registration functionality.

## API Endpoints
- **POST** `/api/v1/auths/login` → User login
- **POST** `/api/v1/auths/signup` → User registration

## File Structure
```
app/
├── login/page.tsx              # Main login page
├── register/page.tsx           # Main register page
lib/
├── api.ts                      # API service for Swagger endpoints
└── validations.ts              # Zod validation schemas
types/
└── auth.ts                     # TypeScript types for auth
ui/
└── alert.tsx                   # Alert component for error handling
```

## Features

### Login Page (`/login`)
- **Fields**: Email, Password
- **Validation**: Zod schema validation with real-time error display
- **Password Toggle**: Show/hide password functionality
- **Loading States**: Disabled form and loading spinner during submission
- **Error Handling**: Toast notifications and inline error messages
- **Success**: Stores token in localStorage and redirects to `/dashboard`

### Register Page (`/register`)
- **Fields**: Username, Email, First Name, Last Name, Password, Confirm Password
- **Validation**: 
  - Username: 3-20 characters, alphanumeric and underscores only
  - Email: Valid email format
  - First Name: 2-50 characters
  - Last Name: 2-50 characters
  - Password: Minimum 8 characters with uppercase, lowercase, and number
  - Password confirmation: Must match password
- **Password Toggle**: Separate toggles for password and confirm password
- **Two-Step Process**: Registration → OTP Verification → Dashboard
- **OTP Verification**: 6-digit code sent to email after registration
- **Resend OTP**: Users can request a new verification code with 60-second cooldown
- **Success State**: Shows success message and redirects to dashboard
- **Error Handling**: Comprehensive error display and toast notifications

### Forgot Password Page (`app/forgot-password/page.tsx`)
- **Two-Step Process**: Forgot Password → Reset Password → Dashboard
- **Step 1 - Forgot Password**: 
  - Email field with validation
  - Sends OTP to user's email
  - Success message and transition to reset step
- **Step 2 - Reset Password**:
  - Email field (read-only, pre-filled)
  - OTP verification field (6-digit code)
  - New password field with strength requirements
  - Confirm password field with matching validation
  - Password toggle for both password fields
- **Auto-Login**: After successful reset, automatically logs user in and redirects to dashboard
- **Success State**: Shows success message and redirects to dashboard
- **Error Handling**: Comprehensive error display and toast notifications

### API Service (`lib/api.ts`)
- **Base URL**: `https://auth.amapi.site`
- **Endpoints**: 
  - `POST /api/v1/auths/login` - User login
  - `POST /api/v1/auths/signup` - User registration
  - `POST /api/v1/auths/verify-opt` - OTP verification
  - `POST /api/v1/auths/resend-otp` - Resend OTP
  - `POST /api/v1/auths/forget-password` - Forgot password
  - `POST /api/v1/auths/reset-password` - Reset password
  - `POST /api/v1/auths/refresh` - Token refresh
  - `POST /api/v1/auths/logout` - User logout
- **Error Handling**: Custom ApiError class with status codes and validation error parsing
- **Token Management**: Automatic token storage and retrieval
- **Type Safety**: Full TypeScript support with proper interfaces

### Validation (`lib/validations.ts`)
- **Zod Schemas**: Type-safe validation with custom error messages
- **Real-time Validation**: Form validation on input change
- **Password Requirements**: Strong password policy enforcement

## Usage

### Login
```typescript
import { loginUser } from "@/lib/api"

const response = await loginUser({
  email: "user@example.com",
  password: "password123",
  rememberMe: true
})

if (response.success) {
  // Store token and redirect
  localStorage.setItem("amapi_token", response.access_token)
  if (response.refresh_token) {
    localStorage.setItem("amapi_refresh_token", response.refresh_token)
  }
  router.push("/dashboard")
}
```

### Registration
```typescript
import { registerUser, verifyOtp } from "@/lib/api"

// Step 1: Register user
const response = await registerUser({
  userName: "johndoe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "Password123",
  confirmPassword: "Password123"
})

if (response.success) {
  // Step 2: Verify OTP
  const otpResponse = await verifyOtp({
    email: "john@example.com",
    otp: "123456"
  })
  
  if (otpResponse.success) {
    // Store token and redirect to dashboard
    localStorage.setItem("amapi_token", otpResponse.access_token)
    if (otpResponse.refresh_token) {
      localStorage.setItem("amapi_refresh_token", otpResponse.refresh_token)
    }
    router.push("/dashboard")
  }
}

// Resend OTP
const resendResponse = await resendOtp({
  email: "john@example.com"
})

if (resendResponse.success) {
  // New OTP sent successfully
  console.log("New verification code sent")
}

// Forgot Password
const forgotResponse = await forgotPassword({
  email: "john@example.com"
})

if (forgotResponse.success) {
  // Reset code sent successfully
  console.log("Password reset code sent")
}

// Reset Password
const resetResponse = await resetPassword({
  email: "john@example.com",
  otp: "123456",
  newPassword: "NewSecurePassword123"
})

if (resetResponse.success) {
  // Password reset successfully, user is automatically logged in
  localStorage.setItem("amapi_token", resetResponse.access_token)
  if (resetResponse.refresh_token) {
    localStorage.setItem("amapi_refresh_token", resetResponse.refresh_token)
  }
  router.push("/dashboard")
}
```

## Security Features
- **Password Requirements**: Strong password policy
- **Input Validation**: Client-side validation with Zod
- **Error Handling**: Secure error messages without sensitive data exposure
- **Token Storage**: Secure localStorage token management
- **HTTPS**: All API calls use HTTPS endpoints

## Dependencies
- `react-hook-form`: Form handling and validation
- `@hookform/resolvers`: Zod integration for React Hook Form
- `zod`: Schema validation
- `lucide-react`: Icons
- `class-variance-authority`: Component variants

## Error Handling
- **Network Errors**: Graceful handling of network failures
- **Validation Errors**: Real-time form validation with clear messages
- **API Errors**: Server error messages displayed to user
- **Toast Notifications**: User-friendly success/error notifications

## Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tailwind CSS**: Utility-first styling
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation

## Future Enhancements
- Password reset functionality
- Email verification
- Two-factor authentication
- Social login integration
- Session management
- Token refresh mechanism
