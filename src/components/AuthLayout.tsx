import Navbar from './Navbar'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-beige">
      <Navbar currentSection="" />

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
