import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Shield, ChevronDown, Activity, Lock, Cpu } from 'lucide-react'

const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const BADGES = [
    { icon: Activity, label: 'Neural Detection', color: '#06b6d4' },
    { icon: Lock,     label: 'Enterprise Security', color: '#8b5cf6' },
    { icon: Cpu,      label: 'AI-Powered Analysis', color: '#ec4899' },
  ]

  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  }
  const staggerItem = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.23,1,0.32,1] } },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: 80 }}
    >
      {/* Parallax background elements */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          y: y2,
          width: 800, height: 800,
          top: '10%', left: '50%',
          x: '-50%',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          y: y1,
          width: 500, height: 500,
          top: '20%', left: '15%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Neural grid accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity }}
      >
        {/* Orbiting rings behind hero */}
        {[300, 420, 540].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              top: '50%', left: '50%',
              x: '-50%', y: '-50%',
              border: `1px solid rgba(6,182,212,${0.06 - i * 0.015})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 10, ease: 'linear', repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Top badge */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border-glow-cyan"
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="mono text-xs tracking-widest" style={{ color: 'rgba(6,182,212,0.8)', letterSpacing: '0.2em' }}>
            NEURAL INTELLIGENCE ENGINE v4.2
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={staggerItem} className="flex flex-col items-center gap-4">
          <h1
            className="font-display font-semibold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', letterSpacing: '-0.03em' }}
          >
            <span style={{ color: '#e2e8f0' }}>Detect </span>
            <span className="gradient-text-full">Deepfakes</span>
            <br />
            <span style={{ color: '#e2e8f0' }}>with </span>
            <span style={{ color: 'rgba(148,163,184,0.7)' }}>
              <TypeAnimation
                sequence={[
                  'Military Precision.',
                  2000,
                  'Neural Intelligence.',
                  2000,
                  'Zero Margin of Error.',
                  2000,
                  'Enterprise-Grade AI.',
                  2000,
                ]}
                speed={50}
                repeat={Infinity}
                wrapper="span"
              />
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={staggerItem}
          className="font-body text-lg max-w-2xl text-balance leading-relaxed"
          style={{ color: 'rgba(148,163,184,0.7)', fontWeight: 300 }}
        >
          DeepShield AI deploys cutting-edge neural forensic analysis to identify synthetic media
          with up to <span style={{ color: '#06b6d4' }}>99.7% confidence</span>. Trusted by
          intelligence agencies and enterprise security teams worldwide.
        </motion.p>

        {/* Badges */}
        <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-3 mt-2">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass"
              style={{ border: `1px solid ${badge.color}25` }}
              whileHover={{ scale: 1.05, borderColor: `${badge.color}60` }}
            >
              <badge.icon size={12} style={{ color: badge.color }} />
              <span className="mono text-xs" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '10px', letterSpacing: '0.1em' }}>
                {badge.label.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-4 mt-4">
          <motion.button
            className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-medium text-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Shield size={15} />
            Start Analysis
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-medium text-sm glass"
            style={{ color: 'rgba(148,163,184,0.9)', border: '1px solid rgba(148,163,184,0.1)' }}
            whileHover={{ scale: 1.04, borderColor: 'rgba(6,182,212,0.3)', color: '#e2e8f0' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Platform
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={staggerItem}
          className="flex flex-wrap justify-center gap-8 mt-8 pt-8"
          style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}
        >
          {[
            { value: '99.7%', label: 'Detection Accuracy' },
            { value: '<2s',   label: 'Analysis Time' },
            { value: '50M+',  label: 'Videos Analyzed' },
            { value: 'AES-256', label: 'Encryption' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="font-display font-semibold"
                style={{ fontSize: '1.4rem', color: '#e2e8f0' }}
              >
                {stat.value}
              </span>
              <span
                className="mono text-xs"
                style={{ color: 'rgba(100,116,139,0.8)', letterSpacing: '0.1em', fontSize: '10px' }}
              >
                {stat.label.toUpperCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="mono text-xs" style={{ color: 'rgba(100,116,139,0.5)', letterSpacing: '0.2em', fontSize: '9px' }}>
          SCROLL
        </span>
        <ChevronDown size={14} style={{ color: 'rgba(6,182,212,0.4)' }} />
      </motion.div>
    </section>
  )
}

export default Hero
