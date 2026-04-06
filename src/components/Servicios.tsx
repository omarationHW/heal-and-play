import { useState } from 'react'
import { useInView } from '../hooks/useInView'

const servicios = [
  {
    titulo: 'Barras de Access Consciousness',
    descripcion: 'Tecnica para liberar bloqueos emocionales y expandir la consciencia. Una sesion que te permite soltar limitaciones y abrir nuevas posibilidades.',
    icono: '✧',
    precio: '$1,111 MXN'
  },
  {
    titulo: 'Numerologia',
    descripcion: 'Descubre tu verdadero ser, vida pasada, mision de vida, karma y alma. Los numeros revelan informacion profunda sobre tu camino.',
    icono: '✧',
    precio: '$888 MXN'
  },
  {
    titulo: 'Sesiones 1:1',
    descripcion: 'Espacio individual para explorar, entender y sanar heridas, traumas y desafios emocionales con acompanamiento personalizado.',
    icono: '✧',
    precio: '$999 MXN'
  },
  {
    titulo: 'Circulos de Mujeres',
    descripcion: 'Experiencias sagradas de sanacion entre mujeres. Circulos de flores, rituales y conexion profunda con lo femenino. También ofrecemos círculos privados para festejos holísticos.',
    icono: '✧',
    precio: 'Precio dependiendo temática'
  },
  {
    titulo: 'Talleres Emocionales',
    descripcion: 'Sesiones grupales de regulacion mental y emocional. Herramientas practicas para tu bienestar diario.',
    icono: '✧',
    precio: 'Precio dependiendo taller'
  },
  {
    titulo: 'Terapia de 7 Chakras',
    descripcion: 'Alineación y desbloqueo de chakras con piedras, diapasones, péndulo, oráculo de chakras y sonoroterapia.',
    icono: '✧',
    precio: '$1,111 MXN'
  },
  {
    titulo: 'Limpias Energeticas',
    descripcion: 'Liberacion de energias estancadas que no te pertenecen. Renueva tu campo energetico y siente ligereza.',
    icono: '✧',
    precio: '$777 MXN'
  }
]

interface Servicio {
  titulo: string
  descripcion: string
  icono: string
  precio: string
}

export default function Servicios() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 })
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)

  const abrirModal = (servicio: Servicio) => {
    setServicioSeleccionado(servicio)
    document.body.style.overflow = 'hidden'
  }

  const cerrarModal = () => {
    setServicioSeleccionado(null)
    document.body.style.overflow = ''
  }

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
            <p className="mt-3 text-beige/50 text-sm italic">
              ✧ Haz click en cada servicio para conocer más ✧
            </p>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] border border-beige/20 p-6 md:p-8 transition-all duration-300 group hover:border-beige/40 hover:bg-beige/5 animate-on-scroll cursor-pointer ${isInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${(index + 1) * 0.15}s` }}
                onClick={() => abrirModal(servicio)}
              >
                <span className={`text-2xl mb-4 block opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-110 inline-block transform duration-300 animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ transitionDelay: `${(index + 1) * 0.15 + 0.1}s` }}>
                  {servicio.icono}
                </span>
                <h3 className={`text-lg md:text-xl font-medium mb-3 tracking-wide animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ transitionDelay: `${(index + 1) * 0.15 + 0.2}s` }}>
                  {servicio.titulo}
                </h3>
                <p className={`text-beige/70 text-sm leading-relaxed animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ transitionDelay: `${(index + 1) * 0.15 + 0.3}s` }}>
                  {servicio.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={`text-center mt-12 animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ transitionDelay: '1s' }}>
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

      {/* Service Modal */}
      {servicioSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-modal-overlay"
          onClick={cerrarModal}
        >
          <div
            className="relative bg-white text-dark max-w-lg w-full p-8 md:p-10 animate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-dark/40 hover:text-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="text-center mb-6">
              <span className="text-5xl">{servicioSeleccionado.icono}</span>
            </div>

            {/* Service Info */}
            <h3 className="text-2xl font-medium tracking-wide mb-4 text-center">
              {servicioSeleccionado.titulo}
            </h3>
            <p className="text-dark/70 leading-relaxed mb-6 text-center">
              {servicioSeleccionado.descripcion}
            </p>
            <p className="text-xl font-bold italic text-center mb-8">
              {servicioSeleccionado.precio}
            </p>

            {/* CTA */}
            <a
              href="https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-8 py-4 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300"
            >
              Agendar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
