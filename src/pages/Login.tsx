import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage, validateEmail, validatePassword } from '../lib/auth-helpers'
import type { AuthError } from '@supabase/supabase-js'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const { user, isAdmin, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-dark/60 text-sm tracking-wider uppercase">Cargando...</p>
      </div>
    )
  }
  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailError = validateEmail(email)
    if (emailError) { setError(emailError); return }
    const passwordError = validatePassword(password)
    if (passwordError) { setError(passwordError); return }

    setSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)

    if (signInError) {
      setError(getAuthErrorMessage({ message: signInError } as AuthError))
      return
    }
    // Navigation happens automatically via the `if (user)` redirect above
  }

  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Bienvenida de vuelta">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              autoComplete="current-password"
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

        <div className="text-right">
          <Link
            to="/recuperar-password"
            className="text-xs text-dark/50 hover:text-dark transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-dark text-beige text-sm tracking-wider uppercase rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <p className="text-center text-sm text-dark/60">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-dark font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
