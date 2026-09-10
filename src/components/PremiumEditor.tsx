import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ResumeDocument } from './ResumeDocument'
import { createSharedResumeUrl } from '../data/resumeShare'
import { initialResumeData, type EducationItem, type ExperienceItem, type ResumeData, type TemplateId } from '../data/resume'

const RESUME_STORAGE_KEY = 'resume-maker-unified-data-v1'
const SHARE_TUTORIAL_STORAGE_KEY = 'resume-maker-share-tutorial-seen-v1'

const templates: Array<{ id: TemplateId; name: string; description: string; className: string }> = [
  {
    id: 'design',
    name: 'Design editorial',
    description: 'Dos columnas, badge de especialidad y una composición visual moderna.',
    className: 'template-option--design',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn clásico',
    description: 'Diseño limpio, directo y orientado a sistemas ATS.',
    className: 'template-option--linkedin',
  },
  {
    id: 'portfolio',
    name: 'Portfolio dark',
    description: 'Estilo visual con barra lateral para perfiles creativos y tecnológicos.',
    className: 'template-option--portfolio',
  },
]

const initialData = initialResumeData

const getStoredData = (): ResumeData => {
  try {
    const storedData = window.localStorage.getItem(RESUME_STORAGE_KEY)
    if (!storedData) return initialData

    const parsedData = JSON.parse(storedData) as Partial<ResumeData>
    if (!Array.isArray(parsedData.education) || !Array.isArray(parsedData.experience)) return initialData

    return {
      ...initialData,
      ...parsedData,
      education: parsedData.education,
      experience: parsedData.experience,
    }
  } catch {
    return initialData
  }
}

const getInitialTemplate = (): TemplateId => {
  const requestedTemplate = new URLSearchParams(window.location.search).get('layout')
  return requestedTemplate === 'linkedin' || requestedTemplate === 'portfolio' || requestedTemplate === 'design'
    ? requestedTemplate
    : 'design'
}

export function PremiumEditor() {
  const documentRef = useRef<HTMLElement | null>(null)
  const previewCanvasRef = useRef<HTMLDivElement | null>(null)
  const [data, setData] = useState<ResumeData>(getStoredData)
  const [template, setTemplate] = useState<TemplateId>(getInitialTemplate)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')
  const [previewScale, setPreviewScale] = useState(1)
  const [previewHeight, setPreviewHeight] = useState(940)
  const [isShareTutorialOpen, setIsShareTutorialOpen] = useState(
    () => window.localStorage.getItem(SHARE_TUTORIAL_STORAGE_KEY) !== 'true',
  )

  useEffect(() => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useLayoutEffect(() => {
    const updatePreviewSize = () => {
      const canvas = previewCanvasRef.current
      const resume = documentRef.current
      if (!canvas || !resume) return

      const isMobile = window.matchMedia('(max-width: 800px)').matches
      const documentWidth = template === 'design' ? 760 : 800
      const availableWidth = Math.max(canvas.clientWidth - 16, 0)
      const scale = isMobile && availableWidth > 0 ? Math.min(1, availableWidth / documentWidth) : 1

      setPreviewScale(scale)
      setPreviewHeight(resume.offsetHeight)
    }

    updatePreviewSize()
    const observer = new ResizeObserver(updatePreviewSize)
    if (previewCanvasRef.current) observer.observe(previewCanvasRef.current)
    if (documentRef.current) observer.observe(documentRef.current)
    window.addEventListener('resize', updatePreviewSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePreviewSize)
    }
  }, [data, mobileView, template])

  const previewStageStyle = {
    '--premium-mobile-scale': previewScale,
    '--premium-mobile-stage-width': `${(template === 'design' ? 760 : 800) * previewScale}px`,
    height: `${previewHeight * previewScale}px`,
  } as CSSProperties

  const activeTemplate = templates.find((item) => item.id === template) ?? templates[0]

  const updateField = (field: keyof Omit<ResumeData, 'education' | 'experience'>, value: string) => {
    setData((previous) => ({ ...previous, [field]: value }))
  }

  const updateEducation = (id: number, field: keyof Omit<EducationItem, 'id'>, value: string) => {
    setData((previous) => ({
      ...previous,
      education: previous.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateExperience = (id: number, field: keyof Omit<ExperienceItem, 'id'>, value: string) => {
    setData((previous) => ({
      ...previous,
      experience: previous.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addEducation = () => {
    setData((previous) => ({
      ...previous,
      education: [
        ...previous.education,
        { id: Date.now(), degree: 'NUEVO PROGRAMA', institution: 'Institución', period: 'Año - Año' },
      ],
    }))
  }

  const addExperience = () => {
    setData((previous) => ({
      ...previous,
      experience: [
        ...previous.experience,
        {
          id: Date.now(),
          title: 'NUEVO CARGO',
          period: 'Año - Presente',
          company: 'EMPRESA',
          description: 'Describe el impacto y las responsabilidades principales de este rol.',
          highlights: 'Resultado o responsabilidad destacada',
        },
      ],
    }))
  }

  const removeEducation = (id: number) => {
    setData((previous) => ({ ...previous, education: previous.education.filter((item) => item.id !== id) }))
  }

  const removeExperience = (id: number) => {
    setData((previous) => ({ ...previous, experience: previous.experience.filter((item) => item.id !== id) }))
  }

  const selectTemplate = (nextTemplate: TemplateId) => {
    setTemplate(nextTemplate)
    setIsTemplateModalOpen(false)
    setMobileView('preview')
  }

  const printResume = () => window.print()

  const openSharedPreview = () => {
    window.open(createSharedResumeUrl(data, template), '_blank', 'noopener,noreferrer')
  }

  const closeShareTutorial = () => {
    window.localStorage.setItem(SHARE_TUTORIAL_STORAGE_KEY, 'true')
    setIsShareTutorialOpen(false)
  }

  return (
    <main className="premium-page">
      <header className="premium-nav">
        <a href="/" className="premium-brand">Hojita<span>DeVida</span></a>
        <button type="button" className="premium-preview-trigger" onClick={openSharedPreview} aria-label="Abrir vista previa compartible">
          <svg className="premium-preview-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="2.75" />
          </svg>
          <span>Vista previa</span>
        </button>
        <div className="premium-nav-actions">
          <button type="button" className="premium-template-trigger" onClick={() => setIsTemplateModalOpen(true)}>
            Plantilla: {activeTemplate.name}
          </button>
          <button type="button" className="premium-print" onClick={printResume}>Descargar PDF</button>
          <a href="/" className="premium-exit">Salir</a>
        </div>
      </header>

      <div className={`premium-workspace premium-workspace--${mobileView}`}>
        <aside className="premium-form-panel">
          <div className="premium-form-heading">
            <p>EDITOR DE PLANTILLAS</p>
            <h1>Construye tu perfil.</h1>
            <span>Todos los cambios se reflejan al instante.</span>
          </div>

          <section className="premium-form-section">
            <h2>Identidad</h2>
            <label>Nombre completo<input value={data.fullName} onChange={(event) => updateField('fullName', event.target.value)} /></label>
            <label>Cargo profesional<input value={data.role} onChange={(event) => updateField('role', event.target.value)} /></label>
            <div className="premium-field-grid">
              <label>Correo<input type="email" value={data.email} onChange={(event) => updateField('email', event.target.value)} /></label>
              <label>Teléfono<input value={data.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
            </div>
            <div className="premium-field-grid">
              <label>Ubicación<input value={data.location} onChange={(event) => updateField('location', event.target.value)} /></label>
              <label>Sitio web<input value={data.website} onChange={(event) => updateField('website', event.target.value)} /></label>
            </div>
          </section>

          <section className="premium-form-section">
            <h2>Perfil y especialidad</h2>
            <label>Resumen<textarea rows={5} value={data.profile} onChange={(event) => updateField('profile', event.target.value)} /></label>
            <label>Badge de especialidad<input value={data.badge} onChange={(event) => updateField('badge', event.target.value)} /></label>
            <label>Habilidades <small>Separadas por comas</small><textarea rows={3} value={data.skills} onChange={(event) => updateField('skills', event.target.value)} /></label>
          </section>

          <section className="premium-form-section">
            <div className="premium-section-head"><h2>Educación</h2><button type="button" onClick={addEducation}>Añadir</button></div>
            {data.education.map((item) => (
              <div className="premium-repeat-card" key={item.id}>
                <button type="button" className="premium-remove" onClick={() => removeEducation(item.id)} aria-label="Eliminar educación">×</button>
                <label>Programa<input value={item.degree} onChange={(event) => updateEducation(item.id, 'degree', event.target.value)} /></label>
                <label>Institución<input value={item.institution} onChange={(event) => updateEducation(item.id, 'institution', event.target.value)} /></label>
                <label>Período<input value={item.period} onChange={(event) => updateEducation(item.id, 'period', event.target.value)} /></label>
              </div>
            ))}
          </section>

          <section className="premium-form-section">
            <div className="premium-section-head"><h2>Experiencia</h2><button type="button" onClick={addExperience}>Añadir</button></div>
            {data.experience.map((item) => (
              <div className="premium-repeat-card" key={item.id}>
                <button type="button" className="premium-remove" onClick={() => removeExperience(item.id)} aria-label="Eliminar experiencia">×</button>
                <label>Cargo<input value={item.title} onChange={(event) => updateExperience(item.id, 'title', event.target.value)} /></label>
                <div className="premium-field-grid">
                  <label>Empresa<input value={item.company} onChange={(event) => updateExperience(item.id, 'company', event.target.value)} /></label>
                  <label>Período<input value={item.period} onChange={(event) => updateExperience(item.id, 'period', event.target.value)} /></label>
                </div>
                <label>Descripción<textarea rows={3} value={item.description} onChange={(event) => updateExperience(item.id, 'description', event.target.value)} /></label>
                <label>Logros <small>Uno por línea</small><textarea rows={3} value={item.highlights} onChange={(event) => updateExperience(item.id, 'highlights', event.target.value)} /></label>
              </div>
            ))}
          </section>
        </aside>

        <section className="premium-preview-panel" aria-label="Vista previa de la hoja de vida">
          <div className="premium-canvas" ref={previewCanvasRef}>
            <div className="premium-preview-stage" style={previewStageStyle}>
              <ResumeDocument data={data} template={template} documentRef={documentRef} />
            </div>
          </div>
        </section>
      </div>

      <button type="button" className="premium-mobile-view-toggle" onClick={() => setMobileView((view) => (view === 'form' ? 'preview' : 'form'))}>
        {mobileView === 'form' ? 'Ver CV' : 'Editar CV'}
      </button>

      {isShareTutorialOpen && (
        <div className="share-tutorial-backdrop" role="presentation" onMouseDown={closeShareTutorial}>
          <section className="share-tutorial-card" role="dialog" aria-modal="true" aria-labelledby="share-tutorial-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="share-tutorial-arrow" aria-hidden="true" />
            <div className="share-tutorial-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="2.75" />
              </svg>
            </div>
            <p className="share-tutorial-kicker">NUEVA FUNCIÓN</p>
            <h2 id="share-tutorial-title">Comparte tu hoja de vida</h2>
            <p>Usa <strong>Vista previa</strong> para abrir una versión limpia de tu CV y copiar su URL. Cualquier persona con el enlace podrá verla sin acceder al editor.</p>
            <button type="button" onClick={closeShareTutorial}>Entendido</button>
          </section>
        </div>
      )}

      {isTemplateModalOpen && (
        <div className="template-modal-backdrop" role="presentation" onMouseDown={() => setIsTemplateModalOpen(false)}>
          <section className="template-modal" role="dialog" aria-modal="true" aria-labelledby="template-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="template-modal-header">
              <div><p>PERSONALIZA TU CV</p><h2 id="template-modal-title">Elige una plantilla</h2></div>
              <button type="button" className="template-modal-close" aria-label="Cerrar selector de plantillas" onClick={() => setIsTemplateModalOpen(false)}>×</button>
            </div>
            <p className="template-modal-description">Tu información se conserva al cambiar de plantilla.</p>
            <div className="template-option-list">
              {templates.map((item) => (
                <button key={item.id} type="button" className={`template-option ${item.className} ${template === item.id ? 'is-selected' : ''}`} onClick={() => selectTemplate(item.id)}>
                  <span className="template-option-preview" aria-hidden="true"><span /><span /><span /></span>
                  <span className="template-option-copy"><strong>{item.name}</strong><small>{item.description}</small></span>
                  <span className="template-option-state">{template === item.id ? 'Actual' : 'Usar'}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
