import { useState } from 'react'
import { useInView } from '../hooks/useInView'

type Categoria = 'todos' | 'ropa' | 'aromaterapia' | 'bienestar' | 'kits' | 'rituales'

interface Variante {
  nombre: string
  color: string
  precio?: string
}

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: string
  categoria: Categoria
  imagen?: string
  variantes?: Variante[]
  opciones?: string[]
  opcionesLabel?: string
  nota?: string
}

const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Hoodies',
    descripcion: 'Hoodies exclusivos de Heal and Play para llevar tu energía a donde vayas.',
    precio: 'Desde $800 MXN',
    categoria: 'ropa',
    imagen: '/productos/hoodies.jpg',
    variantes: [
      { nombre: 'Negro', color: '#1a1a1a', precio: '$800 MXN' },
      { nombre: 'Morado', color: '#6B21A8', precio: '$1,200 MXN' }
    ]
  },
  {
    id: 2,
    nombre: 'Sahumerios',
    descripcion: 'Mezcla de hierbas sagradas para limpias energéticas profundas y ceremonias.',
    precio: '1 x $60 · 4 x $200 MXN',
    categoria: 'aromaterapia',
    imagen: '/productos/sahumerios.jpg',
    opcionesLabel: 'Intención',
    opciones: ['Amor', 'Abundancia', 'Protección', 'Limpieza Energética']
  },
  {
    id: 3,
    nombre: 'Escobetinas',
    descripcion: 'Escobetinas artesanales para limpias energéticas y rituales de protección.',
    precio: '$150 MXN',
    categoria: 'rituales',
    imagen: '/productos/escobetina.jpg',
    opcionesLabel: 'Intención',
    opciones: ['Amor', 'Abundancia', 'Protección', 'Limpieza Energética', 'Armonía Emocional']
  },
  {
    id: 4,
    nombre: 'Mists',
    descripcion: 'Sprays aromáticos con esencias naturales para armonizar tu espacio y elevar tu energía.',
    precio: 'Pequeño $50 · Grande $100 MXN',
    categoria: 'aromaterapia',
    imagen: '/productos/mists.jpg',
    opcionesLabel: 'Tipo',
    opciones: ['Protección', 'Agua Florida', 'Amor']
  },
  {
    id: 5,
    nombre: 'Kit Ritualito',
    descripcion: 'Kit completo con todo lo que necesitas para realizar tus propios rituales de sanación.',
    precio: '$250 MXN',
    categoria: 'kits',
    imagen: '/productos/ritualito.jpg',
    opcionesLabel: 'Intención',
    opciones: ['Amor', 'Cumpleaños', 'Abundancia', 'Protección', 'Amistad']
  },
  {
    id: 6,
    nombre: 'Jabones Artesanales',
    descripcion: 'Jabones hechos a mano con ingredientes naturales e intenciones de bienestar. Disponibles en: Armonía, Amor, Abundancia y Protección.',
    precio: '2 x $299 MXN',
    categoria: 'bienestar',
    imagen: '/productos/jabones.jpg',
    nota: 'A elegir 2 aromas'
  },
  {
    id: 7,
    nombre: 'Kit 12 Velas',
    descripcion: 'Set de 12 velas intencionadas para rituales de sanación, amor, prosperidad y protección.',
    precio: '$1,111 MXN',
    categoria: 'kits',
    imagen: '/productos/kit12.jpg'
  },
  {
    id: 8,
    nombre: 'Diario Mágico',
    descripcion: 'Diario diseñado para acompañarte en tu proceso de autoconocimiento y sanación.',
    precio: '$799 MXN',
    categoria: 'bienestar',
    imagen: '/productos/agenda.jpg',
    nota: 'Personalizado con tu nombre'
  },
  {
    id: 9,
    nombre: 'Baños Mágicos',
    descripcion: 'Preparaciones de hierbas y sales para baños rituales de limpieza y renovación energética.',
    precio: '$120 MXN',
    categoria: 'rituales',
    imagen: '/productos/banos.jpg',
    opcionesLabel: 'Tipo',
    opciones: ['Afrodita', 'Amor', 'Anti Envidias', 'Desbloqueo Mental', 'Abundancia']
  },
  {
    id: 10,
    nombre: 'Caps',
    descripcion: 'Cápsulas naturales para bienestar integral. Disponibles en diferentes fórmulas según tus necesidades.',
    precio: '$499 MXN',
    categoria: 'bienestar',
    imagen: '/productos/caps.jpg',
    opcionesLabel: 'Fórmula',
    opciones: ['Cúrcuma', 'Colágeno', 'Femi']
  }
]

const categorias: { id: Categoria; nombre: string }[] = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'ropa', nombre: 'Ropa' },
  { id: 'aromaterapia', nombre: 'Aromaterapia' },
  { id: 'rituales', nombre: 'Rituales' },
  { id: 'bienestar', nombre: 'Bienestar' },
  { id: 'kits', nombre: 'Kits' }
]

export default function Productos() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('todos')
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(null)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null)

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setVarianteSeleccionada(producto.variantes?.[0]?.nombre || null)
    setOpcionSeleccionada(null)
    document.body.style.overflow = 'hidden'
  }

  const cerrarModal = () => {
    setProductoSeleccionado(null)
    setVarianteSeleccionada(null)
    setOpcionSeleccionada(null)
    document.body.style.overflow = ''
  }
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.05 })
  const { ref: magicBoxRef, isInView: magicBoxInView } = useInView<HTMLDivElement>({ threshold: 0.2 })

  const productosFiltrados = categoriaActiva === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  const whatsappBase = "https://api.whatsapp.com/send?phone=&text="

  const handleComprar = (producto: Producto) => {
    const mensaje = encodeURIComponent(
      `Hola! Me interesa el producto: ${producto.nombre} (${producto.precio}). ¿Podrían darme más información?`
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
                    className="relative w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 animate-bounce-slow"
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
                    Cada mes, una caja nueva con productos de sanación y bienestar emocional
                    cuidadosamente seleccionados. Por solo <span className="font-bold italic text-dark text-lg">$444 MXN</span> recibe productos con un valor real
                    de <span className="font-bold italic text-dark text-lg">$1,111 MXN</span>.
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
                    Lanzamiento: 1 de Abril 2026
                  </p>

                  {/* CTA */}
                  <a
                    href="https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-4 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300 hover:scale-105 group"
                  >
                    <span className="flex items-center gap-2">
                      Reserva tu Magic Box
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </a>
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
          <div className="flex flex-wrap justify-center gap-6">
            {productosFiltrados.map((producto, index) => (
              <div
                key={producto.id}
                className={`w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group animate-on-scroll stagger-${(index % 6) + 1} ${isInView ? 'in-view' : ''} cursor-pointer`}
                onClick={() => abrirModal(producto)}
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
                  <div className="flex items-center justify-between pt-2 gap-2">
                    <span className="text-sm md:text-base font-medium">
                      {producto.precio}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleComprar(producto) }}
                      className="px-4 py-2 bg-dark text-beige text-xs uppercase tracking-wider hover:bg-dark/90 transition-all duration-300 hover:scale-105 shrink-0"
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

      {/* Product Modal */}
      {productoSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-modal-overlay"
          onClick={() => cerrarModal()}
        >
          <div
            className="relative bg-white max-w-lg w-full p-8 md:p-10 animate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => cerrarModal()}
              className="absolute top-4 right-4 text-dark/40 hover:text-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Product Image */}
            <div className="aspect-square bg-dark/5 border border-dark/10 mb-6 overflow-hidden">
              {productoSeleccionado.imagen ? (
                <img
                  src={productoSeleccionado.imagen}
                  alt={productoSeleccionado.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-dark/20 text-6xl">✧</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <h3 className="text-2xl font-medium tracking-wide mb-3">
              {productoSeleccionado.nombre}
            </h3>
            <p className="text-dark/70 leading-relaxed mb-6">
              {productoSeleccionado.descripcion}
            </p>

            {/* Variantes */}
            {productoSeleccionado.variantes && productoSeleccionado.variantes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-dark/60 mb-3">Color:</p>
                <div className="flex gap-3">
                  {productoSeleccionado.variantes.map((v) => (
                    <button
                      key={v.nombre}
                      onClick={() => setVarianteSeleccionada(v.nombre)}
                      className={`flex items-center gap-2 px-4 py-2 border transition-all duration-200 ${
                        varianteSeleccionada === v.nombre
                          ? 'border-dark bg-dark/5'
                          : 'border-dark/20 hover:border-dark/40'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-dark/20"
                        style={{ backgroundColor: v.color }}
                      />
                      <span className="text-sm">{v.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opciones */}
            {productoSeleccionado.opciones && productoSeleccionado.opciones.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-dark/60 mb-3">{productoSeleccionado.opcionesLabel || 'Opción'}:</p>
                <div className="flex flex-wrap gap-2">
                  {productoSeleccionado.opciones.map((op) => (
                    <button
                      key={op}
                      onClick={() => setOpcionSeleccionada(op)}
                      className={`px-4 py-2 text-sm border transition-all duration-200 ${
                        opcionSeleccionada === op
                          ? 'border-dark bg-dark text-beige'
                          : 'border-dark/20 hover:border-dark/40'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const variante = productoSeleccionado.variantes?.find(v => v.nombre === varianteSeleccionada)
              const precioMostrado = variante?.precio || productoSeleccionado.precio
              return (
                <p className="text-xl font-medium mb-2">
                  {precioMostrado}
                </p>
              )
            })()}
            {productoSeleccionado.nota && (
              <p className="text-sm text-dark/60 italic mb-6">
                ✧ {productoSeleccionado.nota}
              </p>
            )}
            {!productoSeleccionado.nota && <div className="mb-6" />}

            {/* CTA */}
            <a
              href={`https://api.whatsapp.com/message/3HIAUMOGKWMBF1?autoload=1&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const tieneVariante = productoSeleccionado.variantes && varianteSeleccionada
                const tieneOpcion = productoSeleccionado.opciones && opcionSeleccionada
                if (tieneVariante || tieneOpcion) {
                  e.preventDefault()
                  let detalle = productoSeleccionado.nombre
                  if (tieneVariante) detalle += ` en color ${varianteSeleccionada}`
                  if (tieneOpcion) detalle += ` - ${productoSeleccionado.opcionesLabel || 'Opción'}: ${opcionSeleccionada}`
                  const mensaje = encodeURIComponent(
                    `Hola! Me interesa: ${detalle}. ¿Podrían darme más información?`
                  )
                  window.open(`https://api.whatsapp.com/send?phone=&text=${mensaje}`, '_blank')
                }
              }}
              className="block w-full text-center px-8 py-4 bg-dark text-beige uppercase text-sm tracking-wider hover:bg-dark/90 transition-all duration-300"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
