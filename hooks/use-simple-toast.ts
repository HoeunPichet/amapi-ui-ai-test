"use client"

export interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
  duration?: number
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    if (typeof window !== "undefined" && (window as any).addToast) {
      ;(window as any).addToast(options)
    }
  }

  return { toast }
}
