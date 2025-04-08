import React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "relative h-5 w-10 rounded-full transition-colors",
            checked || defaultChecked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600",
            className,
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              checked || defaultChecked ? "translate-x-5" : "translate-x-0",
            )}
          />
        </div>
      </div>
    )
  },
)
Switch.displayName = "Switch"

export { Switch }
