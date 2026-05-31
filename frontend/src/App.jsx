import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import AnimatedCursor from './components/AnimatedCursor.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

function App() {
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <AnimatedCursor />

      {/* Particle background */}
      <ParticleBackground />

      {/* Loading screen */}
      <AnimatePresence mode="wait">
        {!appReady && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {/* Main app */}
      <AnimatePresence mode="wait">
        {appReady && (
          <motion.div
            key="app"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
