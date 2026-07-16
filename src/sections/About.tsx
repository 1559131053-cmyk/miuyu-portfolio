import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'

const STATS = [
  { value: '3+', label: '从业年限' },
  { value: '50+', label: '已交付项目' },
]

export function About() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-portfolio px-8 lg:px-12">
        {/* Section Header */}
        <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">About · 关于</span>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          {/* Left: Avatar / Portrait */}
          <div className={`lg:col-span-4 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
            <div className="relative h-full">
              {/* Avatar portrait — 自动适配照片比例 */}
              <div className="avatar-frame relative h-full min-h-[300px] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <img
                  src={`${import.meta.env.BASE_URL}about-portrait.png`}
                  alt="MIUYU portrait"
                  className="w-full h-full object-cover object-top"
                />
                {/* 内边缘遮罩 — 消除圆角锯齿 */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_2px_#0a0a0a] pointer-events-none z-[1]" />
                {/* 底部黑色渐变蒙版 — 减弱，让照片自然过渡到背景 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent pointer-events-none z-[2]" />
              </div>

            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-8">
            <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-foreground">
                一位三维设计师，在艺术与技术的交汇处，构建{' '}
                <span className="text-muted-foreground">沉浸式视觉世界</span>。
              </h2>
              <p className="mt-4 font-display text-lg md:text-xl lg:text-2xl font-medium leading-snug text-muted-foreground/60">
                A 3D designer crafting{' '}
                <span className="text-muted-foreground/40">immersive visual worlds</span>{' '}
                at the intersection of art & technology.
              </p>
            </div>

            <div className={`mt-8 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="3">
              <p className="text-muted-foreground leading-relaxed text-base lg:text-lg font-light">
                我是一名拥有 3 年以上经验的三维设计师，专注于三维产品、与三维动效体验。我的作品探索照片级渲染、沉浸式环境——通过空间叙事让概念跃然呈现。曾与科技、时尚、生活方式等领域的品牌合作，打造令人惊艳的三维视觉内容。
              </p>
            </div>

            {/* Stats Grid */}
            <div className={`mt-12 grid grid-cols-2 gap-6 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="4">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-l border-white/10 pl-4">
                  <div className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className={`mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="5">
              <BorderGlow
                flat
                glowColor="0 84% 60%"
                backgroundColor="transparent"
                borderRadius={10}
                glowRadius={12}
                glowIntensity={0.8}
                edgeSensitivity={20}
                colors={['#dc2626', '#ef4444', '#7f1d1d']}
              >
                <a
                  href="mailto:miuyu@qq.com"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors duration-500 ease-smooth px-2 py-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2.5 4L8 8.5L13.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  miuyu@qq.com
                </a>
              </BorderGlow>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14C8 14 13 9 13 5.5C13 3.01 10.76 1 8 1C5.24 1 3 3.01 3 5.5C3 9 8 14 8 14Z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                广州
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
