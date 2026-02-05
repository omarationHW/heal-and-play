import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import QuienesSomos from '../components/QuienesSomos'
import Servicios from '../components/Servicios'
import Productos from '../components/Productos'
import Avisos from '../components/Avisos'
import InstagramFeed from '../components/InstagramFeed'
import Contacto from '../components/Contacto'
import Footer from '../components/Footer'

export default function LandingPage() {
  const [currentSection, setCurrentSection] = useState('inicio')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'nosotros', 'servicios', 'productos', 'avisos', 'instagram', 'contacto']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar currentSection={currentSection} />
      <Hero />
      <QuienesSomos />
      <Servicios />
      <Productos />
      <Avisos />
      <InstagramFeed />
      <Contacto />
      <Footer />
    </div>
  )
}
