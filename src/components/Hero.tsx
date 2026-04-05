export default function Hero() {
  return (
    <section id="inicio" className="min-h-[70vh] flex items-center pt-20 md:pt-24">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Tagline */}
          <p className="hero-title text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-dark/60">
            Sanacion y Bienestar Emocional
          </p>

          {/* Main Title */}
          <h1 className="mb-6">
            <span className="hero-title block text-5xl md:text-6xl lg:text-7xl font-brittany mb-2">
              Heal and Play
            </span>
            <span className="hero-subtitle block text-lg md:text-xl tracking-[0.3em] uppercase font-light text-dark/80">
              Tu bienestar comienza desde adentro
            </span>
          </h1>

          {/* Description */}
          <p className="hero-text text-dark/70 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Un espacio donde la energia se ordena, la mente se expande y el alma recuerda su proposito.
            Combinamos sanacion profunda con un ambiente calido e intimo.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#servicios"
              className="px-8 py-3 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300 hover:scale-105"
            >
              Conoce nuestros servicios
            </a>
            <a
              href="#contacto"
              className="px-8 py-3 border border-dark text-dark uppercase text-sm tracking-wider hover:bg-dark hover:text-beige transition-all duration-300"
            >
              Contactanos
            </a>
          </div>

          {/* Decorative Element */}
          <div className="mt-8 flex justify-center">
            <div className="w-px h-12 bg-dark/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
