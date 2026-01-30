import { useInView } from '../hooks/useInView'

export default function QuienesSomos() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section id="nosotros" className="py-12 md:py-20" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 animate-on-scroll ${isInView ? 'in-view' : ''}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-dark/60 mb-2">
              Conocenos
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-brittany">
              Quienes Somos
            </h2>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className={`order-2 md:order-1 animate-on-scroll stagger-2 ${isInView ? 'in-view' : ''}`}>
              <div className="aspect-[4/5] bg-dark/5 border border-dark/10 flex items-center justify-center img-zoom">
                <p className="text-dark/40 text-sm uppercase tracking-wider">
                  Foto proximamente
                </p>
              </div>
            </div>

            {/* Text Content */}
            <div className={`order-1 md:order-2 animate-on-scroll stagger-3 ${isInView ? 'in-view' : ''}`}>
              <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-wide">
                Un espacio sagrado para tu sanacion
              </h3>

              <div className="space-y-4 text-dark/70 leading-relaxed">
                <p>
                  <span className="font-medium text-dark">Heal and Play</span> nacio de la necesidad de crear
                  un espacio donde las personas puedan reconectarse con su esencia, liberar memorias
                  y desbloquear su campo energetico.
                </p>

                <p>
                  Creemos que el bienestar emocional es la base de una vida plena. Por eso,
                  ofrecemos un acompanamiento integral que combina diferentes tecnicas de sanacion
                  adaptadas a las necesidades de cada persona.
                </p>

                <p>
                  Nuestro enfoque es calido, intimo y profundamente respetuoso de tu proceso personal.
                  Aqui encontraras un lugar seguro para explorar, entender y sanar.
                </p>
              </div>

              {/* Values */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-dark/10 p-4 card-hover">
                  <p className="text-sm uppercase tracking-wider text-dark/60 mb-1">Mision</p>
                  <p className="text-sm text-dark/80">Acompanar tu proceso de sanacion con amor y respeto</p>
                </div>
                <div className="border border-dark/10 p-4 card-hover">
                  <p className="text-sm uppercase tracking-wider text-dark/60 mb-1">Vision</p>
                  <p className="text-sm text-dark/80">Crear comunidad de mujeres empoderadas y sanadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
