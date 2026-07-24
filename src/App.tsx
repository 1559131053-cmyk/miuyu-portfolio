import { useEffect } from 'react'
import { Navbar } from '@/sections/Navbar'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Gallery } from '@/sections/Gallery'
import { Advantages } from '@/sections/Advantages'
import { Contact } from '@/sections/Contact'
import './App.css'

function App() {
  useEffect(() => {
    let cancelled = false

    const scrollToHash = () => {
      if (cancelled) return

      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return

      const section = document.getElementById(id)
      if (!section) return

      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
      const top = section.getBoundingClientRect().top + window.scrollY - headerBottom - 20
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
    }

    const frame = requestAnimationFrame(scrollToHash)
    const timers = [
      window.setTimeout(scrollToHash, 150),
      window.setTimeout(scrollToHash, 600),
      window.setTimeout(scrollToHash, 1600),
    ]
    const handleHashChange = () => requestAnimationFrame(scrollToHash)

    document.fonts?.ready.then(scrollToHash)
    window.addEventListener('load', scrollToHash)
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      timers.forEach(window.clearTimeout)
      window.removeEventListener('load', scrollToHash)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Gallery />
        <Advantages />
        <Contact />
      </main>
    </>
  )
}

export default App
