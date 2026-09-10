import { initialResumeData, type ResumeData, type TemplateId } from './resume'

type SharedResumePayload = {
  template: TemplateId
  data: ResumeData
}

const isTemplateId = (value: unknown): value is TemplateId =>
  value === 'design' || value === 'linkedin' || value === 'portfolio'

const encodeBase64Url = (value: string) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

const decodeBase64Url = (value: string) => {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddedValue = normalizedValue.padEnd(Math.ceil(normalizedValue.length / 4) * 4, '=')
  const binary = atob(paddedValue)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

export const createSharedResumeUrl = (data: ResumeData, template: TemplateId) => {
  const payload: SharedResumePayload = { data, template }
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const url = new URL('/preview', window.location.origin)

  url.searchParams.set('data', encodedPayload)
  return url.toString()
}

export const getSharedResumePayload = (search: string): SharedResumePayload | null => {
  try {
    const encodedPayload = new URLSearchParams(search).get('data')
    if (!encodedPayload) return null

    const parsedPayload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<SharedResumePayload>
    if (
      !parsedPayload.data ||
      !isTemplateId(parsedPayload.template) ||
      !Array.isArray(parsedPayload.data.education) ||
      !Array.isArray(parsedPayload.data.experience)
    ) {
      return null
    }

    return {
      template: parsedPayload.template,
      data: {
        ...initialResumeData,
        ...parsedPayload.data,
        education: parsedPayload.data.education,
        experience: parsedPayload.data.experience,
      },
    }
  } catch {
    return null
  }
}
