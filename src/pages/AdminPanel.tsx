import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { Profile, MaterialDigital, MaterialAcceso } from '../types/database'
import type { MaterialTipo, MaterialAccesoNivel } from '../types/database'

type AdminTab = 'overview' | 'materiales' | 'avisos' | 'productos' | 'usuarios'

export default function AdminPanel() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [userCount, setUserCount] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        setUserCount(count ?? 0)
      })
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'materiales', label: 'Material Digital' },
    { id: 'avisos', label: 'Avisos' },
    { id: 'productos', label: 'Productos' },
    { id: 'usuarios', label: 'Usuarios' },
  ]

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <header className="bg-beige/95 backdrop-blur-sm border-b border-dark/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-lg tracking-[0.2em] font-medium uppercase"
            >
              Heal and Play
            </button>
            <span className="text-xs tracking-wider uppercase bg-dark/10 text-dark/60 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
            >
              Mi Panel
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-brittany text-4xl md:text-5xl mb-2">Administración</h1>
          <p className="text-dark/60 text-sm">
            Hola, {profile?.nombre_completo}. Gestiona tu sitio desde aquí.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-dark/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm tracking-wider uppercase transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-dark border-dark'
                  : 'text-dark/40 border-transparent hover:text-dark/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab userCount={userCount} />}
        {activeTab === 'materiales' && <MaterialesTab />}
        {activeTab === 'avisos' && <PlaceholderTab name="Avisos" description="Crea, edita y elimina avisos que se muestran en la landing page." />}
        {activeTab === 'productos' && <PlaceholderTab name="Productos" description="Gestiona el catálogo de productos: agrega nuevos, edita precios y disponibilidad." />}
        {activeTab === 'usuarios' && <UsuariosTab />}
      </main>
    </div>
  )
}

function OverviewTab({ userCount }: { userCount: number | null }) {
  const stats = [
    { label: 'Usuarios registrados', value: userCount !== null ? userCount.toString() : '...' },
    { label: 'Avisos activos', value: '—' },
    { label: 'Productos', value: '—' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-dark/5"
          >
            <p className="text-3xl font-medium mb-1">{stat.value}</p>
            <p className="text-xs tracking-wider uppercase text-dark/50">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-dark/5">
        <h3 className="text-sm tracking-wider uppercase font-medium mb-2">Acciones Rápidas</h3>
        <p className="text-xs text-dark/50 leading-relaxed">
          Las funcionalidades de administración se irán habilitando gradualmente. Por ahora, puedes gestionar los avisos directamente desde el panel de Supabase y ver el resumen de usuarios aquí.
        </p>
      </div>
    </div>
  )
}

function PlaceholderTab({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-dark/5 text-center">
      <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h3 className="text-sm tracking-wider uppercase font-medium mb-2">
        Gestión de {name}
      </h3>
      <p className="text-xs text-dark/50 leading-relaxed max-w-md mx-auto mb-4">
        {description}
      </p>
      <span className="inline-block text-[10px] tracking-wider uppercase bg-dark/5 text-dark/40 px-3 py-1 rounded">
        Próximamente
      </span>
    </div>
  )
}

// ──────────────────────────────────────────────
// Material Digital Tab
// ──────────────────────────────────────────────

function detectTipo(mimeType: string): MaterialTipo {
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  return 'pdf'
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const tipoIcons: Record<MaterialTipo, React.ReactNode> = {
  pdf: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  audio: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  video: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
}

const accesoBadge: Record<MaterialAccesoNivel, { bg: string; text: string; label: string }> = {
  libre: { bg: 'bg-green-100', text: 'text-green-700', label: 'Libre' },
  premium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Premium' },
  privado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Privado' },
}

function MaterialesTab() {
  const { user } = useAuth()
  const [materiales, setMateriales] = useState<MaterialDigital[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMateriales = async () => {
    try {
      const { data, error } = await supabase
        .from('materiales_digitales')
        .select('*')
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

  useEffect(() => { fetchMateriales() }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-dark/50 tracking-wider uppercase">Cargando materiales...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-dark/50">
          {materiales.length} material{materiales.length !== 1 ? 'es' : ''}
        </p>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-dark text-beige text-xs tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors"
        >
          Subir Material
        </button>
      </div>

      {showUpload && (
        <UploadForm
          userId={user?.id ?? ''}
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); fetchMateriales() }}
        />
      )}

      {materiales.length === 0 && !showUpload && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-dark/5 text-center">
          <p className="text-sm text-dark/50">No hay materiales. Sube el primero.</p>
        </div>
      )}

      {materiales.map((m) => (
        <MaterialRow
          key={m.id}
          material={m}
          expanded={expandedId === m.id}
          onToggle={() => setExpandedId(expandedId === m.id ? null : m.id)}
          onRefresh={fetchMateriales}
        />
      ))}
    </div>
  )
}

// ── Upload Form ──

function UploadForm({
  userId,
  onClose,
  onUploaded,
}: {
  userId: string
  onClose: () => void
  onUploaded: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [acceso, setAcceso] = useState<MaterialAccesoNivel>('libre')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const tipo: MaterialTipo | null = file ? detectTipo(file.type) : null

  const handleFile = (f: File) => {
    setFile(f)
    if (!titulo) setTitulo(f.name.replace(/\.[^.]+$/, ''))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !titulo.trim()) return

    setUploading(true)
    setError('')

    try {
      const materialId = crypto.randomUUID()
      const storagePath = `${materialId}/${file.name}`

      // 1. Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('materiales')
        .upload(storagePath, file)

      if (uploadError) {
        setError(`Error al subir archivo: ${uploadError.message}`)
        return
      }

      // 2. Create DB record
      const { error: dbError } = await supabase
        .from('materiales_digitales')
        .insert({
          id: materialId,
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          tipo: tipo!,
          acceso,
          archivo_path: storagePath,
          archivo_nombre: file.name,
          archivo_tamano: file.size,
          archivo_tipo: file.type,
          created_by: userId,
        })

      if (dbError) {
        // Rollback: delete uploaded file
        try { await supabase.storage.from('materiales').remove([storagePath]) } catch {}
        setError(`Error al guardar: ${dbError.message}`)
        return
      }

      onUploaded()
    } catch (err) {
      console.error('Upload error:', err)
      setError('Error inesperado al subir. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-dark/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm tracking-wider uppercase font-medium">Subir Material</h3>
        <button onClick={onClose} className="text-dark/40 hover:text-dark transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-dark/40 bg-dark/5' : 'border-dark/15 hover:border-dark/30'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.mp3,.mp4,.wav,.webm,.ogg,.m4a"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-dark/60">{tipoIcons[tipo!]}</span>
              <div className="text-left">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-dark/50">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ) : (
            <div>
              <svg className="w-8 h-8 text-dark/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs text-dark/50">Arrastra un archivo o haz clic para seleccionar</p>
              <p className="text-[10px] text-dark/30 mt-1">PDF, MP3, MP4, WAV, WebM, OGG</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors resize-none"
          />
        </div>

        {/* Tipo (auto-detected) */}
        {tipo && (
          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Tipo (auto-detectado)</label>
            <div className="flex items-center gap-2 text-sm text-dark/70">
              {tipoIcons[tipo]}
              <span className="capitalize">{tipo}</span>
            </div>
          </div>
        )}

        {/* Acceso */}
        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Nivel de Acceso</label>
          <div className="flex gap-2">
            {(['libre', 'premium', 'privado'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAcceso(a)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-lg border transition-colors ${
                  acceso === a
                    ? `${accesoBadge[a].bg} ${accesoBadge[a].text} border-current`
                    : 'border-dark/10 text-dark/50 hover:border-dark/30'
                }`}
              >
                {accesoBadge[a].label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || !file || !titulo.trim()}
            className="px-6 py-2 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : 'Subir'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Material Row (expandable) ──

function MaterialRow({
  material,
  expanded,
  onToggle,
  onRefresh,
}: {
  material: MaterialDigital
  expanded: boolean
  onToggle: () => void
  onRefresh: () => void
}) {
  const badge = accesoBadge[material.acceso]

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-dark/5 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-dark/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-dark/5 rounded-full flex items-center justify-center shrink-0 text-dark/50">
            {tipoIcons[material.tipo]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{material.titulo}</p>
            <p className="text-xs text-dark/50 truncate">
              {material.archivo_nombre} &middot; {formatFileSize(material.archivo_tamano)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!material.activo && (
            <span className="text-[10px] tracking-wider uppercase bg-dark/10 text-dark/50 px-2 py-0.5 rounded">
              Inactivo
            </span>
          )}
          <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <svg
            className={`w-4 h-4 text-dark/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <MaterialExpanded material={material} onRefresh={onRefresh} />
      )}
    </div>
  )
}

// ── Material Expanded Details ──

function MaterialExpanded({
  material,
  onRefresh,
}: {
  material: MaterialDigital
  onRefresh: () => void
}) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [titulo, setTitulo] = useState(material.titulo)
  const [descripcion, setDescripcion] = useState(material.descripcion || '')
  const [acceso, setAcceso] = useState(material.acceso)
  const [activo, setActivo] = useState(material.activo)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  // Access management state
  const [accessUsers, setAccessUsers] = useState<(MaterialAcceso & { profile?: Profile })[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [loadingAccess, setLoadingAccess] = useState(false)
  const [showAccessSection, setShowAccessSection] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [grantingAccess, setGrantingAccess] = useState<string | null>(null)
  const [revokingAccess, setRevokingAccess] = useState<string | null>(null)

  const isRestricted = material.acceso === 'premium' || material.acceso === 'privado'

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const { error: err } = await supabase
      .from('materiales_digitales')
      .update({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        acceso,
        activo,
      })
      .eq('id', material.id)

    setSaving(false)
    if (err) {
      setError(`Error: ${err.message}`)
      return
    }
    setEditing(false)
    onRefresh()
  }

  const handleDelete = async () => {
    setDeleting(true)
    // Delete from storage first
    await supabase.storage.from('materiales').remove([material.archivo_path])
    // Then delete DB record (cascades to materiales_acceso)
    await supabase.from('materiales_digitales').delete().eq('id', material.id)
    setDeleting(false)
    onRefresh()
  }

  const loadAccessData = async () => {
    setLoadingAccess(true)
    const [accessResult, usersResult] = await Promise.all([
      supabase
        .from('materiales_acceso')
        .select('*')
        .eq('material_id', material.id),
      supabase
        .from('profiles')
        .select('*')
        .order('nombre_completo'),
    ])

    const accesses = (accessResult.data || []) as MaterialAcceso[]
    const users = (usersResult.data || []) as Profile[]

    // Enrich access records with profile data
    const enriched = accesses.map((a) => ({
      ...a,
      profile: users.find((u) => u.id === a.user_id),
    }))

    setAccessUsers(enriched)
    setAllUsers(users)
    setLoadingAccess(false)
  }

  const handleShowAccess = () => {
    if (!showAccessSection) {
      loadAccessData()
    }
    setShowAccessSection(!showAccessSection)
  }

  const handleGrantAccess = async (targetUserId: string) => {
    setGrantingAccess(targetUserId)
    await supabase.from('materiales_acceso').insert({
      material_id: material.id,
      user_id: targetUserId,
      granted_by: user?.id,
    })
    setGrantingAccess(null)
    loadAccessData()
  }

  const handleRevokeAccess = async (accessId: string) => {
    setRevokingAccess(accessId)
    await supabase.from('materiales_acceso').delete().eq('id', accessId)
    setRevokingAccess(null)
    loadAccessData()
  }

  const filteredUsers = allUsers.filter((u) => {
    // Exclude users who already have access
    if (accessUsers.some((a) => a.user_id === u.id)) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      (u.nombre_completo || '').toLowerCase().includes(q)
    )
  })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <div className="px-6 pb-5 pt-1 border-t border-dark/5 space-y-4">
      {editing ? (
        /* ── Edit Form ── */
        <div className="space-y-3">
          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">Acceso</label>
            <div className="flex gap-2">
              {(['libre', 'premium', 'privado'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAcceso(a)}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-lg border transition-colors ${
                    acceso === a
                      ? `${accesoBadge[a].bg} ${accesoBadge[a].text} border-current`
                      : 'border-dark/10 text-dark/50 hover:border-dark/30'
                  }`}
                >
                  {accesoBadge[a].label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs tracking-wider uppercase text-dark/60">Activo</label>
            <button
              type="button"
              onClick={() => setActivo(!activo)}
              className={`w-10 h-6 rounded-full transition-colors relative ${activo ? 'bg-green-500' : 'bg-dark/20'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${activo ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-dark text-beige text-xs tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setTitulo(material.titulo)
                setDescripcion(material.descripcion || '')
                setAcceso(material.acceso)
                setActivo(material.activo)
              }}
              className="px-4 py-1.5 text-xs tracking-wider uppercase text-dark/60 hover:text-dark transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        /* ── View Details ── */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Título</span>
              <p className="text-sm">{material.titulo}</p>
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Tipo</span>
              <p className="text-sm capitalize">{material.tipo}</p>
            </div>
            {material.descripcion && (
              <div className="md:col-span-2">
                <span className="text-[10px] tracking-wider uppercase text-dark/40">Descripción</span>
                <p className="text-sm">{material.descripcion}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Archivo</span>
              <p className="text-sm">{material.archivo_nombre}</p>
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Tamaño</span>
              <p className="text-sm">{formatFileSize(material.archivo_tamano)}</p>
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Creado</span>
              <p className="text-sm">{formatDate(material.created_at)}</p>
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase text-dark/40">Estado</span>
              <p className="text-sm">{material.activo ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-dark/5">
            <button
              onClick={() => setEditing(true)}
              className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg border border-dark/20 text-dark/70 hover:bg-dark/5 transition-colors"
            >
              Editar
            </button>
            {isRestricted && (
              <button
                onClick={handleShowAccess}
                className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg border border-dark/20 text-dark/70 hover:bg-dark/5 transition-colors"
              >
                {showAccessSection ? 'Ocultar Accesos' : 'Gestionar Accesos'}
              </button>
            )}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Eliminar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600">Confirmar:</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs tracking-wider uppercase px-3 py-1.5 text-dark/50 hover:text-dark transition-colors"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Access Management Section */}
      {showAccessSection && isRestricted && (
        <div className="border-t border-dark/5 pt-4 space-y-3">
          <h4 className="text-xs tracking-wider uppercase font-medium text-dark/70">
            Usuarios con Acceso
          </h4>

          {loadingAccess ? (
            <p className="text-xs text-dark/50">Cargando...</p>
          ) : (
            <>
              {/* Current access list */}
              {accessUsers.length === 0 ? (
                <p className="text-xs text-dark/50">Ningún usuario tiene acceso específico.</p>
              ) : (
                <div className="space-y-2">
                  {accessUsers.map((a) => (
                    <div key={a.id} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm">{a.profile?.nombre_completo || '—'}</p>
                        <p className="text-xs text-dark/50">{a.profile?.email || a.user_id}</p>
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(a.id)}
                        disabled={revokingAccess === a.id}
                        className="text-[10px] tracking-wider uppercase px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {revokingAccess === a.id ? '...' : 'Revocar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add user search */}
              <div>
                <label className="block text-[10px] tracking-wider uppercase text-dark/40 mb-1">
                  Agregar usuario
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full px-3 py-2 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
                />
              </div>

              {searchQuery && (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredUsers.length === 0 ? (
                    <p className="text-xs text-dark/40">Sin resultados</p>
                  ) : (
                    filteredUsers.slice(0, 10).map((u) => (
                      <div key={u.id} className="flex items-center justify-between bg-white/40 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm">{u.nombre_completo || '—'}</p>
                          <p className="text-xs text-dark/50">{u.email}</p>
                        </div>
                        <button
                          onClick={() => handleGrantAccess(u.id)}
                          disabled={grantingAccess === u.id}
                          className="text-[10px] tracking-wider uppercase px-2 py-1 rounded border border-dark/20 text-dark/70 hover:bg-dark/5 transition-colors disabled:opacity-50"
                        >
                          {grantingAccess === u.id ? '...' : 'Dar Acceso'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Usuarios Tab (unchanged)
// ──────────────────────────────────────────────

function UsuariosTab() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [togglingRole, setTogglingRole] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers((data as Profile[]) || [])
        setLoadingUsers(false)
      })
  }, [])

  const handleToggleRole = async (user: Profile) => {
    const newRole = user.role === 'admin' ? 'client' : 'admin'
    setTogglingRole(user.id)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id)
    setTogglingRole(null)

    if (!error) {
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, role: newRole } : u
      ))
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loadingUsers) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-dark/50 tracking-wider uppercase">Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-dark/50">
        {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
      </p>

      {users.length === 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-dark/5 text-center">
          <p className="text-sm text-dark/50">No hay usuarios registrados.</p>
        </div>
      )}

      {users.map((u) => (
        <div
          key={u.id}
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-dark/5 overflow-hidden"
        >
          {/* Row - clickable */}
          <button
            onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-dark/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-dark/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-dark">
                  {(u.nombre_completo || u.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{u.nombre_completo || '—'}</p>
                <p className="text-xs text-dark/50 truncate">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs tracking-wider uppercase px-2 py-0.5 rounded ${
                u.role === 'admin' ? 'bg-dark/10 text-dark' : 'bg-dark/5 text-dark/50'
              }`}>
                {u.role}
              </span>
              <svg
                className={`w-4 h-4 text-dark/30 transition-transform ${expandedId === u.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded details */}
          {expandedId === u.id && (
            <div className="px-6 pb-5 pt-1 border-t border-dark/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Nombre completo</span>
                  <p className="text-sm">{u.nombre_completo || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Email</span>
                  <p className="text-sm">{u.email}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Teléfono</span>
                  <p className="text-sm">{u.telefono || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Rol</span>
                  <p className="text-sm">{u.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Cumpleaños</span>
                  <p className="text-sm">
                    {u.fecha_nacimiento
                      ? new Date(u.fecha_nacimiento + 'T12:00:00').toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Dirección</span>
                  <p className="text-sm">{u.direccion || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Fecha de registro</span>
                  <p className="text-sm">{formatDate(u.created_at)}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">Última actualización</span>
                  <p className="text-sm">{formatDate(u.updated_at)}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] tracking-wider uppercase text-dark/40">ID</span>
                  <p className="text-xs text-dark/40 font-mono">{u.id}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-dark/5">
                <button
                  onClick={() => handleToggleRole(u)}
                  disabled={togglingRole === u.id}
                  className={`text-xs tracking-wider uppercase px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                    u.role === 'admin'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-dark/20 text-dark/70 hover:bg-dark/5'
                  }`}
                >
                  {togglingRole === u.id
                    ? 'Cambiando...'
                    : u.role === 'admin'
                      ? 'Quitar Admin'
                      : 'Hacer Admin'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
