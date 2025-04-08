import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    }

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 py-1 text-xs",
      lg: "h-12 px-6 py-3 text-base",
      icon: "h-10 w-10 p-0",
    }

    const Comp = asChild ? (
      React.cloneElement(props.children as React.ReactElement, {
        className: cn(baseStyles, variants[variant], sizes[size], className),
        ref,
        ...props,
      })
    ) : (
      <button className={cn(baseStyles, variants[variant], sizes[size], className)} ref={ref} {...props} />
    )

    return Comp
  },
)

Button.displayName = "Button"

export { Button }