import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Navbar } from '@/sections/Navbar'
import { Hero } from '@/sections/Hero'
import './App.css'

const loadAbout = () => import('@/sections/About')
const loadProjects = () => import('@/sections/Projects')
const loadGallery = () => import('@/sections/Gallery')
const loadAdvantages = () => import('@/sections/Advantages')
const loadContact = () => import('@/sections/Contact')

const About = lazy(() => loadAbout().then(module => ({ default: module.About })))
const Projects = lazy(() => loadProjects().then(module => ({ default: module.Projects })))
const Gallery = lazy(() => loadGallery().then(module => ({ default: module.Gallery })))
const Advantages = lazy(() => loadAdvantages().then(module => ({ default: module.Advantages })))
const Contact = lazy(() => loadContact().then(module => ({ default: module.Contact })))

const deferredSections = [
  { id: 'about', Component: About, load: loadAbout, placeholderClassName: 'min-h-[850px] lg:min-h-[650px]' },
  { id: 'work', Component: Projects, load: loadProjects, placeholderClassName: 'min-h-[900px] lg:min-h-[800px]' },
  { id: 'gallery', Component: Gallery, load: loadGallery, placeholderClassName: 'min-h-[4200px] lg:min-h-[3000px]' },
  { id: 'expertise', Component: Advantages, load: loadAdvantages, placeholderClassName: 'min-h-[1300px] lg:min-h-[700px]' },
  { id: 'contact', Component: Contact, load: loadContact, placeholderClassName: 'min-h-[900px]' },
] as const

const getInitialSections = () => {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  return new Set(deferredSections.some(section => section.id === hash) ? [hash] : [])
}

function App() {
  const [loadedSections, setLoadedSections] = useState<Set<string>>(getInitialSections)
  const sectionNodes = useRef(new Map<string, HTMLDivElement>())

  useEffect(() => {
    let fallbackFrame: number | undefined
    let observer: IntersectionObserver | undefined
    const loadSections = (ids: string[]) => {
      if (ids.length === 0) return
      setLoadedSections(previous => {
        const next = new Set(previous)
        ids.forEach(id => next.add(id))
        return next
      })
    }

    const checkNearbySections = () => {
      fallbackFrame = undefined
      const nearbyIds = [...sectionNodes.current.entries()]
        .filter(([, node]) => {
          const rect = node.getBoundingClientRect()
          return rect.top <= window.innerHeight + 600 && rect.bottom >= -600
        })
        .map(([id]) => id)
      loadSections(nearbyIds)
    }

    const scheduleFallbackCheck = () => {
      if (fallbackFrame !== undefined) return
      fallbackFrame = requestAnimationFrame(checkNearbySections)
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        const visibleIds = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => (entry.target as HTMLElement).dataset.sectionId)
          .filter((id): id is string => Boolean(id))

        loadSections(visibleIds)
        entries.forEach(entry => {
          if (entry.isIntersecting) observer?.unobserve(entry.target)
        })
      }, { rootMargin: '600px 0px' })

      sectionNodes.current.forEach(node => observer?.observe(node))
    }

    window.addEventListener('scroll', scheduleFallbackCheck, { passive: true })
    window.addEventListener('resize', scheduleFallbackCheck)
    scheduleFallbackCheck()
    const compatibilityFallback = setTimeout(() => {
      loadSections(['about'])
      scheduleFallbackCheck()
    }, 1500)

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', scheduleFallbackCheck)
      window.removeEventListener('resize', scheduleFallbackCheck)
      clearTimeout(compatibilityFallback)
      if (fallbackFrame !== undefined) cancelAnimationFrame(fallbackFrame)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

    const prepareSection = async (id: string) => {
      const targetIndex = deferredSections.findIndex(section => section.id === id)
      if (targetIndex < 0) return

      const sectionsToLoad = deferredSections.slice(0, targetIndex + 1)
      await Promise.all(sectionsToLoad.map(section => section.load()))
      if (cancelled) return

      flushSync(() => {
        setLoadedSections(previous => {
          const next = new Set(previous)
          sectionsToLoad.forEach(section => next.add(section.id))
          return next
        })
      })

      for (let frame = 0; frame < 30; frame += 1) {
        await nextFrame()
        const layoutReady = sectionsToLoad.every(section => {
          const node = document.getElementById(section.id)
          return node?.firstElementChild?.getAttribute('aria-hidden') !== 'true'
        })
        if (layoutReady) break
      }

      await nextFrame()
    }

    const scrollToSection = async (id: string, behavior: ScrollBehavior) => {
      await prepareSection(id)
      if (cancelled) return

      const section = document.getElementById(id)
      if (!section) return

      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
      const top = section.getBoundingClientRect().top + window.scrollY - headerBottom - 20
      window.scrollTo({ top: Math.max(0, top), behavior })
    }

    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id) void scrollToSection(id, 'auto')
    }

    const handleNavigation = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id
      if (id) void scrollToSection(id, 'smooth')
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
    window.addEventListener('portfolio:navigate', handleNavigation)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      timers.forEach(window.clearTimeout)
      window.removeEventListener('load', scrollToHash)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('portfolio:navigate', handleNavigation)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {deferredSections.map(({ id, Component, placeholderClassName }) => {
          const placeholder = <div aria-hidden="true" className={placeholderClassName} />

          return (
            <div
              key={id}
              id={id}
              data-page-section
              data-section-id={id}
              ref={node => {
                if (node) sectionNodes.current.set(id, node)
                else sectionNodes.current.delete(id)
              }}
            >
              {loadedSections.has(id) ? (
                <Suspense fallback={placeholder}>
                  <Component />
                </Suspense>
              ) : placeholder}
            </div>
          )
        })}
      </main>
    </>
  )
}

export default App
