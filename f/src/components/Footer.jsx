import { motion } from 'framer-motion'
import { Shield, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const LINKS = [
    { heading: 'Platform', items: ['Detection API', 'Analytics', 'Documentation', 'Changelog'] },
    { heading: 'Company',  items: ['About', 'Research', 'Blog', 'Careers'] },
    { heading: 'Legal',    items: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'] },
  ]

  return (
    <footer
      className="relative mt-24 border-t"
      style={{ borderColor: 'rgba(6,182,212,0.08)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom center, rgba(6,182,212,0.03), transparent 60%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))',
                  border: '1px solid rgba(6,182,212,0.25)',
                }}
              >
                <Shield size={16} style={{ color: '#06b6d4' }} />
              </div>
              <span className="font-display font-semibold" style={{ color: '#e2e8f0' }}>
                DeepShield AI
              </span>
            </div>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: 'rgba(100,116,139,0.7)', fontWeight: 300, maxWidth: 200 }}
            >
              Enterprise neural deepfake detection for the modern intelligence landscape.
            </p>
            <div className="flex gap-3 mt-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="flex items-center justify-center w-8 h-8 rounded-lg glass"
                  style={{ border: '1px solid rgba(6,182,212,0.1)' }}
                  whileHover={{ scale: 1.1, borderColor: 'rgba(6,182,212,0.3)' }}
                >
                  <Icon size={13} style={{ color: 'rgba(100,116,139,0.7)' }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map(col => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span
                className="mono text-xs font-medium tracking-widest"
                style={{ color: 'rgba(100,116,139,0.5)', fontSize: '10px', letterSpacing: '0.2em' }}
              >
                {col.heading.toUpperCase()}
              </span>
              <div className="flex flex-col gap-2.5">
                {col.items.map(item => (
                  <motion.a
                    key={item}
                    href="#"
                    className="font-body text-sm"
                    style={{ color: 'rgba(100,116,139,0.7)' }}
                    whileHover={{ color: '#e2e8f0', x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(6,182,212,0.06)' }}
        >
          <span
            className="mono text-xs"
            style={{ color: 'rgba(100,116,139,0.4)', fontSize: '10px', letterSpacing: '0.1em' }}
          >
            © 2024 DEEPSHIELD AI. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full status-dot-green"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              className="mono text-xs"
              style={{ color: 'rgba(52,211,153,0.6)', fontSize: '10px', letterSpacing: '0.15em' }}
            >
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
