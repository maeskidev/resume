import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import addIcon from './assets/add.svg'
import collapseIcon from './assets/collapse.svg'
import deleteIcon from './assets/delete.svg'
import expandIcon from './assets/expand.svg'
import './App.css'

type ExperienceMode = 'Presencial' | 'Remoto' | 'Hibrido'

type ExperienceProject = {
  id: number
  title: string
  period: string
  mode: ExperienceMode | ''
  description: string
}

type ExperienceCompany = {
  id: number
  companyName: string
  companyLogoText: string
  employmentMeta: string
  projects: ExperienceProject[]
}

type EducationItem = {
  id: number
  institution: string
  degree: string
  period: string
  description: string
}

type ResumeData = {
  fullName: string
  role: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  experience: ExperienceCompany[]
  education: EducationItem[]
}

type PrintMode = 'ats' | 'visual'
type LegalRoute = '/privacy' | '/terms' | '/contact'
type FormStepKey = 'profile' | 'experience' | 'education'

const modeOptions: ExperienceMode[] = ['Presencial', 'Remoto', 'Hibrido']
const RESUME_STORAGE_KEY = 'resume-maker-data-v1'
const legalRoutes: LegalRoute[] = ['/privacy', '/terms', '/contact']
const formSteps: Array<{ key: FormStepKey; title: string; hint: string }> = [
  { key: 'profile', title: 'Perfil', hint: 'Datos principales' },
  { key: 'experience', title: 'Experiencia', hint: 'Empresas y proyectos' },
  { key: 'education', title: 'Educacion', hint: 'Formacion academica' },
]

const initialResumeData: ResumeData = {
  fullName: 'Michael E. Quiros',
  role: 'Frontend Developer',
  email: 'maeskiros@gmail.com',
  phone: '+506 0000-0000',
  location: 'San Jose, Costa Rica',
  website: 'linkedin.com/in/tu-perfil',
  summary:
    'Desarrollador orientado a producto con enfoque en interfaces limpias y experiencias digitales de alto impacto.',
  experience: [
    {
      id: 1,
      companyName: 'NTT DATA',
      companyLogoText: 'NTT',
      employmentMeta: 'Jornada completa - 5 anos 2 meses',
      projects: [
        {
          id: 1,
          title: 'Software Engineer',
          period: 'Oct. 2025 - Actualidad',
          mode: 'Hibrido',
          description:
            'Construccion del nuevo portal de servicio para lubricantes y combustibles en Colombia, Ecuador y Peru con React y Azure DevOps.',
        },
        {
          id: 2,
          title: 'Frontend Engineer II',
          period: 'May. 2025 - Nov. 2025',
          mode: 'Presencial',
          description:
            'Diseno de componentes de frontend para productos financieros con foco en accesibilidad, rendimiento y escalabilidad.',
        },
      ],
    },
  ],
  education: [
    {
      id: 1,
      institution: 'Universidad de Costa Rica',
      degree: 'Ingenieria en Computacion',
      period: '2018 - 2022',
      description: 'Enfasis en desarrollo web y arquitectura de software.',
    },
  ],
}

const getInitialResumeData = (): ResumeData => {
  try {
    const stored = window.localStorage.getItem(RESUME_STORAGE_KEY)
    if (!stored) {
      return initialResumeData
    }

    const parsed = JSON.parse(stored) as Partial<ResumeData>
    return {
      ...initialResumeData,
      ...parsed,
      experience: parsed.experience ?? initialResumeData.experience,
      education: parsed.education ?? initialResumeData.education,
    }
  } catch {
    return initialResumeData
  }
}

function App() {
  const currentPath = window.location.pathname as LegalRoute | string
  const resumeRef = useRef<HTMLDivElement | null>(null)
  const adSlotRef = useRef<HTMLModElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [data, setData] = useState<ResumeData>(getInitialResumeData)
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({})
  const [printMode, setPrintMode] = useState<PrintMode>('ats')
  const [activeStep, setActiveStep] = useState(0)
  const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
  const adsenseSlot = import.meta.env.VITE_ADSENSE_SLOT as string | undefined

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === formSteps.length - 1
  const progress = ((activeStep + 1) / formSteps.length) * 100

  useEffect(() => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    document.body.setAttribute('data-print-mode', printMode)
  }, [printMode])

  useEffect(() => {
    if (!adsenseClient) {
      return
    }

    const existing = document.querySelector(
      'script[data-adsbygoogle-script="true"]',
    ) as HTMLScriptElement | null

    if (existing) {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`
    script.crossOrigin = 'anonymous'
    script.dataset.adsbygoogleScript = 'true'
    document.head.appendChild(script)
  }, [adsenseClient])

  useEffect(() => {
    if (!adsenseClient || !adsenseSlot || !adSlotRef.current) {
      return
    }

    const adNode = adSlotRef.current
    if (adNode.dataset.adInitialized === 'true') {
      return
    }

    try {
      ;((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({})
      adNode.dataset.adInitialized = 'true'
    } catch {
      // Ignore if AdSense is not ready yet.
    }
  }, [adsenseClient, adsenseSlot])

  const nextExperienceCompanyId = useMemo(() => {
    return data.experience.reduce((max, company) => Math.max(max, company.id), 0) + 1
  }, [data.experience])

  const nextExperienceProjectId = useMemo(() => {
    return (
      data.experience.reduce((maxProject, company) => {
        const companyMax = company.projects.reduce((projectMax, project) => {
          return Math.max(projectMax, project.id)
        }, 0)
        return Math.max(maxProject, companyMax)
      }, 0) + 1
    )
  }, [data.experience])

  const nextEducationId = useMemo(() => {
    return data.education.reduce((max, item) => Math.max(max, item.id), 0) + 1
  }, [data.education])

  const updateBasicField = (
    field: keyof Omit<ResumeData, 'experience' | 'education'>,
    value: string,
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateExperienceCompany = (
    companyId: number,
    field: keyof Omit<ExperienceCompany, 'id' | 'projects'>,
    value: string,
  ) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((company) =>
        company.id === companyId ? { ...company, [field]: value } : company,
      ),
    }))
  }

  const updateExperienceProject = (
    companyId: number,
    projectId: number,
    field: keyof ExperienceProject,
    value: string,
  ) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((company) =>
        company.id === companyId
          ? {
              ...company,
              projects: company.projects.map((project) =>
                project.id === projectId ? { ...project, [field]: value } : project,
              ),
            }
          : company,
      ),
    }))
  }

  const updateEducation = (id: number, field: keyof EducationItem, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addExperienceCompany = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: nextExperienceCompanyId,
          companyName: '',
          companyLogoText: '',
          employmentMeta: '',
          projects: [
            {
              id: nextExperienceProjectId,
              title: '',
              period: '',
              mode: '',
              description: '',
            },
          ],
        },
      ],
    }))
  }

  const removeExperienceCompany = (companyId: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((company) => company.id !== companyId),
    }))
  }

  const addExperienceProject = (companyId: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((company) =>
        company.id === companyId
          ? {
              ...company,
              projects: [
                ...company.projects,
                {
                  id: nextExperienceProjectId,
                  title: '',
                  period: '',
                  mode: '',
                  description: '',
                },
              ],
            }
          : company,
      ),
    }))
  }

  const removeExperienceProject = (companyId: number, projectId: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((company) =>
        company.id === companyId
          ? {
              ...company,
              projects: company.projects.filter((project) => project.id !== projectId),
            }
          : company,
      ),
    }))

    const key = `${companyId}-${projectId}`
    setCollapsedProjects((prev) => {
      if (!(key in prev)) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const toggleProjectCollapsed = (companyId: number, projectId: number) => {
    const key = `${companyId}-${projectId}`
    setCollapsedProjects((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: nextEducationId,
          institution: '',
          degree: '',
          period: '',
          description: '',
        },
      ],
    }))
  }

  const removeEducation = (id: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }))
  }

  const downloadPdf = async () => {
    if (!resumeRef.current) {
      return
    }

    try {
      setIsExporting(true)

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f4f4ef',
      })
      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (imgHeight <= pageHeight) {
        pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        let currentHeight = 0
        while (currentHeight < imgHeight) {
          pdf.addImage(imageData, 'PNG', 0, -currentHeight, imgWidth, imgHeight)
          currentHeight += pageHeight
          if (currentHeight < imgHeight) {
            pdf.addPage()
          }
        }
      }

      pdf.save('resume.pdf')
    } finally {
      setIsExporting(false)
    }
  }

  const printResume = () => {
    document.body.setAttribute('data-print-mode', printMode)
    window.print()
  }

  if (legalRoutes.includes(currentPath as LegalRoute)) {
    const page = currentPath as LegalRoute
    const legalContent: Record<LegalRoute, { title: string; body: string[] }> = {
      '/privacy': {
        title: 'Politica de Privacidad',
        body: [
          'Esta aplicacion no requiere crear cuenta y no solicita datos personales sensibles para su uso normal.',
          'La informacion del CV se guarda localmente en el navegador del usuario (localStorage) para mejorar la experiencia.',
          'El contenido del CV no se envia a servidores externos del proyecto.',
          'Si se habilita publicidad (Google AdSense), Google puede usar cookies o identificadores segun sus politicas.',
          'Puedes borrar tus datos locales limpiando el almacenamiento del navegador.',
        ],
      },
      '/terms': {
        title: 'Terminos de Uso',
        body: [
          'Hojita de vida 💕 se ofrece de forma gratuita, sin garantia explicita de disponibilidad continua.',
          'El usuario es responsable de la informacion que escribe y del uso que haga del documento generado.',
          'No se permite usar la herramienta para actividades ilegales o contenido que infrinja derechos de terceros.',
          'La aplicacion puede actualizarse para mejorar funciones, diseno o rendimiento.',
          'El uso de esta aplicacion implica aceptacion de estos terminos.',
        ],
      },
      '/contact': {
        title: 'Contacto',
        body: [
          'Si tienes dudas, sugerencias o reportes de error, puedes contactar al responsable de Hojita de vida 💕.',
          'Correo de contacto sugerido: maeskiros@gmail.com',
          'Tambien puedes abrir un issue en el repositorio oficial del proyecto en GitHub.',
          'Se intentara responder en tiempos razonables segun disponibilidad.',
        ],
      },
    }

    const content = legalContent[page]
    return (
      <main className="legal-shell">
        <article className="legal-card">
          <h1>{content.title}</h1>
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="legal-actions">
            <a href="/">Volver a Hojita de vida 💕</a>
          </div>
        </article>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className="form-column">
        <div className="form-steps-shell">
          <nav className="form-steps-nav form-dock" aria-label="Pasos del formulario">
            {formSteps.map((step, index) => {
              const stateClass = index === activeStep ? 'is-active' : index < activeStep ? 'is-done' : ''
              return (
                <button
                  key={step.key}
                  type="button"
                  className={`step-item ${stateClass}`.trim()}
                  onClick={() => setActiveStep(index)}
                >
                  <span className="step-index">{index < activeStep ? '✓' : index + 1}</span>
                  <span className="step-text sr-only">
                    <strong>{step.title}</strong>
                    <small>{step.hint}</small>
                  </span>
                  <span className="step-tooltip" role="tooltip">
                    {step.title}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="step-panel">
            <div className="step-progress-wrap" aria-hidden="true">
              <div className="step-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="step-current-meta">
              <p>{formSteps[activeStep].title}</p>
              <span>
                {activeStep + 1}/{formSteps.length}
              </span>
            </div>

            <div key={activeStep} className="step-content-anim">
            {activeStep === 0 && (
              <section className="form-section">
                <h3>Perfil</h3>
                <label>
                  Nombre completo
                  <input
                    value={data.fullName}
                    onChange={(event) => updateBasicField('fullName', event.target.value)}
                  />
                </label>
                <label>
                  Cargo
                  <input
                    value={data.role}
                    onChange={(event) => updateBasicField('role', event.target.value)}
                  />
                </label>
                <label>
                  Correo
                  <input
                    value={data.email}
                    onChange={(event) => updateBasicField('email', event.target.value)}
                  />
                </label>
                <label>
                  Telefono
                  <input
                    value={data.phone}
                    onChange={(event) => updateBasicField('phone', event.target.value)}
                  />
                </label>
                <label>
                  Ubicacion
                  <input
                    value={data.location}
                    onChange={(event) => updateBasicField('location', event.target.value)}
                  />
                </label>
                <label>
                  Link
                  <input
                    value={data.website}
                    onChange={(event) => updateBasicField('website', event.target.value)}
                  />
                </label>
                <label>
                  Resumen profesional
                  <textarea
                    rows={3}
                    value={data.summary}
                    onChange={(event) => updateBasicField('summary', event.target.value)}
                  />
                </label>
              </section>
            )}

            {activeStep === 1 && (
              <section className="form-section">
                <div className="section-title">
                  <h3>Experiencia</h3>
                </div>

                {data.experience.map((company) => (
                  <div className="group-card" key={company.id}>
                    <button
                      type="button"
                      className="company-delete-btn"
                      aria-label="Eliminar empresa"
                      title="Eliminar empresa"
                      onClick={() => removeExperienceCompany(company.id)}
                    >
                      <img src={deleteIcon} alt="Eliminar" className="icon-btn-img" />
                    </button>
                    <label>
                      Empresa
                      <input
                        value={company.companyName}
                        onChange={(event) =>
                          updateExperienceCompany(company.id, 'companyName', event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Texto logo (iniciales)
                      <input
                        placeholder="NTT"
                        value={company.companyLogoText}
                        onChange={(event) =>
                          updateExperienceCompany(company.id, 'companyLogoText', event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Jornada y duracion
                      <input
                        placeholder="Jornada completa - 5 anos 2 meses"
                        value={company.employmentMeta}
                        onChange={(event) =>
                          updateExperienceCompany(company.id, 'employmentMeta', event.target.value)
                        }
                      />
                    </label>

                    <div className="section-title project-title-row">
                      <h4>Proyectos / Roles</h4>
                      <button
                        type="button"
                        className="btn-add-role"
                        onClick={() => addExperienceProject(company.id)}
                        aria-label="Agregar item hijo"
                        title="Agregar item hijo"
                      >
                        <img src={addIcon} alt="Agregar" className="icon-btn-img" />
                      </button>
                    </div>

                    <div className="projects-list-indent">
                      {company.projects.map((project) => {
                        const projectKey = `${company.id}-${project.id}`
                        const isCollapsed = Boolean(collapsedProjects[projectKey])

                        return (
                          <div className={`nested-card ${isCollapsed ? 'collapsed' : ''}`} key={project.id}>
                            <button
                              type="button"
                              className="project-delete-btn"
                              aria-label="Eliminar item hijo"
                              title="Eliminar item hijo"
                              onClick={() => removeExperienceProject(company.id, project.id)}
                            >
                              <img src={deleteIcon} alt="Eliminar" className="icon-btn-img" />
                            </button>

                            <button
                              type="button"
                              className={`project-collapse-btn ${isCollapsed ? 'is-collapsed' : ''}`}
                              onClick={() => toggleProjectCollapsed(company.id, project.id)}
                              aria-label={isCollapsed ? 'Expandir item hijo' : 'Colapsar item hijo'}
                              title={isCollapsed ? 'Expandir item hijo' : 'Colapsar item hijo'}
                            >
                              <img
                                src={isCollapsed ? expandIcon : collapseIcon}
                                alt={isCollapsed ? 'Expandir' : 'Colapsar'}
                                className="icon-btn-img"
                              />
                            </button>

                            <p className="project-summary-title">
                              {project.title || 'Proyecto / Rol sin titulo'}
                            </p>

                            <div className={`project-fields ${isCollapsed ? 'is-collapsed' : ''}`}>
                              <div className="project-fields-inner">
                                <label>
                                  Titulo
                                  <input
                                    value={project.title}
                                    onChange={(event) =>
                                      updateExperienceProject(
                                        company.id,
                                        project.id,
                                        'title',
                                        event.target.value,
                                      )
                                    }
                                  />
                                </label>
                                <label>
                                  Inicio - Fin (texto libre)
                                  <input
                                    placeholder="2020 - 2023"
                                    value={project.period}
                                    onChange={(event) =>
                                      updateExperienceProject(
                                        company.id,
                                        project.id,
                                        'period',
                                        event.target.value,
                                      )
                                    }
                                  />
                                </label>

                                <div>
                                  <p className="label-title">Modalidad</p>
                                  <div className="checkbox-row">
                                    {modeOptions.map((option) => (
                                      <label className="checkbox-option" key={option}>
                                        <input
                                          type="checkbox"
                                          checked={project.mode === option}
                                          onChange={() =>
                                            updateExperienceProject(company.id, project.id, 'mode', option)
                                          }
                                        />
                                        {option}
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <label>
                                  Descripcion
                                  <textarea
                                    rows={3}
                                    value={project.description}
                                    onChange={(event) =>
                                      updateExperienceProject(
                                        company.id,
                                        project.id,
                                        'description',
                                        event.target.value,
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-company-fab"
                  aria-label="Agregar empresa"
                  title="Agregar empresa"
                  onClick={addExperienceCompany}
                >
                  +
                </button>
              </section>
            )}

            {activeStep === 2 && (
              <section className="form-section">
                <div className="section-title">
                  <h4>Educacion</h4>
                  <button
                    type="button"
                    className="btn-add-role"
                    aria-label="Agregar educacion"
                    title="Agregar educacion"
                    onClick={addEducation}
                  >
                    +
                  </button>
                </div>

                {data.education.map((item) => (
                  <div className="group-card" key={item.id}>
                    <button
                      type="button"
                      className="company-delete-btn"
                      onClick={() => removeEducation(item.id)}
                    >
                      <img src={deleteIcon} alt="Eliminar" className="icon-btn-img" />
                    </button>
                    <label>
                      Institucion
                      <input
                        value={item.institution}
                        onChange={(event) => updateEducation(item.id, 'institution', event.target.value)}
                      />
                    </label>
                    <label>
                      Titulo/Carrera
                      <input
                        value={item.degree}
                        onChange={(event) => updateEducation(item.id, 'degree', event.target.value)}
                      />
                    </label>
                    <label>
                      Periodo
                      <input
                        value={item.period}
                        onChange={(event) => updateEducation(item.id, 'period', event.target.value)}
                      />
                    </label>
                    <label>
                      Descripcion
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(event) => updateEducation(item.id, 'description', event.target.value)}
                      />
                    </label>
                  </div>
                ))}
              </section>
            )}
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="secondary-btn step-nav-btn"
                onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
                disabled={isFirstStep}
              >
                Anterior
              </button>
              <button
                type="button"
                className="print-btn step-nav-btn"
                onClick={() => setActiveStep((step) => Math.min(formSteps.length - 1, step + 1))}
                disabled={isLastStep}
              >
                {isLastStep ? 'Completado' : 'Siguiente'}
              </button>
            </div>

            {adsenseClient && adsenseSlot && (
              <section className="form-section ad-form-section">
                <h4>Patrocinado</h4>
                <ins
                  ref={adSlotRef}
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client={adsenseClient}
                  data-ad-slot={adsenseSlot}
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </section>
            )}
          </div>
        </div>
      </aside>

      <section className="preview-column">
        <header className="top-bar">
          <h1>Hoja de vida, resume cv gratis online sin registro</h1>
          <div className="top-actions">
            <div className="print-mode-toggle" role="group" aria-label="Modo de impresion">
              <button
                type="button"
                className={`print-mode-btn ${printMode === 'ats' ? 'active' : ''}`}
                onClick={() => setPrintMode('ats')}
              >
                ATS
              </button>
              <button
                type="button"
                className={`print-mode-btn ${printMode === 'visual' ? 'active' : ''}`}
                onClick={() => setPrintMode('visual')}
              >
                Visual
              </button>
            </div>
            <button className="print-btn" onClick={printResume}>
              {printMode === 'ats' ? 'Imprimir ATS (Ctrl+P)' : 'Imprimir Visual (Ctrl+P)'}
            </button>
            <button className="download-btn" onClick={downloadPdf} disabled={isExporting}>
              {isExporting ? 'Generando PDF...' : 'PDF Imagen'}
            </button>
          </div>
        </header>

        <article className="resume-preview" ref={resumeRef}>
          <header className="resume-header resume-header-calibrated">
            <h2 className="header-name">{data.fullName || 'Tu Nombre'}</h2>
            <p className="header-contact-line">
              <span>{data.email || 'correo@ejemplo.com'}</span>
              <span className="contact-separator">-</span>
              <span>{data.phone || '+00 0000-0000'}</span>
              <span className="contact-separator">-</span>
              <span>{data.website || 'linkedin.com/in/tu-perfil'}</span>
            </p>
            <div className="header-divider" />
            <p className="summary profile-summary">
              {data.summary || 'Agrega un resumen profesional.'}
            </p>
          </header>

          <section className="resume-section resume-section-experience">
            <h4>Experiencia</h4>
            {data.experience.length === 0 && <p className="empty-text">Sin experiencia agregada.</p>}
            {data.experience.map((company) => (
              <article className="exp-company-block" key={company.id}>
                <div className="exp-company-head">
                  <div className="exp-company-logo">{company.companyLogoText || 'LOGO'}</div>
                  <div className="exp-company-meta">
                    <h5>{company.companyName || 'Nombre de empresa'}</h5>
                    <p>{company.employmentMeta || 'Jornada completa - 0 anos'}</p>
                  </div>
                </div>

                <div className="exp-project-list">
                  {company.projects.length === 0 && (
                    <p className="empty-text">Sin proyectos registrados.</p>
                  )}
                  {company.projects.map((project) => (
                    <article className="exp-project-item" key={project.id}>
                      <div className="exp-project-bullet" />
                      <div className="exp-project-content">
                        <h6>{project.title || 'Titulo del proyecto/rol'}</h6>
                        <p className="exp-project-period">
                          {project.period || 'Periodo'}
                          <span> - </span>
                          {project.mode || 'Modalidad'}
                        </p>
                        <p>{project.description || 'Agrega una descripcion del trabajo realizado.'}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="resume-section resume-section-education">
            <h4>Educacion</h4>
            {data.education.length === 0 && <p className="empty-text">Sin educacion agregada.</p>}
            {data.education.map((item) => (
              <article className="item-card" key={item.id}>
                <div className="item-row">
                  <aside className="period-col">{item.period || 'Periodo'}</aside>
                  <div className="content-col">
                    <div className="item-heading">
                      <h5>{item.institution || 'Institucion'}</h5>
                    </div>
                    <p className="item-mode">{item.degree || 'Titulo/Carrera'}</p>
                    <p>{item.description || 'Agrega una descripcion breve.'}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </article>
      </section>

      <footer className="legal-footer">
        <a href="/privacy" data-tip="Privacidad">
          Privacidad
        </a>
        <a href="/terms" data-tip="Terminos">
          Terminos
        </a>
        <a href="/contact" data-tip="Contacto">
          Contacto
        </a>
      </footer>
    </main>
  )
}

export default App
