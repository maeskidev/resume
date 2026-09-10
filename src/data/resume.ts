export type EducationItem = {
  id: number
  degree: string
  institution: string
  period: string
}

export type ExperienceItem = {
  id: number
  title: string
  period: string
  company: string
  description: string
  highlights: string
}

export type TemplateId = 'design' | 'linkedin' | 'portfolio'

export type ResumeData = {
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

export const initialResumeData: ResumeData = {
  fullName: 'MICHAEL QUIROS',
  role: 'UX DESIGNER',
  email: 'maeskiros@gmail.com',
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
  ],
}

export const splitList = (value: string) =>
  value.split(',').map((item) => item.trim()).filter(Boolean)

export const splitLines = (value: string) =>
  value.split('\n').map((item) => item.trim()).filter(Boolean)

export const getInitials = (fullName: string) =>
  fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'CV'
