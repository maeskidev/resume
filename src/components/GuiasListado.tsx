import { useEffect } from 'react'
import { guias } from '../data/guias'

export function GuiasListado() {
  useEffect(() => {
    document.title = 'Guías sobre hoja de vida | Hojita de vida'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Aprende a crear una hoja de vida profesional con nuestras guías sobre ATS, experiencia laboral y más.',
      )
    }
  }, [])

  return (
    <main className="guias-shell">
      <a href="/" className="guias-back-link">
        ← Volver al editor
      </a>

      <header className="guias-article-header">
        <h1>Guías sobre hoja de vida</h1>
        <p className="guias-intro">
          Consejos prácticos para crear una hoja de vida que pase los filtros ATS y llame la
          atención de los reclutadores.
        </p>
      </header>

      <section className="guias-list">
        {guias.map((guia) => (
          <article key={guia.slug} className="guias-card">
            <a href={`/guias/${guia.slug}`} className="guias-card-link">
              <h2 className="guias-card-title">{guia.titulo}</h2>
              <p className="guias-card-desc">{guia.descripcion}</p>
              <time
                dateTime={guia.fechaPublicacion}
                className="guias-card-date"
              >
                {new Date(guia.fechaPublicacion).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </a>
          </article>
        ))}
      </section>
    </main>
  )
}
