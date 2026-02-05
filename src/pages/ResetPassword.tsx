import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage, validateEmail, validatePassword } from '../lib/auth-helpers'
import type { AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/AuthLayout'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const [mode, setMode] = useState<'request' | 'update'>('request')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)
  const { resetPassword } = useAuth()

  // Detect if user arrived via password recovery link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailError = validateEmail(email)
    if (emailError) { setError(emailError); return }

    setSubmitting(true)
    const { error: resetError } = await resetPassword(email)
    setSubmitting(false)

    if (resetError) {
      setError(getAuthErrorMessage({ message: resetError } as AuthError))
      return
    }

    setEmailSent(true)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const passwordError = validatePassword(newPassword)
    if (passwordError) { setError(passwordError); return }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await updatePassword(newPassword)
    setSubmitting(false)

    if (updateError) {
      setError(getAuthErrorMessage({ message: updateError } as AuthError))
      return
    }

    setPasswordUpdated(true)
  }

  // Success: password updated
  if (passwordUpdated) {
    return (
      <AuthLayout title="¡Listo!" subtitle="Tu contraseña ha sido actualizada">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-dark/70 text-sm">
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <Link
            to="/login"
            className="inline-block mt-2 px-6 py-2.5 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Success: email sent
  if (emailSent) {
    return (
      <AuthLayout title="Correo enviado" subtitle="Revisa tu bandeja de entrada">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-dark/70 text-sm leading-relaxed">
            Enviamos un enlace de recuperación a <strong>{email}</strong>. Haz clic en el enlace para crear una nueva contraseña.
          </p>
          <Link
            to="/login"
            className="inline-block mt-2 text-sm text-dark font-medium hover:underline"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Mode: update password (arrived via recovery link)
  if (mode === 'update') {
    return (
      <AuthLayout title="Nueva Contraseña" subtitle="Ingresa tu nueva contraseña">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-dark/60 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </AuthLayout>
    )
  }

  // Mode: request reset email
  return (
    <AuthLayout title="Recuperar Contraseña" subtitle="Te enviaremos un enlace para restablecerla">
      <form onSubmit={handleRequestReset} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Enviar Enlace'}
        </button>

        <p className="text-center text-sm text-dark/60">
          <Link to="/login" className="text-dark font-medium hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
