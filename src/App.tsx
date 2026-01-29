import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown al 1 de marzo 2026
  useEffect(() => {
    const targetDate = new Date('2026-03-01T00:00:00').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') {
          // Email ya existe
          setStatus('success')
        } else {
          throw error
        }
      } else {
        setStatus('success')
      }
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  // Texto repetido para el marquee
  const marqueeText = "COMING SOON • PRÓXIMAMENTE • "

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">

      {/* Marquee Top */}
      <div className="w-full bg-dark text-beige py-2 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-sm tracking-[0.3em] uppercase whitespace-nowrap">
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 lg:px-20 py-3 relative">
        <div className="text-xl tracking-wider font-medium uppercase text-center">
          HEAL AND PLAY
        </div>
        <a
          href="https://www.instagram.com/heal_play/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-6 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 flex items-center gap-2 text-dark/70 hover:text-dark transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-sm hidden sm:inline">@heal_play</span>
        </a>
      </nav>

      {/* Countdown Banner */}
      <div className="w-full text-center py-4 md:py-6">
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-dark/50 mb-2">1 de Marzo 2026</p>
        <div className="flex justify-center items-center gap-4 md:gap-6">
          <div className="text-center">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-wider text-dark/50">Días</span>
          </div>
          <span className="text-2xl md:text-3xl text-dark/30">:</span>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-wider text-dark/50">Hrs</span>
          </div>
          <span className="text-2xl md:text-3xl text-dark/30">:</span>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-wider text-dark/50">Min</span>
          </div>
          <span className="text-2xl md:text-3xl text-dark/30">:</span>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-wider text-dark/50">Seg</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex items-center py-6 md:py-0">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-12 items-center">

            {/* Left Column - Content */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-2 text-dark/60 italic">
                Mágica Mujer presenta
              </p>

              <h1 className="mb-4">
                <span className="block text-xl md:text-2xl lg:text-3xl tracking-[0.25em] uppercase font-light mb-1">THE</span>
                <span className="flex items-baseline justify-center md:justify-start">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-brittany">magic</span>
                  <span className="text-4xl md:text-5xl lg:text-6xl tracking-[0.1em] uppercase font-bold">BOX</span>
                </span>
                <span className="block text-lg md:text-xl tracking-[0.3em] uppercase font-light mt-1 text-dark/80">Para Ti</span>
              </h1>

              <p className="text-dark/70 text-sm md:text-base leading-relaxed mb-4 max-w-lg mx-auto md:mx-0">
                Una experiencia única de sanación y bienestar emocional,
                cuidadosamente intencionada para acompañarte en tu viaje de transformación interior.
              </p>

              {/* Email Capture */}
              <div className="max-w-md mx-auto md:mx-0">
                <p className="text-dark/60 mb-2 text-xs uppercase tracking-wider">
                  Sé la primera en saber cuando esté lista
                </p>

                {status === 'success' ? (
                  <div className="bg-white/50 border border-dark/10 px-4 py-3">
                    <p className="text-dark/90 text-sm">
                      ¡Gracias! Te avisaremos cuando la Magic Box esté lista.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Tu correo electrónico"
                      required
                      className="flex-1 px-4 py-2.5 bg-white/50 border border-dark/20 outline-none focus:border-dark/50 transition-colors placeholder:text-dark/40 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-6 py-2.5 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {status === 'loading' ? 'Enviando...' : 'Notifícame'}
                    </button>
                  </form>
                )}

                {status === 'error' && (
                  <p className="text-red-600 mt-2 text-sm">
                    Hubo un error. Por favor intenta de nuevo.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-10 bg-white/30 rounded-full blur-3xl magic-box-glow"></div>
                <img
                  src="/Magic box (800 x 800 px).png"
                  alt="Magic Box - Caja de regalo con moño negro"
                  className="relative w-80 md:w-96 lg:w-[28rem] h-auto drop-shadow-2xl magic-box"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee Bottom */}
      <div className="w-full bg-dark text-beige py-2 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content marquee-reverse">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-sm tracking-[0.3em] uppercase whitespace-nowrap">
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-20 py-3">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 text-center">
          <p className="text-dark/50 text-sm">
            © 2026 HEAL AND PLAY. Todos los derechos reservados.
          </p>
          <a href="https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-dark/50 hover:text-dark text-sm transition-colors">
              Contacto
            </a>
        </div>
      </footer>
    </div>
  )
}

export default App
