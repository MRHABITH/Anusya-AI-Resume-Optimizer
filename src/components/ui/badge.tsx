import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // Since we don't have full tailwind config with primary/secondary/destructive colors set up properly 
    // (based on button implementation which uses hardcoded colors), let's map these to actual tailwind classes.
    const simpleVariants = {
      default: "border-transparent bg-gray-900 text-white hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900",
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50",
      destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
      outline: "text-gray-950 dark:text-gray-50 border border-gray-200 dark:border-gray-800",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          simpleVariants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
