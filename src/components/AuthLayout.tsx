import { useNavigate } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-beige">
      {/* Simple header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-beige/95 backdrop-blur-sm border-b border-dark/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-center h-16 md:h-20">
          <button
            onClick={() => navigate('/')}
            className="text-lg md:text-xl tracking-[0.2em] font-medium uppercase"
          >
            Heal and Play
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 pt-28">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-dark/5">
          <h1 className="font-brittany text-3xl md:text-4xl text-center mb-2">{title}</h1>
          {subtitle && (
            <p className="text-dark/60 text-sm text-center mb-6">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
