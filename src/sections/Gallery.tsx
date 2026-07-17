import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CuratedImage {
  id: string
  width: number
  height: number
  title: string
  titleCn: string
  position?: string
}

const ASSET_BASE = import.meta.env.BASE_URL

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

interface GalleryCardProps {
  image: CuratedImage
  index: number
  className: string
}

function GalleryCard({ image, index, className }: GalleryCardProps) {
  const imageBase = `${ASSET_BASE}gallery/${image.id}`

  return (
    <figure className={`group relative overflow-hidden rounded-2xl bg-[#0a0a0a] ${className}`}>
      <img
        src={`${imageBase}.webp`}
        srcSet={`${imageBase}-640.webp 640w, ${imageBase}.webp ${image.width}w`}
        sizes="(max-width: 1023px) calc(100vw - 4rem), (max-width: 1440px) 55vw, 790px"
        alt={`${image.title} · ${image.titleCn}`}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        onLoad={(event) => event.currentTarget.classList.add('optimized-image--loaded')}
        className="optimized-image h-full w-full object-cover group-hover:scale-[1.035]"
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
            <GalleryCard image={CURATED_IMAGES[0]} index={0} className="lg:col-span-8 h-[520px] lg:h-[720px]" />
            <div className="lg:col-span-4 lg:h-[720px] grid grid-rows-2 gap-6 lg:gap-8">
              <GalleryCard image={CURATED_IMAGES[1]} index={1} className="h-[340px] lg:h-auto min-h-0" />
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
