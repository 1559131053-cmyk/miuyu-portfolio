import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextPressure from '@/components/TextPressure'

export function Hero() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const [videoReady, setVideoReady] = useState(false)

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
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1200 ease-smooth"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
        </video>

        {/* 黑色蒙版 — 压暗视频 */}
        <div
          className="absolute inset-0 bg-black/45 transition-opacity duration-1200 ease-smooth"
          style={{ opacity: videoReady ? 1 : 0 }}
        />

        {/* 文字可读性渐变 — 底部渐变到背景色 */}
        <div
          className="absolute inset-0 transition-opacity duration-1200 ease-smooth"
          style={{
            opacity: videoReady ? 1 : 0,
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
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a] pointer-events-none" />

        {/* Fallback gradient while video loads */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a] transition-opacity duration-800 ease-smooth"
          style={{ opacity: videoReady ? 0 : 1 }}
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
              fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
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
