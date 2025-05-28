import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Syncs modal open/close state with a query param in the URL.
 * @param isOpen Whether the modal is open
 * @param setOpen Function to set modal open/close
 * @param modalKey The query param key (e.g., 'task', 'invite', etc)
 */
export function useModalUrlSync(
  isOpen: boolean,
  setOpen: (open: boolean) => void,
  modalKey: string
) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasOpenedByUrl = useRef(false)

  // Open modal if param is present in URL
  useEffect(() => {
    const hasParam = searchParams.get('modal') === modalKey
    if (hasParam && !isOpen) {
      setOpen(true)
      wasOpenedByUrl.current = true
    }
    // If param is missing and modal is open, close it
    if (!hasParam && isOpen) {
      setOpen(false)
    }
    // eslint-disable-next-line
  }, [searchParams, modalKey])

  // When modal opens, push param to URL
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('modal', modalKey)
      router.push(`?${params.toString()}`, { scroll: false })
    } else {
      // When modal closes, remove param
      const params = new URLSearchParams(searchParams.toString())
      if (params.get('modal') === modalKey) {
        params.delete('modal')
        // If modal was opened by URL, go back in history
        if (wasOpenedByUrl.current) {
          router.back()
          wasOpenedByUrl.current = false
        } else {
          router.replace(`?${params.toString()}`, { scroll: false })
        }
      }
    }
    // eslint-disable-next-line
  }, [isOpen, modalKey])
}
