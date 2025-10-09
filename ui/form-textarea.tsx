"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, icon, required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            {icon}
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-slate-400">
              {icon}
            </div>
          )}
          <textarea
            className={cn(
              "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              error ? "border-red-500" : "border-primary-300",
              icon ? "pl-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
