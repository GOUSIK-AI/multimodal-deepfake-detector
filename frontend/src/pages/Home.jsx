import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import UploadBox from '../components/UploadBox.jsx'
import ResultsPanel from '../components/ResultsPanel.jsx'
import StatsCards from '../components/StatsCards.jsx'
import Footer from '../components/Footer.jsx'
import { RevealSection, MouseGlow } from '../components/AIEffects.jsx'
import { Zap, ChevronDown, Shield } from 'lucide-react'

const Home = () => {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const resultsRef            = useRef(null)

  const handleResult = (data) => {
    setResult(data)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400)
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#020617' }}>

      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Upload Section */}
      <section id="upload" className="relative py-20 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.04) 0%, transparent 65%)' }}
        />

        <div className="max-w-3xl mx-auto relative">
          <RevealSection>
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4"
                style={{ border: '1px solid rgba(6,182,212,0.2)' }}
              >
                <Zap size={11} style={{ color: '#06b6d4' }} />
                <span
                  className="mono text-xs"
                  style={{ color: 'rgba(6,182,212,0.8)', letterSpacing: '0.2em', fontSize: '10px' }}
                >
                  NEURAL FORENSIC ENGINE
                </span>
              </div>
              <h2
                className="font-display font-semibold text-3xl md:text-4xl"
                style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}
              >
                Upload for{' '}
                <span className="gradient-text-cyan">AI Analysis</span>
              </h2>
              <p
                className="font-body text-base mt-3"
                style={{ color: 'rgba(100,116,139,0.7)', fontWeight: 300 }}
              >
                Drop any video file. Our neural engine will forensically examine
                every frame in under 2 seconds.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={0.15}>
            <UploadBox onResult={handleResult} onLoading={setLoading} />
          </RevealSection>
        </div>
      </section>

      {/* Loading shimmer */}
      <AnimatePresence>
        {loading && (
          <motion.section
            className="py-10 px-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-8 border-glow-cyan">
                <div className="flex flex-col items-center gap-5">
                  {/* Rotating rings */}
                  <div className="relative w-20 h-20">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: `2px solid rgba(6,182,212,${0.6 - i * 0.15})`,
                          margin: i * 6,
                        }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 2 + i, ease: 'linear', repeat: Infinity }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield size={16} style={{ color: '#06b6d4' }} />
                    </div>
                  </div>
                  <motion.span
                    className="font-display font-medium"
                    style={{ color: 'rgba(6,182,212,0.9)' }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Neural forensic analysis in progress...
                  </motion.span>
                  <span className="mono text-xs" style={{ color: 'rgba(100,116,139,0.5)', fontSize: '10px' }}>
                    Scanning 240 frames · Analyzing facial landmarks · Cross-referencing GAN database
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.section
            ref={resultsRef}
            className="py-10 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-3"
                  style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  <span className="mono text-xs" style={{ color: 'rgba(139,92,246,0.8)', letterSpacing: '0.2em', fontSize: '10px' }}>
                    ANALYSIS COMPLETE
                  </span>
                </div>
                <h2
                  className="font-display font-semibold text-3xl md:text-4xl"
                  style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}
                >
                  Forensic{' '}
                  <span className="gradient-text-warm">Intelligence Report</span>
                </h2>
              </div>
              <ResultsPanel result={result} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stats */}
      <StatsCards />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
