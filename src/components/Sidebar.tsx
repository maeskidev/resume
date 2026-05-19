type SidebarProps = {
  isExpanded: boolean
  onToggle: () => void
  currentPath: string
}

const navItems = [
  {
    href: '/',
    label: 'Inicio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    href: '/guias',
    label: 'Guías',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: '/',
    label: 'Crear',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
]

const legalItems = [
  { href: '/privacy', label: 'Privacidad' },
  { href: '/terms', label: 'Términos' },
  { href: '/contact', label: 'Contacto' },
]

export function Sidebar({ isExpanded, onToggle, currentPath }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${isExpanded ? 'sidebar--expanded' : 'sidebar--collapsed'}`}
      aria-label="Navegación principal"
    >
      <button
        className="sidebar-toggle"
        type="button"
        onClick={onToggle}
        aria-label={isExpanded ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isExpanded}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? currentPath === '/'
              : currentPath === item.href || currentPath.startsWith(item.href + '/')
          return (
            <a
              key={item.label}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={!isExpanded ? item.label : undefined}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </a>
          )
        })}
      </nav>

      <div className="sidebar-legal">
        {legalItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="sidebar-legal-link"
            title={item.label}
          >
            <span className="sidebar-legal-label">{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}
