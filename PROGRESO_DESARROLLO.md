# Heal and Play - Progreso de Desarrollo

## Resumen del Proyecto
Sitio web para **Heal and Play**, un espacio de sanación y bienestar emocional. El sitio incluye información sobre servicios, catálogo de productos, sistema de avisos, feed de Instagram, sistema de autenticación y panel de administración.

**URL del repo:** https://github.com/omarationHW/heal-and-play
**Correo de contacto:** contacto@healandplay.mx
**Instagram:** @heal_play

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2 | UI Framework |
| TypeScript | 5.9 | Tipado estático |
| Vite | 7.x | Build tool / Dev server |
| Tailwind CSS | 4.x | Estilos |
| Supabase | 2.93 | Auth, Database (PostgreSQL), Storage |
| React Router | 7.x | Enrutamiento SPA |
| Azure Static Web Apps | - | Hosting/Deploy |

---

## Ramas de Git

| Rama | Descripción |
|------|-------------|
| `master` | Landing page "Coming Soon" para Magic Box (en producción) |
| `desarrollo-pagina-real` | Página completa en desarrollo |

---

## Fases del Proyecto

### Fase 1 - Estructura Base (COMPLETADA)
- [x] Navbar con menú móvil y scroll suave
- [x] Hero con animaciones de entrada
- [x] Sección "Quiénes Somos"
- [x] Sección "Servicios" (6 servicios)
- [x] Sección "Contacto" con WhatsApp, Instagram y Email
- [x] Footer con links y redes sociales
- [x] Animaciones al scroll (fade in, stagger)
- [x] Diseño responsive para móvil

### Fase 2 - Catálogo de Productos (COMPLETADA)
- [x] Sección de productos con filtro por categorías
- [x] Magic Box destacada con pre-order (mystery box)
- [x] Botón "Comprar" que abre WhatsApp con mensaje pre-escrito
- [x] Categorías: Velas, Aromaterapia, Sprays & Mists, Bienestar, Kits

### Fase 3 - Reservaciones (PENDIENTE)
- [ ] Integración con Calendly (preferido por el usuario)
- [ ] Notificaciones al celular cuando se haga una reservación
- **Nota:** El usuario tiene cuenta de negocio en Instagram y correo contacto@healandplay.mx

### Fase 4 - Pagos en Línea (PENDIENTE)
- [ ] Integración de pagos con tarjeta (Stripe, Conekta o similar)
- [ ] Opción de transferencia bancaria
- **Nota:** Actualmente el botón "Comprar" redirige a WhatsApp

### Fase 5 - Instagram Feed + Avisos (COMPLETADA)
- [x] Feed de Instagram con widget de Elfsight
- [x] Sección de Avisos conectada a Supabase
- [x] Tipos de avisos: info, evento, promo, importante

### Fase 6 - Sistema de Autenticación (COMPLETADA)
- [x] Login con email/password (Supabase Auth)
- [x] Registro con confirmación por email
- [x] Recuperación de contraseña
- [x] Tabla `profiles` vinculada a `auth.users` via trigger
- [x] Roles: admin / client
- [x] Rutas protegidas (ProtectedRoute component)
- [x] Manejo robusto de sesiones con timeouts

### Fase 7 - Panel de Usuario (Dashboard) (COMPLETADA)
- [x] Perfil editable (nombre, teléfono, fecha nacimiento, dirección)
- [x] Selector de código de país para teléfono
- [x] Input de dirección con autocompletado (Leaflet/Nominatim)
- [x] Sección Material Digital con visor/reproductor

### Fase 8 - Panel de Administración (COMPLETADA)
- [x] Tab Resumen con estadísticas
- [x] Tab Usuarios: lista, ver detalles, cambiar rol
- [x] Tab Material Digital: subir, editar, eliminar materiales
- [x] Gestión de acceso por usuario (premium/privado)
- [x] Tabs placeholder para Avisos y Productos

### Fase 9 - Material Digital (COMPLETADA)
- [x] Tabla `materiales_digitales` con metadatos
- [x] Tabla `materiales_acceso` para control de acceso por usuario
- [x] Bucket `materiales` en Supabase Storage (privado)
- [x] Upload con drag & drop, detección automática de tipo
- [x] Niveles de acceso: libre, premium, privado
- [x] Visor PDF (abre en nueva pestaña via signed URL)
- [x] Reproductor de audio inline (HTML5 audio)
- [x] Reproductor de video inline (HTML5 video)
- [x] Signed URLs con expiración de 1 hora

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Navbar.tsx           # Navegación con menú móvil
│   ├── Hero.tsx             # Sección principal
│   ├── QuienesSomos.tsx     # Sobre nosotros
│   ├── Servicios.tsx        # 6 servicios ofrecidos
│   ├── Productos.tsx        # Magic Box + catálogo
│   ├── Avisos.tsx           # Avisos desde Supabase
│   ├── InstagramFeed.tsx    # Widget de Elfsight
│   ├── Contacto.tsx         # Información de contacto
│   ├── Footer.tsx           # Pie de página
│   ├── AuthLayout.tsx       # Layout compartido para auth pages
│   ├── ProtectedRoute.tsx   # Guard para rutas protegidas
│   └── AddressInput.tsx     # Input de dirección con mapa
├── contexts/
│   └── AuthContext.tsx      # Provider de autenticación
├── hooks/
│   └── useInView.ts         # Hook para animaciones al scroll
├── lib/
│   ├── supabase.ts          # Cliente de Supabase
│   └── auth-helpers.ts      # Helpers de auth (validación, mensajes)
├── pages/
│   ├── LandingPage.tsx      # Página principal pública
│   ├── Login.tsx            # Inicio de sesión
│   ├── Register.tsx         # Registro
│   ├── ResetPassword.tsx    # Recuperar contraseña
│   ├── Dashboard.tsx        # Panel de usuario
│   └── AdminPanel.tsx       # Panel de administración
├── types/
│   └── database.ts          # Tipos de TypeScript para DB
├── App.tsx                  # Router principal
├── main.tsx                 # Entry point
└── index.css                # Estilos globales
```

---

## Configuraciones Importantes

### TypeScript (tsconfig)
- `erasableSyntaxOnly: true` — NO usar enums, usar union types
- `verbatimModuleSyntax: true` — usar `import type` para tipos
- `noUnusedLocals/noUnusedParameters: true` — strict unused checks

### Supabase - Tablas

**`profiles`** — Perfiles de usuario
```sql
- id (UUID, PK, FK → auth.users)
- email, nombre_completo, telefono, avatar_url
- fecha_nacimiento, direccion, direccion_lat, direccion_lng
- role ('admin' | 'client')
- created_at, updated_at
```

**`materiales_digitales`** — Materiales descargables
```sql
- id (UUID, PK)
- titulo, descripcion, tipo ('pdf'|'audio'|'video')
- acceso ('libre'|'premium'|'privado')
- archivo_path, archivo_nombre, archivo_tamano, archivo_tipo
- activo, orden, created_at, updated_at, created_by
```

**`materiales_acceso`** — Acceso por usuario a materiales
```sql
- id (UUID, PK)
- material_id (FK), user_id (FK)
- granted_at, granted_by
```

**`avisos`** — Avisos en landing page
```sql
- id, titulo, contenido, fecha
- tipo ('info'|'evento'|'promo'|'importante')
- activo, created_at
```

**`subscribers`** — Suscriptores de newsletter

### Supabase - Storage
- Bucket `materiales` (privado) — archivos PDF, audio, video
- Acceso via signed URLs (1 hora expiración)

### Supabase - Functions (SECURITY DEFINER)
- `is_admin()` — verifica si el usuario actual es admin
- `handle_new_user()` — trigger para crear profile al registrarse
- `handle_updated_at()` — trigger para actualizar timestamp

### SPA Routing (Azure)
- `staticwebapp.config.json` — fallback a index.html para rutas cliente

### Elfsight (Instagram Feed)
- Widget ID: `97b0e41c-88a9-4238-9dee-5e2ad4a9a69b`

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

## Patrones de Diseño

- Cards: `bg-white/60 backdrop-blur-sm rounded-2xl border border-dark/5`
- Labels/Buttons: `uppercase tracking-wider text-xs`
- Inputs: `bg-white border border-dark/10 rounded-lg`

---

## Rutas de la Aplicación

| Ruta | Componente | Acceso |
|------|------------|--------|
| `/` | LandingPage | Público |
| `/login` | Login | Público (redirige si logueado) |
| `/registro` | Register | Público |
| `/recuperar-password` | ResetPassword | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/admin` | AdminPanel | Solo admin |

---

## Pendientes / Mejoras Futuras

- [ ] Agregar fotos reales de productos
- [ ] Actualizar precios reales de productos
- [ ] Agregar foto en sección "Quiénes Somos"
- [ ] Configurar Calendly para reservaciones
- [ ] Integrar pagos en línea
- [ ] Completar tabs de Avisos y Productos en admin
- [ ] SEO y meta tags para redes sociales
- [ ] Personalizar emails de Supabase Auth (confirmación, reset)

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

## Migraciones SQL

Las migraciones están en `supabase/migrations/` (ignoradas en git):
1. `001_create_profiles.sql` — tabla profiles + triggers + RLS
2. `002_fix_rls_policies.sql` — ajustes de políticas
3. `003_add_birthday_address.sql` — campos adicionales en profiles
4. `004_create_materiales.sql` — tablas de material digital + storage

**Nota:** Ejecutar manualmente en Supabase SQL Editor.

---

## Fecha de Lanzamiento
**Magic Box y página:** 1 de Marzo 2026

---

*Última actualización: 5 de Febrero 2026*
