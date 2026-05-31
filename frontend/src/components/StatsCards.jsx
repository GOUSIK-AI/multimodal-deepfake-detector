import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import CountUp from 'react-countup'
import { Shield, Activity, Globe, Lock, Cpu, TrendingUp } from 'lucide-react'

const STATS = [
  {
    icon: Activity,
    value: 99.7, suffix: '%',
    label: 'Detection Accuracy',
    sub: 'Neural ensemble model',
    color: '#06b6d4',
  },
  {
    icon: Globe,
    value: 50, suffix: 'M+',
    label: 'Videos Analyzed',
    sub: 'Across 140+ countries',
    color: '#8b5cf6',
  },
  {
    icon: TrendingUp,
    value: 1.14, suffix: 's',
    label: 'Avg. Analysis Time',
    sub: 'Real-time inference',
    color: '#ec4899',
    decimals: 2,
  },
  {
    icon: Shield,
    value: 99.9, suffix: '%',
    label: 'Platform Uptime',
    sub: 'Enterprise SLA',
    color: '#10b981',
  },
  {
    icon: Cpu,
    value: 47, suffix: '',
    label: 'Neural Layers',
    sub: 'Deep forensic model',
    color: '#06b6d4',
  },
  {
    icon: Lock,
    value: 256, suffix: '-bit',
    label: 'AES Encryption',
    sub: 'Military-grade security',
    color: '#8b5cf6',
  },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Forensic-Grade Detection',
    desc: 'Multi-modal analysis across video, audio, and metadata layers using ensemble neural networks trained on 50M+ synthetic samples.',
    color: '#06b6d4',
  },
  {
    icon: Cpu,
    title: 'Neural Intelligence Engine',
    desc: 'Proprietary transformer architecture with 47 specialized detection layers identifying GAN artifacts, temporal inconsistencies, and frequency anomalies.',
    color: '#8b5cf6',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    desc: 'AES-256 encrypted uploads, zero data retention policy, SOC 2 Type II compliant infrastructure with full audit trail.',
    color: '#ec4899',
  },
]

const StatCard = ({ stat, i }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
      style={{ border: `1px solid ${stat.color}15` }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{
        scale: 1.03,
        borderColor: `${stat.color}30`,
        boxShadow: `0 0 40px ${stat.color}15, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${stat.color}08, transparent 70%)` }}
        whileHover={{ scale: 1.5, opacity: 1 }}
      />

      <stat.icon size={18} style={{ color: stat.color, marginBottom: 12 }} />

      <div className="font-display font-semibold" style={{ fontSize: '2rem', color: '#e2e8f0', lineHeight: 1 }}>
        {inView ? (
          <CountUp
            end={stat.value}
            duration={2}
            decimals={stat.decimals || (stat.value % 1 !== 0 ? 1 : 0)}
            suffix={stat.suffix}
          />
        ) : '—'}
      </div>
      <div className="font-display text-sm font-medium mt-1" style={{ color: 'rgba(148,163,184,0.9)' }}>
        {stat.label}
      </div>
      <div className="mono text-xs mt-1" style={{ color: 'rgba(100,116,139,0.55)', fontSize: '10px' }}>
        {stat.sub}
      </div>
    </motion.div>
  )
}

const StatsCards = () => {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section id="stats" className="relative py-24 px-6">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <span className="mono text-xs" style={{ color: 'rgba(139,92,246,0.8)', letterSpacing: '0.2em', fontSize: '10px' }}>
              PLATFORM INTELLIGENCE
            </span>
          </div>
          <h2
            className="font-display font-semibold text-4xl md:text-5xl"
            style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}
          >
            Built for{' '}
            <span className="gradient-text-cyan">Enterprise</span>
          </h2>
          <p
            className="font-body text-lg mt-4 max-w-xl mx-auto"
            style={{ color: 'rgba(100,116,139,0.8)', fontWeight: 300 }}
          >
            Military-grade deepfake detection trusted by intelligence agencies,
            media organizations, and security teams worldwide.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} i={i} />
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true, margin: '-60px' })
            return (
              <motion.div
                key={feat.title}
                ref={ref}
                className="glass rounded-2xl p-6 relative overflow-hidden"
                style={{ border: `1px solid ${feat.color}15` }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{
                  borderColor: `${feat.color}30`,
                  boxShadow: `0 0 40px ${feat.color}10`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${feat.color}06, transparent)` }}
                />
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}25` }}
                >
                  <feat.icon size={18} style={{ color: feat.color }} />
                </div>
                <h4 className="font-display font-semibold mb-2" style={{ color: '#e2e8f0', fontSize: '1rem' }}>
                  {feat.title}
                </h4>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(100,116,139,0.75)', fontWeight: 300 }}>
                  {feat.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StatsCards
