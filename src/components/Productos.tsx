import { useState } from 'react'
import { useInView } from '../hooks/useInView'

type Categoria = 'todos' | 'velas' | 'aromaterapia' | 'sprays' | 'bienestar' | 'kits'

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: Categoria
  imagen?: string
}

const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Velas Vestidas',
    descripcion: 'Velas preparadas con intención específica para rituales de sanación, amor, prosperidad y protección.',
    precio: 150,
    categoria: 'velas'
  },
  {
    id: 2,
    nombre: 'Vela de Miel',
    descripcion: 'Vela base intencionada con miel para endulzar situaciones y atraer energías positivas.',
    precio: 120,
    categoria: 'velas'
  },
  {
    id: 3,
    nombre: 'Inciensos Intencionados',
    descripcion: 'Pack de inciensos preparados para limpiar espacios y elevar la vibración energética.',
    precio: 80,
    categoria: 'aromaterapia'
  },
  {
    id: 4,
    nombre: 'Sahumerios',
    descripcion: 'Mezcla de hierbas sagradas para limpias energéticas profundas y ceremonias.',
    precio: 100,
    categoria: 'aromaterapia'
  },
  {
    id: 5,
    nombre: 'Spray Agua Florida',
    descripcion: 'Agua de Florida en spray para limpieza energética rápida y protección personal.',
    precio: 180,
    categoria: 'sprays'
  },
  {
    id: 6,
    nombre: 'Mists Energéticos',
    descripcion: 'Sprays aromáticos con esencias naturales para armonizar tu espacio y elevar tu energía.',
    precio: 200,
    categoria: 'sprays'
  },
  {
    id: 7,
    nombre: 'Cúrcuma Caps',
    descripcion: 'Cápsulas de cúrcuma natural para bienestar antiinflamatorio y salud integral.',
    precio: 250,
    categoria: 'bienestar'
  }
]

const categorias: { id: Categoria; nombre: string }[] = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'velas', nombre: 'Velas' },
  { id: 'aromaterapia', nombre: 'Aromaterapia' },
  { id: 'sprays', nombre: 'Sprays & Mists' },
  { id: 'bienestar', nombre: 'Bienestar' },
  { id: 'kits', nombre: 'Kits' }
]

export default function Productos() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('todos')
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.05 })
  const { ref: magicBoxRef, isInView: magicBoxInView } = useInView<HTMLDivElement>({ threshold: 0.2 })

  const productosFiltrados = categoriaActiva === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  const whatsappBase = "https://api.whatsapp.com/send?phone=&text="

  const handleComprar = (producto: Producto) => {
    const mensaje = encodeURIComponent(
      `Hola! Me interesa el producto: ${producto.nombre} ($${producto.precio} MXN). ¿Podrían darme más información?`
    )
    window.open(`${whatsappBase}${mensaje}`, '_blank')
  }

  const handlePreOrderMagicBox = () => {
    const mensaje = encodeURIComponent(
      `Hola! Quiero hacer un PRE-ORDER de The Magic Box. ¿Podrían darme más información sobre disponibilidad y precio?`
    )
    window.open(`${whatsappBase}${mensaje}`, '_blank')
  }

  return (
    <section id="productos" className="py-16 md:py-24" ref={sectionRef}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 animate-on-scroll ${isInView ? 'in-view' : ''}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-dark/60 mb-2">
              Nuestra Tienda
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-brittany">
              Productos
            </h2>
            <p className="mt-4 text-dark/70 max-w-2xl mx-auto">
              Herramientas sagradas para acompañar tu proceso de sanación y bienestar diario.
            </p>
          </div>

          {/* MAGIC BOX - Featured Pre-Order Section */}
          <div
            ref={magicBoxRef}
            className={`mb-20 animate-on-scroll ${magicBoxInView ? 'in-view' : ''}`}
          >
            <div className="relative border-2 border-dark/20 p-6 md:p-10 lg:p-12 bg-gradient-to-br from-beige to-white">
              {/* Pre-order Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-dark text-beige px-6 py-2 text-xs uppercase tracking-[0.2em]">
                Pre-Order Disponible
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-4">
                {/* Image */}
                <div className="relative flex justify-center">
                  <div className="absolute -inset-10 bg-white/30 rounded-full blur-3xl"></div>
                  <img
                    src="/Magic box (800 x 800 px).png"
                    alt="The Magic Box"
                    className="relative w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <p className="text-sm tracking-[0.3em] uppercase mb-2 text-dark/60 italic">
                    Mágica Mujer presenta
                  </p>
                  <h3 className="mb-4">
                    <span className="block text-lg md:text-xl tracking-[0.2em] uppercase font-light mb-1">THE</span>
                    <span className="flex items-baseline justify-center md:justify-start">
                      <span className="text-4xl md:text-5xl lg:text-6xl font-brittany">magic</span>
                      <span className="text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase font-bold">BOX</span>
                    </span>
                  </h3>

                  <p className="text-dark/70 leading-relaxed mb-6">
                    Una caja sorpresa llena de herramientas de sanación y bienestar emocional,
                    cuidadosamente seleccionadas para acompañarte en tu viaje de transformación interior.
                  </p>

                  {/* Mystery Box Value */}
                  <div className="bg-dark/5 p-4 mb-6">
                    <p className="text-sm text-dark/80 text-center">
                      <span className="block font-medium text-dark mb-1">✧ Mystery Box ✧</span>
                      El valor real de los productos supera el precio de la caja.
                      <span className="block text-dark/60 mt-1 italic">¿Qué sorpresas te esperan?</span>
                    </p>
                  </div>

                  {/* Launch Date */}
                  <p className="text-sm uppercase tracking-wider text-dark/50 mb-4">
                    Lanzamiento: 1 de Marzo 2026
                  </p>

                  {/* CTA */}
                  <button
                    onClick={handlePreOrderMagicBox}
                    className="inline-block px-8 py-4 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300 hover:scale-105 group"
                  >
                    <span className="flex items-center gap-2">
                      Reserva tu Magic Box
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-dark/10"></div>
            <span className="text-dark/40 text-sm uppercase tracking-wider">Más productos</span>
            <div className="flex-1 h-px bg-dark/10"></div>
          </div>

          {/* Category Filter */}
          <div className={`flex flex-wrap justify-center gap-2 md:gap-4 mb-10 animate-on-scroll stagger-1 ${isInView ? 'in-view' : ''}`}>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`px-4 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                  categoriaActiva === cat.id
                    ? 'bg-dark text-beige'
                    : 'border border-dark/20 text-dark/70 hover:border-dark/50'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto, index) => (
              <div
                key={producto.id}
                className={`group animate-on-scroll stagger-${(index % 6) + 1} ${isInView ? 'in-view' : ''}`}
              >
                {/* Product Image */}
                <div className="aspect-square bg-dark/5 border border-dark/10 mb-4 overflow-hidden relative">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-dark/30 text-4xl">✧</span>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-dark tracking-wide">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-dark/60 leading-relaxed line-clamp-2">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-medium">
                      ${producto.precio} <span className="text-sm text-dark/50">MXN</span>
                    </span>
                    <button
                      onClick={() => handleComprar(producto)}
                      className="px-4 py-2 bg-dark text-beige text-xs uppercase tracking-wider hover:bg-dark/90 transition-all duration-300 hover:scale-105"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {productosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark/50">No hay productos en esta categoría.</p>
            </div>
          )}

          {/* CTA */}
          <div className={`text-center mt-16 p-8 md:p-12 bg-dark/5 animate-on-scroll ${isInView ? 'in-view' : ''}`} style={{ animationDelay: '0.8s' }}>
            <p className="text-lg md:text-xl text-dark/80 mb-4">
              ¿Buscas algo especial o tienes dudas sobre algún producto?
            </p>
            <a
              href="https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
