import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { supabase } from '../lib/supabase'

interface Aviso {
  id: string
  titulo: string
  contenido: string
  fecha: string
  tipo: 'info' | 'evento' | 'promo' | 'importante'
}

const tipoStyles = {
  info: 'border-dark/20 bg-white/50',
  evento: 'border-dark/30 bg-dark/5',
  promo: 'border-dark/20 bg-white/70',
  importante: 'border-dark/40 bg-dark/10'
}

const tipoIcons = {
  info: '✦',
  evento: '✧',
  promo: '❖',
  importante: '◆'
}

const tipoLabels = {
  info: 'Información',
  evento: 'Evento',
  promo: 'Promoción',
  importante: 'Importante'
}

export default function Avisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 })

  useEffect(() => {
    fetchAvisos()
  }, [])

  const fetchAvisos = async () => {
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .eq('activo', true)
        .order('fecha', { ascending: false })
        .limit(6)

      if (error) throw error
      setAvisos(data || [])
    } catch (error) {
      console.error('Error fetching avisos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // No mostrar la sección si no hay avisos
  if (!loading && avisos.length === 0) {
    return null
  }

  return (
    <section id="avisos" className="py-12 md:py-20" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 animate-on-scroll ${isInView ? 'in-view' : ''}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-dark/60 mb-2">
              Mantente Informada
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-brittany">
              Avisos
            </h2>
            <p className="mt-4 text-dark/70 max-w-2xl mx-auto">
              Entérate de nuestros eventos, promociones y novedades.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin"></div>
            </div>
          )}

          {/* Avisos Grid */}
          {!loading && avisos.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avisos.map((aviso, index) => (
                <article
                  key={aviso.id}
                  className={`p-6 border-2 ${tipoStyles[aviso.tipo]} transition-all duration-300 hover:shadow-lg animate-on-scroll stagger-${(index % 6) + 1} ${isInView ? 'in-view' : ''}`}
                >
                  {/* Tipo Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-dark/60">
                      <span>{tipoIcons[aviso.tipo]}</span>
                      {tipoLabels[aviso.tipo]}
                    </span>
                    <span className="text-xs text-dark/40">
                      {formatDate(aviso.fecha)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-medium text-dark mb-2">
                    {aviso.titulo}
                  </h3>
                  <p className="text-dark/70 text-sm leading-relaxed">
                    {aviso.contenido}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
