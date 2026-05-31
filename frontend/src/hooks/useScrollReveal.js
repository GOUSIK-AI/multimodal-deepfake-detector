import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal
 * Returns a ref and a boolean isVisible.
 * Apply ref to any element; it becomes 'visible' when 20% enters the viewport.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref       = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
