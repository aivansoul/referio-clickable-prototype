import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
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
  const dailyCount = state.dailyDiscoveries.length
  const dailyPoints = dailyCount * 5 + (state.dailyBonusClaimed ? 25 : 0)
  const rows: Array<[string, string, string]> = [
    ...(dailyCount > 0 ? [[`Pépites du jour · ${dailyCount}/8`, 'Aujourd’hui', `+${dailyPoints}`] as [string, string, string]] : []),
    ...(state.visitVerified ? [['Visite vérifiée · Café Moka', 'Aujourd’hui · 10:42', '+50'] as [string, string, string]] : []),
    ...(state.reviewPublished ? [['Avis vérifié · Café Central', 'Aujourd’hui · 10:49', '+170'] as [string, string, string]] : []),
    ...(state.challengeRewardClaimed ? [['Challenge centre-ville', 'Aujourd’hui', '+150'] as [string, string, string]] : []),
    ...(state.rewardUsed ? [['Récompense · Café offert', 'Aujourd’hui', '−200'] as [string, string, string]] : []),
    ['Challenge gourmand', '18 août · 16:21', '+150'],
  ]
  return (
    <AppShell>
      <PageTitle eyebrow="POINTS LOCAUX" title="Ton impact local, point par point." />
      <section className="balance-card"><span>SOLDE DISPONIBLE</span><strong>{state.balance.toLocaleString('fr-BE')}</strong><small>{state.points.toLocaleString('fr-BE')} points cumulés · {state.level}</small></section>
      <div className="chip-row"><Chip active>Tous</Chip><Chip>Gagnés</Chip><Chip>Utilisés</Chip></div>
      <div className="history-list">
        {rows.map(([title, date, points]) => <div className={`history-row${points.startsWith('−') ? ' is-spent' : ''}`} key={title}><span><b>{title}</b><small>{date}</small></span><strong>{points}</strong></div>)}
      </div>
    </AppShell>
  )
}

export function ChallengesScreen() {
  const { state } = useDemo()
  const challengeProgress = Math.min(state.challengeProgress, 5)
  const challengeComplete = challengeProgress === 5
  const ambassadorProgress = Math.min(state.interested.length, 5)
  const explorerProgress = Math.min(state.dailyDiscoveries.length, 7)
  return (
    <AppShell tone="lavender" bottomNav className="challenges-shell">
      <PageTitle eyebrow="CHALLENGES" title="Explore ton quartier autrement." body="Des missions simples qui font vivre les bonnes adresses." />
      <Link to="/client/challenges/centre-ville" className={`challenge-card${challengeComplete ? ' is-complete' : ''}`}>
        <StampBadge name="serieLocale" locked={!challengeComplete} /><div><Badge variant={challengeComplete ? 'verified' : 'new'}>{challengeComplete ? 'TERMINÉ' : 'EN COURS'}</Badge><h2>Le tour des boulangeries</h2><p>{challengeProgress} / 5 · {challengeComplete ? 'Challenge terminé' : 'Se termine dimanche'}</p><strong>+150 points locaux</strong><div className="progress"><i style={{ width: `${challengeProgress * 20}%` }} /></div></div>
      </Link>
      <article className={`challenge-card${state.reviewPublished ? ' is-complete' : ''}`}><StampBadge name="avisVerifie" locked={!state.reviewPublished} /><div><span>{state.reviewPublished ? 'TERMINÉ' : 'À FAIRE'}</span><h2>Premier avis</h2><p>{state.reviewPublished ? 'Ton avis vérifié aide déjà le quartier.' : 'Partage un avis après une visite vérifiée.'}</p><strong>{state.reviewPublished ? 'Timbre Avis vérifié obtenu' : '+30 points locaux'}</strong></div></article>
      <article className={`challenge-card${ambassadorProgress === 5 ? ' is-complete' : ''}`}><StampBadge name="ambassadeur" locked={ambassadorProgress < 5} /><div><span>{ambassadorProgress} / 5 RECOMMANDATIONS</span><h2>Ambassadeur</h2><p>Inspire 5 amis à découvrir local.</p><strong>{ambassadorProgress === 5 ? 'Timbre Ambassadeur obtenu' : 'Timbre Ambassadeur'}</strong><div className="progress"><i style={{ width: `${ambassadorProgress * 20}%` }} /></div></div></article>
      <article className={`challenge-card${explorerProgress === 7 ? ' is-complete' : ''}`}><StampBadge name="explorateur" locked={explorerProgress === 0} /><div><span>SÉRIE · {explorerProgress} / 7 JOURS</span><h2>Explorateur de quartier</h2><p>Découvre une adresse par jour.</p><strong>{explorerProgress === 7 ? 'Timbre Explorateur obtenu' : 'Timbre Explorateur'}</strong><div className="progress"><i style={{ width: `${(explorerProgress / 7) * 100}%` }} /></div></div></article>
    </AppShell>
  )
}

export function ChallengeDetailScreen() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const progress = Math.min(state.challengeProgress, 5)
  const remaining = 5 - progress
  const stops = ['Café Moka', 'Maison Dune', 'Studio Nola', 'Boulangerie Louise', 'Atelier Basilic']
  return (
    <AppShell tone="lavender">
      <PageTitle eyebrow="CHALLENGE LOCAL" title="Le tour des boulangeries." body="Cinq adresses artisanales à découvrir avant dimanche." />
      <section className="challenge-progress"><strong>{progress} / 5</strong><span>{remaining === 0 ? 'Challenge terminé' : `Encore ${remaining} découverte${remaining > 1 ? 's' : ''}`}</span><div className="progress"><i style={{ width: `${progress * 20}%` }} /></div></section>
      <h2 className="subheading">Ta progression</h2>
      {stops.slice(0, progress).map((stop, index) => <StateCard label="VALIDÉ" title={stop} body={`Visite vérifiée · étape ${index + 1}`} key={stop} />)}
      {remaining > 0 && <StateCard tone="info" label="À DÉCOUVRIR" title={stops[progress]} body="Choisis un commerce vérifié du centre." />}
      <img className="challenge-visual" src={asset('challenge-photo.jpg')} alt="Commerces du centre-ville" />
      <div className="screen-spacer" />
      <Button full onClick={() => navigate(remaining === 0 ? '/client/challenges/centre-ville/success' : '/client/daily')}>{remaining === 0 ? 'Voir ma réussite' : 'Voir les commerces proches'}</Button>
    </AppShell>
  )
}

export function ChallengeSuccessScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const [shared, setShared] = useState(false)
  const reduced = useReducedMotion()
  const complete = state.challengeProgress >= 5
  useEffect(() => {
    if (complete) dispatch({ type: 'CLAIM_CHALLENGE_REWARD' })
  }, [complete, dispatch])
  return (
    <AppShell tone="lavender">
      <PageTitle eyebrow={complete ? 'CHALLENGE RÉUSSI' : 'CHALLENGE EN COURS'} title={complete ? 'Cinq découvertes. Un quartier plus vivant.' : `Encore ${5 - state.challengeProgress} découverte${5 - state.challengeProgress > 1 ? 's' : ''} pour réussir.`} />
      <motion.section className="celebration" initial={reduced ? false : { scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={reduced ? { duration: 0 } : motionTransition.slow}>
        <Icon name="star" /><strong>+150</strong><p>{complete ? 'points locaux ajoutés' : 'points locaux à débloquer'}</p><b>{complete ? 'Challenge validé' : 'Termine les cinq découvertes'}</b>
      </motion.section>
      <div className="merchant-mini"><img src={asset('challenge-photo.jpg')} alt="Commerces du centre-ville" /><div><strong>Centre-ville</strong><p>5 adresses découvertes</p></div></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate(complete ? '/client/rewards' : '/client/daily')}>{complete ? 'Découvrir la sélection' : 'Continuer le challenge'}</Button>
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
