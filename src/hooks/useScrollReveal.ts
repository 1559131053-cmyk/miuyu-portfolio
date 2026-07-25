import { useEffect, useRef, useState } from 'react'

interface RevealObserverGroup {
  observer: IntersectionObserver
  callbacks: Map<Element, () => void>
}

const revealObservers = new Map<string, RevealObserverGroup>()
const revealFallbacks = new Map<Element, () => void>()
let fallbackFrame: number | undefined
let fallbackListening = false

const stopFallbackListeners = () => {
  if (!fallbackListening || revealFallbacks.size > 0) return
  fallbackListening = false
  window.removeEventListener('scroll', scheduleFallbackCheck)
  window.removeEventListener('resize', scheduleFallbackCheck)
}

const checkFallbackVisibility = () => {
  fallbackFrame = undefined
  revealFallbacks.forEach((reveal, element) => {
    const rect = element.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return
    revealFallbacks.delete(element)
    requestAnimationFrame(reveal)
  })
  stopFallbackListeners()
}

function scheduleFallbackCheck() {
  if (fallbackFrame !== undefined) return
  fallbackFrame = requestAnimationFrame(checkFallbackVisibility)
}

const addFallback = (element: Element, reveal: () => void) => {
  revealFallbacks.set(element, reveal)
  if (!fallbackListening) {
    fallbackListening = true
    window.addEventListener('scroll', scheduleFallbackCheck, { passive: true })
    window.addEventListener('resize', scheduleFallbackCheck)
  }
  scheduleFallbackCheck()
}

const removeFallback = (element: Element) => {
  revealFallbacks.delete(element)
  stopFallbackListeners()
}

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
    const reveal = () => {
      if (active) setIsVisible(true)
      removeFallback(el)
    }
    const observerGroup = 'IntersectionObserver' in window
      ? getRevealObserver(
          options?.threshold ?? 0.12,
          options?.rootMargin ?? '0px 0px -60px 0px',
        )
      : undefined

    if (observerGroup) {
      observerGroup.callbacks.set(el, reveal)
      observerGroup.observer.observe(el)
    }
    addFallback(el, reveal)

    return () => {
      active = false
      observerGroup?.callbacks.delete(el)
      observerGroup?.observer.unobserve(el)
      removeFallback(el)
    }
  }, [options?.threshold, options?.rootMargin])

  return { ref, isVisible }
}
