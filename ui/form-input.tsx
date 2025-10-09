"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
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
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

FormInput.displayName = "FormInput"

export { FormInput }
