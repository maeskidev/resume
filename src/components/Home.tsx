import { useState, useRef, useEffect } from 'react'

const templateCards = [
  {
    id: 'design',
    label: 'NUEVO',
    titleLines: ['DESIGN.'],
    description: 'Plantilla editorial de dos columnas. Foto, habilidades y experiencia con estilo.',
    cta: 'Usar esta plantilla',
    href: '/premium',
  },
  {
    id: 'linkedin',
    label: 'MÁS POPULAR',
    titleLines: ['LINKEDIN', 'CLÁSICO.'],
    description: 'Diseño limpio optimizado para ATS y reclutadores corporativos.',
    cta: 'Usar esta plantilla',
    href: '/crear?layout=linkedin',
  },
  {
    id: 'portfolio',
    label: 'CREATIVO',
    titleLines: ['PORTFOLIO', 'DARK.'],
    description: '6 temas de color, sidebar visual. Ideal para perfiles tech y creativos.',
    cta: 'Usar esta plantilla',
    href: '/crear?layout=portfolio',
  },
]

export function Home() {
  const [activeCard, setActiveCard] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Hoja de vida gratis online | HojitaDeVida.com'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Crea tu hoja de vida gratis en minutos. Sin registro, sin límites. Descarga en PDF o imprime directamente.',
      )
    }
  }, [])

  const scrollToCard = (index: number) => {
    const total = templateCards.length
    const clamped = Math.max(0, Math.min(total - 1, index))
    setActiveCard(clamped)
    const track = trackRef.current
    if (!track) return
    const card = track.children[clamped] as HTMLElement
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <div className="home-page">
      {/* ── NAV ── */}
      <header className="home-nav">
        <a href="/" className="home-brand" aria-label="HojitaDeVida: inicio">
          Hojita<span>DeVida</span>
        </a>
        <nav className="home-nav-links" aria-label="Navegación principal">
          <a href="/" className="home-nav-link is-active" aria-current="page">Inicio</a>
          <a href="/guias" className="home-nav-link">Guías</a>
          {/* <a href="/premium" className="home-nav-link home-nav-link--premium">Premium</a> */}
        </nav>
        <a href="/crear" className="home-nav-create">Crear hoja de vida</a>
      </header>

      {/* ── HEADLINE ── */}
      <section className="home-hero-section">
        <p className="home-eyebrow">Gratis · Sin registro · PDF en minutos</p>
        {/* <h1 className="home-headline">
          CONSIGUE<br />EL TRABAJO.
        </h1> */}
      </section>

      {/* ── CARDS ── */}
      <section className="home-cards-section" aria-label="Plantillas disponibles">
        {/* Mobile carousel prev button */}
        <button
          className="home-carousel-btn home-carousel-btn--prev"
          onClick={() => scrollToCard(activeCard - 1)}
          disabled={activeCard === 0}
          aria-label="Anterior plantilla"
        >
          ‹
        </button>

        <div className="home-cards-track" ref={trackRef}>
          {templateCards.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className={`home-card home-card--${card.id}`}
              aria-label={`Plantilla ${card.titleLines.join(' ')}`}
            >
              {/* Label */}
              <span className="home-card-label">{card.label}</span>

              {/* Preview area */}
              <div className="home-card-preview" aria-hidden="true">
                {card.id === 'linkedin' && (
                  <div className="home-tpl-li-preview">
                    <div className="home-tpl-li-header">
                      <div className="home-tpl-li-name" />
                      <div className="home-tpl-li-contact" />
                      <div className="home-tpl-li-divider" />
                    </div>
                    <div className="home-tpl-li-body">
                      <div className="home-tpl-section-label" />
                      <div className="home-tpl-exp-row">
                        <div className="home-tpl-logo" />
                        <div className="home-tpl-lines">
                          <div className="home-tpl-line" />
                          <div className="home-tpl-line home-tpl-line--short" />
                        </div>
                      </div>
                      <div className="home-tpl-exp-row">
                        <div className="home-tpl-logo" />
                        <div className="home-tpl-lines">
                          <div className="home-tpl-line" />
                          <div className="home-tpl-line home-tpl-line--short" />
                        </div>
                      </div>
                      <div className="home-tpl-section-label" />
                      <div className="home-tpl-line" />
                      <div className="home-tpl-line home-tpl-line--short" />
                    </div>
                  </div>
                )}

                {card.id === 'portfolio' && (
                  <div className="home-tpl-pf-preview">
                    <div className="home-tpl-pf-sidebar">
                      <div className="home-tpl-pf-name" />
                      <div className="home-tpl-pf-role" />
                      <div className="home-tpl-pf-line" />
                      <div className="home-tpl-pf-line home-tpl-pf-line--short" />
                      <div className="home-tpl-pf-line" />
                    </div>
                    <div className="home-tpl-pf-main">
                      <div className="home-tpl-pf-section" />
                      <div className="home-tpl-pf-block">
                        <div className="home-tpl-pf-block-head" />
                        <div className="home-tpl-pf-line" />
                        <div className="home-tpl-pf-line home-tpl-pf-line--short" />
                      </div>
                      <div className="home-tpl-pf-block">
                        <div className="home-tpl-pf-block-head" />
                        <div className="home-tpl-pf-line" />
                      </div>
                    </div>
                  </div>
                )}

                {card.id === 'design' && (
                  <div className="home-tpl-design-preview">
                    {/* Left sidebar */}
                    <div className="home-tpl-design-sidebar">
                      <div className="home-tpl-design-photo">
                        <span>MQ</span>
                      </div>
                      <div className="home-tpl-design-badge" />
                      <div className="home-tpl-design-skill-label" />
                      <div className="home-tpl-design-skill" />
                      <div className="home-tpl-design-skill home-tpl-design-skill--short" />
                      <div className="home-tpl-design-skill" />
                      <div className="home-tpl-design-skill home-tpl-design-skill--short" />
                      <div className="home-tpl-design-skill" />
                    </div>
                    {/* Right content */}
                    <div className="home-tpl-design-main">
                      <div className="home-tpl-design-name-sm" />
                      <div className="home-tpl-design-name-lg" />
                      <div className="home-tpl-design-role" />
                      <div className="home-tpl-design-dots">
                        <div className="home-tpl-design-dot" />
                        <div className="home-tpl-design-dot" />
                        <div className="home-tpl-design-dot" />
                      </div>
                      <div className="home-tpl-design-section-label" />
                      <div className="home-tpl-design-exp">
                        <div className="home-tpl-design-exp-marker" />
                        <div className="home-tpl-design-exp-lines">
                          <div className="home-tpl-design-line" />
                          <div className="home-tpl-design-line home-tpl-design-line--short" />
                          <div className="home-tpl-design-line" />
                        </div>
                      </div>
                      <div className="home-tpl-design-exp">
                        <div className="home-tpl-design-exp-marker" />
                        <div className="home-tpl-design-exp-lines">
                          <div className="home-tpl-design-line" />
                          <div className="home-tpl-design-line home-tpl-design-line--short" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer: big title + cta */}
              <div className="home-card-footer">
                <p className="home-card-title">
                  {card.titleLines.map((line, j) => (
                    <span key={j} className="home-card-title-line">{line}</span>
                  ))}
                </p>
                <span className="home-card-cta">{card.cta} →</span>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile carousel next button */}
        <button
          className="home-carousel-btn home-carousel-btn--next"
          onClick={() => scrollToCard(activeCard + 1)}
          disabled={activeCard === templateCards.length - 1}
          aria-label="Siguiente plantilla"
        >
          ›
        </button>

        {/* Mobile dots indicator */}
        <div className="home-carousel-dots" aria-hidden="true">
          {templateCards.map((_, i) => (
            <button
              key={i}
              className={`home-carousel-dot${i === activeCard ? ' is-active' : ''}`}
              onClick={() => scrollToCard(i)}
              aria-label={`Ir a plantilla ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features">
        <div className="home-feature">
          <span className="home-feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <h3>Tiempo real</h3>
          <p>Cada cambio aparece al instante en la vista previa.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <h3>Privacidad total</h3>
          <p>Tus datos nunca salen de tu navegador. Sin servidores, sin cuentas.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </span>
          <h3>PDF en un clic</h3>
          <p>Descarga tu hoja de vida como PDF o imprime directamente.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            </svg>
          </span>
          <h3>Múltiples estilos</h3>
          <p>LinkedIn clásico o Portfolio oscuro con 6 temas de color.</p>
        </div>
      </section>
    </div>
  )
}
