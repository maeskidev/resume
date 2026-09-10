import type { Ref } from 'react'
import { getInitials, splitLines, splitList, type ResumeData, type TemplateId } from '../data/resume'

type ResumeDocumentProps = {
  data: ResumeData
  template: TemplateId
  documentRef?: Ref<HTMLElement>
}

export function ResumeDocument({ data, template, documentRef }: ResumeDocumentProps) {
  const initials = getInitials(data.fullName)
  const contacts = [data.email, data.phone, data.location, data.website].filter(Boolean)

  if (template === 'design') {
    return (
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
              {contacts.map((contact) => <li key={contact}>{contact}</li>)}
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
                    <div className="premium-job-line"><h3>{item.title || 'CARGO'}</h3><time>{item.period || 'Año - Año'}</time></div>
                    <h4>{item.company || 'EMPRESA'}</h4>
                    <p>{item.description || 'Describe tu experiencia.'}</p>
                    {splitLines(item.highlights).length > 0 && <ul>{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </article>
    )
  }

  if (template === 'linkedin') {
    return (
      <article className="resume-preview unified-document" ref={documentRef}>
        <header className="resume-header resume-header-calibrated">
          <h2 className="header-name">{data.fullName || 'Tu Nombre'}</h2>
          <p className="header-contact-line">
            {contacts.map((contact, index) => <span key={contact}>{index > 0 && <span className="contact-separator"> · </span>}{contact}</span>)}
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
                <div className="exp-company-meta"><h5>{item.company || 'Nombre de empresa'}</h5><p>{item.period || 'Periodo'}</p></div>
              </div>
              <div className="exp-project-list">
                <article className="exp-project-item">
                  <div className="exp-project-bullet" />
                  <div className="exp-project-content">
                    <h6>{item.title || 'Cargo'}</h6>
                    <p>{item.description || 'Agrega una descripción del trabajo realizado.'}</p>
                    {splitLines(item.highlights).length > 0 && <ul>{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
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
                <div className="content-col"><div className="item-heading"><h5>{item.institution || 'Institución'}</h5></div><p className="item-mode">{item.degree || 'Título/Carrera'}</p></div>
              </div>
            </article>
          ))}
        </section>
        <section className="resume-section unified-skills-section"><h4>Habilidades</h4><p className="summary">{splitList(data.skills).join(' · ')}</p></section>
      </article>
    )
  }

  return (
    <article className="resume-preview resume-portfolio unified-document" ref={documentRef}>
      <aside className="pf-sidebar">
        <div className="pf-sidebar-name"><h2>{data.fullName || 'Tu Nombre'}</h2><p className="pf-role">{data.role || 'Tu Cargo'}</p></div>
        <div className="pf-sidebar-block"><h3 className="pf-sidebar-heading">Contacto</h3><ul className="pf-contact-list">{contacts.map((contact) => <li key={contact}>{contact}</li>)}</ul></div>
        <div className="pf-sidebar-block"><h3 className="pf-sidebar-heading">Perfil</h3><p className="pf-summary">{data.profile || 'Agrega un resumen profesional.'}</p></div>
        <div className="pf-sidebar-block"><h3 className="pf-sidebar-heading">Habilidades</h3><ul className="pf-contact-list">{splitList(data.skills).map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        <div className="pf-sidebar-block">
          <h3 className="pf-sidebar-heading">Educación</h3>
          {data.education.map((item) => <div className="pf-edu-item" key={item.id}><p className="pf-edu-degree">{item.degree || 'Título/Carrera'}</p><p className="pf-edu-institution">{item.institution || 'Institución'}</p><p className="pf-edu-period">{item.period || 'Periodo'}</p></div>)}
        </div>
      </aside>
      <div className="pf-main">
        <section className="pf-section">
          <h3 className="pf-section-title">Experiencia</h3>
          {data.experience.map((item) => (
            <div className="pf-company" key={item.id}>
              <div className="pf-company-head"><div className="pf-company-logo">{getInitials(item.company || 'Empresa')}</div><div><p className="pf-company-name">{item.company || 'Nombre de empresa'}</p><p className="pf-company-meta">{item.period || 'Periodo'}</p></div></div>
              <div className="pf-projects"><div className="pf-project-item"><div className="pf-project-dot" /><div className="pf-project-body"><p className="pf-project-title">{item.title || 'Cargo'}</p><p className="pf-project-desc">{item.description || 'Agrega una descripción.'}</p>{splitLines(item.highlights).length > 0 && <ul className="pf-highlights">{splitLines(item.highlights).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}</div></div></div>
            </div>
          ))}
        </section>
      </div>
    </article>
  )
}
