import { useState } from 'react'
import type { ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button, Field, ListRow, PageTitle, StateCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

function BusinessHeader() {
  return <div className="business-kicker"><Link to="/business/dashboard">REFERIO · ESPACE PME</Link><span><Link to="/client/home">Expérience Client</Link><Link to="/business/dashboard">Tableau de bord</Link></span></div>
}

const businessMobileTabs = [
  ['/business/dashboard', 'Tableau', 'nav-home.png'],
  ['/business/profile', 'Fiche', 'nav-profile.png'],
  ['/business/publish', 'Publier', 'icon-star.svg'],
  ['/business/stats', 'Stats', 'nav-ranking.png'],
  ['/business/subscription', 'Compte', 'icon-settings.svg'],
] as const

const businessPlans = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    description: 'L’essentiel pour lancer une présence locale fiable.',
    features: ['Fiche publique vérifiée', 'Réponse aux avis', 'Statistiques de base'],
    recommended: false,
  },
  {
    name: 'Visibilité',
    price: '19 € /mois',
    description: 'Des actions guidées pour être vu plus souvent.',
    features: ['Tout Découverte', 'Score de visibilité + tâches guidées', 'Offres et challenges sponsorisés', 'Statistiques avancées'],
    recommended: true,
  },
  {
    name: 'Rayonnement',
    price: '49 € /mois',
    description: 'Les outils avancés pour animer votre communauté.',
    features: ['Tout Visibilité', 'Assistant IA de contenu', 'Campagnes de demandes d’avis'],
    recommended: false,
  },
] as const

function BusinessMobileNavigation() {
  const { pathname } = useLocation()
  return (
    <nav className="business-mobile-nav" aria-label="Navigation Business mobile">
      {businessMobileTabs.map(([to, label, icon]) => <Link className={`${pathname === to ? 'is-active' : ''}${to === '/business/publish' ? ' is-publish' : ''}`} to={to} key={to}><span><img src={asset(icon)} alt="" /></span><b>{label}</b></Link>)}
      <Link className="business-mobile-client-switch" to="/client/home">Vue Client</Link>
    </nav>
  )
}

function BusinessShell({ children, tone = 'light', showHeader = true, preAuth = false, className = '' }: { children: ReactNode; tone?: 'light' | 'forest' | 'sun' | 'lavender' | 'info' | 'lime'; showHeader?: boolean; preAuth?: boolean; className?: string }) {
  return <AppShell tone={tone} statusBar={showHeader} businessSidebar={!preAuth} className={`${showHeader ? 'business-shell' : 'business-shell business-dashboard-shell'}${preAuth ? ' business-shell--public' : ' business-shell--authenticated'} ${className}`.trim()}>{showHeader && <BusinessHeader />}{children}{!preAuth && <BusinessMobileNavigation />}</AppShell>
}

export function BusinessLandingScreen() {
  const navigate = useNavigate()
  return (
    <BusinessShell tone="forest" preAuth>
      <PageTitle eyebrow="RÉFÉRIO POUR LES COMMERCES" title="Transforme la confiance locale en visites réelles." body="Une présence vérifiée, des recommandations utiles et des clients qui reviennent." inverse />
      <div className="business-metrics"><div><strong>+28 %</strong><span>de visites</span></div><div><strong>4,8</strong><span>note moyenne</span></div><div><strong>1 284</strong><span>interactions</span></div></div>
      <img className="business-hero-art" src={asset('business-asset-1.jpg')} alt="Commerçante locale" />
      <StateCard label="MAISON DUNE" title="Une fiche complète, visible et crédible" body="Les visites vérifiées distinguent l’expérience réelle du simple clic." />
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/business/login')}>Créer ma fiche</Button>
      <Button full variant="ghost" onClick={() => navigate('/business/dashboard')}>Voir une démo</Button>
    </BusinessShell>
  )
}

export function BusinessLoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('bonjour@cafemoka.be')
  const [password, setPassword] = useState('referio-demo')
  const canConnect = email.includes('@') && password.trim().length >= 4
  return (
    <BusinessShell preAuth>
      <PageTitle eyebrow="ESPACE PRO" title="Pilote ta présence locale." body="Connexion simulée pour le prototype." />
      <Field label="Adresse e-mail professionnelle" type="email" value={email} onChange={setEmail} />
      <Field label="Mot de passe" type="password" value={password} onChange={setPassword} helper="4 caractères minimum pour cette démonstration." />
      <Link className="text-link" to="/business/support">Mot de passe oublié&nbsp;?</Link>
      <div className="screen-spacer" />
      <Button full disabled={!canConnect} onClick={() => navigate('/business/dashboard')}>Se connecter</Button>
      <Button full variant="ghost" onClick={() => navigate('/business/plans')}>Créer un compte</Button>
    </BusinessShell>
  )
}

export function BusinessPlansScreen() {
  const [plan, setPlan] = useState<(typeof businessPlans)[number]['name']>('Visibilité')
  const navigate = useNavigate()
  return (
    <BusinessShell tone="lavender" preAuth>
      <PageTitle eyebrow="ABONNEMENT" title="Choisis l’élan adapté à ton commerce." />
      {businessPlans.map((offer) => <button type="button" className={`plan-card${plan === offer.name ? ' is-selected' : ''}`} aria-pressed={plan === offer.name} onClick={() => setPlan(offer.name)} key={offer.name}><span>{offer.recommended ? 'RECOMMANDÉ' : 'OFFRE'}</span><h2>{offer.name}</h2><strong>{offer.price}</strong><p>{offer.description}</p></button>)}
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/claim')}>Continuer avec {plan}</Button>
    </BusinessShell>
  )
}

export function BusinessClaimScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('Café Moka')
  const merchants = [
    { name: 'Café Moka', address: 'Rue de Dampremy 18 · Charleroi' },
    { name: 'Moka Corner', address: 'Boulevard Tirou 42 · Charleroi' },
  ]
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-BE')
  const results = merchants.filter((merchant) => `${merchant.name} ${merchant.address}`.toLocaleLowerCase('fr-BE').includes(normalizedQuery))
  return (
    <BusinessShell preAuth>
      <PageTitle eyebrow="REVENDICATION" title="Retrouve ton commerce." body="Nous vérifions que tu peux bien le représenter." />
      <Field label="Nom ou adresse" value={query} onChange={setQuery} helper="La liste se met à jour pendant la saisie." />
      <p className="business-search-summary" role="status">{results.length} {results.length === 1 ? 'commerce trouvé' : 'commerces trouvés'}</p>
      {results.map((merchant) => <button type="button" className="claim-card" onClick={() => navigate('/business/verification')} key={merchant.name}><strong>{merchant.name}</strong><span>{merchant.address}</span><b>Revendiquer</b></button>)}
      {results.length === 0 && <StateCard label="AUCUN RÉSULTAT" title="Essayez une autre recherche" body="Vous pouvez aussi créer une nouvelle fiche ci-dessous." />}
      <div className="screen-spacer" /><Button full variant="ghost" onClick={() => navigate('/business/onboarding/info')}>Mon commerce n’apparaît pas</Button>
    </BusinessShell>
  )
}

export function BusinessVerificationScreen() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  return (
    <BusinessShell tone="info" preAuth>
      <PageTitle eyebrow="VÉRIFICATION" title="Prouve que Café Moka est bien à toi." body="Notre équipe répond en moins de 24 heures ouvrées." />
      <ListRow title="Numéro BCE" subtitle="BE 0123.456.789" />
      <ListRow title="Identité du responsable" subtitle="Document ajouté" />
      <ListRow title="Preuve d’adresse" subtitle="Facture récente ajoutée" />
      {submitted && <StateCard label="DOSSIER ENVOYÉ" title="Vérification en cours" body="Tu peux déjà compléter ta fiche." />}
      <div className="screen-spacer" />
      <Button full onClick={() => setSubmitted(true)}>Envoyer mon dossier</Button>
      <Button full variant="ghost" onClick={() => navigate('/business/onboarding/info')}>Compléter ma fiche</Button>
    </BusinessShell>
  )
}

export function BusinessInfoScreen() {
  const navigate = useNavigate()
  const [info, setInfo] = useState({ name: 'Café Moka', category: 'Café · Brunch', address: 'Rue de Dampremy 18, Charleroi', phone: '071 00 00 00', website: 'https://cafemoka.example' })
  function updateInfo(field: keyof typeof info, value: string) {
    setInfo((current) => ({ ...current, [field]: value }))
  }
  const canContinue = info.name.trim().length > 1 && info.category.trim().length > 1 && info.address.trim().length > 3
  return (
    <BusinessShell preAuth>
      <PageTitle eyebrow="1 SUR 3 · INFORMATIONS" title="Présente ton commerce clairement." />
      <Field label="Nom public" value={info.name} onChange={(value) => updateInfo('name', value)} /><Field label="Catégorie" value={info.category} onChange={(value) => updateInfo('category', value)} /><Field label="Adresse" value={info.address} onChange={(value) => updateInfo('address', value)} /><Field label="Téléphone" type="tel" value={info.phone} onChange={(value) => updateInfo('phone', value)} /><Field label="Site web" type="url" value={info.website} onChange={(value) => updateInfo('website', value)} />
      <Button full disabled={!canContinue} onClick={() => navigate('/business/onboarding/hours')}>Continuer</Button>
    </BusinessShell>
  )
}

export function BusinessHoursScreen() {
  const navigate = useNavigate()
  const [closedSunday, setClosedSunday] = useState(true)
  return (
    <BusinessShell preAuth>
      <PageTitle eyebrow="2 SUR 3 · HORAIRES" title="Dis quand la porte est ouverte." />
      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => <div className="hours-row" key={day}><strong>{day}</strong><span>08:00</span><span>18:00</span><img src={asset('switch-on.svg')} alt="Ouvert" /></div>)}
      <button type="button" className="hours-row" onClick={() => setClosedSunday(!closedSunday)}><strong>Dimanche</strong><span>{closedSunday ? 'Fermé' : '09:00'}</span><span>{closedSunday ? '' : '14:00'}</span><img src={asset(closedSunday ? 'switch-off.svg' : 'switch-on.svg')} alt={closedSunday ? 'Fermé' : 'Ouvert'} /></button>
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/onboarding/media')}>Continuer</Button>
    </BusinessShell>
  )
}

export function BusinessMediaScreen() {
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  return (
    <BusinessShell tone="sun" preAuth>
      <PageTitle eyebrow="3 SUR 3 · MÉDIAS" title="Montre le vrai visage de Café Moka." />
      <button type="button" className="upload-zone" onClick={() => setAdded(true)}><strong>{added ? 'Photos ajoutées' : 'Ajouter des photos'}</strong><span>JPG ou PNG · 10 Mo maximum</span></button>
      <div className="media-grid"><img src={asset('business-asset-3.jpg')} alt="Commerce" /><img src={asset('business-asset-5.jpg')} alt="Ambiance" /><img src={asset('business-asset-6.jpg')} alt="Produit" /></div>
      <label className="consent"><input type="checkbox" defaultChecked /> <span>Je confirme avoir le droit d’utiliser ces photos.</span></label>
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/preview')}>Voir mon aperçu</Button>
    </BusinessShell>
  )
}

export function BusinessPreviewScreen() {
  const navigate = useNavigate()
  return (
    <BusinessShell preAuth>
      <PageTitle eyebrow="APERÇU PUBLIC" title="Café Moka" body="Voilà ce que les habitants verront." />
      <img className="preview-cover" src={asset('business-asset-3.jpg')} alt="Aperçu de Café Moka" />
      <StateCard label="COMMERCE VÉRIFIÉ" title="★ 4,8 · 126 avis" body="Café · Brunch · Ouvert jusqu’à 18 h" />
      <section className="offer-preview"><span>OFFRE DU MOMENT</span><h2>Une pâtisserie offerte</h2><p>Avec deux boissons chaudes.</p></section>
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/checklist')}>Continuer</Button>
    </BusinessShell>
  )
}

export function BusinessDashboardScreen() {
  const { state } = useDemo()
  return (
    <BusinessShell showHeader={false} className="business-dashboard-fidelity">
      <header className="business-dashboard-heading">
        <span className="business-dashboard-heading__mobile">Espace pro · Café Central</span>
        <h1><span className="business-dashboard-heading__mobile">Votre visibilité</span><span className="business-dashboard-heading__desktop">Bonjour Café Central</span></h1>
        <p className="business-dashboard-heading__desktop">Voici votre visibilité cette semaine</p>
      </header>
      <section className="business-score-card">
        <div className="score-ring" aria-label={`${state.businessCompleteness} sur 100`}><span>{state.businessCompleteness}</span></div>
        <div className="business-score-copy">
          <strong><span className="business-dashboard-heading__mobile">{state.businessCompleteness}/100</span><span className="business-dashboard-heading__desktop">Score de visibilité</span></strong>
          <p><span className="business-dashboard-heading__desktop">Top 25 % des cafés de Charleroi<br /></span><b>▲ +6 cette semaine</b></p>
          <Link to="/business/visibility">Améliorer</Link>
        </div>
      </section>
      <section className="business-tasks">
        <h2>Tâches prioritaires</h2>
        <Link to="/business/profile" className="business-task-row"><span aria-hidden="true" /><strong>✓ Ajouter vos horaires</strong></Link>
        <Link to="/business/reviews" className="business-task-row"><span aria-hidden="true" /><strong>Répondre à 3 avis récents</strong></Link>
        <Link to="/business/publish" className="business-task-row"><span aria-hidden="true" /><strong>Publier une photo de vos plats</strong></Link>
      </section>
      <section className="business-week-card">
        <h2>Cette semaine</h2>
        <div><span>Vues du profil</span><strong>1 240</strong><b>▲ 12 %</b></div>
        <div><span>Appels</span><strong>86</strong><b>▲ 8 %</b></div>
        <div><span>Itinéraires</span><strong>214</strong><b>▲ 15 %</b></div>
      </section>
      <div className="dashboard-stats dashboard-stats--three"><article><strong>1 240</strong><span>Vues</span></article><article><strong>86</strong><span>Appels</span></article><article><strong>214</strong><span>Itinéraires</span></article></div>
      <section className="business-progress-card" aria-label="Progression de visibilité sur 30 jours">
        <h2>Progression · 30 jours</h2>
        <div className="business-progress-plot" aria-hidden="true">
          <i className="business-progress-segment business-progress-segment--1" /><i className="business-progress-segment business-progress-segment--2" /><i className="business-progress-segment business-progress-segment--3" /><i className="business-progress-segment business-progress-segment--4" /><i className="business-progress-segment business-progress-segment--5" /><i className="business-progress-segment business-progress-segment--6" />
          <span className="business-progress-marker business-progress-marker--photos">Photos +4</span><span className="business-progress-marker business-progress-marker--reviews">Avis +2</span><span className="business-progress-marker business-progress-marker--offer">Offre +3</span>
        </div>
      </section>
      <Link className="business-review-pending" to="/business/reviews"><span>Avis en attente</span><div className="business-review-person"><img src={asset('review-avatar.png')} alt="Sophie D." /><strong>Sophie D. · ★ 4,0</strong></div><p>« Très bon accueil, service un peu lent au rush… »</p><b>Répondre</b></Link>
      <Link className="business-next-step" to="/business/profile"><strong>Prochaine étape · Ajoutez 2 photos de vos plats (+4 pts estimés)</strong><span>Faire maintenant</span></Link>
      <Link className="business-booster" to="/business/visibility">Booster ma visibilité</Link>
    </BusinessShell>
  )
}

export function BusinessVisibilityScreen() {
  const { state } = useDemo()
  return (
    <BusinessShell tone="sun" className="business-visibility-fidelity">
      <header className="business-visibility-title"><span aria-hidden="true" /><h1>Visibilité</h1></header>
      <section className="business-visibility-score">
        <div><strong>{state.businessCompleteness}</strong><span>/100</span><h2>Top 25 % des cafés<br />de Charleroi</h2><b>+6 cette semaine</b></div>
        <div className="business-level-meter" aria-label={`${state.businessCompleteness} sur 100, prochain niveau Légende locale`}><span /><i /><small>75<br /><br />50<br /><br />25</small><b>Légende<br />locale</b></div>
      </section>
      <div className="business-impact-pills"><Link to="/business/profile">Photos +4</Link><Link to="/business/reviews">Avis +2</Link><Link to="/business/publish">Offre +3</Link></div>
      <section className="business-recommendation-card"><strong>18 %</strong><h2>de votre visibilité vient des recommandations</h2><div><span className="business-mini-avatars"><img src={asset('rank-2.png')} alt="" /><img src={asset('review-avatar.png')} alt="" /></span><b>+22 % ce mois</b></div></section>
      <section className="business-recommendation-chart"><b>221<br />reco</b><div>{[38, 58, 80, 44].map((height, index) => <i style={{ height }} key={index} />)}</div><small>Avr&nbsp;&nbsp;&nbsp; Mai&nbsp;&nbsp;&nbsp; Juin&nbsp;&nbsp;&nbsp; Juil</small></section>
      <section className="business-visibility-stat business-visibility-stat--lime"><strong>96</strong><span>Avis vérifiés</span></section>
      <section className="business-visibility-stat business-visibility-stat--forest"><strong>18</strong><span>Partages</span></section>
      <Link className="business-social-proof" to="/business/review-campaign"><span /><div><strong>Vos clients parlent de vous</strong><p>Karim, Julie et 16 autres ont recommandé votre café cette semaine.</p></div></Link>
    </BusinessShell>
  )
}

export function BusinessChecklistScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const tasks = ['Commerce vérifié', 'Profil complété', 'QR de visite affiché', 'Première offre publiée']
  const [completedTasks, setCompletedTasks] = useState(() => new Set(state.businessCompleteness >= 80 ? [0, 1, 2, 3] : [0, 1, 2]))
  function completeTask(index: number) {
    if (completedTasks.has(index)) return
    setCompletedTasks((current) => new Set(current).add(index))
    dispatch({ type: 'COMPLETE_BUSINESS_STEP' })
  }
  return (
    <BusinessShell tone="lime" preAuth>
      <PageTitle eyebrow="LANCEMENT" title="Ta fiche est prête à vivre." body={`${state.businessCompleteness} % complété`} />
      <div className="progress progress--large"><i style={{ width: `${state.businessCompleteness}%` }} /></div>
      {tasks.map((task, index) => { const completed = completedTasks.has(index); return <button type="button" className="task-row" key={task} disabled={completed} onClick={() => completeTask(index)}><span className={completed ? 'is-done' : ''}>{completed ? '✓' : index + 1}</span><strong>{task}</strong><b>{completed ? 'Terminé' : 'À faire'}</b></button> })}
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/dashboard')}>Ouvrir mon tableau de bord</Button>
    </BusinessShell>
  )
}

export function BusinessQrScreen() {
  const [renewed, setRenewed] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  function downloadQr() {
    const svg = document.querySelector('.business-qr svg')
    if (!svg) return
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `referio-qr-cafe-moka${renewed ? '-renouvele' : ''}.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    setDownloaded(true)
  }
  return (
    <BusinessShell>
      <PageTitle eyebrow="QR DE VISITE" title="Un code vivant, prêt pour la caisse." body="Le renouvellement protège les visites contre les copies." />
      <div className="business-qr"><QRCodeSVG value={renewed ? 'referio://visit/cafe-moka/demo-2' : 'referio://visit/cafe-moka/demo-1'} size={215} bgColor="#FFFFFF" fgColor="#243838" level="M" title="QR de démonstration Café Moka" /><strong>CAFÉ MOKA</strong><span>{renewed ? 'Code renouvelé à l’instant' : 'Rotation automatique active'}</span></div>
      {downloaded && <p className="inline-success" role="status">Support QR téléchargé au format SVG.</p>}
      <Button full onClick={downloadQr}>Télécharger le support</Button>
      <Button full variant="ghost" onClick={() => { setRenewed(true); setDownloaded(false) }}>Renouveler maintenant</Button>
    </BusinessShell>
  )
}

export function BusinessProfileScreen() {
  const [saved, setSaved] = useState(false)
  const [photoAdded, setPhotoAdded] = useState(false)
  const [profile, setProfile] = useState({ name: 'Café Central', category: 'Café · Brunch', address: 'Rue de la Montagne 12', hours: 'Lun–Sam 8h–18h · Ouvert', phone: '071 12 34 56' })
  const [services, setServices] = useState(['Terrasse', 'Wi-Fi', 'Végétarien'])
  function updateProfile(field: keyof typeof profile, value: string) {
    setSaved(false)
    setProfile((current) => ({ ...current, [field]: value }))
  }
  function addService() {
    if (!services.includes('À emporter')) setServices((current) => [...current, 'À emporter'])
  }
  return <BusinessShell className="business-profile-shell business-profile-fidelity">
    <header className="business-profile-heading"><span aria-hidden="true" /><h1>Ma fiche</h1><Link to="/business/preview">Aperçu</Link></header>
    <section className="business-profile-completeness"><strong>Fiche complétée à {photoAdded ? 90 : 80} %</strong><div><i style={{ width: photoAdded ? '90%' : '80%' }} /></div><span>{photoAdded ? 'Encore 1 photo pour atteindre 100 %' : 'Ajoutez 2 photos pour atteindre 100 %'}</span></section>
    <div className="business-profile-workspace">
      <section className="business-profile-form">
        <div className="business-profile-photos"><h2>Photos</h2><div><figure><img src={asset('business-asset-3.jpg')} alt="Couverture de Café Central" /><figcaption>Couverture</figcaption></figure><img src={asset('business-asset-5.jpg')} alt="Ambiance du Café Central" />{photoAdded ? <img src={asset('business-asset-6.jpg')} alt="Produit ajouté à la galerie" /> : <button type="button" onClick={() => { setPhotoAdded(true); setSaved(false) }}>+ Ajouter</button>}</div>{photoAdded && <p className="inline-success business-photo-feedback" role="status">Photo ajoutée à la galerie.</p>}</div>
        <h2>Informations</h2>
        <div className="business-profile-fields"><Field label="Nom" value={profile.name} onChange={(value) => updateProfile('name', value)} /><Field label="Catégorie" value={profile.category} onChange={(value) => updateProfile('category', value)} /><Field label="Adresse" value={profile.address} onChange={(value) => updateProfile('address', value)} /><Field label="Horaires" value={profile.hours} onChange={(value) => updateProfile('hours', value)} /><Field label="Téléphone" value={profile.phone} onChange={(value) => updateProfile('phone', value)} /></div>
        <div className="business-profile-services"><h2>Services</h2><div>{services.map((service) => <button type="button" className="is-selected" key={service} onClick={() => setServices((current) => current.filter((item) => item !== service))}>{service}</button>)}<button type="button" onClick={addService}>+ Ajouter</button></div></div>
        <Button full onClick={() => setSaved(true)}>{saved ? 'Fiche enregistrée' : 'Enregistrer les changements'}</Button>
      </section>
      <aside className="business-profile-preview">
        <span>APERÇU PUBLIC</span>
        <img src={asset('business-asset-3.jpg')} alt="Aperçu du Café Central" />
        <div><h2>{profile.name}</h2><p>{profile.category} · Charleroi centre</p><strong>★ 4,9 · Visite vérifiée</strong><small>{profile.address}<br />{profile.hours}<br />{profile.phone}</small></div>
      </aside>
    </div>
  </BusinessShell>
}

export function BusinessStatsScreen() {
  return <BusinessShell tone="info"><PageTitle eyebrow="STATISTIQUES" title="Les visites racontent mieux que les clics." /><div className="chart-card"><strong>Visites vérifiées</strong><div className="bar-chart">{[42, 58, 38, 72, 84, 68, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span>+28 % sur les 30 derniers jours</span></div><div className="dashboard-stats"><article><strong>87</strong><span>visites</span></article><article><strong>31</strong><span>avis</span></article><article><strong>4,8</strong><span>note</span></article><article><strong>19 %</strong><span>retours</span></article></div></BusinessShell>
}

export function BusinessPublishScreen() {
  const [published, setPublished] = useState(false)
  const [title, setTitle] = useState('−5 % sur le brunch du dimanche')
  const [conditions, setConditions] = useState('Valable le dimanche de 9h à 14h.')
  const [endDate, setEndDate] = useState('31 août')
  return <BusinessShell tone="sun" className="business-publish-fidelity"><PageTitle eyebrow="OFFRE" title="Donne une bonne raison de passer." /><Field label="Titre" value={title} onChange={(value) => { setTitle(value); setPublished(false) }} /><Field label="Conditions" multiline value={conditions} onChange={(value) => { setConditions(value); setPublished(false) }} /><Field label="Fin de l’offre" value={endDate} onChange={(value) => { setEndDate(value); setPublished(false) }} /><section className="business-offer-preview"><span>APERÇU CLIENT</span><strong>Café Central ✓</strong><p>{title}</p><small>{conditions} · Jusqu’au {endDate}</small></section>{published && <StateCard label="OFFRE PUBLIÉE" title="Visible dès maintenant" body="Elle apparaît sur votre fiche publique." />}<div className="screen-spacer" /><Button full onClick={() => setPublished(true)}>Publier l’offre</Button></BusinessShell>
}

export function BusinessReviewsScreen() {
  const [answer, setAnswer] = useState('Merci pour votre visite, à très bientôt chez Café Central !')
  const [sent, setSent] = useState(false)
  return <BusinessShell tone="lavender"><PageTitle eyebrow="AVIS RÉCENT" title="Réponds avec attention." /><article className="review-card"><strong>★★★★★ · Léa</strong><p>Accueil chaleureux et brunch généreux. Une vraie bonne adresse du centre.</p><span>Visite vérifiée · Il y a 2 h</span></article><Field label="Votre réponse" multiline value={answer} onChange={setAnswer} />{sent && <p className="inline-success">Réponse publiée.</p>}<Button full onClick={() => setSent(true)}>Publier la réponse</Button></BusinessShell>
}

export function BusinessSubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof businessPlans)[number]['name']>('Découverte')
  return <BusinessShell className="business-subscription-fidelity"><PageTitle eyebrow="ABONNEMENT" title="Votre formule" body="Changez ou annulez à tout moment." /><div className="business-plan-grid">{businessPlans.map((offer) => { const selected = selectedPlan === offer.name; return <article className={`business-plan-card${offer.recommended ? ' is-recommended' : ''}${selected ? ' is-selected' : ''}`} key={offer.name}>{offer.recommended && <span className="business-plan-recommended">RECOMMANDÉ</span>}<h2>{offer.name}</h2><strong>{offer.price}</strong><p>{offer.description}</p><ul>{offer.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><button type="button" aria-pressed={selected} onClick={() => setSelectedPlan(offer.name)}>{selected ? 'Formule sélectionnée' : `Choisir ${offer.name}`}</button></article> })}</div><p className="business-plan-status" role="status">Formule sélectionnée : <strong>{selectedPlan}</strong></p><p className="business-plan-note">Tarifs de lancement · TVA comprise</p><section className="business-account-tools"><h2>Outils de mon espace</h2><ListRow title="QR de visite" subtitle="Afficher et renouveler" to="/business/qr" /><ListRow title="Équipe et rôles" subtitle="Gérer les accès" to="/business/team" /><ListRow title="Intégrations" subtitle="Connecter mes outils" to="/business/integrations" /><ListRow title="Sécurité" subtitle="Protéger mon compte" to="/business/security" /><ListRow title="Aide et support" subtitle="Obtenir de l’aide" to="/business/support" /></section></BusinessShell>
}

export function BusinessReviewsCampaignScreen() {
  const [sent, setSent] = useState(false)
  const [channel, setChannel] = useState('SMS et e-mail')
  const [message, setMessage] = useState('Merci d’être passé chez Café Moka. Ton expérience peut aider le quartier : partage un avis honnête sur Referio.')
  function updateCampaign(update: () => void) {
    update()
    setSent(false)
  }
  return <BusinessShell tone="lavender"><PageTitle eyebrow="AVIS ÉTHIQUES" title="Demande un retour, jamais une faveur." body="Le message est envoyé uniquement après une visite vérifiée." /><Field label="Canal" value={channel} onChange={(value) => updateCampaign(() => setChannel(value))} helper="Exemples : SMS, e-mail ou les deux." /><Field label="Message" multiline value={message} onChange={(value) => updateCampaign(() => setMessage(value))} />{sent && <StateCard label="CAMPAGNE PRÊTE" title="126 clients éligibles" body={`Prévisualisation via ${channel || 'le canal choisi'} : « ${message} »`} />}<Button full disabled={!channel.trim() || !message.trim()} onClick={() => setSent(true)}>Prévisualiser la campagne</Button></BusinessShell>
}

const supportScreens = {
  team: ['ÉQUIPE & RÔLES', 'Les bonnes personnes, avec le bon niveau d’accès.', ['Omer · Propriétaire', 'Léa · Gestionnaire', 'Nora · Éditrice']],
  integrations: ['INTÉGRATIONS', 'Connecte les outils qui font déjà tourner ton commerce.', ['Google Business Profile', 'Caisse / POS', 'Calendrier', 'Webhook']],
  security: ['SÉCURITÉ', 'Protège l’accès à Café Moka.', ['Double authentification', 'Appareils connectés', 'Historique de connexion', 'Clés API']],
  support: ['SUPPORT', 'Décris le problème, nous gardons le fil.', ['Centre d’aide', 'Incident QR', 'Question abonnement']],
} as const

export function BusinessUtilityScreen({ kind }: { kind: keyof typeof supportScreens }) {
  const [done, setDone] = useState(false)
  const [supportSubject, setSupportSubject] = useState('Question sur ma fiche')
  const [supportDescription, setSupportDescription] = useState('')
  const [eyebrow, title, items] = supportScreens[kind]
  const supportReady = supportSubject.trim().length > 2 && supportDescription.trim().length > 5
  return <BusinessShell tone={kind === 'security' ? 'info' : 'light'}><PageTitle eyebrow={eyebrow} title={title} />{items.map((item) => <ListRow key={item} title={item} subtitle={kind === 'integrations' ? 'Configurer' : kind === 'team' ? 'Accès actif' : 'Consulter'} />)}{kind === 'support' && <><Field label="Sujet" value={supportSubject} onChange={(value) => { setSupportSubject(value); setDone(false) }} /><Field label="Description" multiline value={supportDescription} onChange={(value) => { setSupportDescription(value); setDone(false) }} placeholder="Explique le contexte…" helper="Décrivez le problème en quelques mots." /></>}{done && <p className="inline-success" role="status">{kind === 'support' ? 'Demande envoyée au support.' : 'Action simulée avec succès.'}</p>}<div className="screen-spacer" /><Button full disabled={kind === 'support' && !supportReady} onClick={() => setDone(true)}>{kind === 'team' ? 'Inviter une personne' : kind === 'support' ? 'Envoyer la demande' : 'Enregistrer'}</Button></BusinessShell>
}
