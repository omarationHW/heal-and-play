import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateNombreCompleto } from '../lib/auth-helpers'
import AddressInput from '../components/AddressInput'
import type { MaterialDigital } from '../types/database'
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
    title: 'Contenido Exclusivo',
    description: 'Artículos, tips y contenido especial solo para miembros de nuestra comunidad.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-lg tracking-[0.2em] font-medium uppercase"
          >
            Heal and Play
          </button>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
              >
                Administración
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="font-brittany text-4xl md:text-5xl mb-2">
            Hola, {displayName || 'bienvenida'}
          </h1>
          <p className="text-dark/60 text-sm">
            Este es tu espacio personal en Heal and Play.
          </p>
        </div>

        {/* Profile Section */}
        <section className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-dark/5">
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

        {/* Material Digital Section */}
        <MaterialDigitalSection />

        {/* Coming Soon Cards */}
        <section>
          <h2 className="text-sm tracking-wider uppercase font-medium mb-6">Próximamente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comingSoonCards.map((card) => (
              <div
                key={card.title}
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-dark/5 opacity-60"
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

function MaterialDigitalSection() {
  const [materiales, setMateriales] = useState<MaterialDigital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
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
  }, [])

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-sm tracking-wider uppercase font-medium mb-6">Material Digital</h2>
        <p className="text-xs text-dark/50">Cargando materiales...</p>
      </section>
    )
  }

  if (materiales.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-sm tracking-wider uppercase font-medium mb-6">Material Digital</h2>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-dark/5 text-center">
          <svg className="w-8 h-8 text-dark/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-xs text-dark/50">Aún no hay materiales disponibles.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-sm tracking-wider uppercase font-medium mb-6">Material Digital</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materiales.map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </section>
  )
}

function MaterialCard({ material }: { material: MaterialDigital }) {
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
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-dark/5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-dark/5 rounded-full flex items-center justify-center shrink-0 text-dark/50">
          {tipoIcons[material.tipo]}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium mb-0.5">{material.titulo}</h3>
          {material.descripcion && (
            <p className="text-xs text-dark/50 leading-relaxed">{material.descripcion}</p>
          )}
        </div>
        <span className="text-[10px] tracking-wider uppercase bg-dark/5 text-dark/50 px-2 py-0.5 rounded shrink-0">
          {tipoBadge[material.tipo]}
        </span>
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-xs tracking-wider uppercase">Reproducir {material.archivo_nombre}</span>
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
