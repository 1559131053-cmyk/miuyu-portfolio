import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import BorderGlow from '@/components/BorderGlow'

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'contact', label: 'Contacts' },
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      // Use a narrow viewport band so very tall editorial sections can still
      // become active; percentage thresholds fail when a section exceeds the viewport.
      { threshold: 0, rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      {/* === Floating Glass Pill Navbar — 始终置顶 === */}
      <header className="fixed top-4 lg:top-5 left-0 right-0 z-50 px-6 lg:px-10">
        <nav className="mx-auto max-w-portfolio flex items-center justify-between h-14 lg:h-16 px-5 lg:px-7 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <BorderGlow
            flat
            glowColor="0 84% 60%"
            backgroundColor="transparent"
            borderRadius={10}
            glowRadius={12}
            glowIntensity={0.8}
            edgeSensitivity={20}
            colors={['#dc2626', '#ef4444', '#7f1d1d']}
            className="flex-shrink-0"
          >
            <button
              onClick={() => scrollToSection('hero')}
              className="font-display font-bold text-base lg:text-lg tracking-[0.15em] uppercase text-white hover:text-red-500 transition-colors duration-500 ease-smooth px-2 py-1"
            >
              MIU<span className="text-white/50">.</span>YU
            </button>
          </BorderGlow>

          {/* Nav Links — 聚焦动效 */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 nav-group">
            {NAV_LINKS.map((link) => (
              <BorderGlow
                key={link.id}
                flat
                glowColor="0 84% 60%"
                backgroundColor="transparent"
                borderRadius={8}
                glowRadius={10}
                glowIntensity={0.7}
                edgeSensitivity={20}
                colors={['#dc2626', '#ef4444', '#7f1d1d']}
              >
                <button
                  onClick={() => scrollToSection(link.id)}
                  className={`nav-pill px-4 lg:px-5 py-2 rounded-lg text-[11px] font-display font-medium tracking-[0.12em] uppercase transition-colors duration-500 ease-smooth ${
                    activeSection === link.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-red-500 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              </BorderGlow>
            ))}
          </div>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <BorderGlow
              flat
              glowColor="0 84% 60%"
              backgroundColor="transparent"
              borderRadius={12}
              glowRadius={14}
              glowIntensity={0.9}
              edgeSensitivity={20}
              colors={['#dc2626', '#ef4444', '#7f1d1d']}
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white border border-white/20 bg-white/[0.06] backdrop-blur-2xl text-[11px] font-display font-semibold tracking-[0.1em] uppercase hover:bg-white/[0.12] hover:border-white/30 hover:scale-[1.05] transition-all duration-500 ease-smooth"
              >
                Let's Talk
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </BorderGlow>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#050508]/95 backdrop-blur-xl transition-all duration-600 ease-smooth md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-2xl font-display font-medium tracking-[0.2em] uppercase text-white/70 hover:text-red-500 hover:scale-110 transition-all duration-500 ease-smooth"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
