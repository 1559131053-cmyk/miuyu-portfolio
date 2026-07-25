import { useEffect, useRef, useState } from 'react'

interface RevealObserverGroup {
  observer: IntersectionObserver
  callbacks: Map<Element, () => void>
}

const revealObservers = new Map<string, RevealObserverGroup>()

const getRevealObserver = (threshold: number, rootMargin: string) => {
  const key = `${threshold}:${rootMargin}`
  const existing = revealObservers.get(key)
  if (existing) return existing

  const callbacks = new Map<Element, () => void>()
  const group: RevealObserverGroup = {
    callbacks,
    observer: new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const reveal = callbacks.get(entry.target)
        if (reveal) requestAnimationFrame(reveal)
        group.observer.unobserve(entry.target)
        callbacks.delete(entry.target)
      })
    }, { threshold, rootMargin }),
  }

  revealObservers.set(key, group)
  return group
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let active = true
    const observerGroup = getRevealObserver(
      options?.threshold ?? 0.12,
      options?.rootMargin ?? '0px 0px -60px 0px',
    )

    observerGroup.callbacks.set(el, () => {
      if (active) setIsVisible(true)
    })
    observerGroup.observer.observe(el)

    return () => {
      active = false
      observerGroup.callbacks.delete(el)
      observerGroup.observer.unobserve(el)
    }
  }, [options?.threshold, options?.rootMargin])

  return { ref, isVisible }
}
