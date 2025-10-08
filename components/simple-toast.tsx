"use client"

import { useState, useEffect } from "react"
// Simple icons without external dependencies
const XIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
const CheckIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
const AlertIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
const InfoIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-primary-500 bg-primary-50 text-primary-900"
      case "destructive":
        return "border-accent-500 bg-accent-50 text-accent-900"
      default:
        return "border-secondary-300 bg-white text-secondary-900"
    }
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckIcon />
      case "destructive":
        return <AlertIcon />
      default:
        return <InfoIcon />
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-300",
        getVariantStyles(),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1">
          {title && <p className="font-medium">{title}</p>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(id), 300)
        }}
        className="text-secondary-400 hover:text-secondary-600 transition-colors"
      >
        <XIcon />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2)
    const newToast = { ...toast, id, onClose: removeToast }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Expose addToast globally
  useEffect(() => {
    ;(window as any).addToast = addToast
    return () => {
      delete (window as any).addToast
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
