import './App.css'
import { GuiasArticulo } from './components/GuiasArticulo'
import { GuiasListado } from './components/GuiasListado'
import { Home } from './components/Home'
import { PremiumEditor } from './components/PremiumEditor'
import { getGuiaBySlug } from './data/guias'

type LegalRoute = '/privacy' | '/terms' | '/contact'

const legalRoutes: LegalRoute[] = ['/privacy', '/terms', '/contact']

const legalContent: Record<LegalRoute, { title: string; body: string[] }> = {
  '/privacy': {
    title: 'Política de Privacidad',
    body: [
      'Esta aplicación no requiere crear cuenta y no solicita datos personales sensibles para su uso normal.',
      'La información de tu hoja de vida se guarda localmente en el navegador para mejorar tu experiencia.',
      'El contenido de tu hoja de vida no se envía a servidores externos del proyecto.',
      'Puedes borrar tus datos locales limpiando el almacenamiento del navegador.',
    ],
  },
  '/terms': {
    title: 'Términos de Uso',
    body: [
      'Hojita de vida se ofrece de forma gratuita, sin garantía explícita de disponibilidad continua.',
      'Eres responsable de la información que escribes y del uso que hagas del documento generado.',
      'No está permitido utilizar la herramienta para actividades ilegales o contenido que infrinja derechos de terceros.',
    ],
  },
  '/contact': {
    title: 'Contacto',
    body: [
      'Si tienes dudas, sugerencias o reportes de error, puedes contactar al responsable de Hojita de vida.',
      'Correo de contacto: maeskiros@gmail.com',
      'También puedes abrir un issue en el repositorio oficial del proyecto en GitHub.',
    ],
  },
}

function App() {
  const currentPath = window.location.pathname

  if (currentPath === '/') return <Home />

  // /premium is preserved as a backwards-compatible entry to the unified editor.
  if (currentPath === '/crear' || currentPath === '/premium' || currentPath === '/portafolio') {
    return <PremiumEditor />
  }

  if (currentPath === '/guias') return <GuiasListado />

  if (currentPath.startsWith('/guias/')) {
    const guia = getGuiaBySlug(currentPath.replace('/guias/', ''))
    if (guia) return <GuiasArticulo guia={guia} />

    return (
      <main className="guias-shell">
        <h1>Página no encontrada</h1>
        <p>La guía que buscas no existe.</p>
        <a href="/">← Volver al inicio</a>
      </main>
    )
  }

  if (legalRoutes.includes(currentPath as LegalRoute)) {
    const content = legalContent[currentPath as LegalRoute]

    return (
      <main className="legal-shell">
        <article className="legal-card">
          <h1>{content.title}</h1>
          {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="legal-actions">
            <a href="/">Volver a Hojita de vida</a>
          </div>
        </article>
      </main>
    )
  }

  return <Home />
}

export default App
