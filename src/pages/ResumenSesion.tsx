import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import type { Grabacion } from '../types/database'

export default function ResumenSesion() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { sessionReady } = useAuth()
  const [grabacion, setGrabacion] = useState<Grabacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionReady || !id) return
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('grabaciones')
          .select('*')
          .eq('id', id)
          .single()
        if (error) console.error('Error fetching grabacion:', error)
        setGrabacion(data as Grabacion)
      } catch (err) {
        console.error('Error fetching grabacion:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionReady, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-beige text-dark flex items-center justify-center">
        <p className="text-sm text-dark/50">Cargando resumen...</p>
      </div>
    )
  }

  if (!grabacion || !grabacion.resumen) {
    return (
      <div className="min-h-screen bg-beige text-dark flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-dark/50">Resumen no disponible.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm underline text-dark/60 hover:text-dark transition-colors"
        >
          Volver al dashboard
        </button>
      </div>
    )
  }

  const fecha = grabacion.fecha_sesion
    ? new Date(grabacion.fecha_sesion + 'T12:00:00').toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-beige">
      {/* Header - mismo estilo que Dashboard */}
      <header className="bg-beige/95 backdrop-blur-sm border-b border-dark/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-base sm:text-lg tracking-[0.2em] font-medium uppercase"
          >
            Heal and Play
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
        {/* Title section */}
        <section className="mb-6 sm:mb-8">
          <h1 className="font-maven text-lg sm:text-xl font-bold tracking-wide uppercase mb-1">
            {grabacion.titulo}
          </h1>
          {grabacion.descripcion && (
            <p className="text-xs sm:text-sm text-dark/50">{grabacion.descripcion}</p>
          )}
          {fecha && (
            <p className="text-xs text-dark/40 mt-1">{fecha}</p>
          )}
        </section>

        {/* Resumen */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-dark/5">
          <h2 className="font-maven text-sm tracking-wider uppercase font-semibold mb-4 sm:mb-6">Resumen de la sesión</h2>

          <article className="font-carlito">
            <ReactMarkdown
              components={{
                h3: ({ children }) => (
                  <h3 className="font-maven text-sm sm:text-[15px] font-semibold uppercase tracking-[0.1em] text-dark mt-6 mb-3 pb-1.5 border-b border-dark/10 first:mt-0">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-8 space-y-1 mb-2 text-[13px] sm:text-sm text-dark/65">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="relative pl-5 text-[13px] sm:text-sm text-dark/75 leading-relaxed before:content-['\2727'] before:absolute before:left-0 before:text-[10px] before:text-dark/35 before:top-[3px]">
                    {children}
                  </li>
                ),
              }}
            >
              {grabacion.resumen}
            </ReactMarkdown>
          </article>
        </section>

        {/* Footer note */}
        <p className="text-center text-[11px] text-dark/30 mt-6 italic">
          Material exclusivo para participantes
        </p>
      </main>
    </div>
  )
}
