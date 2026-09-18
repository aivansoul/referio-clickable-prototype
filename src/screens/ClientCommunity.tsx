import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button, Chip, Field, MerchantCard, PageTitle, PointsCard, SectionHeading } from '../components/ui'
import { categories, merchants } from '../data/demo'
import { useDemo } from '../state/DemoContext'
import { motionTransition } from '../motion'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

export function ReviewsScreen() {
  const navigate = useNavigate()
  return (
    <AppShell bottomNav>
      <PageTitle eyebrow="AVIS · CAFÉ CENTRAL" title="4,9" body="176 avis · Tous associés à une expérience réelle ou signalés comme non vérifiés." />
      <div className="rating-breakdown"><strong>★★★★★</strong><div className="progress"><i style={{ width: '92%' }} /></div><span>92 %</span></div>
      <article className="review-card"><div className="review-author"><img src={asset('review-avatar.png')} alt="Portrait de Léa" /><span><strong>Léa M.</strong><small>Visite vérifiée · Il y a 2 h</small></span></div><b>★★★★★</b><p>Accueil chaleureux et brunch généreux. Une vraie bonne adresse du centre.</p><div className="merchant-reply"><strong>Réponse de Café Central</strong><p>Merci Léa, à très bientôt !</p></div></article>
      <article className="review-card"><strong>Thomas · Visite vérifiée</strong><b>★★★★☆</b><p>Très bon café et équipe souriante. La terrasse est agréable le matin.</p></article>
      <div className="screen-spacer" /><Button full onClick={() => navigate('/client/review/new')}>Écrire mon avis</Button>
    </AppShell>
  )
}

export function NewReviewScreen() {
  const [rating, setRating] = useState(4)
  const [text, setText] = useState('Une équipe vraiment accueillante et un brunch préparé avec soin. Je reviendrai avec plaisir.')
  const [tags, setTags] = useState(['Accueil chaleureux', 'Fait maison'])
  const navigate = useNavigate()
  const { state, dispatch } = useDemo()

  function publish() {
    dispatch({ type: 'PUBLISH_REVIEW' })
    navigate('/client/review/success')
  }

  return (
    <AppShell>
      <PageTitle eyebrow="MON AVIS" title="Raconte ton expérience." body="Ton avis est associé à ta visite vérifiée chez Café Central." />
      <div className="review-merchant"><img src={asset('review-merchant.png')} alt="Café Central" /><div><strong>Café Central</strong><span>Visite vérifiée aujourd’hui</span></div></div>
      <fieldset className="stars-field"><legend>Ta note</legend>{[1, 2, 3, 4, 5].map((star) => <button type="button" aria-label={`${star} étoile${star > 1 ? 's' : ''}`} className={star <= rating ? 'is-active' : ''} onClick={() => setRating(star)} key={star}>★</button>)}</fieldset>
      <div className="tag-picker"><span>Qu’est-ce qui t’a plu ?</span>{['Accueil chaleureux', 'Fait maison', 'Bon rapport qualité-prix', 'Cadre agréable'].map((tag) => <Chip key={tag} active={tags.includes(tag)} onClick={() => setTags(tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag])}>{tag}</Chip>)}</div>
      <Field label="Ton avis" multiline value={text} onChange={setText} helper={`${text.length} / 500`} />
      <img className="review-photo" src={asset('review-photo.png')} alt="Photo ajoutée à l’avis" />
      <Button full onClick={publish} disabled={!state.visitVerified || text.length < 20}>Publier mon avis</Button>
    </AppShell>
  )
}

export function ReviewSuccessScreen() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  return (
    <AppShell tone="forest">
      <PageTitle eyebrow="AVIS PUBLIÉ" title="Ton expérience aide tout le quartier." body="Le badge Guide du centre vient d’être ajouté à ton profil." inverse />
      <motion.section className="level-up" initial={reduced ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0 } : motionTransition.slow}>
        <span className="badge-seal">GUIDE<br />LOCAL</span><p>NOUVEAU BADGE</p><h2>Guide du centre</h2><strong>{state.level}</strong><small>{state.points.toLocaleString('fr-BE')} points locaux cumulés</small>
      </motion.section>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/rewards')}>Voir ma récompense</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/discover')}>Revenir à la découverte</Button>
    </AppShell>
  )
}

export function ProfileScreen() {
  const { state } = useDemo()
  const [dark, setDark] = useState(false)
  const [shared, setShared] = useState(false)
  return (
    <AppShell tone={dark ? 'forest' : 'light'} bottomNav>
      <div className={`profile-page${dark ? ' profile-page--dark' : ''}`}>
        <button className="theme-toggle" type="button" aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? 'Version claire' : 'Version sombre'}</button>
        <img className="profile-avatar" src={asset('profile-avatar.png')} alt="Portrait de Lana Totolina" />
        <h1>Lana Totolina</h1><p>Charleroi · Membre depuis 2026</p>
        <PointsCard points={state.points} level={state.level} />
        <div className="profile-stats"><div><strong>28</strong><span>recommandations</span></div><div><strong>96</strong><span>avis vérifiés</span></div><div><strong>12</strong><span>badges</span></div></div>
        <SectionHeading title="Ton impact local" />
        <div className="impact-card"><strong>3 420 €</strong><span>orientés vers des commerces locaux</span><p>Estimation de démonstration, non financière.</p></div>
        <SectionHeading title="Dernières découvertes" action="Voir les favoris" to="/client/favorites" />
        <div className="discovery-grid">{['discovery-1.jpg', 'discovery-2.png', 'discovery-3.png', 'discovery-4.png'].map((image) => <img src={asset(image)} alt="Découverte locale" key={image} />)}</div>
        {shared && <p className="inline-success" role="status">Lien de profil copié pour la démonstration.</p>}
        <Button full variant={dark ? 'primary' : 'secondary'} onClick={() => setShared(true)}>Partager mon profil</Button>
        <Link className="button button--ghost button--full" to="/client/settings">Paramètres</Link>
      </div>
    </AppShell>
  )
}

export function RankingScreen() {
  const { state } = useDemo()
  const people = [
    ['2', 'Maya', 'rank-1.png', '1 890'],
    ['1', 'Nicolas', 'rank-2.png', '2 140'],
    ['3', 'Samir', 'rank-3.png', '1 720'],
  ]
  return (
    <AppShell tone="lavender" bottomNav>
      <PageTitle eyebrow="CHARLEROI" title="Classement local" body="Ce mois-ci · Entre amis et habitants actifs." />
      <div className="chip-row"><Chip active>Charleroi</Chip><Chip>Amis</Chip><Chip>Ce mois</Chip></div>
      <div className="podium">{people.map(([rank, name, avatar, points]) => <div className={`podium__person podium__person--${rank}`} key={name}><span>{rank}</span><img src={asset(avatar)} alt={`Portrait de ${name}`} /><strong>{name}</strong><small>{points} pts</small></div>)}</div>
      <div className="ranking-list"><div className="ranking-row is-me"><span>8</span><img src={asset('rank-lana.png')} alt="Portrait de Lana" /><strong>Toi · Lana</strong><b>{state.points.toLocaleString('fr-BE')} pts</b></div>{[['9', 'Amélie', '1 190'], ['10', 'Jules', '1 150'], ['11', 'Zoé', '1 090']].map(([rank, name, points]) => <div className="ranking-row" key={name}><span>{rank}</span><i>{name[0]}</i><strong>{name}</strong><b>{points} pts</b></div>)}</div>
    </AppShell>
  )
}

export function FavoritesScreen() {
  const { state } = useDemo()
  const [created, setCreated] = useState(false)
  const [feedback, setFeedback] = useState('')
  return (
    <AppShell bottomNav>
      <PageTitle eyebrow="TES LISTES" title="Tes pépites à garder sous le coude." body={`${state.favorites.length + 11} favoris enregistrés`} />
      <div className="favorite-lists"><button type="button" onClick={() => setFeedback('Liste « Brunch du dimanche » ouverte.')}><img src={asset('review-photo.png')} alt="" /><strong>Brunch du dimanche</strong><span>6 adresses</span></button><button type="button" onClick={() => setFeedback('Liste « Idées cadeaux » ouverte.')}><img src={asset('review-merchant.png')} alt="" /><strong>Idées cadeaux</strong><span>9 adresses</span></button></div>
      <Button full variant="ghost" onClick={() => setCreated(true)}>+ Nouvelle liste</Button>
      {created && <div className="inline-form"><Field label="Nom de la liste" value="Ma nouvelle liste" /><Button onClick={() => { setCreated(false); setFeedback('La liste « Ma nouvelle liste » a été créée.') }}>Créer</Button></div>}
      {feedback && <p className="inline-success" role="status">{feedback}</p>}
      <SectionHeading title="Tous les favoris" />
      {merchants.map((merchant) => <MerchantCard merchant={merchant} compact key={merchant.id} />)}
    </AppShell>
  )
}

export function EmptyFavoritesScreen() {
  const navigate = useNavigate()
  return <AppShell><div className="empty-state"><img src={asset('mascot.png')} alt="Mascotte Referio" /><h1>Aucune pépite sauvée… pour l’instant</h1><p>Enregistre les commerces qui te donnent envie pour les retrouver ici.</p><Button full onClick={() => navigate('/client/discover')}>Explorer les environs</Button></div></AppShell>
}

export function NotificationsScreen() {
  const [read, setRead] = useState(false)
  const items = [
    ['notification-points.svg', '+50 points locaux', 'Ta visite chez Café Moka est vérifiée.', 'Aujourd’hui'],
    ['notification-social.svg', 'Léa recommande Maison Dune', 'Une nouvelle pépite à 320 m de toi.', 'Aujourd’hui'],
    ['notification-points.svg', 'Un nouveau tampon', 'Encore une visite avant ta boisson offerte.', 'Hier'],
    ['notification-social.svg', 'Café Central a répondu', 'Merci pour ton avis vérifié.', 'Hier'],
  ]
  return (
    <AppShell bottomNav>
      <div className="title-row"><PageTitle eyebrow="ACTIVITÉ" title="Notifications" /><Button variant="ghost" onClick={() => setRead(true)}>{read ? 'Tout est lu' : 'Tout marquer comme lu'}</Button></div>
      <div className="notification-list">{items.map(([icon, title, body, date], index) => <article className={read || index > 1 ? 'is-read' : ''} key={title}><img src={asset(icon)} alt="" /><div><span>{date}</span><strong>{title}</strong><p>{body}</p></div></article>)}</div>
    </AppShell>
  )
}

export function OnboardingScreen({ step }: { step: 1 | 2 | 3 | 4 }) {
  const navigate = useNavigate()
  const { state, dispatch } = useDemo()
  const [selected, setSelected] = useState<string[]>(['Café', 'Boulangerie', 'Culture'])
  const next = step === 1 ? '/onboarding/2' : step === 2 ? '/onboarding/3' : step === 3 ? '/onboarding/4' : '/client/home'
  return (
    <AppShell tone={step === 1 ? 'forest' : step === 2 ? 'lavender' : step === 3 ? 'sun' : 'lime'}>
      {step === 1 && <><img className="onboarding-hero" src={asset('onboarding-city.jpg')} alt="Charleroi illustrée" /><PageTitle eyebrow="REFERIO" title="Ta ville, tes pépites." body="Découvre les bonnes adresses grâce à celles et ceux qui les vivent." inverse /><div className="screen-spacer" /><Button full onClick={() => navigate(next)}>Commencer</Button></>}
      {step === 2 && <><img className="onboarding-hero" src={asset('onboarding-value.jpg')} alt="Découverte locale" /><PageTitle eyebrow="COMMENT ÇA MARCHE" title="Du vécu, pas du bruit." /><div className="value-list"><p><b>Découvre</b><span>Des adresses proches et singulières.</span></p><p><b>Vérifie</b><span>Des avis liés à de vraies visites.</span></p><p><b>Progresse</b><span>Points locaux, badges et fidélité partagée.</span></p></div><div className="screen-spacer" /><Button full onClick={() => navigate(next)}>Suivant</Button></>}
      {step === 3 && <><PageTitle eyebrow="TA VILLE" title="Où explores-tu ?" body="La ville détermine les recommandations, la carte et le classement." /><div className="city-picker"><button className="is-selected" type="button" onClick={() => dispatch({ type: 'SET_CITY', city: 'Charleroi' })}><strong>Charleroi</strong><span>Ville pilote</span></button><button type="button" disabled><strong>Bruxelles</strong><span>Bientôt</span></button><button type="button" disabled><strong>Namur</strong><span>Bientôt</span></button></div><p className="selected-city">Ville active : {state.city}</p><div className="screen-spacer" /><Button full onClick={() => navigate(next)}>Continuer</Button></>}
      {step === 4 && <><PageTitle eyebrow="TES GOÛTS" title="Qu’est-ce qui te fait vibrer ?" body="Choisis au moins trois catégories. Tu pourras les modifier plus tard." /><div className="interest-grid">{categories.slice(1).concat(['Culture', 'Bien-être', 'Artisanat', 'Sorties']).map((category) => <button type="button" key={category} className={selected.includes(category) ? 'is-selected' : ''} onClick={() => setSelected(selected.includes(category) ? selected.filter((item) => item !== category) : [...selected, category])}>{category}</button>)}</div><div className="screen-spacer" /><Button full disabled={selected.length < 3} onClick={() => navigate(next)}>C’est parti !</Button></>}
    </AppShell>
  )
}

export function NetworkErrorScreen() {
  const [retrying, setRetrying] = useState(false)
  const navigate = useNavigate()
  return <AppShell><div className="empty-state"><img src={asset('mascot.png')} alt="Mascotte Referio" /><h1>Oups, la connexion s’est envolée</h1><p>Ton passeport et tes favoris restent disponibles. Le scan attendra le retour du réseau.</p><Button full onClick={() => { setRetrying(true); window.setTimeout(() => navigate('/client/home'), 500) }}>{retrying ? 'Connexion…' : 'Réessayer'}</Button></div></AppShell>
}

export function LocationErrorScreen() {
  const navigate = useNavigate()
  return <AppShell><div className="empty-state"><img src={asset('mascot.png')} alt="Mascotte Referio" /><h1>Referio ne sait pas où tu es</h1><p>Active la localisation ou continue avec Charleroi comme ville manuelle.</p><Button full onClick={() => navigate('/client/permissions/location')}>Activer la localisation</Button><Button full variant="ghost" onClick={() => navigate('/client/home')}>Continuer avec Charleroi</Button></div></AppShell>
}
