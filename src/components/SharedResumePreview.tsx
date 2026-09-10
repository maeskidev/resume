import { ResumeDocument } from './ResumeDocument'
import { getSharedResumePayload } from '../data/resumeShare'

export function SharedResumePreview() {
  const sharedResume = getSharedResumePayload(window.location.search)

  if (!sharedResume) {
    return (
      <main className="shared-resume-error">
        <section>
          <a href="/" className="shared-resume-brand">Hojita<span>DeVida</span></a>
          <h1>Enlace de hoja de vida no válido</h1>
          <p>El enlace está incompleto, fue modificado o no contiene información que se pueda mostrar.</p>
          <a className="shared-resume-return" href="/crear">Crear una hoja de vida</a>
        </section>
      </main>
    )
  }

  return (
    <main className={`shared-resume-page shared-resume-page--${sharedResume.template}`}>
      <header className="shared-resume-nav">
        <a href="/" className="shared-resume-brand">Hojita<span>DeVida</span></a>
        <button type="button" onClick={() => window.print()}>Descargar PDF</button>
      </header>
      <section className="shared-resume-canvas" aria-label="Hoja de vida compartida">
        <ResumeDocument data={sharedResume.data} template={sharedResume.template} />
      </section>
    </main>
  )
}
