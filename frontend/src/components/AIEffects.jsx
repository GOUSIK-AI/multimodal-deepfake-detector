import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Mouse-follow gradient glow — attaches to a card container
export const MouseGlow = ({ color = '#06b6d4', intensity = 0.15 }) => {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { damping: 20, stiffness: 150 })
  const springY = useSpring(my, { damping: 20, stiffness: 150 })

  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const handler = (e) => {
      const rect = el.getBoundingClientRect()
      mx.set(e.clientX - rect.left)
      my.set(e.clientY - rect.top)
    }
    el.addEventListener('mousemove', handler)
    return () => el.removeEventListener('mousemove', handler)
  }, [mx, my])

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none rounded-full"
      style={{
        width:  300,
        height: 300,
        x:      springX,
        y:      springY,
        translateX: '-50%',
        translateY: '-50%',
        background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2,'0')}, transparent 70%)`,
        filter: 'blur(40px)',
        zIndex: 0,
      }}
    />
  )
}

// Holographic overlay for cards
export const HolographicCard = ({ children, className = '', style = {} }) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <div className="holographic absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.4 }} />
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// Section reveal animation wrapper
export const RevealSection = ({ children, delay = 0, direction = 'up' }) => {
  const directions = {
    up:    { y: 40, x: 0 },
    down:  { y: -40, x: 0 },
    left:  { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', ...directions[direction] }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Animated scan overlay
export const ScanOverlay = ({ active = true }) => {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <div className="scan-line" />
      {/* Vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(6,182,212,0.04) 0%, transparent 10%, transparent 90%, rgba(6,182,212,0.04) 100%)',
        }}
      />
    </div>
  )
}

// Neural pulse ring effect
export const NeuralPulse = ({ size = 60, color = '#06b6d4', delay = 0 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size, height: size,
      border: `1px solid ${color}40`,
      left: '50%', top: '50%',
      x: '-50%', y: '-50%',
    }}
    animate={{
      scale: [1, 2, 2.5],
      opacity: [0.6, 0.2, 0],
    }}
    transition={{
      duration: 2.5,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
)

export default { MouseGlow, HolographicCard, RevealSection, ScanOverlay, NeuralPulse }
