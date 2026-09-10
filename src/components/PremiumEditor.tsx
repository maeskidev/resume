import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type EducationItem = {
  id: number
  degree: string
  institution: string
  period: string
}

type ExperienceItem = {
  id: number
  title: string
  period: string
  company: string
  description: string
  highlights: string
}

type TemplateId = 'design' | 'linkedin' | 'portfolio'

type ResumeData = {
  fullName: string
  role: string
  email: string
  phone: string
  location: string
  website: string
  profile: string
  badge: string
  skills: string
  education: EducationItem[]
  experience: ExperienceItem[]
}

const RESUME_STORAGE_KEY = 'resume-maker-unified-data-v1'

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

const initialData: ResumeData = {
  fullName: 'WILLIAM PARKER',
  role: 'UX DESIGNER',
  email: 'hello@yourname.com',
  phone: '+1-234-097-864',
  location: 'Bogotá, Colombia',
  website: 'www.webaddress.com',
  profile:
    'Creative and user-centered UX Designer with a passion for crafting intuitive, engaging, and accessible digital experiences. Seeking to leverage design thinking, research, and prototyping skills to solve real user problems and enhance product usability.',
  badge: 'Excellence in AI & Automation',
  skills: 'Visual Design, UI/UX Design, Storyboards, User Flows, Process Flow, Web Design, Branding, Illustration',
  education: [
    { id: 1, degree: 'CSE OF UX DESIGN', institution: 'University Name', period: '2030 - 2034' },
    { id: 2, degree: 'CSE OF UX DESIGN', institution: 'University Name', period: '2026 - 2030' },
  ],
  experience: [
    {
      id: 1,
      title: 'SENIOR UX DESIGNER',
      period: '2034 - PRESENT',
      company: 'COMPANY NAME',
      description:
        'I lead user-centered product experiences from discovery through delivery, combining research, prototyping and systems thinking to make complex journeys feel simple.',
      highlights:
        'Designed scalable interfaces for high-impact product journeys\nLed workshops that aligned product, engineering and customer needs\nImproved usability through research-backed iteration',
    },
    {
      id: 2,
      title: 'UX DESIGNER',
      period: '2032 - 2034',
      company: 'COMPANY NAME',
      description:
        'Created clear, engaging digital products while partnering with cross-functional teams to turn opportunities into practical, accessible solutions.',
      highlights:
        'Created user flows and interactive prototypes\nMaintained a consistent visual language across product surfaces\nDocumented design decisions and outcomes',
    },
  ],
}

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

const splitList = (value: string) =>
  value.split(',').map((item) => item.trim()).filter(Boolean)

const splitLines = (value: string) =>
  value.split('\n').map((item) => item.trim()).filter(Boolean)

const getInitials = (fullName: string) =>
  fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'CV'

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
  const initials = useMemo(() => getInitials(data.fullName), [data.fullName])

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

  const renderDesignDocument = () => (
    <article className="premium-document premium-document--design" ref={documentRef}>
      <aside className="premium-resume-sidebar">
        <div className="premium-photo" aria-label="Retrato de perfil estilizado">
          <div className="premium-photo-orbit" />
          <span>{initials}</span>
        </div>
        <div className="premium-ai-badge">
          <span className="premium-spark">✦</span>
          <p>{data.badge || 'Especialidad destacada'}</p>
        </div>
        <section className="premium-resume-section">
          <h2>SKILLS</h2>
          <p className="premium-label">PROFESSIONAL</p>
          <ul className="premium-skills-list">
            {splitList(data.skills).map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </section>
        <section className="premium-resume-section premium-education">
          <h2>EDUCATION</h2>
          {data.education.map((item) => (
            <div className="premium-education-item" key={item.id}>
              <h3>{item.degree || 'PROGRAMA'}</h3>
              <p>{item.institution || 'Institución'}</p>
              <span>{item.period || 'Año - Año'}</span>
            </div>
          ))}
        </section>
      </aside>

      <section className="premium-resume-content">
        <header className="premium-identity">
          <p className="premium-first-name">{data.fullName.split(/\s+/).slice(0, -1).join(' ') || data.fullName || 'NOMBRE'}</p>
          <h1>{data.fullName.split(/\s+/).slice(-1).join(' ') || 'APELLIDO'}</h1>
          <h2>{data.role || 'CARGO PROFESIONAL'}</h2>
          <ul className="premium-contact-list">
            {[data.email, data.phone, data.location, data.website].filter(Boolean).map((contact) => <li key={contact}>{contact}</li>)}
          </ul>
        </header>
        <section className="premium-content-section">
          <h2>PROFILE</h2>
          <p>{data.profile || 'Agrega un resumen profesional.'}</p>
        </section>
        <section className="premium-content-section premium-experience-section">
          <h2>EXPERIENCE</h2>
          <div className="premium-timeline">
            {data.experience.map((item) => (
              <article className="premium-timeline-item" key={item.id}>
                <div className="premium-timeline-marker"><span /></div>
                <div className="premium-timeline-content">
                  <div className="premium-job-line">
                    <h3>{item.title || 'CARGO'}</h3>
                    <time>{item.period || 'Año - Año'}</time>
                  </div>
                  <h4>{item.company || 'EMPRESA'}</h4>
                  <p>{item.description || 'Describe tu experiencia.'}</p>
                  {splitLines(item.highlights).length > 0 && (
                    <ul>{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </article>
  )

  const renderLinkedInDocument = () => (
    <article className="resume-preview unified-document" ref={documentRef}>
      <header className="resume-header resume-header-calibrated">
        <h2 className="header-name">{data.fullName || 'Tu Nombre'}</h2>
        <p className="header-contact-line">
          {[data.email, data.phone, data.location, data.website].filter(Boolean).map((contact, index) => (
            <span key={contact}>{index > 0 && <span className="contact-separator"> · </span>}{contact}</span>
          ))}
        </p>
        <div className="header-divider" />
        <p className="summary profile-summary">{data.profile || 'Agrega un resumen profesional.'}</p>
      </header>
      <section className="resume-section resume-section-experience">
        <h4>Experiencia</h4>
        {data.experience.map((item) => (
          <article className="exp-company-block" key={item.id}>
            <div className="exp-company-head">
              <div className="exp-company-logo">{getInitials(item.company || 'Empresa')}</div>
              <div className="exp-company-meta">
                <h5>{item.company || 'Nombre de empresa'}</h5>
                <p>{item.period || 'Periodo'}</p>
              </div>
            </div>
            <div className="exp-project-list">
              <article className="exp-project-item">
                <div className="exp-project-bullet" />
                <div className="exp-project-content">
                  <h6>{item.title || 'Cargo'}</h6>
                  <p>{item.description || 'Agrega una descripción del trabajo realizado.'}</p>
                  {splitLines(item.highlights).length > 0 && (
                    <ul>{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  )}
                </div>
              </article>
            </div>
          </article>
        ))}
      </section>
      <section className="resume-section resume-section-education">
        <h4>Educación</h4>
        {data.education.map((item) => (
          <article className="item-card" key={item.id}>
            <div className="item-row">
              <aside className="period-col">{item.period || 'Periodo'}</aside>
              <div className="content-col">
                <div className="item-heading"><h5>{item.institution || 'Institución'}</h5></div>
                <p className="item-mode">{item.degree || 'Título/Carrera'}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="resume-section unified-skills-section">
        <h4>Habilidades</h4>
        <p className="summary">{splitList(data.skills).join(' · ')}</p>
      </section>
    </article>
  )

  const renderPortfolioDocument = () => (
    <article className="resume-preview resume-portfolio unified-document" ref={documentRef}>
      <aside className="pf-sidebar">
        <div className="pf-sidebar-name">
          <h2>{data.fullName || 'Tu Nombre'}</h2>
          <p className="pf-role">{data.role || 'Tu Cargo'}</p>
        </div>
        <div className="pf-sidebar-block">
          <h3 className="pf-sidebar-heading">Contacto</h3>
          <ul className="pf-contact-list">
            {[data.email, data.phone, data.location, data.website].filter(Boolean).map((contact) => <li key={contact}>{contact}</li>)}
          </ul>
        </div>
        <div className="pf-sidebar-block">
          <h3 className="pf-sidebar-heading">Perfil</h3>
          <p className="pf-summary">{data.profile || 'Agrega un resumen profesional.'}</p>
        </div>
        <div className="pf-sidebar-block">
          <h3 className="pf-sidebar-heading">Habilidades</h3>
          <ul className="pf-contact-list">{splitList(data.skills).map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
        <div className="pf-sidebar-block">
          <h3 className="pf-sidebar-heading">Educación</h3>
          {data.education.map((item) => (
            <div className="pf-edu-item" key={item.id}>
              <p className="pf-edu-degree">{item.degree || 'Título/Carrera'}</p>
              <p className="pf-edu-institution">{item.institution || 'Institución'}</p>
              <p className="pf-edu-period">{item.period || 'Periodo'}</p>
            </div>
          ))}
        </div>
      </aside>
      <div className="pf-main">
        <section className="pf-section">
          <h3 className="pf-section-title">Experiencia</h3>
          {data.experience.map((item) => (
            <div className="pf-company" key={item.id}>
              <div className="pf-company-head">
                <div className="pf-company-logo">{getInitials(item.company || 'Empresa')}</div>
                <div>
                  <p className="pf-company-name">{item.company || 'Nombre de empresa'}</p>
                  <p className="pf-company-meta">{item.period || 'Periodo'}</p>
                </div>
              </div>
              <div className="pf-projects">
                <div className="pf-project-item">
                  <div className="pf-project-dot" />
                  <div className="pf-project-body">
                    <p className="pf-project-title">{item.title || 'Cargo'}</p>
                    <p className="pf-project-desc">{item.description || 'Agrega una descripción.'}</p>
                    {splitLines(item.highlights).length > 0 && (
                      <ul className="pf-highlights">{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </article>
  )

  return (
    <main className="premium-page">
      <header className="premium-nav">
        <a href="/" className="premium-brand">Hojita<span>DeVida</span></a>
        <div className="premium-nav-center"><span className="premium-nav-dot" /><span>{activeTemplate.name}</span></div>
        <div className="premium-nav-actions">
          <button type="button" className="premium-template-trigger" onClick={() => setIsTemplateModalOpen(true)}>
            Plantilla: {activeTemplate.name}
          </button>
          <button type="button" className="premium-print" onClick={printResume}>Imprimir</button>
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
              {template === 'design' && renderDesignDocument()}
              {template === 'linkedin' && renderLinkedInDocument()}
              {template === 'portfolio' && renderPortfolioDocument()}
            </div>
          </div>
        </section>
      </div>

      <button type="button" className="premium-mobile-view-toggle" onClick={() => setMobileView((view) => (view === 'form' ? 'preview' : 'form'))}>
        {mobileView === 'form' ? 'Ver CV' : 'Editar CV'}
      </button>

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
