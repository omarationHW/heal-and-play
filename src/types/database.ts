export type UserRole = 'admin' | 'client'

export type MaterialTipo = 'pdf' | 'audio' | 'video'

export type MaterialAccesoNivel = 'libre' | 'premium' | 'privado'

export interface Profile {
  id: string
  email: string
  nombre_completo: string | null
  telefono: string | null
  avatar_url: string | null
  fecha_nacimiento: string | null
  direccion: string | null
  direccion_lat: number | null
  direccion_lng: number | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface MaterialDigital {
  id: string
  titulo: string
  descripcion: string | null
  tipo: MaterialTipo
  acceso: MaterialAccesoNivel
  archivo_path: string
  archivo_nombre: string
  archivo_tamano: number | null
  archivo_tipo: string | null
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface MaterialAcceso {
  id: string
  material_id: string
  user_id: string
  granted_at: string
  granted_by: string | null
}
