'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export function GlobalLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [pathname])

  if (!loading) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 pointer-events-none transition-all animate-fade-in">
      <Spinner size="lg" className="text-orange-500" />
    </div>
  )
}
