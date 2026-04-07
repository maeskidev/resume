import { useEffect } from 'react'
import type { Guia } from '../data/guias'

type GuiasArticuloProps = {
  guia: Guia
}

export function GuiasArticulo({ guia }: GuiasArticuloProps) {
  useEffect(() => {
    document.title = `${guia.titulo} | Hojita de vida`
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', guia.descripcion)
    }

    const existingLd = document.querySelector('script[data-guia-ld="true"]')
    if (existingLd) {
      existingLd.remove()
    }

    const ldScript = document.createElement('script')
    ldScript.type = 'application/ld+json'
    ldScript.dataset.guiaLd = 'true'
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guia.titulo,
      description: guia.descripcion,
      datePublished: guia.fechaPublicacion,
      author: { '@type': 'Organization', name: 'Hojita de vida' },
      publisher: {
        '@type': 'Organization',
        name: 'Hojita de vida',
        url: 'https://hojitadevida.com',
      },
      mainEntityOfPage: `https://hojitadevida.com/guias/${guia.slug}`,
    })
    document.head.appendChild(ldScript)

    return () => {
      ldScript.remove()
    }
  }, [guia])

  const fechaFormateada = new Date(guia.fechaPublicacion).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="guias-shell">
      <nav aria-label="Migas de pan" className="guias-breadcrumb">
        <ol>
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/guias">Guías</a>
          </li>
          <li aria-current="page">{guia.titulo}</li>
        </ol>
      </nav>

      <article>
        <header className="guias-article-header">
          <h1>{guia.titulo}</h1>
          <time dateTime={guia.fechaPublicacion} className="guias-article-date">
            {fechaFormateada}
          </time>
        </header>

        <div className="guias-article-body">
          {guia.contenido ? (
            <div dangerouslySetInnerHTML={{ __html: guia.contenido }} />
          ) : (
            <p className="guias-placeholder">Artículo en construcción. Vuelve pronto.</p>
          )}
        </div>

        <div className="guias-cta">
          <p>¿Lista para crear la tuya?</p>
          <a href="/" className="guias-cta-btn">
            Crea tu hoja de vida gratis ahora
          </a>
        </div>
      </article>

      <a href="/guias" className="guias-back-link">
        ← Volver a todas las guías
      </a>
    </main>
  )
}
