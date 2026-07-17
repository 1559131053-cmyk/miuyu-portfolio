import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'
import SoftAurora from '@/components/SoftAurora'

interface Advantage {
  number: string
  title: string
  titleCn: string
  description: string
  descriptionCn: string
  tags: string[]
  auroraColors: [string, string]
  auroraBand: number
}

const ADVANTAGES: Advantage[] = [
  {
    number: '01',
    title: 'Product Visualization',
    titleCn: '产品视觉表现',
    description: 'Creating high-quality product visuals through modeling, lighting and cinematic rendering.',
    descriptionCn: '专注于产品CG视觉表现，通过三维建模、材质、灯光与镜头设计展现产品质感。',
    tags: ['Cinema 4D', 'Octane', 'Photoshop'],
    auroraColors: ['#f7f7f7', '#ff2424'],
    auroraBand: 0.38,
  },
  {
    number: '02',
    title: 'Motion Design',
    titleCn: '三维动画设计',
    description: 'Designing dynamic 3D animations with cinematic camera movement and storytelling.',
    descriptionCn: '制作产品动画与动态视觉内容，结合镜头语言提升视觉表现和叙事效果。',
    tags: ['Cinema 4D', 'After Effects', 'Motion Design'],
    auroraColors: ['#ff5a5a', '#8b0000'],
    auroraBand: 0.52,
  },
  {
    number: '03',
    title: '3D Modeling',
    titleCn: '三维建模',
    description: 'Building accurate 3D models and optimized scenes for visualization and animation.',
    descriptionCn: '完成产品模型、场景搭建与细节优化，为动画和渲染提供高质量三维基础。',
    tags: ['Cinema 4D', 'Hard Surface', 'Texture & Materials'],
    auroraColors: ['#ffffff', '#ff3030'],
    auroraBand: 0.64,
  },
]

export function Advantages() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section id="expertise" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/[0.03] rounded-full blur-[120px] -translate-y-1/2" />

      <div className="mx-auto max-w-portfolio px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
              <span className="section-label">EXPERTISE · 专业能力</span>
            </div>
            <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
              <h2 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground">
                3D Design &amp; Visualization
              </h2>
              <p className="mt-2 font-display text-lg text-muted-foreground/60">
                三维设计与视觉表现
              </p>
            </div>
          </div>
          <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
            <p className="text-muted-foreground max-w-sm leading-relaxed font-light">
              Three core capabilities spanning the full 3D design pipeline — from concept to final render.
            </p>
            <p className="text-muted-foreground/50 max-w-sm leading-relaxed font-light text-sm mt-2">
              三项核心能力，覆盖从建模、动画到最终视觉表现的完整三维设计流程。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ADVANTAGES.map((advantage, index) => (
            <BorderGlow
              key={advantage.number}
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
                  color1={advantage.auroraColors[0]}
                  color2={advantage.auroraColors[1]}
                  noiseFrequency={1.9}
                  noiseAmplitude={0.7}
                  bandHeight={advantage.auroraBand}
                  bandSpread={0.62}
                  octaveDecay={0.16}
                  layerOffset={0.45 + index * 0.18}
                  colorSpeed={0.55}
                  enableMouseInteraction
                  mouseInfluence={0.12}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/5 via-black/30 to-black/80 pointer-events-none" />
                <div className="relative z-10 p-8 lg:p-9 h-full">
                  <div className="font-display text-5xl font-bold text-white/20 group-hover:text-red-500/35 transition-colors duration-600 ease-smooth">
                    {advantage.number}
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold text-white leading-snug">
                    {advantage.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60 font-medium">
                    {advantage.titleCn}
                  </p>

                  <p className="mt-4 text-sm text-white/75 leading-relaxed font-light">
                    {advantage.description}
                  </p>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed font-light">
                    {advantage.descriptionCn}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {advantage.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium text-white/75 bg-black/30 backdrop-blur-sm border border-white/15 rounded-full">
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
