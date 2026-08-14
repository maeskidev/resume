import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

type PremiumEducation = {
  id: number
  degree: string
  institution: string
  period: string
}

type PremiumExperience = {
  id: number
  title: string
  period: string
  company: string
  description: string
  highlights: string
}

type PremiumData = {
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  website: string
  profile: string
  badge: string
  skills: string
  education: PremiumEducation[]
  experience: PremiumExperience[]
}

const initialData: PremiumData = {
  firstName: 'WILLIAM',
  lastName: 'PARKER',
  role: 'UX DESIGNER',
  email: 'hello@yourname.com',
  phone: '+1-234-097-864',
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

const PREMIUM_STORAGE_KEY = 'resume-maker-premium-data-v1'

const getStoredPremiumData = (): PremiumData => {
  try {
    const storedData = window.localStorage.getItem(PREMIUM_STORAGE_KEY)
    if (!storedData) {
      return initialData
    }

    const parsedData = JSON.parse(storedData) as Partial<PremiumData>
    if (!Array.isArray(parsedData.education) || !Array.isArray(parsedData.experience)) {
      return initialData
    }

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
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

export function PremiumEditor() {
  const documentRef = useRef<HTMLElement | null>(null)
  const previewCanvasRef = useRef<HTMLDivElement | null>(null)
  const [data, setData] = useState<PremiumData>(getStoredPremiumData)
  const [isExporting, setIsExporting] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')
  const [previewScale, setPreviewScale] = useState(1)
  const [previewHeight, setPreviewHeight] = useState(940)

  useEffect(() => {
    window.localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useLayoutEffect(() => {
    const updatePreviewSize = () => {
      const canvas = previewCanvasRef.current
      const resume = documentRef.current

      if (!canvas || !resume) {
        return
      }

      const isMobile = window.matchMedia('(max-width: 800px)').matches
      const availableWidth = Math.max(canvas.clientWidth - 16, 0)
      const scale = isMobile && availableWidth > 0 ? Math.min(1, availableWidth / 760) : 1

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
  }, [data, mobileView])

  const previewStageStyle = {
    '--premium-mobile-scale': previewScale,
    '--premium-mobile-stage-width': `${760 * previewScale}px`,
    height: `${previewHeight * previewScale}px`,
  } as CSSProperties

  const initials = useMemo(
    () => `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase() || 'CV',
    [data.firstName, data.lastName],
  )

  const updateField = (field: keyof Omit<PremiumData, 'education' | 'experience'>, value: string) => {
    setData((previous) => ({ ...previous, [field]: value }))
  }

  const updateEducation = (id: number, field: keyof Omit<PremiumEducation, 'id'>, value: string) => {
    setData((previous) => ({
      ...previous,
      education: previous.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateExperience = (id: number, field: keyof Omit<PremiumExperience, 'id'>, value: string) => {
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

  const printResume = () => {
    window.print()
  }

  const downloadPdf = async () => {
    if (!documentRef.current || isExporting) {
      return
    }

    try {
      setIsExporting(true)

      const canvas = await html2canvas(documentRef.current, {
        backgroundColor: '#f7f7f5',
        scale: 2,
        useCORS: true,
      })
      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageHeight = (canvas.height * pageWidth) / canvas.width

      let renderedHeight = 0
      while (renderedHeight < imageHeight) {
        pdf.addImage(imageData, 'PNG', 0, -renderedHeight, pageWidth, imageHeight)
        renderedHeight += pageHeight

        if (renderedHeight < imageHeight) {
          pdf.addPage()
        }
      }

      const fullName = `${data.firstName} ${data.lastName}`.trim().toLowerCase().replace(/\s+/g, '-')
      pdf.save(`hoja-de-vida-premium-${fullName || 'perfil'}.pdf`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="premium-page">
      <header className="premium-nav">
        <a href="/" className="premium-brand">Hojita<span>DeVida</span></a>
        <div className="premium-nav-center">
          <span className="premium-nav-dot" />
          <span>Editor Premium</span>
        </div>
        <div className="premium-nav-actions">
          <button type="button" className="premium-print" onClick={printResume}>
            Imprimir ATS
          </button>
          <button type="button" className="premium-download" onClick={downloadPdf} disabled={isExporting}>
            {isExporting ? 'Generando…' : 'PDF visual'}
          </button>
          <a href="/" className="premium-exit">Salir</a>
        </div>
      </header>

      <div className={`premium-workspace premium-workspace--${mobileView}`}>
        <aside className="premium-form-panel">
          <div className="premium-form-heading">
            <p>PLANTILLA EXCLUSIVA</p>
            <h1>Construye tu perfil.</h1>
            <span>Los cambios se reflejan al instante.</span>
          </div>

          <section className="premium-form-section">
            <h2>Identidad</h2>
            <div className="premium-field-grid">
              <label>Nombre<input value={data.firstName} onChange={(event) => updateField('firstName', event.target.value)} /></label>
              <label>Apellido<input value={data.lastName} onChange={(event) => updateField('lastName', event.target.value)} /></label>
            </div>
            <label>Cargo profesional<input value={data.role} onChange={(event) => updateField('role', event.target.value)} /></label>
            <div className="premium-field-grid">
              <label>Correo<input type="email" value={data.email} onChange={(event) => updateField('email', event.target.value)} /></label>
              <label>Teléfono<input value={data.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
            </div>
            <label>Sitio web<input value={data.website} onChange={(event) => updateField('website', event.target.value)} /></label>
          </section>

          <section className="premium-form-section">
            <h2>Perfil y especialidad</h2>
            <label>Resumen<textarea rows={5} value={data.profile} onChange={(event) => updateField('profile', event.target.value)} /></label>
            <label>Badge de especialidad<input value={data.badge} onChange={(event) => updateField('badge', event.target.value)} /></label>
            <label>Habilidades <small>Separadas por comas</small><textarea rows={3} value={data.skills} onChange={(event) => updateField('skills', event.target.value)} /></label>
          </section>

          <section className="premium-form-section">
            <div className="premium-section-head">
              <h2>Educación</h2>
              <button type="button" onClick={addEducation}>Añadir</button>
            </div>
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
            <div className="premium-section-head">
              <h2>Experiencia</h2>
              <button type="button" onClick={addExperience}>Añadir</button>
            </div>
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

        <section className="premium-preview-panel" aria-label="Vista previa del currículum premium">
          <div className="premium-canvas" ref={previewCanvasRef}>
            <div className="premium-preview-stage" style={previewStageStyle}>
              <article className="premium-document" ref={documentRef}>
              <aside className="premium-resume-sidebar">
                <div className="premium-photo" aria-label="Retrato de perfil estilizado">
                  <div className="premium-photo-orbit" />
                  <span>{initials}</span>
                </div>
                <div className="premium-ai-badge">
                  <span className="premium-spark">✦</span>
                  <p>{data.badge || 'Excellence in AI & Automation'}</p>
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
                  <p className="premium-first-name">{data.firstName || 'NOMBRE'}</p>
                  <h1>{data.lastName || 'APELLIDO'}</h1>
                  <h2>{data.role || 'CARGO PROFESIONAL'}</h2>
                  <ul className="premium-contact-list">
                    {[data.email, data.phone, data.website].filter(Boolean).map((contact) => <li key={contact}>{contact}</li>)}
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
                            <ul>
                              {splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}
                            </ul>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </section>
              </article>
            </div>
          </div>
        </section>
      </div>

      <button
        type="button"
        className="premium-mobile-view-toggle"
        onClick={() => setMobileView((view) => (view === 'form' ? 'preview' : 'form'))}
        aria-label={mobileView === 'form' ? 'Ver vista previa del currículum' : 'Volver al formulario'}
      >
        {mobileView === 'form' ? 'Ver CV' : 'Editar CV'}
      </button>
    </main>
  )
}
