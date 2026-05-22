import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1C1C1C] text-[#E8A838]",
        secondary: "bg-[#F5F2EC] text-[#1C1C1C]",
        amber: "bg-[#FDF3DC] text-[#B8841C]",
        green: "bg-[#E6F4EA] text-[#2D7D46]",
        blue: "bg-[#E8F0FB] text-[#1E5BA8]",
        destructive: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
