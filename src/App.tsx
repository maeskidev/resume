import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
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

const modeOptions: ExperienceMode[] = ['Presencial', 'Remoto', 'Hibrido']
const RESUME_STORAGE_KEY = 'resume-maker-data-v1'

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
  const resumeRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [data, setData] = useState<ResumeData>(getInitialResumeData)

  useEffect(() => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
  }, [data])

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

  return (
    <main className="app-shell">
      <aside className="form-column">
        <h2>Formulario</h2>

        <section className="form-section">
          <h3>Header</h3>
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

        <section className="form-section">
          <div className="section-title">
            <h3>Experiencia</h3>
            <button type="button" className="secondary-btn" onClick={addExperienceCompany}>
              + Agregar empresa
            </button>
          </div>

          {data.experience.map((company) => (
            <div className="group-card" key={company.id}>
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
                  className="secondary-btn"
                  onClick={() => addExperienceProject(company.id)}
                >
                  + Agregar item hijo
                </button>
              </div>

              {company.projects.map((project) => (
                <div className="nested-card" key={project.id}>
                  <label>
                    Titulo
                    <input
                      value={project.title}
                      onChange={(event) =>
                        updateExperienceProject(company.id, project.id, 'title', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Inicio - Fin (texto libre)
                    <input
                      placeholder="2020 - 2023"
                      value={project.period}
                      onChange={(event) =>
                        updateExperienceProject(company.id, project.id, 'period', event.target.value)
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

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => removeExperienceProject(company.id, project.id)}
                  >
                    Eliminar item hijo
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="danger-btn"
                onClick={() => removeExperienceCompany(company.id)}
              >
                Eliminar empresa
              </button>
            </div>
          ))}
        </section>

        <section className="form-section">
          <div className="section-title">
            <h3>Educacion</h3>
            <button type="button" className="secondary-btn" onClick={addEducation}>
              + Agregar item
            </button>
          </div>

          {data.education.map((item) => (
            <div className="group-card" key={item.id}>
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

              <button
                type="button"
                className="danger-btn"
                onClick={() => removeEducation(item.id)}
              >
                Eliminar item
              </button>
            </div>
          ))}
        </section>
      </aside>

      <section className="preview-column">
        <header className="top-bar">
          <h1>CV Maker</h1>
          <button className="download-btn" onClick={downloadPdf} disabled={isExporting}>
            {isExporting ? 'Generando PDF...' : 'Descargar en PDF'}
          </button>
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
    </main>
  )
}

export default App
