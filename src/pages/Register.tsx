import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage, validateEmail, validatePassword, validateNombreCompleto } from '../lib/auth-helpers'
import type { AuthError } from '@supabase/supabase-js'
import AuthLayout from '../components/AuthLayout'
import AddressInput from '../components/AddressInput'

export default function Register() {
  const { user, loading, signUp } = useAuth()
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [address, setAddress] = useState({ text: '', lat: null as number | null, lng: null as number | null })
  const [fraseSecreta, setFraseSecreta] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-dark/60 text-sm tracking-wider uppercase">Cargando...</p>
      </div>
    )
  }
  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const nombreError = validateNombreCompleto(nombreCompleto)
    if (nombreError) { setError(nombreError); return }
    const emailError = validateEmail(email)
    if (emailError) { setError(emailError); return }
    const passwordError = validatePassword(password)
    if (passwordError) { setError(passwordError); return }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    const { error: signUpError } = await signUp(email, password, nombreCompleto.trim(), {
      fecha_nacimiento: fechaNacimiento || undefined,
      direccion: address.text || undefined,
      direccion_lat: address.lat ?? undefined,
      direccion_lng: address.lng ?? undefined,
      frase_secreta: fraseSecreta.trim() || undefined,
    })
    setSubmitting(false)

    if (signUpError) {
      setError(getAuthErrorMessage({ message: signUpError } as AuthError))
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout title="¡Registro exitoso!" subtitle="Solo falta un paso">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-dark/70 text-sm leading-relaxed">
            Revisa tu bandeja de entrada en <strong>{email}</strong> y haz clic en el enlace de verificación para activar tu cuenta.
          </p>
          <Link
            to="/login"
            className="inline-block mt-4 text-sm text-dark font-medium hover:underline"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Únete a nuestra comunidad">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
            placeholder="Tu nombre"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Fecha de nacimiento <span className="normal-case tracking-normal text-dark/40">(opcional)</span>
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
            Dirección <span className="normal-case tracking-normal text-dark/40">(opcional)</span>
          </label>
          <AddressInput value={address} onChange={setAddress} />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Frase secreta <span className="normal-case tracking-normal text-dark/40">(opcional)</span>
          </label>
          <input
            type="text"
            value={fraseSecreta}
            onChange={(e) => setFraseSecreta(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
            placeholder="Si tienes una, ingrésala aquí"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark/70 transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark/70 transition-colors"
            >
              {showConfirm ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        <p className="text-center text-sm text-dark/60">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-dark font-medium hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
