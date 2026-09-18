import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Chip, Field, MerchantCard, PageTitle, PassportCard, PointsCard, StateCard } from '../components/ui'
import { merchants, prototypeRoutes } from '../data/demo'
import { useDemo } from '../state/DemoContext'

export function PrototypeHubScreen() {
  const { state, reset } = useDemo()
  return (
    <main className="hub-page">
      <header><div><span>REFERIO · MODE PRÉSENTATION</span><h1>Hub du prototype</h1><p>Lance un parcours, inspecte un composant ou restaure l’état initial.</p></div><Link className="wordmark" to="/client/home"><span className="wordmark__dot" />referio.</Link></header>
      <section className="hub-scenario"><div><span>SCÉNARIO PRIORITAIRE</span><h2>Découverte → visite → avis → récompense</h2><p>Le compte démarre à proximité d’un changement de niveau. Le parcours déclenche des Points locaux, un tampon, un badge et une récompense.</p></div><Link className="button button--primary" to="/client/home">Lancer le scénario Client</Link></section>
      <section className="hub-grid"><Link to="/client/home"><span>01</span><h2>Client</h2><p>Découverte, visite vérifiée, avis, passeports et progression.</p></Link><Link to="/business/landing"><span>02</span><h2>Business</h2><p>Onboarding, fiche, QR, offres, avis et statistiques.</p></Link><Link to="/admin/login"><span>03</span><h2>Admin</h2><p>Vérification, modération, appels et anti-fraude.</p></Link><Link to="/web/business"><span>04</span><h2>Web desktop</h2><p>Landing, accueil Client et cockpit Business.</p></Link></section>
      <section className="hub-state"><div><span>ÉTAT COURANT</span><strong>{state.points.toLocaleString('fr-BE')} points · {state.level}</strong><p>{state.stamps}/6 tampons · badge {state.badgeUnlocked ? 'débloqué' : 'à débloquer'} · récompense {state.rewardUnlocked ? 'disponible' : 'verrouillée'}</p></div><Button variant="ghost" onClick={reset}>Réinitialiser la démo</Button></section>
      <div className="hub-columns"><section><h2>Accès rapide Client</h2>{prototypeRoutes.client.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}</section><section><h2>Accès rapide Business</h2>{prototypeRoutes.business.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}</section><section><h2>Contrôle</h2>{prototypeRoutes.admin.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}<Link to="/design-system">Design system<span>›</span></Link></section></div>
    </main>
  )
}

export function DesignSystemScreen() {
  const { state } = useDemo()
  const [feedback, setFeedback] = useState('')
  return (
    <main className="design-system-page">
      <header><div><span>REFERIO PRODUCT LIBRARY V2</span><h1>Design system</h1><p>Variables, composants et états réutilisés par le prototype.</p></div><Link className="button button--secondary" to="/hub">Retour au hub</Link></header>
      <section><PageTitle eyebrow="FONDATIONS" title="Couleurs et surfaces" /><div className="swatches">{[['Forest', '#243838'], ['Lime', '#B2FA63'], ['Sun', '#FF7833'], ['Lavender', '#B2A1FF'], ['Cream', '#F6F7F7'], ['Ink', '#1A2020']].map(([name, color]) => <div key={name}><i style={{ background: color }} /><strong>{name}</strong><code>{color}</code></div>)}</div></section>
      <section><PageTitle eyebrow="TYPOGRAPHIE" title="Archivo + Inter" /><div className="type-specimen"><h1>Display XL · 34</h1><h2>Title LG · 28</h2><h3>Title MD · 22</h3><p>Body · Inter Regular 16. La confiance locale vient du vécu.</p><small>CAPTION · INTER SEMI BOLD 12</small></div></section>
      <section><PageTitle eyebrow="ACTIONS" title="Boutons, chips et champs" /><div className="component-row"><Button onClick={() => setFeedback('Action principale')}>Action principale</Button><Button variant="secondary" onClick={() => setFeedback('Action secondaire')}>Action secondaire</Button><Button variant="ghost" onClick={() => setFeedback('Action discrète')}>Action discrète</Button><Button disabled>Désactivée</Button></div>{feedback && <p className="inline-success" role="status">Composant activé : {feedback}.</p>}<div className="component-row"><Chip active>Actif</Chip><Chip>Inactif</Chip><Chip tone="new">Nouveau</Chip></div><div className="field-demo"><Field label="Adresse e-mail" value="lana@exemple.be" helper="Nous ne partagerons jamais ton adresse." /></div></section>
      <section><PageTitle eyebrow="COMPOSANTS" title="Cartes produit" /><div className="card-grid"><PointsCard points={state.points} level={state.level} /><PassportCard stamps={state.stamps} /><MerchantCard merchant={merchants[0]} /><StateCard label="VISITE VÉRIFIÉE" title="+50 points locaux" body="La progression et le passeport sont à jour." /><StateCard tone="error" label="PREUVE NON VALIDÉE" title="Réessaie près du comptoir" body="Aucune progression n’a été modifiée." /></div></section>
      <section><PageTitle eyebrow="RÈGLES" title="Contrat visuel" /><ul className="design-rules"><li>Jamais de texte blanc sur Sun.</li><li>Lime n’est jamais une couleur de texte.</li><li>Aucun bouton outline.</li><li>Glassmorphism réservé aux avis.</li><li>Gradients de célébration réservés aux récompenses.</li><li>« points locaux », jamais XP.</li></ul></section>
    </main>
  )
}
