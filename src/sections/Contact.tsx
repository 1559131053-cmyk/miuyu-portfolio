import { useScrollReveal } from '@/hooks/useScrollReveal'
import BorderGlow from '@/components/BorderGlow'

export function Contact() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section id="contact" ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-portfolio px-8 lg:px-12 w-full py-32">
        <div className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">CONTACT · 联系我</span>
        </div>

        <div className={`mt-8 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="1">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] tracking-tight text-foreground max-w-5xl">
            Let's Create Something <span className="italic font-light" style={{ color: '#8A8A8A' }}>Extraordinary</span>
          </h2>
          <p className="mt-4 font-display text-2xl md:text-3xl text-muted-foreground/60 leading-snug">
            期待与你交流三维设计机会
          </p>
        </div>

        <div className={`mt-8 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="2">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            专注于产品CG、三维动画与视觉表现。
          </p>
          <p className="mt-3 text-base md:text-lg text-muted-foreground/50 max-w-2xl leading-relaxed font-light">
            如果你对我的作品感兴趣，欢迎通过邮箱或微信与我联系。
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className={`lg:col-span-7 flex flex-col items-start gap-2 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="3">
            <BorderGlow flat glowColor="0 84% 60%" backgroundColor="transparent" borderRadius={20} glowRadius={18} glowIntensity={1.0} edgeSensitivity={15} colors={['#dc2626', '#ef4444', '#7f1d1d']}>
              <a href="mailto:miuyu@qq.com" className="group inline-flex items-center gap-4 px-4 py-2">
                <span className="flex flex-col items-start">
                  <span className="mb-1 font-display text-[10px] md:text-xs font-medium tracking-[0.2em] text-white/40">MAIL</span>
                  <span className="font-display text-2xl md:text-4xl lg:text-5xl font-medium text-foreground group-hover:text-gold transition-colors duration-500 ease-smooth">miuyu@qq.com</span>
                </span>
                <span className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/15 group-hover:border-gold group-hover:bg-gold transition-all duration-500 ease-smooth">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-background transition-all duration-500 ease-smooth group-hover:rotate-[-45deg] transform" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>
            </BorderGlow>
          </div>

          <div className={`lg:col-span-5 justify-self-center lg:justify-self-end reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="4">
            <div
              className="group flex flex-col items-center rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-white/25"
              style={{ width: 180, height: 220 }}
            >
              <img
                src={`${import.meta.env.BASE_URL}wechat-qr-code.webp`}
                alt="微信二维码"
                width="344"
                height="344"
                loading="lazy"
                decoding="async"
                className="block shrink-0"
                style={{ width: 128, height: 128 }}
              />
              <div className="mt-3 h-px w-8 bg-white/25" />
              <div className="mt-2 text-center">
                <p className="font-display text-xs font-medium tracking-[0.24em] text-white">WECHAT</p>
                <p className="mt-0.5 text-xs" style={{ color: '#8a8a8a' }}>Scan to connect</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-24 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 reveal ${isVisible ? 'reveal--visible' : ''}`} data-delay="5">
          <p className="text-xs text-muted-foreground/50 font-display tracking-wider">© MIUYU · 3D DESIGNER PORTFOLIO</p>
          <BorderGlow flat glowColor="0 84% 60%" backgroundColor="transparent" borderRadius={8} glowRadius={10} glowIntensity={0.7} edgeSensitivity={20} colors={['#dc2626', '#ef4444', '#7f1d1d']}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-gold transition-colors duration-500 ease-smooth font-display tracking-wider px-2 py-1">
              BACK TO TOP
              <svg className="w-3 h-3 transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </BorderGlow>
        </div>
      </div>
    </section>
  )
}
