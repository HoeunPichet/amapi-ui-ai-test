// Use relative URLs that will be rewritten by Next.js to auth.amapi.site
const BASE_URL = "";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  id_token?: string;
  "not-before-policy"?: string;
  session_state?: string;
  scope?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    name?: string;
  };
  message?: string;
  error?: string;
}

// Removed conflicting interface named ApiError to avoid merging with class declaration

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const res = await fetch(`/api/v1/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Login failed. Please try again.";
      
      if (res.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (res.status === 400) {
        errorMessage = "Please check your email and password format.";
      } else if (res.status === 429) {
        errorMessage = "Too many login attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in,
      refresh_expires_in: responseData.refresh_expires_in,
      refresh_token: responseData.refresh_token,
      token_type: responseData.token_type,
      id_token: responseData.id_token,
      "not-before-policy": responseData["not-before-policy"],
      session_state: responseData.session_state,
      scope: responseData.scope,
      user: responseData.user,
      message: responseData.message
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const res = await fetch(`/api/v1/auth/signup`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Registration failed. Please try again.";
      
      if (res.status === 400) {
        errorMessage = "Please check your information and try again.";
      } else if (res.status === 409) {
        errorMessage = "An account with this email already exists. Please use a different email or try signing in.";
      } else if (res.status === 429) {
        errorMessage = "Too many registration attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in,
      refresh_expires_in: responseData.refresh_expires_in,
      refresh_token: responseData.refresh_token,
      token_type: responseData.token_type,
      id_token: responseData.id_token,
      "not-before-policy": responseData["not-before-policy"],
      session_state: responseData.session_state,
      scope: responseData.scope,
      user: responseData.user,
      message: responseData.message
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`/api/v1/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      throw new ApiError(
        responseData.message || responseData.error || responseData.detail || "Token refresh failed",
        res.status
      );
    }

    return {
      success: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in,
      refresh_expires_in: responseData.refresh_expires_in,
      refresh_token: responseData.refresh_token,
      token_type: responseData.token_type,
      id_token: responseData.id_token,
      "not-before-policy": responseData["not-before-policy"],
      session_state: responseData.session_state,
      scope: responseData.scope,
      user: responseData.user,
      message: responseData.message
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  try {
    const res = await fetch(`/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Verification failed. Please try again.";
      
      if (res.status === 400) {
        errorMessage = "Invalid verification code. Please check the code and try again.";
      } else if (res.status === 401) {
        errorMessage = "Verification code has expired. Please request a new code.";
      } else if (res.status === 404) {
        errorMessage = "Verification code not found. Please request a new code.";
      } else if (res.status === 429) {
        errorMessage = "Too many verification attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in,
      refresh_expires_in: responseData.refresh_expires_in,
      refresh_token: responseData.refresh_token,
      token_type: responseData.token_type,
      id_token: responseData.id_token,
      "not-before-policy": responseData["not-before-policy"],
      session_state: responseData.session_state,
      scope: responseData.scope,
      user: responseData.user,
      message: responseData.message
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function resendOtp(data: ResendOtpRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/v1/auth/resend-otp`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Failed to resend verification code. Please try again.";
      
      if (res.status === 400) {
        errorMessage = "Please check your email address and try again.";
      } else if (res.status === 404) {
        errorMessage = "Email not found. Please check your email address.";
      } else if (res.status === 429) {
        errorMessage = "Too many resend attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      message: responseData.message || "Verification code sent successfully"
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("API forgotPassword request:", data)
    
    const res = await fetch(`/api/v1/auth/forget-password`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("API forgotPassword response status:", res.status)
    const responseData = await res.json();
    console.log("API forgotPassword response data:", responseData)

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Failed to send reset code. Please try again.";
      
      if (res.status === 400) {
        errorMessage = "Please check your email address and try again.";
      } else if (res.status === 404) {
        errorMessage = "Email not found. Please check your email address.";
      } else if (res.status === 429) {
        errorMessage = "Too many reset attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      message: responseData.message || "Password reset code sent successfully"
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
  try {
    console.log("API resetPassword request:", data)
    
    const res = await fetch(`/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("API resetPassword response status:", res.status)
    const responseData = await res.json();
    console.log("API resetPassword response data:", responseData)

    if (!res.ok) {
      // Handle validation errors from the API
      if (responseData.errors && Array.isArray(responseData.errors)) {
        const validationErrors = responseData.errors.map((err: any) => err.message || err.detail).join(', ');
        throw new ApiError(validationErrors, res.status);
      }
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Password reset failed. Please try again.";
      
      if (res.status === 400) {
        errorMessage = "Invalid reset code or password. Please check and try again.";
      } else if (res.status === 401) {
        errorMessage = "Reset code has expired. Please request a new code.";
      } else if (res.status === 404) {
        errorMessage = "Reset code not found. Please request a new code.";
      } else if (res.status === 429) {
        errorMessage = "Too many reset attempts. Please wait a moment and try again.";
      } else if (res.status >= 500) {
        errorMessage = "Please check your information and try again.";
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      throw new ApiError(errorMessage, res.status);
    }

    return {
      success: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in,
      refresh_expires_in: responseData.refresh_expires_in,
      refresh_token: responseData.refresh_token,
      token_type: responseData.token_type,
      id_token: responseData.id_token,
      "not-before-policy": responseData["not-before-policy"],
      session_state: responseData.session_state,
      scope: responseData.scope,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export async function logoutUser(token: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch (error) {
    // Logout should not fail even if the server is unreachable
    console.warn("Logout request failed:", error);
  }
}
