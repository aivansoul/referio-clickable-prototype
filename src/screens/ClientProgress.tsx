import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Badge, Button, Chip, Icon, ListRow, PageTitle, PassportCard, StampBadge, StateCard } from '../components/ui'
import { merchants } from '../data/demo'
import { useDemo } from '../state/DemoContext'
import { motionTransition } from '../motion'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

export function PassportsScreen() {
  const { state } = useDemo()
  return (
    <AppShell tone="sun" bottomNav>
      <PageTitle eyebrow="FIDÉLITÉ PARTAGÉE" title="Tes habitudes locales, réunies." body="Chaque commerce garde ses propres tampons et avantages." />
      <Link to="/client/passports/cafe-moka"><PassportCard stamps={state.stamps} merchant="Café Moka" /></Link>
      <PassportCard stamps={2} merchant="Maison Dune" />
      <PassportCard stamps={1} merchant="Studio Nola" />
    </AppShell>
  )
}

export function PassportDetailScreen() {
  const { state } = useDemo()
  const navigate = useNavigate()
  return (
    <AppShell tone="sun">
      <PageTitle eyebrow="CAFÉ MOKA" title="Ta prochaine visite débloque une récompense." />
      <PassportCard stamps={state.stamps} merchant="Café Moka" />
      <section className="reward-next"><span>PROCHAINE RÉCOMPENSE</span><h2>Une boisson au choix</h2><p>Valable pendant 30 jours après le sixième tampon.</p></section>
      <h2 className="subheading">Historique</h2>
      <div className="history-row"><span><b>Aujourd’hui</b><small>Visite vérifiée · 10:42</small></span><strong>+1 tampon</strong></div>
      <div className="history-row"><span><b>19 août</b><small>Visite vérifiée · 16:18</small></span><strong>+1 tampon</strong></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/merchant/cafe-central')}>Voir le commerce</Button>
    </AppShell>
  )
}

export function PointsHistoryScreen() {
  const { state } = useDemo()
  const rows = [
    ['Visite vérifiée · Café Moka', 'Aujourd’hui · 10:42', '+50'],
    ['Avis vérifié · Maison Dune', 'Hier · 18:05', '+30'],
    ['Découverte du jour', 'Hier · 12:17', '+5'],
    ['Challenge centre-ville', '18 août · 16:21', '+150'],
  ]
  return (
    <AppShell>
      <PageTitle eyebrow="POINTS LOCAUX" title="Ton impact local, point par point." />
      <section className="balance-card"><span>SOLDE DISPONIBLE</span><strong>{state.balance.toLocaleString('fr-BE')}</strong><small>{state.points.toLocaleString('fr-BE')} points cumulés · {state.level}</small></section>
      <div className="chip-row"><Chip active>Tous</Chip><Chip>Gagnés</Chip><Chip>Utilisés</Chip></div>
      <div className="history-list">
        {rows.map(([title, date, points]) => <div className="history-row" key={title}><span><b>{title}</b><small>{date}</small></span><strong>{points}</strong></div>)}
      </div>
    </AppShell>
  )
}

export function ChallengesScreen() {
  return (
    <AppShell tone="lavender" bottomNav className="challenges-shell">
      <PageTitle eyebrow="CHALLENGES" title="Explore ton quartier autrement." body="Des missions simples qui font vivre les bonnes adresses." />
      <Link to="/client/challenges/centre-ville" className="challenge-card">
        <StampBadge name="serieLocale" /><div><Badge variant="new">EN COURS</Badge><h2>Le tour des boulangeries</h2><p>2 / 5 · Se termine dimanche</p><strong>+150 points locaux</strong><div className="progress"><i style={{ width: '40%' }} /></div></div>
      </Link>
      <article className="challenge-card"><StampBadge name="premiereVisite" /><div><span>NOUVEAU</span><h2>Premier avis</h2><p>Partage un avis après une visite vérifiée.</p><strong>+30 points locaux</strong></div></article>
      <article className="challenge-card"><StampBadge name="ambassadeur" locked /><div><span>À DÉBLOQUER</span><h2>Ambassadeur</h2><p>Inspire 5 amis à découvrir local.</p><strong>Timbre Ambassadeur</strong></div></article>
      <article className="challenge-card"><StampBadge name="explorateur" /><div><span>SÉRIE · 6 JOURS</span><h2>Explorateur de quartier</h2><p>Découvre une adresse par jour.</p><strong>Timbre Explorateur</strong></div></article>
    </AppShell>
  )
}

export function ChallengeDetailScreen() {
  const navigate = useNavigate()
  return (
    <AppShell tone="lavender">
      <PageTitle eyebrow="CHALLENGE LOCAL" title="Le tour des boulangeries." body="Cinq adresses artisanales à découvrir avant dimanche." />
      <section className="challenge-progress"><strong>2 / 5</strong><span>Encore trois découvertes</span><div className="progress"><i style={{ width: '40%' }} /></div></section>
      <h2 className="subheading">Ta progression</h2>
      <StateCard label="VALIDÉ" title="Café Moka" body="Café · Visite vérifiée aujourd’hui" />
      <StateCard label="VALIDÉ" title="Maison Dune" body="Boulangerie · Visite vérifiée hier" />
      <StateCard tone="info" label="À DÉCOUVRIR" title="Une adresse shopping" body="Choisis un commerce vérifié du centre." />
      <img className="challenge-visual" src={asset('challenge-photo.jpg')} alt="Commerces du centre-ville" />
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/daily')}>Voir les commerces proches</Button>
    </AppShell>
  )
}

export function ChallengeSuccessScreen() {
  const navigate = useNavigate()
  const [shared, setShared] = useState(false)
  const reduced = useReducedMotion()
  return (
    <AppShell tone="lavender">
      <PageTitle eyebrow="CHALLENGE RÉUSSI" title="Trois découvertes. Un quartier plus vivant." />
      <motion.section className="celebration" initial={reduced ? false : { scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={reduced ? { duration: 0 } : motionTransition.slow}>
        <Icon name="star" /><strong>+150</strong><p>points locaux</p><b>Niveau Local Hero consolidé</b>
      </motion.section>
      <div className="merchant-mini"><img src={asset('challenge-photo.jpg')} alt="Commerces du centre-ville" /><div><strong>Centre-ville</strong><p>3 adresses découvertes</p></div></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/rewards')}>Découvrir la sélection</Button>
      {shared && <p className="inline-success" role="status">Challenge partagé dans la démonstration.</p>}
      <Button full variant="ghost" onClick={() => setShared(true)}>Partager</Button>
    </AppShell>
  )
}

export function RewardsScreen() {
  const { state } = useDemo()
  return (
    <AppShell tone="sun" bottomNav className="rewards-shell">
      <PageTitle eyebrow="RÉCOMPENSES" title="Des avantages qui restent dans le quartier." />
      <section className="balance-inline"><span>Solde disponible</span><strong>{state.balance.toLocaleString('fr-BE')} points locaux</strong></section>
      <Link to="/client/rewards/atelier-basilic" className={`reward-card${state.rewardUnlocked ? '' : ' is-locked'}`}>
        <img className="reward-card__media" src={asset('reward-catalog-1.jpg')} alt="Café chez Café Central" />
        <Badge variant="reward">200 points locaux</Badge><h2>Café offert</h2><strong>200 points locaux</strong><p>Café Central · Jusqu’au 30 septembre</p>
      </Link>
      <article className="reward-card"><img className="reward-card__media" src={asset('reward-catalog-2.jpg')} alt="Bouquet local" /><Badge variant="reward">350 points locaux</Badge><h2>−5 € sur un bouquet</h2><strong>350 points locaux</strong><p>Atelier Vert · Valable 30 jours</p></article>
      <article className="reward-card"><img className="reward-card__media" src={asset('reward-catalog-3.jpg')} alt="Pâtisserie locale" /><Badge variant="reward">150 points locaux</Badge><h2>Pâtisserie offerte</h2><strong>150 points locaux</strong><p>Boulangerie Louise · Valable 30 jours</p></article>
      <article className="reward-card is-locked"><img className="reward-card__media" src={asset('reward-photo.jpg')} alt="Brunch local" /><span>VERROUILLÉE</span><h2>Brunch pour deux</h2><strong>800 points locaux</strong><p>Niveau Légende locale requis</p></article>
    </AppShell>
  )
}

export function RewardDetailScreen() {
  const { state } = useDemo()
  const navigate = useNavigate()
  return (
    <AppShell tone="sun">
      <PageTitle eyebrow="RÉCOMPENSE" title="Un café offert chez Café Central." />
      <section className="reward-card"><h2>Café offert</h2><strong>200 points locaux</strong><p>Disponible jusqu’au 30 septembre</p></section>
      <div className="merchant-mini"><img src={merchants[0].image} alt="Café Central" /><div><strong>Café Central</strong><p>Café · 450 m · 4,9</p></div></div>
      <div className="terms"><p>À présenter avant l’addition.</p><p>Une activation par personne.</p><p>Valable 15 minutes après activation.</p></div>
      <img className="reward-visual" src={asset('reward-catalog-1.jpg')} alt="Café offert chez Café Central" />
      <Button full disabled={!state.rewardUnlocked || state.balance < 200} onClick={() => navigate('/client/rewards/atelier-basilic/active')}>
        {state.rewardUnlocked ? 'Activer pour 200 points locaux' : 'Débloque d’abord un badge'}
      </Button>
    </AppShell>
  )
}

export function RewardActiveScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  return (
    <AppShell tone="sun">
      <PageTitle eyebrow="RÉCOMPENSE ACTIVÉE" title="Montre ce code au commerce." />
      <section className="redemption-code"><img src={asset('redemption-code.jpg')} alt="" /><span>CAFÉ CENTRAL</span><strong>CENTRAL-4821</strong><b>14:32 restantes</b></section>
      <section className="reward-card"><h2>Café offert</h2><strong>Activée · 200 points locaux</strong><p>Expire aujourd’hui à 20:15</p></section>
      <p>Ne ferme pas cet écran avant validation par le commerce.</p>
      <div className="screen-spacer" />
      <Button full variant="secondary" disabled={state.rewardUsed} onClick={() => { dispatch({ type: 'USE_REWARD' }); navigate('/client/rewards') }}>
        {state.rewardUsed ? 'Récompense utilisée' : 'J’ai utilisé ma récompense'}
      </Button>
    </AppShell>
  )
}

export function CollectionsScreen() {
  const [feedback, setFeedback] = useState('')
  return (
    <AppShell tone="lavender">
      <PageTitle eyebrow="À PLUSIEURS" title="Tes listes locales, prêtes à partager." />
      <ListRow title="Brunch du dimanche" subtitle="6 commerces · Partagée avec 3 amis" />
      <ListRow title="Idées cadeaux locales" subtitle="9 commerces · Privée" />
      <ListRow title="Soirée à Charleroi" subtitle="4 commerces · Partagée avec 1 ami" />
      <img className="collection-visual" src={asset('collection-photo.jpg')} alt="Amis réunis autour d’une table locale" />
      {feedback && <p className="inline-success" role="status">{feedback}</p>}
      <Button full onClick={() => setFeedback('Nouvelle collection créée.')}>Créer une collection</Button><Button full variant="ghost" onClick={() => setFeedback('Invitation simulée envoyée.')}>Inviter un ami</Button>
    </AppShell>
  )
}

export function SettingsScreen() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [location, setLocation] = useState(true)
  return (
    <AppShell>
      <PageTitle eyebrow="COMPTE" title="Tes préférences Referio." />
      <ListRow title="Profil et coordonnées" subtitle="Nom, e-mail et photo" />
      <button type="button" className="switch-row" aria-pressed={notifications} onClick={() => setNotifications(!notifications)}><img src={asset(notifications ? 'switch-on.svg' : 'switch-off.svg')} alt="" /><span>Notifications utiles</span></button>
      <button type="button" className="switch-row" aria-pressed={location} onClick={() => setLocation(!location)}><img src={asset(location ? 'switch-on.svg' : 'switch-off.svg')} alt="" /><span>Localisation pour la proximité</span></button>
      <ListRow title="Confidentialité" subtitle="Données, consentements et export" to="/client/privacy" />
      <ListRow title="Sécurité" subtitle="Mot de passe et appareils connectés" />
      <ListRow title="Aide et contact" subtitle="FAQ et signalement d’un problème" />
      <div className="screen-spacer" /><Button full variant="ghost" onClick={() => navigate('/client/login')}>Se déconnecter</Button>
    </AppShell>
  )
}

export function PrivacyScreen() {
  const [saved, setSaved] = useState(false)
  const [choices, setChoices] = useState([false, true, false])
  const labels = ['Mesure d’usage optionnelle', 'Recommandations personnalisées', 'Actualités par e-mail']
  return (
    <AppShell tone="info">
      <PageTitle eyebrow="TES DONNÉES" title="Clair, réversible, sans surprise." body="Tu choisis ce que Referio peut utiliser pour personnaliser ton expérience." />
      {labels.map((label, index) => <button type="button" className="switch-row" aria-pressed={choices[index]} key={label} onClick={() => setChoices(choices.map((value, item) => item === index ? !value : value))}><img src={asset(choices[index] ? 'switch-on.svg' : 'switch-off.svg')} alt="" /><span>{label}</span></button>)}
      <ListRow title="Télécharger mes données" subtitle="Recevoir une copie portable" />
      <ListRow title="Historique de consentement" subtitle="Voir quand chaque choix a changé" />
      <div className="danger-zone"><strong>Supprimer mon compte</strong><p>Un délai de 7 jours permet d’annuler la demande.</p></div>
      <div className="screen-spacer" />
      <Button full onClick={() => setSaved(true)}>{saved ? 'Choix enregistrés' : 'Enregistrer mes choix'}</Button>
    </AppShell>
  )
}
