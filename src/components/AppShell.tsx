import type { ReactNode } from 'react'
import { BottomNavigation, StatusBar, TopBar } from './ui'

type AppShellProps = {
  children: ReactNode
  tone?: 'light' | 'forest' | 'sun' | 'lavender' | 'info' | 'lime'
  topBar?: boolean
  statusBar?: boolean
  bottomNav?: boolean
  padded?: boolean
  className?: string
}

export function AppShell({
  children,
  tone = 'light',
  topBar = false,
  statusBar = true,
  bottomNav = false,
  padded = true,
  className = '',
}: AppShellProps) {
  const inverse = tone === 'forest'

  return (
    <main className="prototype-stage">
      <section className={`phone-shell phone-shell--${tone} ${className}`}>
        {statusBar && <StatusBar inverse={inverse} />}
        {topBar && <TopBar inverse={inverse} />}
        <div className={`screen-content${padded ? ' screen-content--padded' : ''}${bottomNav ? ' screen-content--with-nav' : ''}`}>
          {children}
        </div>
        {bottomNav && <BottomNavigation />}
      </section>
    </main>
  )
}

export function DesktopShell({ children, area = 'admin' }: { children: ReactNode; area?: 'admin' | 'business' | 'client' }) {
  return <main className={`desktop-shell desktop-shell--${area}`}>{children}</main>
}
