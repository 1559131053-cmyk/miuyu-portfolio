import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'
import SoftAurora from '@/components/SoftAurora'

interface Advantage {
  number: string
  title: string
  title_cn: string
  description: string
  description_cn: string
  tags: string[]
  auroraColors: [string, string]
  auroraBand: number
}

const ADVANTAGES: Advantage[] = [
  {
    number: '01',
    title: '3D Modeling',
    title_cn: '三维建模',
    description:
      'Creating photorealistic 3D renders, product visualizations, and immersive environments with advanced modeling and rendering pipelines.',
    description_cn:
      '运用高级建模与渲染管线，创建照片级三维渲染、产品可视化与沉浸式环境。',
    tags: ['Cinema 4D'],
    auroraColors: ['#f7f7f7', '#ff2424'],
    auroraBand: 0.38,
  },
  {
    number: '02',
    title: '3D Motion & Animation',
    title_cn: '三维动效与动画',
    description:
      'Crafting dynamic 3D motion graphics and animated sequences that bring dimension and depth to visual storytelling.',
    description_cn:
      '制作动态三维动效与动画序列，为视觉叙事增添维度与深度。',
    tags: ['After Effects', 'Cinema 4D', 'Octane'],
    auroraColors: ['#ff5a5a', '#8b0000'],
    auroraBand: 0.52,
  },
  {
    number: '03',
    title: 'Product Rendering',
    title_cn: '产品渲染',
    description:
      'Producing high-fidelity product renders and 3D configurators for e-commerce, advertising, and design reviews.',
    description_cn:
      '为电商、广告与设计评审制作高保真产品渲染与三维配置器。',
    tags: ['Octane', 'HDR Lighting', 'Adobe Photoshop'],
    auroraColors: ['#ffffff', '#ff3030'],
    auroraBand: 0.64,
  },
]

export function Advantages() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="expertise"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/[0.03] rounded-full blur-[120px] -translate-y-1/2" />

      <div className="mx-auto max-w-portfolio px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
              <span className="section-label">Expertise · 专业能力</span>
            </div>
            <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
              <h2 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground">
                3D Capabilities
              </h2>
              <p className="mt-2 font-display text-lg text-muted-foreground/60">
                三维能力
              </p>
            </div>
          </div>
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
            <p className="text-muted-foreground max-w-sm leading-relaxed font-light">
              Three core capabilities spanning the full 3D design pipeline — from concept to final
              render.
            </p>
            <p className="text-muted-foreground/50 max-w-sm leading-relaxed font-light text-sm mt-2">
              三项核心能力，覆盖从概念到最终渲染的完整三维设计流程。
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ADVANTAGES.map((adv, index) => (
            <BorderGlow
              key={adv.number}
              flat
              glowColor="0 84% 60%"
              backgroundColor="transparent"
              borderRadius={16}
              glowRadius={20}
              glowIntensity={1.0}
              edgeSensitivity={25}
              colors={['#dc2626', '#ef4444', '#7f1d1d']}
              className={`reveal w-full ${isVisible ? 'reveal--visible' : ''}`}
            >
              <div
                className="advantage-card group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] hover:border-red-500/30 cursor-pointer h-full transition-all duration-500 ease-smooth"
                data-delay={String((index % 3) + 1)}
              >
                <SoftAurora
                  speed={0.42}
                  scale={1.35}
                  brightness={1.3}
                  color1={adv.auroraColors[0]}
                  color2={adv.auroraColors[1]}
                  noiseFrequency={1.9}
                  noiseAmplitude={0.7}
                  bandHeight={adv.auroraBand}
                  bandSpread={0.62}
                  octaveDecay={0.16}
                  layerOffset={0.45 + index * 0.18}
                  colorSpeed={0.55}
                  enableMouseInteraction
                  mouseInfluence={0.12}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/5 via-black/30 to-black/80 pointer-events-none" />
                <div className="relative z-10 p-8 lg:p-9 h-full">
                  {/* Number */}
                  <div className="font-display text-5xl font-bold text-white/10 group-hover:text-red-500/30 transition-colors duration-600 ease-smooth">
                    {adv.number}
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-display text-xl font-semibold text-white leading-snug">
                    {adv.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60 font-medium">
                    {adv.title_cn}
                  </p>

                  {/* Description */}
                  <p className="mt-4 text-sm text-white/65 leading-relaxed font-light">
                    {adv.description}
                  </p>
                  <p className="mt-2 text-xs text-white/45 leading-relaxed font-light">
                    {adv.description_cn}
                  </p>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {adv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium text-white/65 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  )
}
