import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1C1C1C] text-[#E8A838] hover:bg-[#2C2C2C]",
        secondary: "bg-[#F5F2EC] text-[#1C1C1C] hover:bg-[#EDE8E0]",
        outline: "border border-[#E8E2D8] bg-white hover:bg-[#F5F2EC] text-[#1C1C1C]",
        ghost: "hover:bg-[#F5F2EC] text-[#1C1C1C]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        amber: "bg-[#E8A838] text-[#1C1C1C] hover:bg-[#D4943A] font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
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
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
