import type { AuthError } from '@supabase/supabase-js'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'Email not confirmed': 'Tu email no ha sido verificado. Revisa tu bandeja de entrada.',
  'User already registered': 'Ya existe una cuenta con este email.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Signup requires a valid password': 'Debes ingresar una contraseña válida.',
  'Unable to validate email address: invalid format': 'El formato del email no es válido.',
  'Email rate limit exceeded': 'Demasiados intentos. Intenta de nuevo en unos minutos.',
  'For security purposes, you can only request this once every 60 seconds': 'Por seguridad, solo puedes solicitar esto una vez cada 60 segundos.',
  'New password should be different from the old password.': 'La nueva contraseña debe ser diferente a la anterior.',
}

export function getAuthErrorMessage(error: AuthError): string {
  return AUTH_ERROR_MESSAGES[error.message] ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El email es requerido.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'El formato del email no es válido.'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es requerida.'
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return null
}

export function validateNombreCompleto(nombre: string): string | null {
  if (!nombre.trim()) return 'El nombre es requerido.'
  if (nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.'
  return null
}
