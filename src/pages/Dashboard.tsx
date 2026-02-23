import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateNombreCompleto } from '../lib/auth-helpers'
import AddressInput from '../components/AddressInput'
import type { MaterialDigital, SesionZoom } from '../types/database'
import type { MaterialTipo } from '../types/database'

const countryCodes = [
  { code: '+52', flag: '\u{1F1F2}\u{1F1FD}', label: 'MX' },
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', label: 'US' },
  { code: '+57', flag: '\u{1F1E8}\u{1F1F4}', label: 'CO' },
  { code: '+54', flag: '\u{1F1E6}\u{1F1F7}', label: 'AR' },
  { code: '+56', flag: '\u{1F1E8}\u{1F1F1}', label: 'CL' },
  { code: '+51', flag: '\u{1F1F5}\u{1F1EA}', label: 'PE' },
  { code: '+58', flag: '\u{1F1FB}\u{1F1EA}', label: 'VE' },
  { code: '+593', flag: '\u{1F1EA}\u{1F1E8}', label: 'EC' },
  { code: '+502', flag: '\u{1F1EC}\u{1F1F9}', label: 'GT' },
  { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', label: 'ES' },
]

function parsePhone(raw: string | null): { countryCode: string; number: string } {
  if (!raw) return { countryCode: '+52', number: '' }
  for (const c of countryCodes) {
    if (raw.startsWith(c.code)) {
      return { countryCode: c.code, number: raw.slice(c.code.length).trim() }
    }
  }
  return { countryCode: '+52', number: raw }
}

const comingSoonCards = [
  {
    title: 'Grabaciones',
    description: 'Acceso a las grabaciones de talleres y sesiones grupales en las que has participado.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Historial de Compras',
    description: 'Revisa tus compras anteriores, productos adquiridos y estado de tus pedidos.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
]

export default function Dashboard() {
  const { user, profile, isAdmin, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const displayName = profile?.nombre_completo
    || (user?.user_metadata?.nombre_completo as string)
    || ''

  const parsed = parsePhone(profile?.telefono ?? null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [nombre, setNombre] = useState(displayName)
  const [countryCode, setCountryCode] = useState(parsed.countryCode)
  const [phoneNumber, setPhoneNumber] = useState(parsed.number)
  const [fechaNacimiento, setFechaNacimiento] = useState(profile?.fecha_nacimiento || '')
  const [address, setAddress] = useState({
    text: profile?.direccion || '',
    lat: profile?.direccion_lat ?? null,
    lng: profile?.direccion_lng ?? null,
  })
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveMessage('')

    if (!user) return

    const nombreError = validateNombreCompleto(nombre)
    if (nombreError) { setSaveMessage(nombreError); return }

    const fullPhone = phoneNumber.trim()
      ? `${countryCode}${phoneNumber.trim()}`
      : null

    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        nombre_completo: nombre.trim(),
        telefono: fullPhone,
        fecha_nacimiento: fechaNacimiento || null,
        direccion: address.text || null,
        direccion_lat: address.lat,
        direccion_lng: address.lng,
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) {
      setSaveMessage('Error al guardar. Intenta de nuevo.')
      return
    }

    setSaveMessage('Perfil actualizado.')
    setEditingProfile(false)
    await refreshProfile()
  }

  const selectedCountry = countryCodes.find(c => c.code === countryCode) ?? countryCodes[0]

  const displayPhone = profile?.telefono
    ? (() => {
        const p = parsePhone(profile.telefono)
        const country = countryCodes.find(c => c.code === p.countryCode)
        return country ? `${country.flag} ${p.countryCode} ${p.number}` : profile.telefono
      })()
    : '—'

  const displayBirthday = profile?.fecha_nacimiento
    ? new Date(profile.fecha_nacimiento + 'T12:00:00').toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <header className="bg-beige/95 backdrop-blur-sm border-b border-dark/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-base sm:text-lg tracking-[0.2em] font-medium uppercase"
          >
            Heal and Play
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-xs sm:text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
              >
                Admin
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="text-xs sm:text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-brittany text-3xl sm:text-4xl md:text-5xl mb-2">
            Hola, {displayName || 'bienvenida'}
          </h1>
          <p className="text-dark/60 text-sm">
            Este es tu espacio personal en Heal and Play.
          </p>
        </div>

        {/* Profile Section */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-dark/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-wider uppercase font-medium">Mi Perfil</h2>
              {!editingProfile && (
                <button
                  onClick={() => {
                    setNombre(displayName)
                    const p = parsePhone(profile?.telefono ?? null)
                    setCountryCode(p.countryCode)
                    setPhoneNumber(p.number)
                    setFechaNacimiento(profile?.fecha_nacimiento || '')
                    setAddress({
                      text: profile?.direccion || '',
                      lat: profile?.direccion_lat ?? null,
                      lng: profile?.direccion_lng ?? null,
                    })
                    setEditingProfile(true)
                    setSaveMessage('')
                  }}
                  className="text-xs tracking-wider uppercase text-dark/50 hover:text-dark transition-colors"
                >
                  Editar
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
                    Teléfono
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-28 px-2 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors appearance-none cursor-pointer"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9\s-]/g, '')
                        setPhoneNumber(val)
                      }}
                      className="flex-1 px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
                      placeholder="10 dígitos"
                    />
                  </div>
                  <p className="text-xs text-dark/40 mt-1">
                    {selectedCountry.flag} {selectedCountry.label} ({selectedCountry.code})
                  </p>
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
                    Dirección
                  </label>
                  <AddressInput value={address} onChange={setAddress} />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-dark/5 border border-dark/10 rounded-lg text-sm text-dark/50 cursor-not-allowed"
                  />
                </div>

                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {saveMessage}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingProfile(false); setSaveMessage('') }}
                    className="px-6 py-2 text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-xs tracking-wider uppercase text-dark/50">Nombre</span>
                  <p className="text-sm">{displayName || '—'}</p>
                </div>
                <div>
                  <span className="text-xs tracking-wider uppercase text-dark/50">Teléfono</span>
                  <p className="text-sm">{displayPhone}</p>
                </div>
                <div>
                  <span className="text-xs tracking-wider uppercase text-dark/50">Cumpleaños</span>
                  <p className="text-sm">{displayBirthday}</p>
                </div>
                <div>
                  <span className="text-xs tracking-wider uppercase text-dark/50">Dirección</span>
                  <p className="text-sm">{profile?.direccion || '—'}</p>
                </div>
                <div>
                  <span className="text-xs tracking-wider uppercase text-dark/50">Email</span>
                  <p className="text-sm">{profile?.email || user?.email || '—'}</p>
                </div>
                {saveMessage && (
                  <p className="text-sm text-green-600">{saveMessage}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Challenge Section - solo acceso secreto */}
        {profile?.tiene_acceso_secreto && (
          <>
            <ChallengeInfoSection />
            <SesionesSection />
          </>
        )}

        {/* Material Digital Section */}
        <MaterialDigitalSection hasSecretAccess={profile?.tiene_acceso_secreto ?? false} />

        {/* Coming Soon Cards */}
        <section>
          <h2 className="text-sm tracking-wider uppercase font-medium mb-4 sm:mb-6">Próximamente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {comingSoonCards.map((card) => (
              <div
                key={card.title}
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-dark/5 opacity-60"
              >
                <div className="text-dark/30 mb-3">{card.icon}</div>
                <h3 className="text-sm font-medium tracking-wider uppercase mb-1">{card.title}</h3>
                <p className="text-xs text-dark/50 leading-relaxed">{card.description}</p>
                <span className="inline-block mt-3 text-[10px] tracking-wider uppercase bg-dark/5 text-dark/40 px-2 py-0.5 rounded">
                  Próximamente
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

// ──────────────────────────────────────────────
// Challenge Info Section
// ──────────────────────────────────────────────

const challengeContent = [
  { day: '1', title: 'New Girl' },
  { day: '3', title: 'Módulos' },
  { day: '5', title: 'Gestión Emocional Consciente' },
  { day: '10', title: 'Conexión y Cuidado del Cuerpo' },
  { day: '16', title: 'Regulación del Sistema Nervioso' },
  { day: '21', title: 'Armonización de tus Relaciones' },
  { day: '25', title: 'Integración del Proceso' },
  { day: '26', title: 'Habitarte' },
  { day: '*', title: 'Ejercicios Complementarios' },
]

function ChallengeInfoSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mb-8 font-carlito">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-dark/5">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <p className="font-maven text-[10px] sm:text-xs tracking-[0.3em] uppercase text-dark/50 mb-2">28 días de auto-cuidado</p>
          <h2 className="font-maven text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight">
            New Girl Challenge
          </h2>
          <p className="text-xs sm:text-sm text-dark/60 mt-2 max-w-md mx-auto">
            Comienza a crear tu personaje protagonico para esta nueva era. Totalmente un reset para tu mindset y comenzar a crear tu mejor versión.
          </p>
        </div>

        {/* What's included */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {[
            { label: 'Workbook Digital', icon: '📖' },
            { label: 'Sesiones Online', icon: '💻' },
            { label: 'Acompañamiento Personal', icon: '🤝' },
            { label: 'Material Extra', icon: '✨' },
          ].map((item) => (
            <div key={item.label} className="text-center py-2.5 sm:py-3 px-1.5 sm:px-2 bg-dark/[0.03] rounded-xl">
              <span className="text-base sm:text-lg block mb-1">{item.icon}</span>
              <span className="font-maven text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-dark/70">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Format summary */}
        <div className="text-center mb-4 py-3 border-y border-dark/5">
          <p className="font-maven text-xs sm:text-sm font-bold tracking-wider uppercase text-dark/80">
            4 clases en línea &middot; 4 lunes &middot; 4 módulos
          </p>
          <p className="text-xs text-dark/50 mt-1">Para crear tu nueva identidad</p>
        </div>

        {/* Contenido toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-maven text-xs tracking-wider uppercase font-semibold text-dark/60">Contenido del Workbook</span>
          <svg
            className={`w-4 h-4 text-dark/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 sm:space-y-2.5">
            {challengeContent.map((item, i) => (
              <div key={i} className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-brittany text-lg sm:text-xl text-dark/40 w-7 sm:w-8 text-right shrink-0">{item.day}</span>
                <span className="font-maven text-xs sm:text-sm font-semibold uppercase tracking-wide">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Sesiones Zoom Section
// ──────────────────────────────────────────────

function SesionesSection() {
  const { sessionReady } = useAuth()
  const [sesiones, setSesiones] = useState<SesionZoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionReady) return
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('sesiones_zoom')
          .select('*')
          .eq('activa', true)
          .order('orden', { ascending: true })
        if (error) console.error('Error fetching sesiones:', error)
        setSesiones((data as SesionZoom[]) || [])
      } catch (err) {
        console.error('Error fetching sesiones:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionReady])

  if (loading) {
    return (
      <section className="mb-8 sm:mb-12">
        <h2 className="text-sm tracking-wider uppercase font-medium mb-4 sm:mb-6">Sesiones</h2>
        <p className="text-xs text-dark/50">Cargando sesiones...</p>
      </section>
    )
  }

  if (sesiones.length === 0) return null

  return (
    <section className="mb-8 sm:mb-12 font-carlito">
      <h2 className="font-maven text-sm tracking-wider uppercase font-semibold mb-4 sm:mb-6">Sesiones</h2>
      <div className="grid grid-cols-1 gap-4">
        {sesiones.map((s) => (
          <div
            key={s.id}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-dark/5"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Video icon - hidden on very small screens, shown inline on sm+ */}
              <div className="hidden sm:flex w-12 h-12 bg-dark/5 rounded-full items-center justify-center shrink-0 text-dark/50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-maven text-base sm:text-lg font-bold tracking-wide uppercase mb-1">{s.titulo}</h3>
                {s.descripcion && (
                  <p className="text-xs sm:text-sm text-dark/60 mb-2">{s.descripcion}</p>
                )}
                {s.recurrencia && (
                  <p className="text-xs sm:text-sm text-dark/60 mb-3 sm:mb-4">
                    <span className="inline-block mr-1.5">
                      <svg className="w-3.5 h-3.5 inline -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    {s.recurrencia}
                  </p>
                )}

                {/* Join button */}
                <a
                  href={s.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-maven inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-dark text-beige text-xs sm:text-sm tracking-wider uppercase font-semibold rounded-lg hover:bg-dark/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Unirse a la sesión
                </a>

                {/* Meeting info */}
                {(s.meeting_id || s.passcode) && (
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-x-6 sm:gap-y-1 text-xs sm:text-sm text-dark/40">
                    {s.meeting_id && (
                      <span>Meeting ID: <span className="text-dark/60 font-bold">{s.meeting_id}</span></span>
                    )}
                    {s.passcode && (
                      <span>Passcode: <span className="text-dark/60 font-bold">{s.passcode}</span></span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Material Digital Section
// ──────────────────────────────────────────────

const tipoIcons: Record<MaterialTipo, React.ReactNode> = {
  pdf: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  audio: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  video: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
}

function MaterialDigitalSection({ hasSecretAccess }: { hasSecretAccess: boolean }) {
  const { sessionReady } = useAuth()
  const [materiales, setMateriales] = useState<MaterialDigital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionReady) return
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('materiales_digitales')
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true })
          .order('created_at', { ascending: false })
        if (error) console.error('Error fetching materiales:', error)
        setMateriales((data as MaterialDigital[]) || [])
      } catch (err) {
        console.error('Error fetching materiales:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionReady])

  if (loading) {
    return (
      <section className="mb-8 sm:mb-12">
        <h2 className="text-sm tracking-wider uppercase font-medium mb-4 sm:mb-6">Material Digital</h2>
        <p className="text-xs text-dark/50">Cargando materiales...</p>
      </section>
    )
  }

  if (materiales.length === 0) {
    return (
      <section className="mb-8 sm:mb-12">
        <h2 className="text-sm tracking-wider uppercase font-medium mb-4 sm:mb-6">Material Digital</h2>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-dark/5 text-center">
          <svg className="w-8 h-8 text-dark/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-xs text-dark/50">Aún no hay materiales disponibles.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-sm tracking-wider uppercase font-medium mb-4 sm:mb-6">Material Digital</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {materiales.map((m) => (
          <MaterialCard key={m.id} material={m} useChallengeFonts={hasSecretAccess && m.acceso === 'secreto'} />
        ))}
      </div>
    </section>
  )
}

function MaterialCard({ material, useChallengeFonts }: { material: MaterialDigital & { acceso?: string }; useChallengeFonts?: boolean }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [error, setError] = useState('')

  const getSignedUrl = async () => {
    if (signedUrl) return signedUrl
    setLoadingUrl(true)
    setError('')
    const { data, error: err } = await supabase.storage
      .from('materiales')
      .createSignedUrl(material.archivo_path, 3600)

    setLoadingUrl(false)
    if (err || !data?.signedUrl) {
      setError('No se pudo obtener el archivo.')
      return null
    }
    setSignedUrl(data.signedUrl)
    return data.signedUrl
  }

  const handleView = async () => {
    const url = await getSignedUrl()
    if (url) window.open(url, '_blank')
  }

  const handleDownload = async () => {
    const url = await getSignedUrl()
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = material.archivo_nombre
    a.target = '_blank'
    a.click()
  }

  const tipoBadge: Record<MaterialTipo, string> = {
    pdf: 'PDF',
    audio: 'Audio',
    video: 'Video',
  }

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-dark/5 ${useChallengeFonts ? 'font-carlito' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-dark/5 rounded-full flex items-center justify-center shrink-0 text-dark/50">
          {tipoIcons[material.tipo]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-medium mb-0.5 ${useChallengeFonts ? 'font-maven font-bold uppercase tracking-wide' : ''}`}>{material.titulo}</h3>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${useChallengeFonts ? 'font-maven font-semibold' : ''} bg-dark/5 text-dark/50`}>
                {tipoBadge[material.tipo]}
              </span>
              {material.acceso === 'secreto' && (
                <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${useChallengeFonts ? 'font-maven font-semibold' : ''} bg-amber-100 text-amber-700`}>
                  Exclusivo
                </span>
              )}
            </div>
          </div>
          {material.descripcion && (
            <p className="text-xs text-dark/50 leading-relaxed">{material.descripcion}</p>
          )}
        </div>
      </div>

      {/* Audio player inline */}
      {material.tipo === 'audio' && (
        <AudioPlayer material={material} getSignedUrl={getSignedUrl} />
      )}

      {/* Video player inline */}
      {material.tipo === 'video' && (
        <VideoPlayer getSignedUrl={getSignedUrl} />
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        {material.tipo === 'pdf' && (
          <button
            onClick={handleView}
            disabled={loadingUrl}
            className="px-3 py-1.5 text-xs tracking-wider uppercase bg-dark text-beige rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
          >
            {loadingUrl ? 'Abriendo...' : 'Ver'}
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={loadingUrl}
          className="px-3 py-1.5 text-xs tracking-wider uppercase border border-dark/20 text-dark/70 rounded-lg hover:bg-dark/5 transition-colors disabled:opacity-50"
        >
          {loadingUrl ? '...' : 'Descargar'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}

function AudioPlayer({
  material,
  getSignedUrl,
}: {
  material: MaterialDigital
  getSignedUrl: () => Promise<string | null>
}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loadingAudio, setLoadingAudio] = useState(false)

  const handlePlay = async () => {
    if (audioUrl) return
    setLoadingAudio(true)
    const url = await getSignedUrl()
    if (url) setAudioUrl(url)
    setLoadingAudio(false)
  }

  if (!audioUrl) {
    return (
      <button
        onClick={handlePlay}
        disabled={loadingAudio}
        className="w-full py-3 bg-dark/5 rounded-xl flex items-center justify-center gap-2 text-dark/60 hover:bg-dark/10 transition-colors disabled:opacity-50"
      >
        {loadingAudio ? (
          <span className="text-xs tracking-wider uppercase">Cargando audio...</span>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-xs tracking-wider uppercase truncate">Reproducir {material.archivo_nombre}</span>
          </>
        )}
      </button>
    )
  }

  return (
    <audio controls className="w-full rounded-lg" src={audioUrl} preload="metadata">
      Tu navegador no soporta el reproductor de audio.
    </audio>
  )
}

function VideoPlayer({
  getSignedUrl,
}: {
  getSignedUrl: () => Promise<string | null>
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)

  const handlePlay = async () => {
    if (videoUrl) return
    setLoadingVideo(true)
    const url = await getSignedUrl()
    if (url) setVideoUrl(url)
    setLoadingVideo(false)
  }

  if (!videoUrl) {
    return (
      <button
        onClick={handlePlay}
        disabled={loadingVideo}
        className="w-full py-8 bg-dark/5 rounded-xl flex items-center justify-center gap-2 text-dark/60 hover:bg-dark/10 transition-colors disabled:opacity-50"
      >
        {loadingVideo ? (
          <span className="text-xs tracking-wider uppercase">Cargando video...</span>
        ) : (
          <>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-xs tracking-wider uppercase">Reproducir video</span>
          </>
        )}
      </button>
    )
  }

  return (
    <video controls className="w-full rounded-xl" src={videoUrl} preload="metadata">
      Tu navegador no soporta el reproductor de video.
    </video>
  )
}
