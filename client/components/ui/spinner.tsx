import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeVariants = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-orange-500',
        sizeVariants[size],
        className
      )}
    />
  )
}

export function LoadingOverlay({ children }: { children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {children && <p className="text-gray-700">{children}</p>}
      </div>
    </div>
  )
}
