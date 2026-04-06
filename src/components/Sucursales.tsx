import { useInView } from '../hooks/useInView'

const sucursales = [
  {
    nombre: 'Sucursal Norte',
    zona: 'Insurgentes Norte',
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    nombre: 'Sucursal Industrial',
    zona: 'Col. Industrial Tepeyac',
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function Sucursales() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="sucursales" className="py-12 md:py-20 bg-dark text-beige" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 animate-on-scroll ${isInView ? 'in-view' : ''}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-beige/60 mb-2">
              Encuéntranos
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-brittany">
              Sucursales
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {sucursales.map((sucursal, index) => (
              <div
                key={sucursal.nombre}
                className={`border border-beige/20 p-8 text-center transition-all duration-300 hover:border-beige/40 hover:bg-beige/5 animate-on-scroll ${isInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className="flex justify-center mb-4 text-beige/60">
                  {sucursal.icono}
                </div>
                <h3 className="text-lg font-medium tracking-wide mb-2">
                  {sucursal.nombre}
                </h3>
                <p className="text-beige/70 text-sm">
                  {sucursal.zona}
                </p>
              </div>
            ))}
          </div>

          {/* Horario + CTA */}
          <div className={`text-center mt-10 animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ transitionDelay: '0.6s' }}>
            <p className="text-beige/60 text-sm mb-4">
              Pregunta por horarios disponibles
            </p>
            <a
              href="https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-beige text-beige uppercase text-sm tracking-wider hover:bg-beige hover:text-dark transition-all duration-300"
            >
              Agendar cita por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
