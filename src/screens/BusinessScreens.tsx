import { useState } from 'react'
import type { ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button, Field, ListRow, PageTitle, StateCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

function BusinessHeader() {
  return <div className="business-kicker"><Link to="/hub">REFERIO BUSINESS</Link><Link to="/business/dashboard">Tableau de bord</Link></div>
}

function BusinessShell({ children, tone = 'light', showHeader = true, className = '' }: { children: ReactNode; tone?: 'light' | 'forest' | 'sun' | 'lavender' | 'info' | 'lime'; showHeader?: boolean; className?: string }) {
  return <AppShell tone={tone} statusBar={showHeader} className={`${showHeader ? 'business-shell' : 'business-shell business-dashboard-shell'} ${className}`.trim()}>{showHeader && <BusinessHeader />}{children}</AppShell>
}

export function BusinessLandingScreen() {
  const navigate = useNavigate()
  return (
    <BusinessShell tone="forest">
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
  return (
    <BusinessShell>
      <PageTitle eyebrow="ESPACE PRO" title="Pilote ta présence locale." body="Connexion simulée pour le prototype." />
      <Field label="Adresse e-mail professionnelle" value="bonjour@cafemoka.be" />
      <Field label="Mot de passe" value="referio-demo" />
      <Link className="text-link" to="/business/support">Mot de passe oublié&nbsp;?</Link>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/business/dashboard')}>Se connecter</Button>
      <Button full variant="ghost" onClick={() => navigate('/business/plans')}>Créer un compte</Button>
    </BusinessShell>
  )
}

export function BusinessPlansScreen() {
  const [plan, setPlan] = useState('Pro')
  const navigate = useNavigate()
  return (
    <BusinessShell tone="lavender">
      <PageTitle eyebrow="ABONNEMENT" title="Choisis l’élan adapté à ton commerce." />
      {[
        ['Gratuit', '0 €', 'Fiche vérifiée et QR de visite'],
        ['Pro', '39 €/mois', 'Statistiques, offres et campagnes'],
        ['Réseau', 'Sur devis', 'Plusieurs établissements et équipe'],
      ].map(([name, price, body]) => <button type="button" className={`plan-card${plan === name ? ' is-selected' : ''}`} onClick={() => setPlan(name)} key={name}><span>{name === 'Pro' ? 'RECOMMANDÉ' : 'OFFRE'}</span><h2>{name}</h2><strong>{price}</strong><p>{body}</p></button>)}
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/claim')}>Continuer avec {plan}</Button>
    </BusinessShell>
  )
}

export function BusinessClaimScreen() {
  const navigate = useNavigate()
  return (
    <BusinessShell>
      <PageTitle eyebrow="REVENDICATION" title="Retrouve ton commerce." body="Nous vérifions que tu peux bien le représenter." />
      <Field label="Nom ou adresse" value="Café Moka" />
      <button type="button" className="claim-card" onClick={() => navigate('/business/verification')}><strong>Café Moka</strong><span>Rue de Dampremy 18 · Charleroi</span><b>Revendiquer</b></button>
      <button type="button" className="claim-card" onClick={() => navigate('/business/verification')}><strong>Moka Corner</strong><span>Boulevard Tirou 42 · Charleroi</span><b>Revendiquer</b></button>
      <div className="screen-spacer" /><Button full variant="ghost" onClick={() => navigate('/business/onboarding/info')}>Mon commerce n’apparaît pas</Button>
    </BusinessShell>
  )
}

export function BusinessVerificationScreen() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  return (
    <BusinessShell tone="info">
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
  return (
    <BusinessShell>
      <PageTitle eyebrow="1 SUR 3 · INFORMATIONS" title="Présente ton commerce clairement." />
      <Field label="Nom public" value="Café Moka" /><Field label="Catégorie" value="Café · Brunch" /><Field label="Adresse" value="Rue de Dampremy 18, Charleroi" /><Field label="Téléphone" value="071 00 00 00" /><Field label="Site web" value="https://cafemoka.example" />
      <Button full onClick={() => navigate('/business/onboarding/hours')}>Continuer</Button>
    </BusinessShell>
  )
}

export function BusinessHoursScreen() {
  const navigate = useNavigate()
  const [closedSunday, setClosedSunday] = useState(true)
  return (
    <BusinessShell>
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
    <BusinessShell tone="sun">
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
    <BusinessShell>
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
    <BusinessShell showHeader={false}>
      <PageTitle eyebrow="Espace pro · Café Central" title="Votre visibilité" />
      <section className="business-score-card">
        <div className="score-ring" aria-label={`${state.businessCompleteness} sur 100`} />
        <div className="business-score-copy">
          <strong>{state.businessCompleteness}/100</strong>
          <p>Score de visibilité · ▲ +6 cette semaine</p>
          <Link to="/business/visibility">Améliorer</Link>
        </div>
      </section>
      <section className="business-tasks">
        <h2>Tâches prioritaires</h2>
        <Link to="/business/profile" className="business-task-row"><span aria-hidden="true" /><strong>✓ Ajouter vos horaires</strong></Link>
        <Link to="/business/reviews" className="business-task-row"><span aria-hidden="true" /><strong>Répondre à 3 avis récents</strong></Link>
        <Link to="/business/publish" className="business-task-row"><span aria-hidden="true" /><strong>Publier une photo de vos plats</strong></Link>
      </section>
      <div className="dashboard-stats dashboard-stats--three"><article><strong>1 240</strong><span>Vues</span></article><article><strong>86</strong><span>Appels</span></article><article><strong>214</strong><span>Itinéraires</span></article></div>
      <Link className="business-review-pending" to="/business/reviews"><span>Avis en attente</span><strong>Sophie D. · ★ 4,0 · « Très bon accueil, service un peu lent… »</strong><b>Répondre</b></Link>
      <Link className="business-booster" to="/business/visibility">Booster ma visibilité</Link>
      <nav className="business-nav"><Link to="/business/dashboard" className="is-active">Tableau</Link><Link to="/business/profile">Fiche</Link><Link to="/business/publish">Publier</Link><Link to="/business/stats">Stats</Link><Link to="/business/subscription">Compte</Link></nav>
    </BusinessShell>
  )
}

export function BusinessVisibilityScreen() {
  const { state } = useDemo()
  return (
    <BusinessShell tone="lime">
      <PageTitle eyebrow="VISIBILITÉ" title="Booster ma visibilité" body="Chaque amélioration rend Café Moka plus facile à choisir." />
      <section className="business-score-card"><div className="score-ring" style={{ background: `conic-gradient(var(--sun) ${state.businessCompleteness}%, var(--white) 0)` }}><span><strong>{state.businessCompleteness}</strong><small>/100</small></span></div><div><span>SCORE ACTUEL</span><h2>Encore trois actions utiles.</h2><Link to="/business/checklist">Ouvrir la checklist ›</Link></div></section>
      <div className="business-priorities"><Link to="/business/profile"><span>+8</span><strong>Ajouter les horaires spéciaux</strong><b>5 min</b></Link><Link to="/business/publish"><span>+6</span><strong>Publier une offre locale</strong><b>Créer</b></Link><Link to="/business/review-campaign"><span>+4</span><strong>Demander des avis honnêtes</strong><b>Lancer</b></Link></div>
      <StateCard label="CONSEIL REFERIO" title="La régularité compte plus que le volume" body="Une fiche à jour et des réponses utiles améliorent durablement la confiance." />
      <nav className="business-nav"><Link to="/business/dashboard">Tableau</Link><Link to="/business/profile">Fiche</Link><Link to="/business/publish">Publier</Link><Link to="/business/stats">Stats</Link><Link to="/business/subscription">Compte</Link></nav>
    </BusinessShell>
  )
}

export function BusinessChecklistScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const tasks = ['Commerce vérifié', 'Profil complété', 'QR de visite affiché', 'Première offre publiée']
  return (
    <BusinessShell tone="lime">
      <PageTitle eyebrow="LANCEMENT" title="Ta fiche est prête à vivre." body={`${state.businessCompleteness} % complété`} />
      <div className="progress progress--large"><i style={{ width: `${state.businessCompleteness}%` }} /></div>
      {tasks.map((task, index) => <button type="button" className="task-row" key={task} onClick={() => dispatch({ type: 'COMPLETE_BUSINESS_STEP' })}><span className={index < 3 ? 'is-done' : ''}>{index < 3 ? '✓' : index + 1}</span><strong>{task}</strong><b>{index < 3 ? 'Terminé' : 'À faire'}</b></button>)}
      <div className="screen-spacer" /><Button full onClick={() => navigate('/business/dashboard')}>Ouvrir mon tableau de bord</Button>
    </BusinessShell>
  )
}

export function BusinessQrScreen() {
  const [renewed, setRenewed] = useState(false)
  return (
    <BusinessShell>
      <PageTitle eyebrow="QR DE VISITE" title="Un code vivant, prêt pour la caisse." body="Le renouvellement protège les visites contre les copies." />
      <div className="business-qr"><QRCodeSVG value={renewed ? 'referio://visit/cafe-moka/demo-2' : 'referio://visit/cafe-moka/demo-1'} size={215} bgColor="#FFFFFF" fgColor="#243838" level="M" title="QR de démonstration Café Moka" /><strong>CAFÉ MOKA</strong><span>{renewed ? 'Code renouvelé à l’instant' : 'Rotation automatique active'}</span></div>
      <Button full onClick={() => window.print()}>Télécharger le support</Button>
      <Button full variant="ghost" onClick={() => setRenewed(true)}>Renouveler maintenant</Button>
    </BusinessShell>
  )
}

export function BusinessProfileScreen() {
  const [saved, setSaved] = useState(false)
  return <BusinessShell className="business-profile-shell">
    <PageTitle eyebrow="MA FICHE" title="Café Central" body="Maintiens les informations publiques utiles et vérifiables." />
    <div className="business-profile-workspace">
      <section className="business-profile-form">
        <h2>Informations publiques</h2>
        <Field label="Description" multiline value="Un café de quartier lumineux, des produits maison et une équipe attentive." />
        <div className="business-profile-fields"><Field label="Adresse" value="Rue de la Montagne 12, Charleroi" /><Field label="Téléphone" value="071 00 00 00" /></div>
        <Button full onClick={() => setSaved(true)}>{saved ? 'Fiche enregistrée' : 'Enregistrer les changements'}</Button>
      </section>
      <aside className="business-profile-preview">
        <span>APERÇU PUBLIC</span>
        <img src={asset('business-asset-3.jpg')} alt="Aperçu du Café Central" />
        <div><h2>Café Central</h2><p>Café · Brunch · Charleroi centre</p><strong>★ 4,9 · Visite vérifiée</strong></div>
      </aside>
    </div>
  </BusinessShell>
}

export function BusinessStatsScreen() {
  return <BusinessShell tone="info"><PageTitle eyebrow="STATISTIQUES" title="Les visites racontent mieux que les clics." /><div className="chart-card"><strong>Visites vérifiées</strong><div className="bar-chart">{[42, 58, 38, 72, 84, 68, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span>+28 % sur les 30 derniers jours</span></div><div className="dashboard-stats"><article><strong>87</strong><span>visites</span></article><article><strong>31</strong><span>avis</span></article><article><strong>4,8</strong><span>note</span></article><article><strong>19 %</strong><span>retours</span></article></div></BusinessShell>
}

export function BusinessPublishScreen() {
  const [published, setPublished] = useState(false)
  return <BusinessShell tone="sun"><PageTitle eyebrow="OFFRE" title="Donne une bonne raison de passer." /><Field label="Titre" value="Une pâtisserie offerte" /><Field label="Conditions" multiline value="Avec deux boissons chaudes, du lundi au vendredi." /><Field label="Fin de l’offre" value="30 septembre" />{published && <StateCard label="OFFRE PUBLIÉE" title="Visible dès maintenant" body="Elle apparaît sur votre fiche publique." />}<div className="screen-spacer" /><Button full onClick={() => setPublished(true)}>Publier l’offre</Button></BusinessShell>
}

export function BusinessReviewsScreen() {
  const [answer, setAnswer] = useState('Merci pour votre visite, à très bientôt chez Café Central !')
  const [sent, setSent] = useState(false)
  return <BusinessShell tone="lavender"><PageTitle eyebrow="AVIS RÉCENT" title="Réponds avec attention." /><article className="review-card"><strong>★★★★★ · Léa</strong><p>Accueil chaleureux et brunch généreux. Une vraie bonne adresse du centre.</p><span>Visite vérifiée · Il y a 2 h</span></article><Field label="Votre réponse" multiline value={answer} onChange={setAnswer} />{sent && <p className="inline-success">Réponse publiée.</p>}<Button full onClick={() => setSent(true)}>Publier la réponse</Button></BusinessShell>
}

export function BusinessSubscriptionScreen() {
  const navigate = useNavigate()
  return <BusinessShell><PageTitle eyebrow="ABONNEMENT" title="Formule Pro" body="39 € par mois · Simulation sans paiement." /><ListRow title="Statistiques détaillées" subtitle="Actif" /><ListRow title="Offres et campagnes" subtitle="Actif" /><ListRow title="Équipe" subtitle="Jusqu’à 5 personnes" /><ListRow title="Facturation" subtitle="Aucune carte enregistrée dans le prototype" /><Button full variant="ghost" onClick={() => navigate('/business/plans')}>Changer de formule</Button></BusinessShell>
}

export function BusinessReviewsCampaignScreen() {
  const [sent, setSent] = useState(false)
  return <BusinessShell tone="lavender"><PageTitle eyebrow="AVIS ÉTHIQUES" title="Demande un retour, jamais une faveur." body="Le message est envoyé uniquement après une visite vérifiée." /><Field label="Canal" value="SMS et e-mail" /><Field label="Message" multiline value="Merci d’être passé chez Café Moka. Ton expérience peut aider le quartier : partage un avis honnête sur Referio." />{sent && <StateCard label="CAMPAGNE PRÊTE" title="126 clients éligibles" body="Envoi simulé pour la démonstration." />}<Button full onClick={() => setSent(true)}>Prévisualiser la campagne</Button></BusinessShell>
}

const supportScreens = {
  team: ['ÉQUIPE & RÔLES', 'Les bonnes personnes, avec le bon niveau d’accès.', ['Omer · Propriétaire', 'Léa · Gestionnaire', 'Nora · Éditrice']],
  integrations: ['INTÉGRATIONS', 'Connecte les outils qui font déjà tourner ton commerce.', ['Google Business Profile', 'Caisse / POS', 'Calendrier', 'Webhook']],
  security: ['SÉCURITÉ', 'Protège l’accès à Café Moka.', ['Double authentification', 'Appareils connectés', 'Historique de connexion', 'Clés API']],
  support: ['SUPPORT', 'Décris le problème, nous gardons le fil.', ['Centre d’aide', 'Incident QR', 'Question abonnement']],
} as const

export function BusinessUtilityScreen({ kind }: { kind: keyof typeof supportScreens }) {
  const [done, setDone] = useState(false)
  const [eyebrow, title, items] = supportScreens[kind]
  return <BusinessShell tone={kind === 'security' ? 'info' : 'light'}><PageTitle eyebrow={eyebrow} title={title} />{items.map((item) => <ListRow key={item} title={item} subtitle={kind === 'integrations' ? 'Configurer' : kind === 'team' ? 'Accès actif' : 'Consulter'} />)}{kind === 'support' && <Field label="Description" multiline placeholder="Explique le contexte…" />}{done && <p className="inline-success">Action simulée avec succès.</p>}<div className="screen-spacer" /><Button full onClick={() => setDone(true)}>{kind === 'team' ? 'Inviter une personne' : kind === 'support' ? 'Envoyer la demande' : 'Enregistrer'}</Button></BusinessShell>
}
