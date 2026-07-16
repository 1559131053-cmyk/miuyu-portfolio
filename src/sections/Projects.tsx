import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'

interface Project {
  title: string
  title_cn: string
  category: string
  category_cn: string
  year: string
  gradient: string
  pattern: string
  video?: string
}

const ASSET_BASE = import.meta.env.BASE_URL

const PROJECTS: Project[] = [
  {
    title: 'Guilloché Dial Striking Watch',
    title_cn: '玑镂盘面自鸣手表',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0c0a08 0%, #181410 40%, #28201a 100%)',
    pattern: 'radial-gradient(circle at 50% 45%, rgba(220,180,100,0.16), transparent 60%)',
    video: `${ASSET_BASE}hero-video.mp4`,
  },
  {
    title: 'Enamel Snake',
    title_cn: '珐琅蛇',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2025',
    gradient: 'linear-gradient(135deg, #100e0a 0%, #1e1a12 40%, #2e2820 100%)',
    pattern: 'radial-gradient(circle at 60% 50%, rgba(220,180,100,0.14), transparent 60%)',
    video: `${ASSET_BASE}watch-enamel-snake.mp4`,
  },
  {
    title: 'Carbon Fiber Case',
    title_cn: '碳纤维外壳',
    category: 'Watch Detail Visualization',
    category_cn: '手表详情可视化',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0d0e10 0%, #181a20 40%, #262a34 100%)',
    pattern: 'radial-gradient(circle at 45% 45%, rgba(180,170,200,0.13), transparent 60%)',
    video: `${ASSET_BASE}watch-final-rev1.mp4`,
  },
  {
    title: 'Transparent Crystal',
    title_cn: '透明水晶',
    category: 'Watch Detail Visualization',
    category_cn: '手表详情可视化',
    year: '2025',
    gradient: 'linear-gradient(135deg, #100d0c 0%, #1e1816 40%, #2e2622 100%)',
    pattern: 'radial-gradient(circle at 55% 40%, rgba(200,160,120,0.12), transparent 60%)',
    video: `${ASSET_BASE}watch-final-rev2.mp4`,
  },
  {
    title: 'Carbon Fiber Dial',
    title_cn: '碳纤维盘面',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0a0d10 0%, #141c24 40%, #1e2c38 100%)',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(120,160,200,0.14), transparent 60%)',
    video: `${ASSET_BASE}watch-4002.mp4`,
  },
  {
    title: 'Skeletonized Dial',
    title_cn: '镂空盘面',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0c0a10 0%, #1a1622 40%, #2a2236 100%)',
    pattern: 'radial-gradient(circle at 40% 55%, rgba(140,120,180,0.13), transparent 60%)',
    video: `${ASSET_BASE}watch-4003.mp4`,
  },
  {
    title: 'Hammered Dial',
    title_cn: '锤纹盘面',
    category: 'Watch Detail Visualization',
    category_cn: '手表详情可视化',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0a0f12 0%, #12222a 40%, #1a3038 100%)',
    pattern: 'radial-gradient(circle at 50% 40%, rgba(100,180,200,0.15), transparent 60%)',
    video: `${ASSET_BASE}watch-bg8008.mp4`,
  },
  {
    title: 'Skeletonized Steel Case',
    title_cn: '镂空钢壳',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2025',
    gradient: 'linear-gradient(135deg, #100c0e 0%, #1e1618 40%, #2e2226 100%)',
    pattern: 'radial-gradient(circle at 65% 45%, rgba(200,140,120,0.13), transparent 60%)',
    video: `${ASSET_BASE}watch-cinematic-score.mp4`,
  },
  {
    title: 'Luminous Carbon Fiber',
    title_cn: '夜光碳纤维',
    category: 'Watch Detail Visualization',
    category_cn: '手表详情可视化',
    year: '2025',
    gradient: 'linear-gradient(135deg, #0e0c10 0%, #1a1620 40%, #282234 100%)',
    pattern: 'radial-gradient(circle at 35% 50%, rgba(160,130,180,0.12), transparent 60%)',
    video: `${ASSET_BASE}watch-bg7006.mp4`,
  },
  {
    title: 'Second-Generation Crystal',
    title_cn: '二代水晶',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2026',
    gradient: 'linear-gradient(135deg, #0e0c12 0%, #1c1828 40%, #2a2440 100%)',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(140,120,200,0.14), transparent 60%)',
    video: `${ASSET_BASE}watch-bgm.mp4`,
  },
  {
    title: 'Genghis Khan',
    title_cn: '成吉思汗',
    category: 'Watch Product Video',
    category_cn: '手表产品视频',
    year: '2026',
    gradient: 'linear-gradient(135deg, #100a0e 0%, #1e141c 40%, #2e1e28 100%)',
    pattern: 'radial-gradient(circle at 45% 55%, rgba(220,140,160,0.12), transparent 60%)',
    video: `${ASSET_BASE}watch-genghis-khan.mp4`,
  },
  {
    title: 'World Cup',
    title_cn: '世界杯',
    category: 'Watch Detail Visualization',
    category_cn: '手表详情可视化',
    year: '2026',
    gradient: 'linear-gradient(135deg, #120e10 0%, #22181e 40%, #322028 100%)',
    pattern: 'radial-gradient(circle at 30% 60%, rgba(200,120,140,0.12), transparent 60%)',
    video: `${ASSET_BASE}watch-world-cup.mp4`,
  },
]

function ProjectPreview({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          requestAnimationFrame(() => video.play().catch(() => undefined))
        } else {
          video.pause()
        }
      },
      { threshold: 0.05, rootMargin: '160px' }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
    />
  )
}

export function Projects() {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>()
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Horizontal scroll position driven by downward wheel input
  const currentXRef = useRef(0)
  const targetXRef = useRef(0)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  // Downward wheel input explores the horizontal track before the page continues.
  // Upward wheel input is never intercepted, so the visitor can leave immediately.
  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    let rafId: number | null = null
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const getMaxTranslate = () => Math.max(0, track.scrollWidth - viewport.offsetWidth)

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0 || document.body.style.overflow === 'hidden') return

      const rect = viewport.getBoundingClientRect()
      const activationLine = window.innerHeight * 0.55
      const isActive = rect.top <= activationLine && rect.bottom >= activationLine
      if (!isActive) return

      const maxTranslate = getMaxTranslate()
      if (maxTranslate === 0 || targetXRef.current <= -maxTranslate + 1) return

      event.preventDefault()
      const deltaMultiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1
      const wheelDistance = event.deltaY * deltaMultiplier * 1.15
      targetXRef.current = Math.max(-maxTranslate, targetXRef.current - wheelDistance)
    }

    const handleResize = () => {
      const maxTranslate = getMaxTranslate()
      targetXRef.current = Math.max(-maxTranslate, Math.min(0, targetXRef.current))
      currentXRef.current = Math.max(-maxTranslate, Math.min(0, currentXRef.current))
    }

    const resetWhenReturningAbove = () => {
      if (viewport.getBoundingClientRect().top >= window.innerHeight) {
        targetXRef.current = 0
        currentXRef.current = 0
        track.style.transform = 'translate3d(0, 0, 0)'
      }
    }

    const animate = () => {
      currentXRef.current = lerp(currentXRef.current, targetXRef.current, 0.1)
      if (Math.abs(targetXRef.current - currentXRef.current) < 0.05) {
        currentXRef.current = targetXRef.current
      }

      track.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', resetWhenReturningAbove, { passive: true })
    rafId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', resetWhenReturningAbove)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="work" ref={revealRef} className="relative pt-24 lg:pt-32 pb-0">
      {/* Section Header */}
      <div className="mx-auto max-w-portfolio px-8 lg:px-12 mb-10 lg:mb-14">
        <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">Selected Work · 精选作品</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-6">
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground">
              3D Watch Projects
            </h2>
            <p className="mt-2 font-display text-lg text-muted-foreground/60">
              三维手表项目
            </p>
          </div>
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
            <p className="text-muted-foreground max-w-sm leading-relaxed font-light">
              A curated selection of 3D watch detail visualizations and product videos,
              crafted with precision and cinematic realism.
            </p>
            <p className="text-muted-foreground/50 max-w-sm leading-relaxed font-light text-sm mt-2">
              精选手表三维详情可视化与产品视频作品，以精准工艺与电影级质感呈现。
            </p>
          </div>
        </div>
      </div>

      {/* Project Viewport — scroll down to move horizontally */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden h-[400px] md:h-[460px] lg:h-[520px]"
      >
        {/* Horizontal Track */}
        <div ref={trackRef} className="projects-track flex gap-6 lg:gap-8 pl-8 lg:pl-12 h-full will-change-transform">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="projects-track__item group cursor-pointer flex-shrink-0 w-[420px] md:w-[500px] lg:w-[620px]"
              onClick={() => project.video && setSelectedProject(project)}
            >
              <BorderGlow
                glowColor="0 84% 60%"
                backgroundColor="#0a0a0a"
                borderRadius={16}
                glowRadius={30}
                glowIntensity={1.2}
                coneSpread={25}
                colors={['#dc2626', '#ef4444', '#7f1d1d']}
                className="h-full"
              >
                <div className="relative w-full h-full overflow-hidden" style={{ background: project.gradient }}>
                  {/* Video background */}
                  {project.video && (
                    <ProjectPreview src={project.video} />
                  )}

                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: project.pattern }}
                  />

                  {/* Gradient overlay for text */}
                  <div className="project-card__overlay" />

                  {/* Bilingual title — consistently anchored at bottom left */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8">
                    <h3 className="max-w-[85%] font-display text-2xl lg:text-3xl font-semibold leading-tight text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 font-display text-sm lg:text-base font-medium tracking-[0.08em] text-white/65">
                      {project.title_cn}
                    </p>
                  </div>
                </div>
              </BorderGlow>
            </div>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-8 lg:w-12" />
        </div>

        {/* Edge fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      </div>

      {/* Hint */}
      <div className="mt-6 flex items-center justify-center gap-3 text-muted-foreground/40 text-xs font-display tracking-[0.15em] uppercase">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Scroll down to explore · 下滑横向浏览</span>
      </div>

      {/* View All Link */}
      <div className="mx-auto max-w-portfolio px-8 lg:px-12 pt-8">
        <div className={`flex justify-center reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="3">
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
            <button className="group inline-flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-[#dc2626] transition-colors duration-500 ease-smooth px-4 py-2">
              <span className="border-b border-white/10 group-hover:border-[#dc2626]/50 pb-1 transition-colors duration-500 ease-smooth">
                View All Projects · 查看全部项目
              </span>
              <svg className="w-4 h-4 transition-transform duration-500 ease-smooth group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </BorderGlow>
        </div>
      </div>

      {/* === Video Modal — rendered via portal to escape any ancestor overflow/transform === */}
      {selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
          onClick={() => setSelectedProject(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-xl text-white/70 hover:text-white hover:border-[#dc2626]/50 hover:bg-[#dc2626]/10 transition-all duration-500 ease-smooth"
            onClick={() => setSelectedProject(null)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Video player */}
          <div
            className="relative w-[92vw] max-w-[1400px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                  {selectedProject.title}
                </h3>
                <p className="mt-1 font-display text-sm text-white/55">
                  {selectedProject.title_cn}
                </p>
              </div>
              <span className="px-3 py-1 bg-white/[0.06] rounded-full text-xs font-display text-white/50 border border-white/10">
                {selectedProject.year}
              </span>
            </div>

            {/* Video — original aspect ratio, no cropping */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(220,38,38,0.15)] bg-black">
              <video
                className="w-full h-auto max-h-[80vh] object-contain"
                src={selectedProject.video}
                autoPlay
                controls
                loop
                playsInline
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
