import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BottomNavigation, StatusBar, TopBar } from './ui'

type AppShellProps = {
  children: ReactNode
  tone?: 'light' | 'forest' | 'sun' | 'lavender' | 'info' | 'lime'
  topBar?: boolean
  statusBar?: boolean
  bottomNav?: boolean
  businessSidebar?: boolean
  padded?: boolean
  className?: string
}

export function AppShell({
  children,
  tone = 'light',
  topBar = false,
  statusBar = true,
  bottomNav = false,
  businessSidebar = true,
  padded = true,
  className = '',
}: AppShellProps) {
  const inverse = tone === 'forest'
  const { pathname } = useLocation()
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia('(min-width: 900px)').matches)
  const business = pathname.startsWith('/business')
  const showBusinessSidebar = business && businessSidebar

  useEffect(() => {
    if (!('matchMedia' in window)) return
    const query = window.matchMedia('(min-width: 900px)')
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const panel = (
    <section className={`${desktop ? 'platform-panel' : 'phone-shell'} phone-shell--${tone} ${className}`}>
      {statusBar && !desktop && <StatusBar inverse={inverse} />}
      {topBar && !desktop && <TopBar inverse={inverse} />}
      <div className={`screen-content${padded ? ' screen-content--padded' : ''}${bottomNav && !desktop ? ' screen-content--with-nav' : ''}`}>
        {children}
      </div>
      {bottomNav && !desktop && <BottomNavigation />}
    </section>
  )

  return (
    <main className={`prototype-stage${desktop ? ` prototype-stage--platform prototype-stage--${business ? 'business' : 'client'}` : ''}`}>
      {desktop ? (
        <div className={`platform-layout platform-layout--${business ? 'business' : 'client'}${business && !businessSidebar ? ' platform-layout--business-public' : ''}`}>
          {showBusinessSidebar ? <BusinessPlatformSidebar pathname={pathname} /> : business ? null : <ClientPlatformHeader pathname={pathname} />}
          {panel}
        </div>
      ) : panel}
    </main>
  )
}

function ClientPlatformHeader({ pathname }: { pathname: string }) {
  const links = [
    ['/client/home', 'Accueil'],
    ['/client/discover', 'Découvrir'],
    ['/client/map', 'Carte'],
    ['/client/challenges', 'Challenges'],
    ['/client/rewards', 'Récompenses'],
    ['/client/profile', 'Profil'],
  ] as const
  return (
    <header className="platform-client-header">
      <Link to="/client/home" className="wordmark" aria-label="Referio, accueil"><span className="wordmark__dot" /><span className="wordmark__accent" />referio.</Link>
      <nav aria-label="Navigation plateforme Client">{links.map(([to, label]) => <Link className={pathname === to ? 'is-active' : ''} to={to} key={to}>{label}</Link>)}</nav>
      <div className="platform-client-tools">
        <Link className="platform-experience-switch" to="/business/dashboard">Espace PME</Link>
        <Link to="/client/search" aria-label="Rechercher"><img src={`${import.meta.env.BASE_URL}assets/figma/icon-search.svg`} alt="" /></Link>
        <Link to="/client/notifications" aria-label="Notifications"><img src={`${import.meta.env.BASE_URL}assets/figma/nav-notifications.png`} alt="" /></Link>
        <Link to="/client/profile" aria-label="Profil de Lana"><img src={`${import.meta.env.BASE_URL}assets/figma/profile-avatar.png`} alt="" /></Link>
      </div>
    </header>
  )
}

function BusinessPlatformSidebar({ pathname }: { pathname: string }) {
  const primaryLinks = [
    ['/business/dashboard', 'Tableau de bord'],
    ['/business/profile', 'Ma fiche'],
    ['/business/visibility', 'Visibilité'],
    ['/business/publish', 'Publier'],
    ['/business/reviews', 'Avis'],
    ['/business/stats', 'Statistiques'],
    ['/business/subscription', 'Abonnement'],
  ] as const
  const secondaryLinks = [
    ['/business/qr', 'QR de visite'],
    ['/business/team', 'Équipe'],
    ['/business/integrations', 'Intégrations'],
    ['/business/security', 'Sécurité'],
  ] as const
  return (
    <aside className="platform-business-sidebar">
      <Link to="/business/dashboard" className="wordmark"><span className="wordmark__dot" /><span className="wordmark__accent" />referio.</Link>
      <div className="platform-business-account"><span>CAFÉ CENTRAL</span><strong>Espace Business</strong></div>
      <nav className="platform-business-primary" aria-label="Navigation principale Business">{primaryLinks.map(([to, label]) => <Link className={pathname === to ? 'is-active' : ''} to={to} key={to}>{label}</Link>)}</nav>
      <nav className="platform-business-secondary" aria-label="Outils Business">{secondaryLinks.map(([to, label]) => <Link className={pathname === to ? 'is-active' : ''} to={to} key={to}>{label}</Link>)}</nav>
      <div className="platform-business-footer">
        <Link className="platform-sidebar-support" to="/business/support">Aide & support</Link>
        <Link className="platform-experience-switch platform-experience-switch--inverse" to="/client/home">Voir l’expérience Client</Link>
      </div>
    </aside>
  )
}

export function DesktopShell({ children, area = 'admin' }: { children: ReactNode; area?: 'admin' | 'business' | 'client' }) {
  return <main className={`desktop-shell desktop-shell--${area}`}>{children}</main>
}
