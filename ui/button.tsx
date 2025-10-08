import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Simple button variants without class-variance-authority
const getButtonClasses = (variant: string = "default", size: string = "default") => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  
  const variantClasses = {
    default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    outline: "border border-primary-300 bg-background hover:bg-primary-50 hover:text-primary-700",
    secondary: "bg-primary-100 text-primary-900 hover:bg-primary-200",
    ghost: "hover:bg-primary-50 hover:text-primary-700",
    link: "text-primary-500 underline-offset-4 hover:underline",
  }
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-lg px-8",
    icon: "h-10 w-10",
  }
  
  return cn(baseClasses, variantClasses[variant as keyof typeof variantClasses], sizeClasses[size as keyof typeof sizeClasses])
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(getButtonClasses(variant, size), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
