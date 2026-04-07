export type Guia = {
  slug: string
  titulo: string
  descripcion: string
  fechaPublicacion: string
  contenido: string
}

export const guias: Guia[] = [
  {
    slug: 'que-es-un-ats',
    titulo: '¿Qué es un sistema ATS y por qué importa?',
    descripcion:
      'Descubre cómo los sistemas de seguimiento de candidatos filtran hojas de vida antes de que un humano las lea.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
  {
    slug: 'como-pasar-filtro-ats',
    titulo: 'Cómo pasar el filtro ATS con tu hoja de vida',
    descripcion:
      'Aprende a optimizar tu hoja de vida para que los sistemas ATS la detecten y clasifiquen correctamente.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
  {
    slug: 'errores-hoja-de-vida-colombia',
    titulo: 'Errores comunes en hojas de vida colombianas',
    descripcion:
      'Los errores más frecuentes que cometen los candidatos en Colombia al redactar su hoja de vida.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
  {
    slug: 'diferencias-cv-hoja-de-vida-resume',
    titulo: 'Diferencias entre CV, hoja de vida y resume',
    descripcion:
      '¿Cuál usar según el país y el tipo de trabajo? Entiende las diferencias clave entre estos tres documentos.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
  {
    slug: 'como-describir-experiencia-laboral',
    titulo: 'Cómo describir experiencia laboral con impacto',
    descripcion:
      'Técnicas para redactar logros y responsabilidades que llamen la atención de reclutadores.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
  {
    slug: 'hoja-de-vida-primer-empleo',
    titulo: 'Hoja de vida para primer empleo sin experiencia',
    descripcion:
      'Estrategias para construir una hoja de vida sólida cuando no tienes experiencia laboral formal.',
    fechaPublicacion: '2026-04-06',
    contenido: '',
  },
]

export function getGuiaBySlug(slug: string): Guia | undefined {
  return guias.find((g) => g.slug === slug)
}
