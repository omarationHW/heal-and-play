import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  currentSection: string
}

export default function Navbar({ currentSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'productos', label: 'Productos' },
    { id: 'avisos', label: 'Avisos' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'contacto', label: 'Contacto' },
  ]

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const displayName = profile?.nombre_completo
    || (user?.user_metadata?.nombre_completo as string)
    || user?.email?.split('@')[0]
    || ''

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-beige/95 backdrop-blur-sm border-b border-dark/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('inicio')}
            className="shrink-0 whitespace-nowrap text-lg md:text-xl tracking-[0.2em] font-medium uppercase"
          >
            Heal and Play
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  currentSection === item.id
                    ? 'text-dark'
                    : 'text-dark/60 hover:text-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://www.instagram.com/heal_play/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark/60 hover:text-dark transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Auth Button / User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 text-dark/60 hover:text-dark transition-colors"
                >
                  <div className="w-8 h-8 bg-dark/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-dark">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-dark/10 py-1 z-50">
                    <div className="px-4 py-2 border-b border-dark/10">
                      <p className="text-sm font-medium text-dark truncate">{displayName}</p>
                      <p className="text-xs text-dark/50 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); navigate('/dashboard') }}
                      className="block w-full text-left px-4 py-2 text-sm text-dark/70 hover:bg-dark/5 transition-colors"
                    >
                      Mi Panel
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setIsUserMenuOpen(false); navigate('/admin') }}
                        className="block w-full text-left px-4 py-2 text-sm text-dark/70 hover:bg-dark/5 transition-colors"
                      >
                        Administración
                      </button>
                    )}
                    <div className="border-t border-dark/10 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="shrink-0 whitespace-nowrap text-sm tracking-wider uppercase px-3 py-1.5 border border-dark/20 rounded-lg text-dark/70 hover:text-dark hover:border-dark/40 transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark/10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-3 text-sm tracking-wider uppercase ${
                  currentSection === item.id
                    ? 'text-dark'
                    : 'text-dark/60'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://www.instagram.com/heal_play/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 text-dark/60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-sm">@heal_play</span>
            </a>

            {/* Mobile Auth */}
            <div className="border-t border-dark/10 mt-2 pt-3">
              {user ? (
                <>
                  <div className="text-sm text-dark/60 py-2">
                    Hola, <span className="text-dark font-medium">{displayName}</span>
                  </div>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/dashboard') }}
                    className="block w-full text-left py-2 text-sm tracking-wider uppercase text-dark/60"
                  >
                    Mi Panel
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { setIsMenuOpen(false); navigate('/admin') }}
                      className="block w-full text-left py-2 text-sm tracking-wider uppercase text-dark/60"
                    >
                      Administración
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 text-sm tracking-wider uppercase text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/login') }}
                  className="block w-full text-left py-2 text-sm tracking-wider uppercase text-dark/60"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
