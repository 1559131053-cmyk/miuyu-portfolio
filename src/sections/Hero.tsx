import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextPressure from '@/components/TextPressure'

export function Hero() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const resumeAfterVisibilityRef = useRef(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let loadTimer: ReturnType<typeof setTimeout> | undefined
    let idleCallbackId: number | undefined
    let idleFallbackTimer: ReturnType<typeof setTimeout> | undefined
    let observer: IntersectionObserver | undefined
    let loadStarted = false

    const startVideoLoad = () => {
      if (loadStarted) return
      loadStarted = true
      setShouldLoadVideo(true)
    }

    const scheduleIdleLoad = () => {
      if ('requestIdleCallback' in window) {
        idleCallbackId = window.requestIdleCallback(startVideoLoad, { timeout: 1200 })
      } else {
        idleFallbackTimer = setTimeout(startVideoLoad, 300)
      }
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer?.disconnect()
          // Give the poster and critical UI a frame to paint before requesting video.
          loadTimer = setTimeout(startVideoLoad, 350)
        },
        { threshold: 0.01 }
      )
      observer.observe(video)
    }

    if (document.readyState === 'complete') scheduleIdleLoad()
    else window.addEventListener('load', scheduleIdleLoad, { once: true })

    const compatibilityFallback = setTimeout(startVideoLoad, 2500)
    return () => {
      observer?.disconnect()
      window.removeEventListener('load', scheduleIdleLoad)
      if (loadTimer) clearTimeout(loadTimer)
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (idleFallbackTimer) clearTimeout(idleFallbackTimer)
      clearTimeout(compatibilityFallback)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo) return

    let stabilityTimer: ReturnType<typeof setTimeout> | undefined
    let fallbackRevealTimer: ReturnType<typeof setTimeout> | undefined
    let frameCallbackId: number | undefined
    let playbackRequestPending = false
    let playbackPrepared = false

    const clearStabilityTimer = () => {
      if (!stabilityTimer) return
      clearTimeout(stabilityTimer)
      stabilityTimer = undefined
    }

    const revealFromBeginning = () => {
      if (playbackPrepared) return
      playbackPrepared = true
      clearStabilityTimer()
      video.currentTime = 0

      const revealVideo = () => setVideoReady(true)
      if ('requestVideoFrameCallback' in video) {
        frameCallbackId = video.requestVideoFrameCallback(revealVideo)
      } else {
        fallbackRevealTimer = setTimeout(revealVideo, 100)
      }
    }

    const handlePlaying = () => {
      if (playbackPrepared || stabilityTimer) return
      stabilityTimer = setTimeout(revealFromBeginning, 1750)
    }

    const handlePlaybackInterruption = () => {
      if (!playbackPrepared) clearStabilityTimer()
    }

    const requestPlayback = () => {
      if (document.hidden || !video.paused || playbackRequestPending) return
      video.defaultMuted = true
      video.muted = true
      video.playsInline = true
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load()

      playbackRequestPending = true
      video.play()
        .catch(() => undefined)
        .finally(() => {
          playbackRequestPending = false
        })
    }

    video.addEventListener('playing', handlePlaying)
    video.addEventListener('waiting', handlePlaybackInterruption)
    video.addEventListener('stalled', handlePlaybackInterruption)
    video.addEventListener('pause', handlePlaybackInterruption)
    video.addEventListener('loadeddata', requestPlayback)
    video.addEventListener('canplay', requestPlayback)
    const playbackFrameId = requestAnimationFrame(requestPlayback)

    return () => {
      clearStabilityTimer()
      if (fallbackRevealTimer) clearTimeout(fallbackRevealTimer)
      cancelAnimationFrame(playbackFrameId)
      if (frameCallbackId !== undefined && 'cancelVideoFrameCallback' in video) {
        video.cancelVideoFrameCallback(frameCallbackId)
      }
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('waiting', handlePlaybackInterruption)
      video.removeEventListener('stalled', handlePlaybackInterruption)
      video.removeEventListener('pause', handlePlaybackInterruption)
      video.removeEventListener('loadeddata', requestPlayback)
      video.removeEventListener('canplay', requestPlayback)
    }
  }, [shouldLoadVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resumeAfterVisibilityRef.current = true
        if (!video.paused) video.pause()
        return
      }

      if (resumeAfterVisibilityRef.current && video.paused) {
        resumeAfterVisibilityRef.current = false
        video.play().catch(() => undefined)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleVisibilityChange()
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [shouldLoadVideo])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* === Full-Screen Video Background (full color) === */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        {/* Lightweight first paint — visually replaced once the video is ready */}
        <img
          src={`${import.meta.env.BASE_URL}hero-poster.webp`}
          alt=""
          width="1920"
          height="1080"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-1200 ease-smooth"
          style={{ opacity: videoReady ? 0 : 1 }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={`${import.meta.env.BASE_URL}hero-poster.webp`}
          className="absolute inset-0 z-[2] w-full h-full object-cover transition-opacity duration-1200 ease-smooth"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          {shouldLoadVideo ? (
            <>
              <source
                src={`${import.meta.env.BASE_URL}hero-video.webm`}
                type="video/webm"
              />
              <source
                src={`${import.meta.env.BASE_URL}hero-video.mp4`}
                type="video/mp4"
              />
            </>
          ) : null}
        </video>

        {/* 黑色蒙版 — 压暗视频 */}
        <div
          className="absolute inset-0 z-[3] bg-black/45"
        />

        {/* 文字可读性渐变 — 底部渐变到背景色 */}
        <div
          className="absolute inset-0 z-[3]"
          style={{
            background: `
              radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.10) 0%, transparent 55%),
              linear-gradient(to bottom,
                rgba(0,0,0,0.30) 0%,
                rgba(0,0,0,0.05) 30%,
                rgba(0,0,0,0.05) 55%,
                rgba(10,10,10,1) 100%)
            `,
          }}
        />

        {/* 底部丝滑过渡层 — 渐变到 #0a0a0a 实现与下一屏无缝衔接 */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] h-[35vh] bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a] pointer-events-none" />

        {/* Fallback gradient while video loads */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]"
        />
      </div>

      {/* === Content === */}
      <div className="relative z-10 flex-1 flex flex-col mx-auto max-w-portfolio px-6 lg:px-10 w-full pt-32 pb-8">
        {/* Huge Heading — TextPressure 变量字体鼠标交互动效 */}
        <div
          className={`transition-all duration-1200 ease-smooth ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative w-full h-[130px] md:h-[185px] lg:h-[240px] overflow-hidden">
            <TextPressure
              text="miuyu"
              fontFamily="Roboto Flex"
              flex={true}
              alpha={true}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#dc2626"
              minFontSize={56}
              maxFontSize={240}
            />
          </div>
        </div>

        {/* 中间留白将下方内容推到底部 */}
        <div className="flex-1" />

        {/* Stats Row — 下移 */}
        <div
          className={`flex flex-wrap items-end gap-8 md:gap-16 transition-all duration-1200 delay-200 ease-smooth ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <p className="text-4xl md:text-5xl font-display font-bold text-white">50+</p>
            <p className="text-[10px] md:text-xs text-white/50 tracking-[0.15em] uppercase mt-1">
              Projects Delivered
            </p>
            <p className="text-[10px] md:text-xs text-white/40 mt-0.5">
              已交付项目
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-display font-bold text-white">3Y</p>
            <p className="text-[10px] md:text-xs text-white/50 tracking-[0.15em] uppercase mt-1">
              Experience
            </p>
            <p className="text-[10px] md:text-xs text-white/40 mt-0.5">
              从业经验
            </p>
          </div>
        </div>

        {/* Bottom Bar — Tagline + CTA */}
        <div
          className={`mt-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-end transition-all duration-1200 delay-300 ease-smooth ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-md">
            <p className="text-sm md:text-base text-white font-display font-medium uppercase tracking-wide">
              Design is not decoration.
            </p>
            <p className="text-sm text-white/60 font-light leading-relaxed mt-1">
              设计不是装饰，是品牌系统、视觉叙事与用户体验的精确耦合。
            </p>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => scrollToSection('about')}
            className="group flex flex-col items-center gap-2 text-white/40 hover:text-red-500 transition-colors duration-300"
          >
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-white animate-scroll-indicator" />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
