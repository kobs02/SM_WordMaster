import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-700 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer", // 기본 스타일 설정
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-pink-100 hover:text-primary-foreground hover:shadow-lg active:bg-primary-700", // hover 상태에서 연한 분홍색으로 변경
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg active:bg-destructive/80",
        outline:
          "bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary-400 border-none shadow-md active:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg active:bg-secondary/70",
        ghost:
          "hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg active:bg-accent",
        link:
          "text-primary underline-offset-4 hover:underline shadow-md hover:shadow-lg active:text-primary/80",
        gradient:
          "bg-gradient-to-r from-primary-600 to-primary-500 text-primary-foreground shadow-md hover:from-primary-500 hover:to-primary-400 hover:shadow-lg active:from-primary-400 active:to-primary-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
