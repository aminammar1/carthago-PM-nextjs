import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-orange-400',
  {
    variants: {
      variant: {
        default:
          'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-400 dark:text-neutral-900 dark:hover:bg-orange-500',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:text-white dark:hover:bg-red-800',
        outline:
          'border border-orange-500 bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-400 dark:bg-neutral-950 dark:text-orange-400 dark:hover:bg-orange-900 dark:hover:text-white',
        secondary:
          'bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-800 dark:text-white dark:hover:bg-orange-700',
        ghost:
          'hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-orange-800 dark:hover:text-white',
        link: 'text-orange-700 underline-offset-4 hover:underline dark:text-orange-400',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
