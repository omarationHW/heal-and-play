# Heal and Play - Progreso de Desarrollo

## Resumen del Proyecto
Sitio web para **Heal and Play**, un espacio de sanación y bienestar emocional. El sitio incluye información sobre servicios, catálogo de productos, sistema de avisos y feed de Instagram.

**URL del repo:** https://github.com/omarationHW/heal-and-play
**Correo de contacto:** contacto@healandplay.mx
**Instagram:** @heal_play

---

## Ramas de Git

| Rama | Descripción |
|------|-------------|
| `master` | Landing page "Coming Soon" para Magic Box (en producción) |
| `desarrollo-pagina-real` | Página completa en desarrollo |

---

## Fases del Proyecto

### ✅ Fase 1 - Estructura Base (COMPLETADA)
- [x] Navbar con menú móvil y scroll suave
- [x] Hero con animaciones de entrada
- [x] Sección "Quiénes Somos"
- [x] Sección "Servicios" (6 servicios)
- [x] Sección "Contacto" con WhatsApp, Instagram y Email
- [x] Footer con links y redes sociales
- [x] Animaciones al scroll (fade in, stagger)
- [x] Diseño responsive para móvil

### ✅ Fase 2 - Catálogo de Productos (COMPLETADA)
- [x] Sección de productos con filtro por categorías
- [x] Magic Box destacada con pre-order (mystery box)
- [x] Botón "Comprar" que abre WhatsApp con mensaje pre-escrito
- [x] Categorías: Velas, Aromaterapia, Sprays & Mists, Bienestar, Kits

### ⏸️ Fase 3 - Reservaciones (PENDIENTE)
- [ ] Integración con Calendly (preferido por el usuario)
- [ ] Notificaciones al celular cuando se haga una reservación
- **Nota:** El usuario tiene cuenta de negocio en Instagram y correo contacto@healandplay.mx

### ⏸️ Fase 4 - Pagos en Línea (PENDIENTE)
- [ ] Integración de pagos con tarjeta (Stripe, Conekta o similar)
- [ ] Opción de transferencia bancaria
- **Nota:** Actualmente el botón "Comprar" redirige a WhatsApp

### ✅ Fase 5 - Instagram Feed + Avisos (COMPLETADA)
- [x] Feed de Instagram con widget de Elfsight
- [x] Sección de Avisos conectada a Supabase
- [x] Tipos de avisos: info, evento, promo, importante

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Navbar.tsx        # Navegación con menú móvil
│   ├── Hero.tsx          # Sección principal
│   ├── QuienesSomos.tsx  # Sobre nosotros
│   ├── Servicios.tsx     # 6 servicios ofrecidos
│   ├── Productos.tsx     # Magic Box + catálogo
│   ├── Avisos.tsx        # Avisos desde Supabase
│   ├── InstagramFeed.tsx # Widget de Elfsight
│   ├── Contacto.tsx      # Información de contacto
│   └── Footer.tsx        # Pie de página
├── hooks/
│   └── useInView.ts      # Hook para animaciones al scroll
├── lib/
│   └── supabase.ts       # Cliente de Supabase
├── App.tsx               # Componente principal
├── main.tsx              # Entry point
└── index.css             # Estilos globales y animaciones
```

---

## Configuraciones Importantes

### Supabase
- **Tabla `subscribers`:** Para captura de emails (landing page original)
- **Tabla `avisos`:** Para mostrar avisos en la página

**Estructura de tabla `avisos`:**
```sql
CREATE TABLE avisos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tipo TEXT DEFAULT 'info' CHECK (tipo IN ('info', 'evento', 'promo', 'importante')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Elfsight (Instagram Feed)
- Widget ID: `97b0e41c-88a9-4238-9dee-5e2ad4a9a69b`
- Script cargado en `index.html`

### Variables de Entorno (.env)
```
VITE_SUPABASE_URL=<url>
VITE_SUPABASE_ANON_KEY=<key>
```

---

## Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Beige | `#f1ebe6` | Fondo principal |
| Dark | `#2e2b29` | Texto y acentos |

---

## Fuentes

- **Poppins** - Texto general (Google Fonts)
- **Brittany** - Títulos decorativos (local en /public/fonts/)

---

## Productos Actuales (precios de ejemplo)

| Producto | Precio | Categoría |
|----------|--------|-----------|
| Velas Vestidas | $150 MXN | Velas |
| Vela de Miel | $120 MXN | Velas |
| Inciensos Intencionados | $80 MXN | Aromaterapia |
| Sahumerios | $100 MXN | Aromaterapia |
| Spray Agua Florida | $180 MXN | Sprays |
| Mists Energéticos | $200 MXN | Sprays |
| Cúrcuma Caps | $250 MXN | Bienestar |
| Magic Box | Pre-order | Kits |

**Nota:** Los precios son de ejemplo, actualizar con precios reales.

---

## Servicios Ofrecidos

1. Barras de Access Consciousness
2. Numerología
3. Sesiones 1:1 de Acompañamiento Emocional
4. Círculos de Mujeres (Flores, Rituales)
5. Talleres Emocionales
6. Limpias Energéticas

---

## Pendientes / Mejoras Futuras

- [ ] Agregar fotos reales de productos
- [ ] Actualizar precios reales de productos
- [ ] Agregar foto en sección "Quiénes Somos"
- [ ] Configurar Calendly para reservaciones
- [ ] Integrar pagos en línea
- [ ] Agregar más contenido a los textos (misión, visión, historia)
- [ ] Considerar agregar sección de testimonios
- [ ] SEO y meta tags para redes sociales

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## Fecha de Lanzamiento
**Magic Box y página:** 1 de Marzo 2026

---

*Última actualización: 30 de Enero 2026*
