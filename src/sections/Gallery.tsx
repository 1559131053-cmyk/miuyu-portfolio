import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CuratedImage {
  id: string
  width: number
  height: number
  title: string
  titleCn: string
  position?: string
}

interface LightboxRect {
  left: number
  top: number
  width: number
  height: number
}

interface SlideTransition {
  from: number
  to: number
  direction: -1 | 1
  entered: boolean
}

const ASSET_BASE = import.meta.env.BASE_URL
const LIGHTBOX_DURATION = 520
const SLIDE_DURATION = 440

const CURATED_IMAGES: CuratedImage[] = [
  { id: '001', width: 790, height: 1600, title: 'Global Arena', titleCn: '世界杯系列', position: 'center 42%' },
  { id: '031', width: 790, height: 2360, title: 'Emerald Guilloché', titleCn: '碧波绿玑镂盘面' },
  { id: '042', width: 790, height: 1480, title: 'Genghis Khan', titleCn: '成吉思汗' },
  { id: '028', width: 790, height: 1340, title: 'Automatic Movement', titleCn: '自动上链机芯' },
  { id: '043', width: 790, height: 1820, title: 'Arcade Dial', titleCn: '水果街机盘面' },
  { id: '056', width: 790, height: 1600, title: 'Play in Motion', titleCn: '街机腕间场景', position: 'center 58%' },
  { id: '065', width: 790, height: 1700, title: 'Enamel Snake', titleCn: '珐琅蛇' },
  { id: '069', width: 790, height: 1520, title: 'Enamel Architecture', titleCn: '珐琅蛇立体结构' },
  { id: '072', width: 790, height: 1640, title: 'Luminous Serpent', titleCn: '夜光蛇影' },
  { id: '075', width: 790, height: 2060, title: 'Hammered Bronze', titleCn: '棕色锤纹盘面' },
  { id: '086', width: 790, height: 2140, title: 'Violet Rhythm', titleCn: '紫色锤纹盘面' },
  { id: '103', width: 790, height: 2060, title: 'Monochrome Texture', titleCn: '黑色锤纹盘面' },
  { id: '082', width: 790, height: 2060, title: 'Sculpted Bracelet', titleCn: '锤纹一体式表链' },
  { id: '092', width: 790, height: 2060, title: 'Blue Resonance', titleCn: '蓝色锤纹盘面' },
]

const imagePath = (image: CuratedImage, thumbnail = false) =>
  `${ASSET_BASE}gallery/${image.id}${thumbnail ? '-640' : ''}.webp`

const rectFromElement = (element: HTMLElement): LightboxRect => {
  const rect = element.getBoundingClientRect()
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
}

const fitImageInViewport = (image: CuratedImage): LightboxRect => {
  const sidePadding = window.innerWidth < 640 ? 24 : 88
  const topPadding = window.innerWidth < 640 ? 88 : 64
  const bottomPadding = window.innerWidth < 640 ? 132 : 112
  const availableWidth = Math.max(1, window.innerWidth - sidePadding * 2)
  const availableHeight = Math.max(1, window.innerHeight - topPadding - bottomPadding)
  const scale = Math.min(availableWidth / image.width, availableHeight / image.height)
  const width = image.width * scale
  const height = image.height * scale

  return {
    left: (window.innerWidth - width) / 2,
    top: topPadding + (availableHeight - height) / 2,
    width,
    height,
  }
}

interface GalleryCardProps {
  image: CuratedImage
  index: number
  className: string
  hidden: boolean
  cardRef: (element: HTMLElement | null) => void
  onOpen: (index: number, element: HTMLElement) => void
}

function GalleryCard({ image, index, className, hidden, cardRef, onOpen }: GalleryCardProps) {
  return (
    <figure
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`全屏查看 ${image.titleCn}`}
      onClick={(event) => onOpen(index, event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(index, event.currentTarget)
        }
      }}
      className={`group relative cursor-zoom-in overflow-hidden rounded-2xl bg-[#0a0a0a] outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a] ${className}`}
    >
      <img
        src={imagePath(image, true)}
        alt={`${image.title} · ${image.titleCn}`}
        width="640"
        height={Math.round((640 / image.width) * image.height)}
        loading="lazy"
        decoding="async"
        onLoad={(event) => event.currentTarget.classList.add('optimized-image--loaded')}
        className="optimized-image h-full w-full object-cover group-hover:scale-[1.035]"
        style={{
          objectPosition: image.position ?? 'center',
          opacity: hidden ? 0 : undefined,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />
      <div className="pointer-events-none absolute left-5 top-5 font-display text-[10px] tracking-[0.2em] text-white/45">
        {String(index + 1).padStart(2, '0')} / {String(CURATED_IMAGES.length).padStart(2, '0')}
      </div>
      <figcaption className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <h3 className="font-display text-xl lg:text-2xl font-semibold leading-tight text-white">
          {image.title}
        </h3>
        <p className="mt-1.5 font-display text-sm font-medium tracking-[0.08em] text-white/60">
          {image.titleCn}
        </p>
      </figcaption>
    </figure>
  )
}

interface LightboxImageProps {
  index: number
  loaded: boolean
  onLoad: (index: number) => void
  style?: React.CSSProperties
  zoomStyle?: React.CSSProperties
}

function LightboxImage({ index, loaded, onLoad, style, zoomStyle }: LightboxImageProps) {
  const image = CURATED_IMAGES[index]

  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      <img
        src={imagePath(image, true)}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
      />
      <img
        src={imagePath(image)}
        alt={`${image.title} · ${image.titleCn}`}
        draggable={false}
        decoding="async"
        onLoad={() => onLoad(index)}
        className="absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-300"
        style={{
          opacity: loaded ? 1 : 0,
          transformOrigin: 'center',
          ...zoomStyle,
        }}
      />
    </div>
  )
}

interface GalleryLightboxProps {
  initialIndex: number
  originRect: LightboxRect
  getOriginRect: (index: number) => LightboxRect | null
  onIndexChange: (index: number) => void
  onClosed: () => void
}

function GalleryLightbox({
  initialIndex,
  originRect,
  getOriginRect,
  onIndexChange,
  onClosed,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [displayRect, setDisplayRect] = useState(originRect)
  const [expanded, setExpanded] = useState(false)
  const [closing, setClosing] = useState(false)
  const [slide, setSlide] = useState<SlideTransition | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set())
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const timersRef = useRef<number[]>([])
  const pointerPositions = useRef(new Map<number, { x: number; y: number }>())
  const gestureRef = useRef<{
    mode: 'swipe' | 'pan' | 'pinch'
    startX: number
    startY: number
    panX: number
    panY: number
    distance: number
    scale: number
  } | null>(null)

  const duration = reducedMotion ? 0 : LIGHTBOX_DURATION
  const shownIndex = slide?.to ?? currentIndex
  const shownImage = CURATED_IMAGES[shownIndex]

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []
  }, [])

  const addTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
    setDrag({ x: 0, y: 0 })
  }, [])

  const close = useCallback(() => {
    if (closing) return

    const destination = getOriginRect(currentIndex) ?? originRect
    setClosing(true)
    setExpanded(false)
    setSlide(null)
    resetZoom()
    setDisplayRect(destination)
    addTimer(onClosed, duration)
  }, [addTimer, closing, currentIndex, duration, getOriginRect, onClosed, originRect, resetZoom])

  const navigate = useCallback((direction: -1 | 1) => {
    if (closing || slide) return

    const nextIndex = (currentIndex + direction + CURATED_IMAGES.length) % CURATED_IMAGES.length
    resetZoom()
    setDisplayRect(fitImageInViewport(CURATED_IMAGES[nextIndex]))
    setSlide({ from: currentIndex, to: nextIndex, direction, entered: false })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlide((activeSlide) => activeSlide ? { ...activeSlide, entered: true } : null)
      })
    })

    addTimer(() => {
      setCurrentIndex(nextIndex)
      onIndexChange(nextIndex)
      setSlide(null)
    }, reducedMotion ? 0 : SLIDE_DURATION)
  }, [addTimer, closing, currentIndex, onIndexChange, reducedMotion, resetZoom, slide])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const body = document.body
    const main = document.querySelector<HTMLElement>('main')
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousBodyOverflow = body.style.overflow
    const previousBodyPadding = body.style.paddingRight
    const previousMainTransform = main?.style.transform ?? ''
    const previousMainFilter = main?.style.filter ?? ''
    const previousMainTransition = main?.style.transition ?? ''
    const previousMainOrigin = main?.style.transformOrigin ?? ''

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    if (main) {
      main.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`
      main.style.transition = reducedMotion ? 'none' : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1), filter 520ms ease'
      requestAnimationFrame(() => {
        main.style.transform = 'scale(0.985)'
        main.style.filter = 'blur(2px)'
      })
    }

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.paddingRight = previousBodyPadding
      if (main) {
        main.style.transform = previousMainTransform
        main.style.filter = previousMainFilter
        main.style.transition = previousMainTransition
        main.style.transformOrigin = previousMainOrigin
      }
    }
  }, [reducedMotion])

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisplayRect(fitImageInViewport(CURATED_IMAGES[currentIndex]))
        setExpanded(true)
        closeButtonRef.current?.focus({ preventScroll: true })
      })
    })
  }, [currentIndex])

  useEffect(() => {
    const handleResize = () => {
      if (!closing) setDisplayRect(fitImageInViewport(CURATED_IMAGES[currentIndex]))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [closing, currentIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') navigate(-1)
      if (event.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [close, navigate])

  useEffect(() => () => clearTimers(), [clearTimers])

  const markLoaded = (index: number) => {
    setLoadedImages((loaded) => {
      if (loaded.has(index)) return loaded
      const next = new Set(loaded)
      next.add(index)
      return next
    })
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (slide || closing) return

    setScale((currentScale) => {
      const nextScale = Math.min(4, Math.max(1, currentScale + (event.deltaY < 0 ? 0.25 : -0.25)))
      if (nextScale === 1) setPan({ x: 0, y: 0 })
      return nextScale
    })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (slide || closing) return
    setInteracting(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerPositions.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointerPositions.current.size === 2) {
      const [first, second] = [...pointerPositions.current.values()]
      gestureRef.current = {
        mode: 'pinch',
        startX: 0,
        startY: 0,
        panX: pan.x,
        panY: pan.y,
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale,
      }
      return
    }

    gestureRef.current = {
      mode: scale > 1 ? 'pan' : 'swipe',
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      distance: 0,
      scale,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerPositions.current.has(event.pointerId) || !gestureRef.current) return
    pointerPositions.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointerPositions.current.size >= 2 && gestureRef.current.mode === 'pinch') {
      const [first, second] = [...pointerPositions.current.values()]
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      const nextScale = Math.min(4, Math.max(1, gestureRef.current.scale * (distance / gestureRef.current.distance)))
      setScale(nextScale)
      if (nextScale === 1) setPan({ x: 0, y: 0 })
      return
    }

    const dx = event.clientX - gestureRef.current.startX
    const dy = event.clientY - gestureRef.current.startY
    if (gestureRef.current.mode === 'pan') {
      setPan({ x: gestureRef.current.panX + dx, y: gestureRef.current.panY + dy })
    } else if (gestureRef.current.mode === 'swipe') {
      setDrag({ x: dx, y: dy })
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    pointerPositions.current.delete(event.pointerId)

    if (gesture?.mode === 'swipe' && pointerPositions.current.size === 0) {
      const { x, y } = drag
      setDrag({ x: 0, y: 0 })

      if (y > 90 && Math.abs(y) > Math.abs(x) * 1.2) {
        close()
      } else if (Math.abs(x) > 58 && Math.abs(x) > Math.abs(y) * 1.15) {
        navigate(x < 0 ? 1 : -1)
      }
    }

    if (pointerPositions.current.size === 0) {
      gestureRef.current = null
      setInteracting(false)
    }
  }

  const zoomStyle: React.CSSProperties = {
    transform: `translate3d(${pan.x + drag.x}px, ${pan.y + drag.y}px, 0) scale(${scale})`,
    transition: interacting || reducedMotion
      ? 'none'
      : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const slideTransition = reducedMotion
    ? 'none'
    : `transform ${SLIDE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${SLIDE_DURATION}ms ease`

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${shownImage.title} · ${shownImage.titleCn}`}
      className="fixed inset-0 z-[300] overflow-hidden bg-black/80"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
      style={{
        opacity: expanded && !closing ? 1 : 0,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transition: reducedMotion ? 'none' : `opacity ${duration}ms ease`,
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="关闭图片查看"
        onClick={close}
        className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/55 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:bg-white/[0.13] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-8 md:top-8"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="上一张图片"
        onClick={() => navigate(-1)}
        className="absolute left-7 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/55 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="下一张图片"
        onClick={() => navigate(1)}
        className="absolute right-7 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/55 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className="fixed overflow-hidden bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          left: displayRect.left,
          top: displayRect.top,
          width: displayRect.width,
          height: displayRect.height,
          borderRadius: expanded && !closing ? 4 : 16,
          touchAction: 'none',
          transition: reducedMotion
            ? 'none'
            : `left ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), top ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), width ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), height ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), border-radius ${duration}ms ease`,
        }}
      >
        {slide ? (
          <>
            <LightboxImage
              index={slide.from}
              loaded={loadedImages.has(slide.from)}
              onLoad={markLoaded}
              style={{
                opacity: slide.entered ? 0 : 1,
                transform: `translate3d(${slide.entered ? -slide.direction * 14 : 0}%, 0, 0)`,
                transition: slideTransition,
              }}
            />
            <LightboxImage
              index={slide.to}
              loaded={loadedImages.has(slide.to)}
              onLoad={markLoaded}
              style={{
                opacity: slide.entered ? 1 : 0,
                transform: `translate3d(${slide.entered ? 0 : slide.direction * 14}%, 0, 0)`,
                transition: slideTransition,
              }}
            />
          </>
        ) : (
          <LightboxImage
            index={currentIndex}
            loaded={loadedImages.has(currentIndex)}
            onLoad={markLoaded}
            zoomStyle={zoomStyle}
          />
        )}
      </div>

      <div
        className="pointer-events-none absolute bottom-7 left-1/2 z-20 w-[calc(100%-3rem)] max-w-xl -translate-x-1/2 text-center md:bottom-8"
        style={{
          opacity: expanded && !closing ? 1 : 0,
          transform: `translate3d(-50%, ${expanded && !closing ? 0 : 12}px, 0)`,
          transition: reducedMotion ? 'none' : 'opacity 380ms ease 160ms, transform 480ms cubic-bezier(0.16, 1, 0.3, 1) 120ms',
        }}
      >
        <p className="font-display text-base font-semibold text-white md:text-lg">{shownImage.title}</p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-display text-xs tracking-[0.08em] text-white/45">{shownImage.titleCn}</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-display text-[10px] tracking-[0.2em] text-white/35">
            {String(shownIndex + 1).padStart(2, '0')} / {String(CURATED_IMAGES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function Gallery() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.01,
    rootMargin: '0px 0px -60px 0px',
  })
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [lightbox, setLightbox] = useState<{ index: number; originRect: LightboxRect } | null>(null)
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  const openLightbox = (index: number, element: HTMLElement) => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : element
    setHiddenIndex(index)
    setLightbox({ index, originRect: rectFromElement(element) })
  }

  const closeLightbox = () => {
    setLightbox(null)
    setHiddenIndex(null)
    requestAnimationFrame(() => previousFocus.current?.focus({ preventScroll: true }))
  }

  const card = (image: CuratedImage, index: number, className: string) => (
    <GalleryCard
      image={image}
      index={index}
      className={className}
      hidden={hiddenIndex === index}
      cardRef={(element) => { cardRefs.current[index] = element }}
      onOpen={openLightbox}
    />
  )

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-portfolio px-8 lg:px-12">
        {/* Section Header */}
        <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">Gallery · 作品图集</span>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground">
              Curated Renders
            </h2>
            <p className="mt-2 font-display text-lg text-muted-foreground/60">
              精选静态渲染
            </p>
          </div>
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
            <p className="text-muted-foreground max-w-sm leading-relaxed font-light">
              A focused edit of form, material, and light — arranged as a visual rhythm rather than an archive.
            </p>
            <p className="text-muted-foreground/50 max-w-sm leading-relaxed font-light text-sm mt-2">
              聚焦形态、材质与光影，以视觉节奏取代素材堆叠，让每一幅作品都拥有呼吸空间。
            </p>
          </div>
        </div>

        <div className={`mt-14 space-y-6 lg:space-y-8 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="3">
          {/* Opening composition: one dominant image, two counterpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {card(CURATED_IMAGES[0], 0, 'lg:col-span-8 h-[520px] lg:h-[720px]')}
            <div className="lg:col-span-4 lg:h-[720px] grid grid-rows-2 gap-6 lg:gap-8">
              {card(CURATED_IMAGES[1], 1, 'h-[340px] lg:h-auto min-h-0')}
              {card(CURATED_IMAGES[2], 2, 'h-[340px] lg:h-auto min-h-0')}
            </div>
          </div>

          {/* Cinematic pause */}
          {card(CURATED_IMAGES[3], 3, 'h-[380px] lg:h-[500px]')}

          {/* Product and context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {card(CURATED_IMAGES[4], 4, 'lg:col-span-5 h-[480px] lg:h-[560px]')}
            {card(CURATED_IMAGES[5], 5, 'lg:col-span-7 h-[480px] lg:h-[560px]')}
          </div>

          {/* Enamel story: hero plus two details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {card(CURATED_IMAGES[6], 6, 'lg:col-span-7 h-[560px] lg:h-[720px]')}
            <div className="lg:col-span-5 lg:h-[720px] grid grid-rows-2 gap-6 lg:gap-8">
              {card(CURATED_IMAGES[7], 7, 'h-[340px] lg:h-auto min-h-0')}
              {card(CURATED_IMAGES[8], 8, 'h-[340px] lg:h-auto min-h-0')}
            </div>
          </div>

          {/* Material rhythm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {card(CURATED_IMAGES[9], 9, 'h-[460px] lg:h-[540px]')}
            {card(CURATED_IMAGES[10], 10, 'h-[460px] lg:h-[540px]')}
            {card(CURATED_IMAGES[11], 11, 'h-[460px] lg:h-[540px]')}
          </div>

          {/* Closing pair */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {card(CURATED_IMAGES[12], 12, 'lg:col-span-7 h-[500px] lg:h-[620px]')}
            {card(CURATED_IMAGES[13], 13, 'lg:col-span-5 h-[500px] lg:h-[620px]')}
          </div>
        </div>
      </div>

      {lightbox && (
        <GalleryLightbox
          initialIndex={lightbox.index}
          originRect={lightbox.originRect}
          getOriginRect={(index) => {
            const element = cardRefs.current[index]
            return element ? rectFromElement(element) : null
          }}
          onIndexChange={setHiddenIndex}
          onClosed={closeLightbox}
        />
      )}
    </section>
  )
}
