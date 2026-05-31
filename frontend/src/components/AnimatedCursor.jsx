import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const AnimatedCursor = () => {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 }
  const trailConfig  = { damping: 20, stiffness: 120, mass: 0.8 }

  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  const trailX  = useSpring(mouseX, trailConfig)
  const trailY  = useSpring(mouseY, trailConfig)

  const [hovered, setHovered]     = useState(false)
  const [clicking, setClicking]   = useState(false)
  const [particles, setParticles] = useState([])
  const particleId = useRef(0)

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Spawn cursor particle occasionally
      if (Math.random() > 0.85) {
        const id = particleId.current++
        setParticles(prev => [...prev.slice(-12), {
          id,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
        }])
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 600)
      }
    }

    const handleDown = () => setClicking(true)
    const handleUp   = () => setClicking(false)

    const checkHover = () => {
      const els = document.querySelectorAll('button, a, [data-cursor-hover], input, label')
      const onEnter = () => setHovered(true)
      const onLeave = () => setHovered(false)
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
      return () => els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    const cleanup = checkHover()

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      cleanup()
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Particle trail */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: p.x,
            top:  p.y,
            width:  p.size,
            height: p.size,
            background: p.color,
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Trail ring */}
      <motion.div
        ref={dotRef}
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9997,
          width:  hovered ? 48 : 28,
          height: hovered ? 48 : 28,
          border: `1px solid ${hovered ? 'rgba(139,92,246,0.6)' : 'rgba(6,182,212,0.4)'}`,
          boxShadow: hovered
            ? '0 0 20px rgba(139,92,246,0.4)'
            : '0 0 12px rgba(6,182,212,0.3)',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, box-shadow 0.3s',
        }}
      />

      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          width:  clicking ? 6 : hovered ? 10 : 8,
          height: clicking ? 6 : hovered ? 10 : 8,
          background: hovered ? '#8b5cf6' : '#06b6d4',
          boxShadow: hovered
            ? '0 0 12px rgba(139,92,246,0.9)'
            : '0 0 10px rgba(6,182,212,0.9), 0 0 20px rgba(6,182,212,0.4)',
          transition: 'width 0.2s, height 0.2s, background 0.2s, box-shadow 0.2s',
        }}
      />
    </>
  )
}

export default AnimatedCursor
