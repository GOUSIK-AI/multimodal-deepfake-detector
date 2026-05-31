import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Outer rings */}
      {[100, 140, 180, 220].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  size,
            height: size,
            border: `1px solid rgba(6,182,212,${0.3 - i * 0.05})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 4 + i * 2, ease: 'linear', repeat: Infinity }}
        />
      ))}

      {/* Core */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 60, height: 60 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Shield Icon */}
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <motion.path
            d="M14 2L2 7v9c0 8 5.5 13.5 12 15 6.5-1.5 12-7 12-15V7L14 2z"
            stroke="#06b6d4"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M8 16l4 4 8-8"
            stroke="#8b5cf6"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* Brand text */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span
          className="text-xl font-display font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(6,182,212,0.9)', letterSpacing: '0.3em' }}
        >
          DeepShield AI
        </span>

        {/* Loading bar */}
        <div
          className="mt-2 rounded-full overflow-hidden"
          style={{ width: 160, height: 2, background: 'rgba(6,182,212,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>

        {/* Status text */}
        <motion.span
          className="mono text-xs"
          style={{ color: 'rgba(6,182,212,0.4)', letterSpacing: '0.15em' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          INITIALIZING NEURAL ENGINE...
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export default LoadingScreen
