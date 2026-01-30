import { useInView } from '../hooks/useInView'

const servicios = [
  {
    titulo: 'Barras de Access Consciousness',
    descripcion: 'Tecnica para liberar bloqueos emocionales y expandir la consciencia. Una sesion que te permite soltar limitaciones y abrir nuevas posibilidades.',
    icono: '✧'
  },
  {
    titulo: 'Numerologia',
    descripcion: 'Descubre tu verdadero ser, vida pasada, mision de vida, karma y alma. Los numeros revelan informacion profunda sobre tu camino.',
    icono: '✧'
  },
  {
    titulo: 'Sesiones 1:1',
    descripcion: 'Espacio individual para explorar, entender y sanar heridas, traumas y desafios emocionales con acompanamiento personalizado.',
    icono: '✧'
  },
  {
    titulo: 'Circulos de Mujeres',
    descripcion: 'Experiencias sagradas de sanacion entre mujeres. Circulos de flores, rituales y conexion profunda con lo femenino.',
    icono: '✧'
  },
  {
    titulo: 'Talleres Emocionales',
    descripcion: 'Sesiones grupales de regulacion mental y emocional. Herramientas practicas para tu bienestar diario.',
    icono: '✧'
  },
  {
    titulo: 'Limpias Energeticas',
    descripcion: 'Liberacion de energias estancadas que no te pertenecen. Renueva tu campo energetico y siente ligereza.',
    icono: '✧'
  }
]

export default function Servicios() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="servicios" className="py-20 md:py-32 bg-dark text-beige" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 animate-on-scroll ${isInView ? 'in-view' : ''}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-beige/60 mb-2">
              Nuestros Servicios
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-brittany">
              Que Hacemos
            </h2>
            <p className="mt-4 text-beige/70 max-w-2xl mx-auto">
              Cada servicio esta disenado para acompanarte en tu viaje de sanacion
              y reconexion con tu esencia.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                className={`border border-beige/20 p-6 md:p-8 transition-all duration-300 group hover:border-beige/40 hover:bg-beige/5 animate-on-scroll stagger-${index + 1} ${isInView ? 'in-view' : ''}`}
              >
                <span className="text-2xl mb-4 block opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-110 inline-block transform duration-300">
                  {servicio.icono}
                </span>
                <h3 className="text-lg md:text-xl font-medium mb-3 tracking-wide">
                  {servicio.titulo}
                </h3>
                <p className="text-beige/70 text-sm leading-relaxed">
                  {servicio.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={`text-center mt-12 animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ animationDelay: '0.8s' }}>
            <p className="text-beige/60 mb-4">
              ¿Quieres saber cual servicio es ideal para ti?
            </p>
            <a
              href="#contacto"
              className="inline-block px-8 py-3 border border-beige text-beige uppercase text-sm tracking-wider hover:bg-beige hover:text-dark transition-all duration-300"
            >
              Agenda una consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
