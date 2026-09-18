import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DesktopShell } from '../components/AppShell'
import { Button, Chip, Field, StateCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

type CsvCell = string | number

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function downloadCsv(filename: string, headers: readonly CsvCell[], rows: readonly (readonly CsvCell[])[]) {
  const escapeCell = (cell: CsvCell) => `"${String(cell).replace(/"/g, '""')}"`
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

const adminNav = [
  ['/admin/dashboard', 'Vue d’ensemble'],
  ['/admin/verifications', 'Vérifications'],
  ['/admin/moderation', 'Avis & signalements'],
  ['/admin/appeals', 'Appels'],
  ['/admin/users', 'Utilisateurs'],
  ['/admin/audit', 'Journal d’audit'],
  ['/admin/system', 'Système'],
] as const

function AdminLayout({ title, eyebrow, subtitle, children, action }: { title: string; eyebrow?: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <DesktopShell area="admin">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/hub">referio admin</Link>
        <nav>{adminNav.map(([to, label]) => <Link className={pathname === to ? 'is-active' : ''} to={to} key={to}>{label}</Link>)}</nav>
        <div className="admin-user">Omer · Super admin</div>
      </aside>
      <section className="admin-main">
        <header className="admin-header"><div>{eyebrow && <span>{eyebrow}</span>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
        {children}
      </section>
    </DesktopShell>
  )
}

export function AdminLoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@referio.example')
  const [password, setPassword] = useState('referio-demo')
  const [trustedDevice, setTrustedDevice] = useState(true)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canContinue = emailValid && password.length >= 8
  return (
    <DesktopShell area="admin">
      <section className="admin-login-art"><img src={asset('admin-login.jpg')} alt="Centre de contrôle Referio" /><div><span>R</span><h1>La confiance locale se protège.</h1><p>Console réservée aux équipes de vérification et de modération.</p></div></section>
      <section className="admin-login-form"><div><p>ADMINISTRATION</p><h1>Connexion renforcée</h1><Field label="Adresse professionnelle" type="email" value={email} onChange={setEmail} helper={email && !emailValid ? 'Saisissez une adresse professionnelle valide.' : undefined} /><Field label="Mot de passe" type="password" value={password} onChange={setPassword} helper={password && password.length < 8 ? '8 caractères minimum.' : undefined} /><label className="consent"><input type="checkbox" checked={trustedDevice} onChange={(event) => setTrustedDevice(event.target.checked)} /> <span>Cet appareil est approuvé</span></label><Button full disabled={!canContinue} onClick={() => canContinue && navigate('/admin/dashboard')}>Continuer avec la 2FA</Button><small>Accès simulé · Aucun compte réel</small></div></section>
    </DesktopShell>
  )
}

function StatCard({ label, value, delta, tone = 'default' }: { label: string; value: string | number; delta: string; tone?: string }) {
  return <article className={`admin-stat admin-stat--${tone}`}><span>{label}</span><strong>{value}</strong><small>{delta}</small></article>
}

export function AdminDashboardScreen() {
  const { state } = useDemo()
  return (
    <AdminLayout eyebrow="AUJOURD’HUI · CHARLEROI" title="Dashboard confiance" action={<Link className="button button--ghost" to="/hub">Hub prototype</Link>}>
      <div className="admin-stats"><StatCard label="À vérifier" value={state.adminPending} delta="5 prioritaires" tone="sun" /><StatCard label="Signalements" value="7" delta="−3 depuis hier" tone="lavender" /><StatCard label="Visites vérifiées" value="1 284" delta="+18 % ce mois" tone="lime" /><StatCard label="Risque détecté" value="2,1 %" delta="Sous le seuil" /></div>
      <div className="admin-columns"><section className="admin-panel"><div className="panel-title"><h2>Priorités</h2><Link to="/admin/verifications">Voir la file</Link></div>{[['Café Moka', 'BCE à contrôler', 'Élevée'], ['Studio Nola', 'Adresse à confirmer', 'Moyenne'], ['Maison Dune', 'Dossier complet', 'Faible']].map(([name, issue, risk]) => <Link className="admin-task" to="/admin/verifications" key={name}><span className={`risk risk--${risk.toLowerCase()}`}>{risk}</span><strong>{name}</strong><small>{issue}</small><b>Ouvrir</b></Link>)}</section><section className="admin-panel"><div className="panel-title"><h2>Activité récente</h2><Link to="/admin/audit">Journal</Link></div>{[['Commerce validé', 'Maison Dune', 'il y a 12 min'], ['Avis conservé', 'Café Central', 'il y a 28 min'], ['QR suspendu', 'Moka Corner', 'il y a 44 min'], ['Rôle modifié', 'Léa B.', 'il y a 1 h']].map(([action, target, time]) => <div className="activity-row" key={action + target}><i /><span><strong>{action}</strong><small>{target} · {time}</small></span></div>)}</section></div>
    </AdminLayout>
  )
}

const verificationRows = [
  ['Café Moka', 'BCE 0748.221.930 · Charleroi', 'Complet', 'Faible'],
  ['Maison Dune', 'BCE 0821.744.115 · Mons', 'Complet', 'Moyen'],
  ['Studio Nova', 'BCE 0652.882.410 · Namur', 'Incomplet', 'Élevé'],
  ['La Table Verte', 'BCE 0789.014.663 · Liège', 'Complet', 'Faible'],
  ['Atelier 17', 'BCE 0691.445.200 · Charleroi', 'Incomplet', 'Moyen'],
]

export function AdminVerificationsScreen() {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const { dispatch } = useDemo()
  const normalizedQuery = normalizeSearch(query)
  const filteredRows = verificationRows.filter((row) => normalizeSearch(row.join(' ')).includes(normalizedQuery))
  function decide(decision: string) { setStatus(decision); if (decision === 'validé') dispatch({ type: 'VALIDATE_BUSINESS' }) }
  return (
    <AdminLayout title="Vérifications Business" subtitle="18 commerces attendent une décision documentée">
      <div className="admin-toolbar admin-verification-toolbar"><Field label="Rechercher" value={query} placeholder="Nom, BCE ou ville" onChange={setQuery} /><Button className="verification-export" variant="ghost" onClick={() => downloadCsv('referio-verifications.csv', ['Commerce', 'BCE et ville', 'Dossier', 'Risque'], filteredRows)}>Exporter CSV</Button></div>
      {filteredRows.length > 0 ? <div className="verification-list" role="table"><div className="verification-list__head" role="row"><span>COMMERCE</span><span>DOSSIER</span><span>RISQUE</span><span>ACTION</span></div>{filteredRows.map(([name, meta, dossier, risk]) => <button type="button" role="row" className="verification-row" key={name} onClick={() => { setSelected(name); setStatus(null) }}><span><strong>{name}</strong><small>{meta}</small></span><span className={`dossier dossier--${dossier.toLowerCase()}`}>{dossier}</span><span className={`risk risk--${risk.toLowerCase()}`}>{risk}</span><span>Ouvrir</span></button>)}</div> : <StateCard tone="info" label="AUCUN RÉSULTAT" title="Aucun dossier correspondant" body="Modifiez le nom, le numéro BCE ou la ville recherchée." />}
      {selected && <div className="admin-drawer" role="dialog" aria-modal="true" aria-label={`Dossier ${selected}`}><button className="drawer-close" onClick={() => setSelected(null)} aria-label="Fermer">×</button><span>DOSSIER DE VÉRIFICATION</span><h2>{selected}</h2><StateCard label="PREUVES REÇUES" title="BCE, identité et adresse" body="Les informations concordent avec le profil public." />{status ? <p className="inline-success" role="status">Dossier {status}.{notes[selected]?.trim() ? ' Note interne enregistrée.' : ''}</p> : <><Field label="Note interne" multiline value={notes[selected] ?? ''} placeholder="Motif de la décision…" onChange={(value) => setNotes((current) => ({ ...current, [selected]: value }))} /><div className="two-actions"><Button onClick={() => decide('validé')}>Valider</Button><Button variant="danger" onClick={() => decide('rejeté')}>Rejeter</Button></div></>}</div>}
    </AdminLayout>
  )
}

export function AdminModerationScreen() {
  const [decision, setDecision] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState(0)
  const reports = ['Contenu commercial', 'Expérience contestée', 'Langage inapproprié']
  const [notes, setNotes] = useState<Record<string, string>>({ 'Contenu commercial': 'La preuve de visite est valide. Le texte ne viole pas les règles.' })
  const report = reports[selectedReport]
  return <AdminLayout eyebrow="7 SIGNALEMENTS" title="Modération des avis"><div className="moderation-grid"><section className="admin-panel"><h2>Signalements</h2>{reports.map((item, index) => <button type="button" className={index === selectedReport ? 'is-selected' : ''} aria-pressed={index === selectedReport} onClick={() => { setSelectedReport(index); setDecision(null) }} key={item}><strong>{item}</strong><small>Café Central · il y a {index + 1} h</small></button>)}</section><section className="admin-panel moderation-detail"><span>{report.toUpperCase()}</span><h2>« Une publicité déguisée, rien de plus. »</h2><p>Publié par un compte avec visite vérifiée. Le commerce conteste le caractère authentique du contenu.</p><StateCard label="PREUVE DE VISITE" title="QR validé · 18 septembre, 10:42" body="Aucun autre signal de fraude associé au compte." /><Field label="Note interne" multiline value={notes[report] ?? ''} placeholder="Ajouter le motif de la décision…" onChange={(value) => setNotes((current) => ({ ...current, [report]: value }))} />{decision ? <p className="inline-success" role="status">Décision enregistrée : {decision}.</p> : <div className="two-actions"><Button onClick={() => setDecision('avis conservé')}>Conserver</Button><Button variant="danger" onClick={() => setDecision('avis retiré')}>Retirer</Button></div>}</section></div></AdminLayout>
}

export function AdminAppealsScreen() {
  const [step, setStep] = useState(1)
  const [selectedAppeal, setSelectedAppeal] = useState('Café du Parc')
  const appeals = ['Café du Parc', 'Studio 8', 'Le Comptoir']
  return <AdminLayout eyebrow="3 DOSSIERS" title="Appels"><div className="appeal-layout"><section className="admin-panel">{appeals.map((name, index) => <button type="button" className={name === selectedAppeal ? 'is-selected' : ''} aria-pressed={name === selectedAppeal} onClick={() => { setSelectedAppeal(name); setStep(1) }} key={name}><strong>{name}</strong><small>SLA · {12 + index * 4} h restantes</small></button>)}</section><section className="admin-panel"><span>RELECTURE EN 4 ÉTAPES</span><h2>{selectedAppeal}</h2><div className="stepper">{['Décision initiale', 'Nouvelles pièces', 'Seconde lecture', 'Décision finale'].map((label, index) => <button type="button" onClick={() => setStep(index + 1)} className={step >= index + 1 ? 'is-active' : ''} key={label}><i>{index + 1}</i><span>{label}</span></button>)}</div><StateCard tone="info" label={`ÉTAPE ${step}`} title="Dossier en cours de relecture" body="Toutes les actions sont historisées dans le journal d’audit." /><Button onClick={() => setStep(Math.min(4, step + 1))}>Étape suivante</Button></section></div></AdminLayout>
}

type AdminUser = {
  name: string
  email: string
  role: string
  state: string
}

type UserEditor = {
  mode: 'invite' | 'manage'
  originalEmail?: string
  name: string
  email: string
  role: string
}

const initialAdminUsers: AdminUser[] = [
  { name: 'Omer B.', email: 'omer@referio.example', role: 'Super admin', state: 'Actif' },
  { name: 'Léa B.', email: 'lea@referio.example', role: 'Vérification', state: 'Actif' },
  { name: 'Nora D.', email: 'nora@referio.example', role: 'Modération', state: 'Invitation' },
  { name: 'Samir K.', email: 'samir@referio.example', role: 'Lecture', state: 'Inactif' },
]

export function AdminUsersScreen() {
  const [users, setUsers] = useState(initialAdminUsers)
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState<UserEditor | null>(null)
  const [feedback, setFeedback] = useState('')
  const normalizedQuery = normalizeSearch(query)
  const filteredUsers = users.filter((user) => normalizeSearch(`${user.name} ${user.email} ${user.role} ${user.state}`).includes(normalizedQuery))
  const editorEmailValid = Boolean(editor && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editor.email))
  const editorEmailAvailable = Boolean(editor && !users.some((user) => user.email.toLowerCase() === editor.email.toLowerCase() && user.email !== editor.originalEmail))
  const canSave = Boolean(editor?.name.trim() && editor.role.trim() && editorEmailValid && editorEmailAvailable)

  function openInvitation() {
    setFeedback('')
    setEditor({ mode: 'invite', name: '', email: '', role: 'Vérification' })
  }

  function openManagement(user: AdminUser) {
    setFeedback('')
    setEditor({ mode: 'manage', originalEmail: user.email, name: user.name, email: user.email, role: user.role })
  }

  function saveUser() {
    if (!editor || !canSave) return
    if (editor.mode === 'invite') {
      setUsers((current) => [...current, { name: editor.name.trim(), email: editor.email.trim(), role: editor.role.trim(), state: 'Invitation' }])
      setFeedback(`Invitation envoyée à ${editor.email.trim()}.`)
    } else {
      setUsers((current) => current.map((user) => user.email === editor.originalEmail ? { ...user, name: editor.name.trim(), email: editor.email.trim(), role: editor.role.trim() } : user))
      setFeedback(`Accès de ${editor.name.trim()} mis à jour.`)
    }
    setEditor(null)
  }

  return (
    <AdminLayout eyebrow="ÉQUIPE" title="Utilisateurs & rôles" action={<Button onClick={openInvitation}>Inviter</Button>}>
      <div className="admin-toolbar"><Field label="Recherche" value={query} placeholder="Nom, e-mail ou rôle…" onChange={setQuery} /></div>
      {feedback && <p className="inline-success" role="status">{feedback}</p>}
      {filteredUsers.length > 0 ? <div className="user-grid">{filteredUsers.map((user) => <article key={user.email}><span>{user.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{user.name}</strong><small>{user.role}</small></div><b>{user.state}</b><Button variant="ghost" onClick={() => openManagement(user)}>Gérer</Button></article>)}</div> : <StateCard tone="info" label="AUCUN RÉSULTAT" title="Aucun utilisateur correspondant" body="Recherchez un nom, une adresse e-mail, un rôle ou un statut." />}
      {editor && <div className="admin-drawer" role="dialog" aria-modal="true" aria-label="Gestion d’un membre"><button className="drawer-close" onClick={() => setEditor(null)} aria-label="Fermer">×</button><h2>{editor.mode === 'invite' ? 'Inviter un membre' : `Gérer ${editor.name}`}</h2><Field label="Nom complet" value={editor.name} onChange={(name) => setEditor((current) => current ? { ...current, name } : current)} /><Field label="Adresse professionnelle" type="email" value={editor.email} onChange={(email) => setEditor((current) => current ? { ...current, email } : current)} helper={editor.email && !editorEmailValid ? 'Saisissez une adresse professionnelle valide.' : !editorEmailAvailable ? 'Cette adresse est déjà utilisée.' : undefined} /><Field label="Groupe de permissions" value={editor.role} onChange={(role) => setEditor((current) => current ? { ...current, role } : current)} /><Button full disabled={!canSave} onClick={saveUser}>{editor.mode === 'invite' ? 'Envoyer l’invitation' : 'Enregistrer'}</Button></div>}
    </AdminLayout>
  )
}

const auditLogs = [
  ['10:42:18', 'Omer B.', 'VALIDATE_BUSINESS', 'Café Moka', 'Succès'],
  ['10:28:03', 'Léa B.', 'KEEP_REVIEW', 'Avis #4821', 'Succès'],
  ['09:58:44', 'Système', 'BLOCK_QR', 'Moka Corner', 'Auto'],
  ['09:31:12', 'Omer B.', 'UPDATE_ROLE', 'Nora D.', 'Succès'],
  ['08:47:55', 'Système', 'RISK_ALERT', 'Compte #782', 'Ouvert'],
]

export function AdminAuditScreen() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'today' | 'success' | 'alerts'>('today')
  const normalizedQuery = normalizeSearch(query)
  const filteredLogs = auditLogs.filter((row) => {
    const matchesQuery = normalizeSearch(row.join(' ')).includes(normalizedQuery)
    const matchesFilter = filter === 'today' || (filter === 'success' ? row[4] === 'Succès' : row[2] === 'BLOCK_QR' || row[2] === 'RISK_ALERT')
    return matchesQuery && matchesFilter
  })
  return (
    <AdminLayout eyebrow="TRAÇABILITÉ" title="Journal d’audit" action={<Button variant="ghost" onClick={() => downloadCsv('referio-journal-audit.csv', ['Heure', 'Acteur', 'Action', 'Cible', 'Statut'], filteredLogs)}>Exporter CSV</Button>}>
      <div className="admin-toolbar"><Field label="Recherche" value={query} placeholder="Acteur, action ou cible…" onChange={setQuery} /><div className="chip-row"><Chip active={filter === 'today'} onClick={() => setFilter('today')}>Aujourd’hui</Chip><Chip active={filter === 'success'} onClick={() => setFilter('success')}>Succès</Chip><Chip active={filter === 'alerts'} onClick={() => setFilter('alerts')}>Alertes</Chip></div></div>
      {filteredLogs.length > 0 ? <div className="audit-table">{filteredLogs.map((row) => <div key={row.join('-')}>{row.map((cell, index) => index === 2 ? <code key={cell}>{cell}</code> : <span key={cell}>{cell}</span>)}</div>)}</div> : <StateCard tone="info" label="AUCUN RÉSULTAT" title="Aucune action correspondante" body="Modifiez la recherche ou choisissez un autre filtre." />}
    </AdminLayout>
  )
}

export function AdminSystemScreen() {
  const [rules, setRules] = useState([true, true, false])
  return <AdminLayout eyebrow="TEMPS RÉEL" title="Système & anti-fraude"><div className="admin-stats"><StatCard label="API" value="Opérationnelle" delta="99,99 %" tone="lime" /><StatCard label="Latence" value="84 ms" delta="p95" /><StatCard label="Alertes" value="3" delta="1 prioritaire" tone="sun" /><StatCard label="QR bloqués" value="12" delta="24 dernières heures" tone="lavender" /></div><div className="admin-columns"><section className="admin-panel"><h2>Règles anti-fraude</h2>{['Rotation QR obligatoire', 'Vitesse de visites anormale', 'Comptes liés au même appareil'].map((rule, index) => <button type="button" className="rule-row" onClick={() => setRules(rules.map((value, i) => i === index ? !value : value))} key={rule}><span><strong>{rule}</strong><small>Dernière évaluation il y a 4 min</small></span><img src={asset(rules[index] ? 'switch-on.svg' : 'switch-off.svg')} alt={rules[index] ? 'Activée' : 'Désactivée'} /></button>)}</section><section className="admin-panel"><h2>Incidents récents</h2><StateCard tone="error" label="PRIORITAIRE" title="Pic de scans · Moka Corner" body="38 scans en 4 minutes depuis deux appareils." /><StateCard tone="info" label="SURVEILLANCE" title="Comptes liés" body="Trois profils partagent un appareil récent." /></section></div></AdminLayout>
}
