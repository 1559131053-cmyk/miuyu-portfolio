import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CuratedImage {
  src: string
  title: string
  titleCn: string
  position?: string
}

const ASSET_BASE = import.meta.env.BASE_URL

const CURATED_IMAGES: CuratedImage[] = [
  { src: `${ASSET_BASE}gallery/001.jpg`, title: 'Global Arena', titleCn: '世界杯系列', position: 'center 42%' },
  { src: `${ASSET_BASE}gallery/031.jpg`, title: 'Emerald Guilloché', titleCn: '碧波绿玑镂盘面' },
  { src: `${ASSET_BASE}gallery/042.jpg`, title: 'Genghis Khan', titleCn: '成吉思汗' },
  { src: `${ASSET_BASE}gallery/028.jpg`, title: 'Automatic Movement', titleCn: '自动上链机芯' },
  { src: `${ASSET_BASE}gallery/043.jpg`, title: 'Arcade Dial', titleCn: '水果街机盘面' },
  { src: `${ASSET_BASE}gallery/056.jpg`, title: 'Play in Motion', titleCn: '街机腕间场景', position: 'center 58%' },
  { src: `${ASSET_BASE}gallery/065.jpg`, title: 'Enamel Snake', titleCn: '珐琅蛇' },
  { src: `${ASSET_BASE}gallery/069.jpg`, title: 'Enamel Architecture', titleCn: '珐琅蛇立体结构' },
  { src: `${ASSET_BASE}gallery/072.jpg`, title: 'Luminous Serpent', titleCn: '夜光蛇影' },
  { src: `${ASSET_BASE}gallery/075.jpg`, title: 'Hammered Bronze', titleCn: '棕色锤纹盘面' },
  { src: `${ASSET_BASE}gallery/086.jpg`, title: 'Violet Rhythm', titleCn: '紫色锤纹盘面' },
  { src: `${ASSET_BASE}gallery/103.jpg`, title: 'Monochrome Texture', titleCn: '黑色锤纹盘面' },
  { src: `${ASSET_BASE}gallery/082.jpg`, title: 'Sculpted Bracelet', titleCn: '锤纹一体式表链' },
  { src: `${ASSET_BASE}gallery/092.jpg`, title: 'Blue Resonance', titleCn: '蓝色锤纹盘面' },
]

interface GalleryCardProps {
  image: CuratedImage
  index: number
  className: string
  eager?: boolean
}

function GalleryCard({ image, index, className, eager = false }: GalleryCardProps) {
  return (
    <figure className={`group relative overflow-hidden rounded-2xl bg-[#0a0a0a] ${className}`}>
      <img
        src={image.src}
        alt={`${image.title} · ${image.titleCn}`}
        loading={eager ? 'eager' : 'lazy'}
        className="h-full w-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-[1.035]"
        style={{ objectPosition: image.position ?? 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />
      <div className="absolute left-5 top-5 font-display text-[10px] tracking-[0.2em] text-white/45">
        {String(index + 1).padStart(2, '0')} / {String(CURATED_IMAGES.length).padStart(2, '0')}
      </div>
      <figcaption className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
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

export function Gallery() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.01,
    rootMargin: '0px 0px -60px 0px',
  })

  return (
    <section id="gallery" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
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
            <GalleryCard image={CURATED_IMAGES[0]} index={0} eager className="lg:col-span-8 h-[520px] lg:h-[720px]" />
            <div className="lg:col-span-4 lg:h-[720px] grid grid-rows-2 gap-6 lg:gap-8">
              <GalleryCard image={CURATED_IMAGES[1]} index={1} eager className="h-[340px] lg:h-auto min-h-0" />
              <GalleryCard image={CURATED_IMAGES[2]} index={2} className="h-[340px] lg:h-auto min-h-0" />
            </div>
          </div>

          {/* Cinematic pause */}
          <GalleryCard image={CURATED_IMAGES[3]} index={3} className="h-[380px] lg:h-[500px]" />

          {/* Product and context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <GalleryCard image={CURATED_IMAGES[4]} index={4} className="lg:col-span-5 h-[480px] lg:h-[560px]" />
            <GalleryCard image={CURATED_IMAGES[5]} index={5} className="lg:col-span-7 h-[480px] lg:h-[560px]" />
          </div>

          {/* Enamel story: hero plus two details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <GalleryCard image={CURATED_IMAGES[6]} index={6} className="lg:col-span-7 h-[560px] lg:h-[720px]" />
            <div className="lg:col-span-5 lg:h-[720px] grid grid-rows-2 gap-6 lg:gap-8">
              <GalleryCard image={CURATED_IMAGES[7]} index={7} className="h-[340px] lg:h-auto min-h-0" />
              <GalleryCard image={CURATED_IMAGES[8]} index={8} className="h-[340px] lg:h-auto min-h-0" />
            </div>
          </div>

          {/* Material rhythm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <GalleryCard image={CURATED_IMAGES[9]} index={9} className="h-[460px] lg:h-[540px]" />
            <GalleryCard image={CURATED_IMAGES[10]} index={10} className="h-[460px] lg:h-[540px]" />
            <GalleryCard image={CURATED_IMAGES[11]} index={11} className="h-[460px] lg:h-[540px]" />
          </div>

          {/* Closing pair */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <GalleryCard image={CURATED_IMAGES[12]} index={12} className="lg:col-span-7 h-[500px] lg:h-[620px]" />
            <GalleryCard image={CURATED_IMAGES[13]} index={13} className="lg:col-span-5 h-[500px] lg:h-[620px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
