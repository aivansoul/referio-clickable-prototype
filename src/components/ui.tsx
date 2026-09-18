import { motion, type HTMLMotionProps, useReducedMotion } from 'motion/react'
import type { ChangeEvent, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Merchant } from '../data/demo'
import { motionTransition } from '../motion'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

const iconFiles = {
  search: 'icon-search.svg',
  close: 'icon-close.svg',
  check: 'icon-check.svg',
  chevronRight: 'icon-chevron-right.svg',
  mapPin: 'icon-map-pin.svg',
  scan: 'icon-scan.svg',
  star: 'icon-star.svg',
  heart: 'icon-heart.svg',
  settings: 'icon-settings.svg',
} as const

export type IconName = keyof typeof iconFiles

export function Icon({ name, label, className = '' }: { name: IconName; label?: string; className?: string }) {
  return <img className={`figma-icon ${className}`} src={asset(iconFiles[name])} alt={label ?? ''} aria-hidden={label ? undefined : true} />
}

export function Badge({ variant, children }: { variant: 'reward' | 'verified' | 'new' | 'level'; children?: ReactNode }) {
  const defaults = { reward: '+50 points locaux', verified: 'Visite vérifiée', new: 'Nouveau', level: 'Local Hero' }
  return <span className={`figma-badge figma-badge--${variant}`}>{variant === 'verified' && <Icon name="check" />}{children ?? defaults[variant]}</span>
}

const stampFiles = {
  curieux: ['stamp-curieux.png', 'Curieux'],
  explorateur: ['stamp-explorateur.png', 'Explorateur'],
  insider: ['stamp-insider.png', 'Insider'],
  localHero: ['stamp-local-hero.png', 'Local Hero'],
  legendeLocale: ['stamp-legende-locale.png', 'Légende locale'],
  premiereVisite: ['stamp-premiere-visite.png', 'Première visite'],
  avisVerifie: ['stamp-avis-verifie.png', 'Avis vérifié'],
  serieLocale: ['stamp-serie-locale.png', 'Série locale'],
  ambassadeur: ['stamp-ambassadeur.png', 'Ambassadeur'],
  fideliteComplete: ['stamp-fidelite-complete.png', 'Fidélité complète'],
} as const

export type StampName = keyof typeof stampFiles

export function StampBadge({ name, locked = false }: { name: StampName; locked?: boolean }) {
  const [file, label] = stampFiles[name]
  return <figure className={`stamp-badge${locked ? ' is-locked' : ''}`}><img src={asset(file)} alt={`Timbre ${label}`} /><figcaption>{label}</figcaption></figure>
}

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  full?: boolean
}

export function Button({ variant = 'primary', full, className = '', children, ...props }: ButtonProps) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={reduced ? { duration: 0 } : motionTransition.fast}
      className={`button button--${variant}${full ? ' button--full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Chip({ active, tone, children, onClick }: { active?: boolean; tone?: 'new'; children: ReactNode; onClick?: () => void }) {
  const className = `chip${active ? ' chip--active' : ''}${tone === 'new' ? ' chip--new' : ''}`
  return onClick
    ? <button className={className} onClick={onClick} type="button" aria-pressed={active}>{children}</button>
    : <span className={className}>{children}</span>
}

export function StatusBar({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`status-bar${inverse ? ' status-bar--inverse' : ''}`} aria-hidden="true">
      <span>9:41</span>
      <span>●&nbsp;&nbsp;▮▮▮</span>
    </div>
  )
}

export function TopBar({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`top-bar${inverse ? ' top-bar--inverse' : ''}`}>
      <Link to="/client/home" className="wordmark" aria-label="Referio, accueil">
        <img className="wordmark__main" src={asset('topbar-logo-main.svg')} alt="" />
        <img className="wordmark__accent-image" src={asset('topbar-logo-accent.svg')} alt="" />
        referio.
      </Link>
      <div className="top-bar__actions">
        <Link to="/client/search" aria-label="Rechercher"><Icon name="search" /></Link>
        <Link to="/client/notifications" aria-label="Ouvrir les notifications"><img src={asset('nav-notifications.png')} alt="" /></Link>
      </div>
    </header>
  )
}

const navItems = [
  { label: 'Accueil', to: '/client/home', key: 'home', icon: 'nav-home.png' },
  { label: 'Carte', to: '/client/map', key: 'map', icon: 'nav-map.png' },
  { label: 'Découvrir', to: '/client/discover', key: 'discover', icon: 'nav-discover.png' },
  { label: 'Classement', to: '/client/ranking', key: 'ranking', icon: 'nav-ranking.png' },
  { label: 'Profil', to: '/client/profile', key: 'profile', icon: 'nav-profile.png' },
] as const

export function BottomNavigation() {
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {navItems.map((item) => {
        const active = pathname === item.to || (item.key === 'discover' && pathname === '/client/daily')
        return (
          <Link
            key={item.key}
            to={item.to}
            className={`bottom-nav__item${item.key === 'discover' ? ' bottom-nav__item--discover' : ''}${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.key === 'discover' ? (
              <img className="bottom-nav__discover" src={asset(item.icon)} alt="" />
            ) : (
              <img className="bottom-nav__icon" src={asset(item.icon)} alt="" />
            )}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function PageTitle({ eyebrow, title, body, inverse = false }: { eyebrow?: string; title: string; body?: string; inverse?: boolean }) {
  return (
    <div className={`page-title${inverse ? ' page-title--inverse' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {body && <p className="page-title__body">{body}</p>}
    </div>
  )
}

export function PointsCard({ points, level = 'Local Hero' }: { points: number; level?: string }) {
  const reduced = useReducedMotion()
  const nextLevel = 1720
  const levelFloor = 345
  const progress = Math.max(0, Math.min(100, Math.round(((points - levelFloor) / (nextLevel - levelFloor)) * 100)))
  return (
    <Link to="/client/points" className="points-card">
      <strong>{points.toLocaleString('fr-BE')} points locaux · {level}</strong>
      <div className="progress" aria-label={`${progress} % vers le niveau suivant`}>
        <motion.span initial={false} animate={{ width: `${progress}%` }} transition={reduced ? { duration: 0 } : motionTransition.slow} />
      </div>
      <small>{level === 'Légende locale' ? 'Niveau maximum atteint' : `Encore ${Math.max(0, nextLevel - points)} points pour devenir Légende locale`}</small>
    </Link>
  )
}

export function MerchantCard({ merchant, compact = false }: { merchant: Merchant; compact?: boolean }) {
  return (
    <Link className={`merchant-card${compact ? ' merchant-card--compact' : ''}`} to={`/client/merchant/${merchant.id}`}>
      <img src={merchant.image} alt={`Devanture de ${merchant.name}`} />
      <div className="merchant-card__body">
        <div className="merchant-card__topline">
          <h3>{merchant.name}</h3>
          <span className="merchant-card__verified" aria-label="Commerce vérifié"><Icon name="check" /></span>
        </div>
        <p>{merchant.category} · {merchant.distance} · {merchant.district}</p>
        {!compact && <div className="merchant-card__social"><span className="merchant-card__avatars"><img src={`${import.meta.env.BASE_URL}assets/figma/rank-2.png`} alt="" /><img src={`${import.meta.env.BASE_URL}assets/figma/review-avatar.png`} alt="" /><img src={`${import.meta.env.BASE_URL}assets/figma/rank-3.png`} alt="" /><b>+15</b></span><span>Recommandé par {merchant.recommendedBy} personnes</span></div>}
        <div className="merchant-card__footer"><span className="rating"><Icon name="star" /> {merchant.rating.toFixed(1).replace('.', ',')} ({merchant.reviews})</span>{compact ? <span className="social-proof">Recommandé par {merchant.recommendedBy}</span> : <span className="merchant-card__cta">Découvrir</span>}</div>
      </div>
    </Link>
  )
}

export function PassportCard({ stamps = 4, merchant = 'Café Moka' }: { stamps?: number; merchant?: string }) {
  const circles = Array.from({ length: 6 })
  return (
    <div className="passport-card">
      <h3>{merchant}</h3>
      <strong>{stamps} / 6 tampons</strong>
      <div className="stamp-row" aria-label={`${stamps} tampons sur 6`}>
        {stamps === 4 ? <img src={asset('stamps.svg')} alt="Quatre tampons obtenus sur six" /> : circles.map((_, index) => <span key={index} className={index < stamps ? 'is-earned' : ''} />)}
      </div>
      <p>{stamps >= 6 ? 'Ta prochaine récompense est prête.' : `Encore ${6 - stamps} visite${6 - stamps > 1 ? 's' : ''} avant ta boisson offerte`}</p>
    </div>
  )
}

export function StateCard({ tone = 'success', label, title, body }: { tone?: 'success' | 'error' | 'info'; label: string; title: string; body: string }) {
  return (
    <div className={`state-card state-card--${tone}`} role="status">
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  )
}

export function SectionHeading({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action && to && <Link to={to}>{action}</Link>}
    </div>
  )
}

export function Field({ label, value, placeholder, helper, multiline = false, onChange }: { label: string; value?: string; placeholder?: string; helper?: string; multiline?: boolean; onChange?: (value: string) => void }) {
  const common = {
    value,
    placeholder,
    readOnly: !onChange,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(event.target.value),
  }
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? <textarea rows={5} {...common} /> : <input {...common} />}
      {helper && <small>{helper}</small>}
    </label>
  )
}

export function ListRow({ title, subtitle, to }: { title: string; subtitle: string; to?: string }) {
  const content = (
    <>
      <strong>{title}</strong>
      <span>{subtitle}</span>
      {to && <Icon name="chevronRight" />}
    </>
  )
  return to ? <Link className="list-row" to={to}>{content}</Link> : <div className="list-row">{content}</div>
}
