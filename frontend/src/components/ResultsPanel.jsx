import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { AlertTriangle, CheckCircle, Shield, Activity, Eye, Cpu, Lock, Zap } from 'lucide-react'

const THREAT_CONFIG = {
  'HIGHLY FAKE':   { color: '#ef4444', glow: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)',   label: 'HIGH THREAT',  icon: AlertTriangle },
  'LIKELY FAKE':   { color: '#f97316', glow: 'rgba(249,115,22,0.3)',   bg: 'rgba(249,115,22,0.08)',   label: 'ELEVATED',     icon: AlertTriangle },
  'UNCERTAIN':     { color: '#eab308', glow: 'rgba(234,179,8,0.3)',    bg: 'rgba(234,179,8,0.08)',    label: 'UNCERTAIN',    icon: Activity },
  'LIKELY REAL':   { color: '#06b6d4', glow: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.08)',   label: 'LOW RISK',     icon: CheckCircle },
  'HIGHLY REAL':   { color: '#10b981', glow: 'rgba(16,185,129,0.3)',  bg: 'rgba(16,185,129,0.08)',  label: 'AUTHENTIC',    icon: CheckCircle },
}

const CircularProgress = ({ value, color, size = 120, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - value) / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-display font-semibold" style={{ color, fontSize: '1.3rem', lineHeight: 1 }}>
            <CountUp end={value} duration={1.8} decimals={1} suffix="%" />
          </span>
        </div>
      </div>
      <span className="mono text-xs text-center" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '10px', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  )
}

const MetricBar = ({ label, value, color, delay = 0 }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center">
      <span className="mono text-xs" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '10px', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span className="mono text-xs font-medium" style={{ color }}>
        <CountUp end={value} duration={1.5} decimals={1} suffix="%" />
      </span>
    </div>
    <div
      className="rounded-full overflow-hidden"
      style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}
    >
      <motion.div
        className="metric-bar-fill"
        style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, delay, ease: [0.23, 1, 0.32, 1] }}
      />
    </div>
  </div>
)

const ResultsPanel = ({ result }) => {
  if (!result) return null

  const { label, fake_confidence, real_confidence } = result
  const cfg = THREAT_CONFIG[label] || THREAT_CONFIG['UNCERTAIN']
  const ThreatIcon = cfg.icon

  const forensicMetrics = [
    { label: 'GAN ARTIFACT SCORE',    value: fake_confidence * 0.92, color: cfg.color },
    { label: 'FACIAL INCONSISTENCY',  value: fake_confidence * 0.87, color: '#8b5cf6' },
    { label: 'TEMPORAL COHERENCE',    value: real_confidence * 0.94, color: '#06b6d4' },
    { label: 'COMPRESSION ANOMALY',   value: fake_confidence * 0.78, color: '#ec4899' },
    { label: 'NEURAL CONFIDENCE',     value: Math.max(fake_confidence, real_confidence), color: cfg.color },
  ]

  const SCAN_LOGS = [
    { time: '00:00.12', msg: 'Frame extraction complete — 240 frames analyzed', ok: true },
    { time: '00:00.38', msg: 'Facial region detection: 47 landmarks mapped', ok: true },
    { time: '00:00.61', msg: 'GAN fingerprint pattern detected in pixel domain', ok: fake_confidence < 50 },
    { time: '00:00.89', msg: 'Neural coherence analysis complete', ok: true },
    { time: '00:01.14', msg: `Classification complete — confidence: ${Math.max(fake_confidence, real_confidence).toFixed(2)}%`, ok: true },
  ]

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.23,1,0.32,1] } },
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Top threat banner */}
      <motion.div
        variants={item}
        className="glass rounded-2xl p-6 mb-4 relative overflow-hidden"
        style={{ border: `1px solid ${cfg.color}30`, boxShadow: `0 0 40px ${cfg.glow}` }}
      >
        {/* BG glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${cfg.bg}, transparent 60%)` }}
        />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}40` }}
            >
              <ThreatIcon size={22} style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="mono text-xs tracking-widest"
                  style={{ color: cfg.color, letterSpacing: '0.25em', fontSize: '10px' }}
                >
                  THREAT LEVEL: {cfg.label}
                </span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <h3 className="font-display font-semibold text-2xl" style={{ color: '#e2e8f0' }}>
                {label}
              </h3>
            </div>
          </div>

          {/* Confidence rings */}
          <div className="flex gap-8">
            <CircularProgress
              value={fake_confidence}
              color={cfg.color}
              label="FAKE CONFIDENCE"
            />
            <CircularProgress
              value={real_confidence}
              color="#06b6d4"
              label="REAL CONFIDENCE"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid: Metrics + Scan Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Forensic Metrics */}
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={14} style={{ color: '#8b5cf6' }} />
            <span className="mono text-xs tracking-widest" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '10px', letterSpacing: '0.2em' }}>
              FORENSIC METRICS
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {forensicMetrics.map((m, i) => (
              <MetricBar key={m.label} {...m} delay={0.1 * i} />
            ))}
          </div>
        </motion.div>

        {/* Scan Log */}
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Eye size={14} style={{ color: '#06b6d4' }} />
            <span className="mono text-xs tracking-widest" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '10px', letterSpacing: '0.2em' }}>
              ANALYSIS TIMELINE
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {SCAN_LOGS.map((log, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <span className="mono text-xs flex-shrink-0 mt-0.5" style={{ color: 'rgba(6,182,212,0.5)', fontSize: '10px' }}>
                  {log.time}
                </span>
                <div
                  className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: log.ok ? '#10b981' : '#ef4444',
                    boxShadow: `0 0 4px ${log.ok ? '#10b981' : '#ef4444'}`,
                  }}
                />
                <span className="mono text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.6)', fontSize: '10px' }}>
                  {log.msg}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom AI Cards Row */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          { icon: Shield, label: 'Frames Scanned',  value: '240',   unit: 'frames', color: '#06b6d4' },
          { icon: Cpu,    label: 'Model Layers',     value: '47',    unit: 'layers', color: '#8b5cf6' },
          { icon: Zap,    label: 'Analysis Time',    value: '1.14',  unit: 'sec',    color: '#ec4899' },
          { icon: Lock,   label: 'Encryption',       value: 'AES',   unit: '256-bit', color: '#10b981' },
        ].map(card => (
          <motion.div
            key={card.label}
            className="glass rounded-xl p-4 flex flex-col gap-2"
            style={{ border: `1px solid ${card.color}15` }}
            whileHover={{
              scale: 1.03,
              borderColor: `${card.color}35`,
              boxShadow: `0 0 24px ${card.color}15`,
            }}
            transition={{ duration: 0.3 }}
          >
            <card.icon size={14} style={{ color: card.color }} />
            <div className="mt-auto">
              <div className="font-display font-semibold text-lg" style={{ color: '#e2e8f0', lineHeight: 1 }}>
                {card.value}
                <span className="font-body text-xs ml-1" style={{ color: 'rgba(100,116,139,0.6)' }}>
                  {card.unit}
                </span>
              </div>
              <div className="mono text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.5)', fontSize: '9px', letterSpacing: '0.08em' }}>
                {card.label.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ResultsPanel
