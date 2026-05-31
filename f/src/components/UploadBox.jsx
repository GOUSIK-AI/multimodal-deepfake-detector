import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, X, Zap, AlertCircle } from 'lucide-react'
import axios from 'axios'

const UploadBox = ({ onResult, onLoading }) => {
  const [dragOver, setDragOver]   = useState(false)
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState(null)
  const [phase, setPhase]         = useState('idle') // idle | preview | uploading | scanning
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.type.startsWith('video/') && !f.type.startsWith('image/') && !f.type.startsWith('audio/')) {
     setError('Please upload a valid file (video, image, or audio)')
    return
}
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setPhase('preview')
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    setPhase('idle')
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const analyze = async () => {
    if (!file) return
    setPhase('uploading')
    setProgress(0)
    onLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) { clearInterval(progressInterval); return prev }
          return prev + Math.random() * 8
        })
      }, 200)

      setPhase('scanning')

      const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total)
          setProgress(Math.min(pct, 85))
        },
      })

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        onResult(response.data)
        onLoading(false)
        setPhase('preview')
      }, 600)

    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
      onLoading(false)
      setPhase('preview')
    }
  }

  const SCAN_LINES = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* IDLE: Drop zone */}
        {phase === 'idle' && (
          <motion.div
            key="dropzone"
            className={`upload-zone rounded-2xl p-12 text-center cursor-pointer relative overflow-hidden ${dragOver ? 'drag-over' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            data-cursor-hover
          >
            {/* Corner accents */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 ${pos}`}
                style={{
                  borderTop:    i < 2 ? '2px solid rgba(6,182,212,0.4)' : 'none',
                  borderBottom: i >= 2 ? '2px solid rgba(6,182,212,0.4)' : 'none',
                  borderLeft:   i % 2 === 0 ? '2px solid rgba(6,182,212,0.4)' : 'none',
                  borderRight:  i % 2 !== 0 ? '2px solid rgba(6,182,212,0.4)' : 'none',
                }}
              />
            ))}

            <input
              ref={inputRef}
              type="file"
              accept="video/*,image/*,audio/*"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />

            <motion.div
              className="flex flex-col items-center gap-4"
              animate={dragOver ? { scale: 1.05 } : { scale: 1 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.1))',
                  border: '1px solid rgba(6,182,212,0.25)',
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Upload size={24} style={{ color: '#06b6d4' }} />
              </motion.div>

              <div className="flex flex-col gap-2">
                <p className="font-display font-semibold text-lg" style={{ color: '#e2e8f0' }}>
                  Drop your video file here
                </p>
                <p className="font-body text-sm" style={{ color: 'rgba(100,116,139,0.8)' }}>
                  or <span style={{ color: '#06b6d4' }}>click to browse</span> · MP4, MOV, AVI · JPG, PNG, WEBP · MP3, WAV, AAC
                </p>
              </div>

              <div
                className="flex items-center gap-4 mt-2 px-6 py-2 rounded-full"
                style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}
              >
                {['Max 2GB', 'Any Resolution', 'Secure Upload'].map((t, i) => (
                  <span key={t} className="flex items-center gap-1.5">
                    {i > 0 && <span style={{ color: 'rgba(6,182,212,0.2)' }}>·</span>}
                    <span className="mono text-xs" style={{ color: 'rgba(100,116,139,0.6)', fontSize: '10px' }}>{t}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PREVIEW: File loaded */}
        {phase === 'preview' && (
          <motion.div
            key="preview"
            className="glass rounded-2xl overflow-hidden border-glow-cyan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
          >
            {/* Video preview */}
            <div className="relative" style={{ background: '#000' }}>
              {file?.type.startsWith('image/') ? (
  <img
    src={preview}
    className="w-full"
    style={{ maxHeight: 280, objectFit: 'contain' }}
    alt="preview"
  />
) : file?.type.startsWith('audio/') ? (
  <div className="flex flex-col items-center justify-center gap-4 py-10">
    <div
      className="flex items-center justify-center w-16 h-16 rounded-2xl"
      style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
        <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
      </svg>
    </div>
    <audio src={preview} controls className="w-full max-w-sm" style={{ accentColor: '#8b5cf6' }} />
  </div>
) : (
  <video
    src={preview}
    className="w-full"
    style={{ maxHeight: 280, objectFit: 'contain' }}
    controls
  />
)}
              <button
                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                onClick={clearFile}
              >
                <X size={14} />
              </button>
            </div>

            {/* File info + action */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                >
                  <Film size={16} style={{ color: '#06b6d4' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>
                    {file?.name}
                  </p>
                  <p className="mono text-xs" style={{ color: 'rgba(100,116,139,0.6)', fontSize: '10px' }}>
                    {file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
                  </p>
                </div>
              </div>
              <motion.button
                className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-display text-sm font-medium flex-shrink-0"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={analyze}
              >
                <Zap size={13} />
                Analyze
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCANNING / UPLOADING */}
        {(phase === 'uploading' || phase === 'scanning') && (
          <motion.div
            key="scanning"
            className="glass rounded-2xl overflow-hidden border-glow-cyan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scan overlay on video */}
            <div className="relative overflow-hidden" style={{ background: '#000' }}>
              <video
                src={preview}
                className="w-full opacity-40"
                style={{ maxHeight: 280, objectFit: 'contain' }}
              />

              {/* Holographic overlay */}
              <div className="absolute inset-0 holographic opacity-30" />

              {/* Scan lines */}
              {SCAN_LINES.map(i => (
                <motion.div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{
                    height: 1,
                    background: 'rgba(6,182,212,0.4)',
                    top: `${(i / SCAN_LINES.length) * 100}%`,
                  }}
                  animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* Main scan beam */}
              <motion.div
                className="absolute left-0 right-0"
                style={{
                  height: 3,
                  background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)',
                  boxShadow: '0 0 20px rgba(6,182,212,0.6)',
                }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Corner scanners */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {[80, 50, 60].map((w, i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 rounded-full"
                    style={{ width: w, background: 'rgba(6,182,212,0.6)' }}
                    animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>

              {/* Center overlay text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <motion.div
                  className="mono text-sm tracking-widest"
                  style={{ color: 'rgba(6,182,212,0.9)', letterSpacing: '0.3em' }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {phase === 'uploading' ? 'UPLOADING...' : 'NEURAL SCAN ACTIVE'}
                </motion.div>
                <div className="flex gap-1.5">
                  {[0, 0.15, 0.3].map(delay => (
                    <motion.div
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#06b6d4' }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, delay, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="mono text-xs" style={{ color: 'rgba(6,182,212,0.7)', letterSpacing: '0.15em' }}>
                  {phase === 'uploading' ? 'UPLOADING' : 'FORENSIC ANALYSIS'}
                </span>
                <span className="mono text-xs font-medium" style={{ color: '#06b6d4' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 3, background: 'rgba(6,182,212,0.1)' }}
              >
                <motion.div
                  className="h-full progress-bar"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Scan log */}
              <div className="mt-1 flex flex-col gap-1">
                {['Initializing neural engine...', 'Extracting facial landmarks...', 'Running GAN artifact detection...', 'Cross-referencing forensic database...'].map((log, i) => (
                  <motion.div
                    key={log}
                    className="mono text-xs flex items-center gap-2"
                    style={{ color: 'rgba(100,116,139,0.6)', fontSize: '10px' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 + 0.2 }}
                  >
                    <span style={{ color: 'rgba(6,182,212,0.5)' }}>›</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(252,165,165,0.9)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span className="font-body text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadBox
