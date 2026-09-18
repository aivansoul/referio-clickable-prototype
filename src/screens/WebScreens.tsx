import { Link } from 'react-router-dom'
import { DesktopShell } from '../components/AppShell'
import { MerchantCard, PointsCard } from '../components/ui'
import { merchants } from '../data/demo'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

export function WebBusinessLandingScreen() {
  return (
    <DesktopShell area="business">
      <header className="web-header"><Link className="wordmark" to="/hub"><span className="wordmark__dot" />referio.</Link><nav><a href="#benefits">Pourquoi Referio</a><Link to="/business/login">Connexion</Link><Link className="button button--primary" to="/business/landing">Créer ma fiche</Link></nav></header>
      <section className="web-hero"><div><span>LA CONFIANCE LOCALE, MESURABLE</span><h1>Transforme les recommandations en visites réelles.</h1><p>Referio aide les commerces indépendants à être découverts, choisis et revisités grâce à des expériences vérifiées.</p><div><Link className="button button--primary" to="/business/landing">Créer ma fiche</Link><Link className="button button--ghost" to="/business/dashboard">Voir le cockpit</Link></div></div><img src={asset('business-asset-1.jpg')} alt="Commerçante locale" /></section>
      <section className="web-benefits" id="benefits"><article><span>01</span><h2>Une présence crédible</h2><p>Commerce, visites et avis vérifiés.</p></article><article><span>02</span><h2>Des actions concrètes</h2><p>QR, offres et fidélité locale.</p></article><article><span>03</span><h2>Un impact visible</h2><p>Suivez les visites, pas seulement les clics.</p></article></section>
    </DesktopShell>
  )
}

export function WebClientHomeScreen() {
  const { state } = useDemo()
  return (
    <DesktopShell area="client">
      <header className="web-header"><Link className="wordmark" to="/client/home"><span className="wordmark__dot" />referio.</Link><nav><Link to="/client/discover">Découvrir</Link><Link to="/client/map">Carte</Link><Link to="/client/ranking">Classement</Link><Link to="/client/profile">Profil</Link></nav></header>
      <section className="desktop-client-intro"><div><span>CHARLEROI</span><h1>Bonjour Lana, envie de découvrir quoi aujourd’hui&nbsp;?</h1><Link className="desktop-search" to="/client/search">Rechercher un commerce…</Link></div><PointsCard points={state.points} level={state.level} /></section>
      <section className="desktop-merchants"><div className="section-heading"><h2>Pépites près de toi</h2><Link to="/client/discover">Tout découvrir</Link></div><div>{merchants.map((merchant) => <MerchantCard key={merchant.id} merchant={merchant} />)}</div></section>
    </DesktopShell>
  )
}

export function WebBusinessCockpitScreen() {
  const { state } = useDemo()
  return (
    <DesktopShell area="business">
      <aside className="cockpit-sidebar"><Link className="wordmark" to="/hub"><span className="wordmark__dot" />referio.</Link><p>Café Moka</p>{['Vue d’ensemble', 'Visibilité', 'Ma fiche', 'Avis', 'Offres', 'Statistiques', 'Équipe'].map((item, index) => <Link className={index === 0 ? 'is-active' : ''} to={index === 0 ? '/business/dashboard' : '/business/profile'} key={item}>{item}</Link>)}</aside>
      <section className="cockpit-main"><header><span>CAFÉ MOKA · CHARLEROI</span><h1>Bonjour Omer</h1><p>Voici ce qui fait bouger votre visibilité locale.</p></header><div className="cockpit-grid"><article><span>Score de visibilité</span><strong>{state.businessCompleteness}/100</strong><div className="progress"><i style={{ width: `${state.businessCompleteness}%` }} /></div><Link to="/business/checklist">Compléter la fiche</Link></article><article><span>Visites vérifiées</span><strong>87</strong><small>+28 % ce mois</small></article><article><span>Note moyenne</span><strong>4,8</strong><small>126 avis</small></article><article className="cockpit-chart"><h2>Visites sur 7 jours</h2><div className="bar-chart">{[42, 58, 38, 72, 84, 68, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article><article className="cockpit-reviews"><h2>Avis récents</h2><p>« Une vraie bonne adresse du centre. »</p><Link to="/business/reviews">Répondre</Link><p>« Très bon café et accueil attentionné. »</p></article><article className="cockpit-banner"><strong>Votre première offre est prête à être publiée.</strong><Link className="button button--primary" to="/business/publish">Publier maintenant</Link></article></div></section>
    </DesktopShell>
  )
}
