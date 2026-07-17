import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'

interface Project {
  title: string
  titleCn: string
  year: string
  gradient: string
  pattern: string
  videoMp4: string
  videoWebm?: string
  poster: string
}

const ASSET_BASE = import.meta.env.BASE_URL

const PROJECTS: Project[] = [
  ['Guilloché Dial Striking Watch', '玑镂盘面自鸣手表', '2025', 'hero-video.mp4', 'gallery/031.webp', 'hero-video.webm'],
  ['Enamel Snake', '珐琅蛇', '2025', 'watch-enamel-snake.mp4', 'gallery/065.webp'],
  ['Carbon Fiber Case', '碳纤维外壳', '2025', 'watch-final-rev1.mp4', 'gallery/103.webp'],
  ['Transparent Crystal', '透明水晶', '2025', 'watch-final-rev2.mp4', 'gallery/028.webp'],
  ['Carbon Fiber Dial', '碳纤维盘面', '2025', 'watch-4002.mp4', 'gallery/082.webp'],
  ['Skeletonized Dial', '镂空盘面', '2025', 'watch-4003.mp4', 'gallery/043.webp'],
  ['Hammered Dial', '锤纹盘面', '2025', 'watch-bg8008.mp4', 'gallery/075.webp'],
  ['Skeletonized Steel Case', '镂空钢壳', '2025', 'watch-cinematic-score.mp4', 'gallery/086.webp'],
  ['Luminous Carbon Fiber', '夜光碳纤维', '2025', 'watch-bg7006.mp4', 'gallery/072.webp'],
  ['Second-Generation Crystal', '二代水晶', '2026', 'watch-bgm.mp4', 'gallery/069.webp'],
  ['Genghis Khan', '成吉思汗', '2026', 'watch-genghis-khan.mp4', 'gallery/042.webp'],
  ['World Cup', '世界杯', '2026', 'watch-world-cup.mp4', 'gallery/001.webp'],
].map(([title, titleCn, year, videoMp4, poster, videoWebm], index) => ({
  title,
  titleCn,
  year,
  videoMp4: `${ASSET_BASE}${videoMp4}`,
  videoWebm: videoWebm ? `${ASSET_BASE}${videoWebm}` : undefined,
  poster: `${ASSET_BASE}${poster}`,
  gradient: `linear-gradient(135deg, #090909 0%, #151515 55%, ${index % 2 ? '#201817' : '#172027'} 100%)`,
  pattern: 'radial-gradient(circle at 50% 42%, rgba(220,38,38,0.09), transparent 62%)',
}))

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 5L8 12L15 19' : 'M9 5L16 12L9 19'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectPreview({ project, active }: { project: Project; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const shouldLoad = active && isNearViewport

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '120px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.load()
    if (shouldLoad) requestAnimationFrame(() => video.play().catch(() => undefined))
  }, [shouldLoad])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      poster={project.poster}
      muted
      loop
      playsInline
      preload="none"
    >
      {project.videoWebm && <source src={shouldLoad ? project.videoWebm : undefined} type="video/webm" />}
      <source src={shouldLoad ? project.videoMp4 : undefined} type="video/mp4" />
    </video>
  )
}

export function Projects() {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>()
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const didSwipe = useRef(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(() => (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1))
  const [currentPage, setCurrentPage] = useState(0)
  const pageCount = Math.ceil(PROJECTS.length / itemsPerPage)

  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, page) => PROJECTS.slice(page * itemsPerPage, (page + 1) * itemsPerPage)),
    [itemsPerPage, pageCount],
  )

  const goToPage = (page: number) => setCurrentPage(Math.max(0, Math.min(pageCount - 1, page)))
  const goPrevious = () => setCurrentPage((page) => Math.max(0, page - 1))
  const goNext = () => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const updateLayout = () => {
      setItemsPerPage(media.matches ? 3 : 1)
      setCurrentPage(0)
    }
    updateLayout()
    media.addEventListener('change', updateLayout)
    return () => media.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrevious()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    pointerStart.current = { x: event.clientX, y: event.clientY }
    didSwipe.current = false
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current || event.pointerType === 'mouse') return
    const dx = event.clientX - pointerStart.current.x
    const dy = event.clientY - pointerStart.current.y
    pointerStart.current = null
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      didSwipe.current = true
      if (dx > 0) goPrevious()
      else goNext()
    }
  }

  const openProject = (project: Project) => {
    if (didSwipe.current) {
      didSwipe.current = false
      return
    }
    setSelectedProject(project)
  }

  const navigationButtonClass = 'projects-carousel__arrow inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#dc2626]/70 hover:bg-[#dc2626]/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-25'

  return (
    <section id="work" ref={revealRef} className="relative pt-24 lg:pt-32 pb-0">
      <div className="mx-auto max-w-portfolio px-8 lg:px-12 mb-10 lg:mb-14">
        <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">Selected Work · 精选作品</span>
        </div>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
            <h2 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl">3D Watch Projects</h2>
            <p className="mt-2 font-display text-lg text-muted-foreground/60">三维手表项目</p>
          </div>
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
            <p className="max-w-sm font-light leading-relaxed text-muted-foreground">A curated selection of 3D watch detail visualizations and product videos, crafted with precision and cinematic realism.</p>
            <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-muted-foreground/50">精选手表三维详情可视化与产品视频作品，以精准工艺与电影级质感呈现。</p>
          </div>
        </div>
      </div>

      <div className="projects-carousel mx-auto max-w-portfolio px-8 lg:px-12">
        <div className="relative lg:px-16">
          <button className={`${navigationButtonClass} absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 lg:inline-flex`} onClick={goPrevious} disabled={currentPage === 0} aria-label="上一个视频作品">
            <ArrowIcon direction="left" />
          </button>

          <div
            ref={viewportRef}
            className="projects-carousel__viewport overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/80"
            tabIndex={0}
            role="region"
            aria-roledescription="轮播"
            aria-label="视频作品轮播"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStart.current = null }}
          >
            <div className="projects-carousel__track flex" style={{ transform: `translate3d(-${currentPage * 100}%, 0, 0)` }}>
              {pages.map((projects, pageIndex) => (
                <div key={pageIndex} className="grid min-w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6" aria-hidden={pageIndex !== currentPage}>
                  {projects.map((project) => (
                    <div
                      key={project.title}
                      className="projects-carousel__card group h-[460px] cursor-pointer overflow-hidden rounded-2xl lg:h-[500px]"
                      onClick={() => openProject(project)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          openProject(project)
                        }
                      }}
                      role="button"
                      tabIndex={pageIndex === currentPage ? 0 : -1}
                      aria-label={`播放 ${project.titleCn}`}
                    >
                      <BorderGlow glowColor="0 84% 60%" backgroundColor="#0a0a0a" borderRadius={16} glowRadius={30} glowIntensity={1.2} coneSpread={25} colors={['#dc2626', '#ef4444', '#7f1d1d']} className="h-full">
                        <div className="relative h-full w-full overflow-hidden" style={{ background: project.gradient }}>
                          <ProjectPreview project={project} active={pageIndex === currentPage} />
                          <div className="absolute inset-0" style={{ background: project.pattern }} />
                          <div className="project-card__overlay" />
                          <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8">
                            <h3 className="max-w-[90%] font-display text-2xl font-semibold leading-tight text-white">{project.title}</h3>
                            <p className="mt-2 font-display text-sm font-medium tracking-[0.08em] text-white/65">{project.titleCn}</p>
                          </div>
                        </div>
                      </BorderGlow>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className={`${navigationButtonClass} absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:inline-flex`} onClick={goNext} disabled={currentPage === pageCount - 1} aria-label="下一个视频作品">
            <ArrowIcon direction="right" />
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-5 lg:hidden">
          <button className={navigationButtonClass} onClick={goPrevious} disabled={currentPage === 0} aria-label="上一个视频作品"><ArrowIcon direction="left" /></button>
          <span className="min-w-14 text-center font-display text-xs tracking-[0.18em] text-white/45" aria-live="polite">{String(currentPage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
          <button className={navigationButtonClass} onClick={goNext} disabled={currentPage === pageCount - 1} aria-label="下一个视频作品"><ArrowIcon direction="right" /></button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5" aria-label="视频作品分页">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              className={`projects-carousel__dot h-3 min-w-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a] ${page === currentPage ? 'projects-carousel__dot--active' : ''}`}
              onClick={() => goToPage(page)}
              aria-label={`跳转到第 ${page + 1} 页视频作品`}
              aria-current={page === currentPage ? 'true' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-portfolio px-8 pt-8 lg:px-12">
        <div className={`flex justify-center reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="3">
          <BorderGlow flat glowColor="0 84% 60%" backgroundColor="transparent" borderRadius={12} glowRadius={14} glowIntensity={0.9} edgeSensitivity={20} colors={['#dc2626', '#ef4444', '#7f1d1d']}>
            <button className="group inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-500 hover:text-[#dc2626]">
              <span className="border-b border-white/10 pb-1 transition-colors duration-500 group-hover:border-[#dc2626]/50">View All Projects · 查看全部项目</span>
              <ArrowIcon direction="right" />
            </button>
          </BorderGlow>
        </div>
      </div>

      {selectedProject && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedProject(null)}>
          <button className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/70 backdrop-blur-xl transition-all duration-300 hover:border-[#dc2626]/50 hover:bg-[#dc2626]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]" onClick={() => setSelectedProject(null)} aria-label="关闭视频">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
          <div className="relative w-[92vw] max-w-[1400px]" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-end justify-between">
              <div><h3 className="font-display text-2xl font-semibold text-foreground lg:text-3xl">{selectedProject.title}</h3><p className="mt-1 font-display text-sm text-white/55">{selectedProject.titleCn}</p></div>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-display text-xs text-white/50">{selectedProject.year}</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_80px_rgba(220,38,38,0.15)]">
              <video className="max-h-[80vh] h-auto w-full object-contain" poster={selectedProject.poster} autoPlay controls loop playsInline preload="metadata">
                {selectedProject.videoWebm && <source src={selectedProject.videoWebm} type="video/webm" />}
                <source src={selectedProject.videoMp4} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}
