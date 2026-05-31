import { useCallback } from 'react'

/**
 * useMouseGradient
 * Returns an onMouseMove handler that sets a CSS radial gradient glow
 * following the cursor inside any card element.
 *
 * Usage:
 *   const { handleMouseMove, handleMouseLeave } = useMouseGradient()
 *   <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
 */
export function useMouseGradient(
  color = 'rgba(6,182,212,0.12)',
  size  = 300
) {
  const handleMouseMove = useCallback((e) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top
    el.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 80%), rgba(15,23,42,0.5)`
  }, [color, size])

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.background = 'rgba(15,23,42,0.5)'
  }, [])

  return { handleMouseMove, handleMouseLeave }
}
