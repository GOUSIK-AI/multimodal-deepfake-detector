import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Platform',  href: '#platform' },
  { label: 'Detection', href: '#upload' },
  { label: 'Analytics', href: '#stats' },
  { label: 'About',     href: '#about' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="mx-auto transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(2,6,23,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(30px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(6,182,212,0.1)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div
              className="relative flex items-center justify-center rounded-lg"
              style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(6,182,212,0.3)',
                boxShadow: '0 0 16px rgba(6,182,212,0.2)',
              }}
            >
              <Shield size={16} style={{ color: '#06b6d4' }} />
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ border: '1px solid rgba(6,182,212,0.5)' }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-display font-semibold text-sm tracking-wider"
                style={{ color: '#e2e8f0', letterSpacing: '0.08em' }}
              >
                DeepShield
              </span>
              <span
                className="mono text-xs tracking-widest"
                style={{ color: 'rgba(6,182,212,0.7)', letterSpacing: '0.2em', fontSize: '9px' }}
              >
                AI PLATFORM
              </span>
            </div>
          </motion.div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="font-body text-sm font-medium transition-all duration-300"
                style={{ color: 'rgba(148,163,184,0.8)' }}
                whileHover={{ color: '#e2e8f0', y: -1 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full mono text-xs"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: 'rgba(52,211,153,0.8)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="w-1.5 h-1.5 rounded-full status-dot-green" />
              SYSTEMS ONLINE
            </motion.div>

            <motion.button
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap size={13} />
              Analyze Now
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'rgba(6,182,212,0.8)', background: 'rgba(6,182,212,0.08)' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden glass-heavy"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-sm py-2"
                  style={{ color: 'rgba(148,163,184,0.9)' }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
