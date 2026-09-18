import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button, Chip, Field, MerchantCard, PageTitle, PassportCard, PointsCard, SectionHeading, StateCard } from '../components/ui'
import { categories, merchants } from '../data/demo'
import { useDemo } from '../state/DemoContext'
import { motionDuration, motionTransition } from '../motion'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

export function SplashScreen() {
  const navigate = useNavigate()
  return (
    <AppShell tone="forest" padded={false} className="splash-shell">
      <button className="splash" onClick={() => navigate('/client/home')} aria-label="Entrer dans Referio">
        <span className="splash__brand">
          <img className="splash__texture" src={asset('brand-texture.jpg')} alt="" />
          <span className="brand-orb"><img src={asset('brand-mark.svg')} alt="" /><b>R</b></span>
          <strong>referio</strong>
          <span>Découvre local. Fais confiance au vécu.</span>
        </span>
        <small>Charleroi · Version pilote</small>
      </button>
    </AppShell>
  )
}

export function HomeScreen() {
  const { state } = useDemo()
  const [activeCategory, setActiveCategory] = useState('Tout')
  const pepites = [
    ['home-pepite-1.png', 'Café Moka'],
    ['home-pepite-2.png', 'Studio Nola'],
    ['home-pepite-3.png', 'Maison Dune'],
    ['home-pepite-4.png', 'Atelier Basilic'],
  ]
  return (
    <AppShell topBar statusBar={false} bottomNav padded={false} className="home-shell">
      <div className="home-page">
        <h1>Bonjour Lana,<br />envie de découvrir quoi aujourd’hui&nbsp;?</h1>
        <Link className="search-box" to="/client/search">Rechercher un commerce…</Link>
        <div className="chip-row" aria-label="Catégories">
          {categories.map((category) => (
            <Chip key={category} active={category === activeCategory} tone={category === 'Nouveau' ? 'new' : undefined} onClick={() => setActiveCategory(category)}>
              {category}
            </Chip>
          ))}
        </div>
        <PointsCard points={state.points} level={state.level} />
        <SectionHeading title="Pépites du jour" action="Voir tout" to="/client/discover" />
        <div className="pepite-strip">
          {pepites.map(([image, label]) => (
            <Link to={label === 'Café Moka' ? '/client/merchant/cafe-central' : '/client/discover'} key={label} aria-label={label}>
              <img src={asset(image)} alt="" />
            </Link>
          ))}
        </div>
        <MerchantCard merchant={merchants[0]} />
      </div>
    </AppShell>
  )
}

export function DiscoverScreen() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const current = merchants[selected % merchants.length]
  const rotate = selected * -42
  return (
    <AppShell topBar bottomNav>
      <PageTitle title="Pépites du jour" body="Faites tourner pour explorer les adresses du coin." />
      <div className="chip-row"><Chip active>Tout</Chip><Chip>Manger</Chip><Chip>Beauté</Chip><Chip>Shopping</Chip></div>
      <article className="selected-pepite">
        <div><h2>{current.name}</h2><p>{current.category} · ★ {current.rating.toFixed(1)} · {current.distance}</p></div>
        <Link className="button button--primary" to={`/client/merchant/${current.id}`}>Découvrir</Link>
      </article>
      <motion.div className="discovery-wheel" animate={{ rotate }} transition={reduced ? { duration: 0 } : motionTransition.response}>
        {[...merchants, ...merchants].map((merchant, index) => (
          <button
            type="button"
            key={`${merchant.id}-${index}`}
            className={index === selected ? 'is-selected' : ''}
            style={{ transform: `rotate(${index * 42}deg) translateY(-118px) rotate(${-index * 42}deg)` }}
            onClick={() => setSelected(index)}
            aria-label={`Sélectionner ${merchant.name}`}
          >
            <img src={index === selected ? asset('pepite-selected.png') : asset(index % 2 ? 'pepite-2.png' : 'pepite-1.png')} alt="" />
          </button>
        ))}
      </motion.div>
      <div className="wheel-controls">
        <Button variant="ghost" onClick={() => setSelected((selected - 1 + merchants.length) % merchants.length)}>Précédente</Button>
        <Button variant="secondary" onClick={() => setSelected((selected + 1) % merchants.length)}>Suivante</Button>
      </div>
      <p className="gesture-help">Fais glisser la roue avec le pouce, sans cacher la carte.</p>
    </AppShell>
  )
}

export function DailyDiscoveryScreen() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const merchant = merchants[index % merchants.length]

  function decide(next: 'left' | 'right') {
    setDirection(next)
    if (next === 'right') dispatch({ type: 'INTEREST', merchantId: merchant.id })
    window.setTimeout(() => {
      setIndex((value) => value + 1)
      setDirection(null)
    }, reduced ? 0 : motionDuration.base * 1000)
  }

  return (
    <AppShell bottomNav padded={false}>
      <div className="daily-page">
        <PageTitle eyebrow="COMMERCES DU JOUR" title="237 découvertes aujourd’hui à Charleroi" />
        <span className="points-pill">+5 points par découverte</span>
        <motion.article
          className="swipe-card"
          key={merchant.id + index}
          drag={reduced ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          animate={direction ? { x: direction === 'right' ? 480 : -480, rotate: direction === 'right' ? 8 : -8, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 90) decide('right')
            else if (info.offset.x < -90) decide('left')
          }}
          transition={reduced ? { duration: 0 } : motionTransition.base}
        >
          <img src={merchant.image} alt={`Devanture de ${merchant.name}`} />
          <span className="swipe-card__category">{merchant.category.split(' · ')[0].toUpperCase()}</span>
          <div className="swipe-card__copy">
            <h1>{merchant.name}<br />régale le quartier</h1>
            <p>★ {merchant.rating.toFixed(1)} ({merchant.reviews}) · {merchant.distance} · ♥ {merchant.recommendedBy} amis</p>
          </div>
          <button type="button" onClick={() => navigate(`/client/merchant/${merchant.id}`)}>Ouvrir la fiche</button>
        </motion.article>
        <div className="swipe-actions">
          <Button variant="ghost" onClick={() => decide('left')}>Passer</Button>
          <Button variant="secondary" onClick={() => dispatch({ type: 'FAVORITE', merchantId: merchant.id })}>Enregistrer</Button>
          <Button onClick={() => decide('right')}>Coup de cœur</Button>
        </div>
        <p className="swipe-progress">{Math.min(index + 3, 8)}/8 aujourd’hui · bonus +25 points à 8 découvertes</p>
      </div>
    </AppShell>
  )
}

export function SearchScreen() {
  const [query, setQuery] = useState('café')
  const [verified, setVerified] = useState(true)
  const results = useMemo(() => merchants.filter((merchant) => `${merchant.name} ${merchant.category}`.toLowerCase().includes(query.toLowerCase()) || !query), [query])
  return (
    <AppShell bottomNav>
      <PageTitle eyebrow="RECHERCHE" title="Qu’est-ce qui te ferait plaisir ?" />
      <Field label="Recherche" value={query} onChange={setQuery} />
      <div className="chip-row"><Chip active>Ouvert</Chip><Chip active={verified} onClick={() => setVerified(!verified)}>Vérifié</Chip><Chip>À moins de 1 km</Chip></div>
      <p className="results-count">{results.length} adresse{results.length > 1 ? 's' : ''} autour de toi</p>
      <div className="stack-list">
        {results.map((merchant) => <MerchantCard key={merchant.id} merchant={merchant} compact />)}
      </div>
    </AppShell>
  )
}

export function MapScreen() {
  const [selected, setSelected] = useState(merchants[0])
  return (
    <AppShell bottomNav padded={false}>
      <div className="map-page">
        <PageTitle eyebrow="CARTE" title="Autour de Charleroi" />
        <Link className="search-box" to="/client/search">Rechercher sur la carte…</Link>
        <div className="map-canvas" style={{ backgroundImage: `url(${asset('map-background.png')})` }} aria-label="Carte simulée de Charleroi">
          <i className="road road--one" /><i className="road road--two" /><i className="road road--three" />
          {merchants.map((merchant, index) => (
            <button
              type="button"
              className={`map-pin map-pin--${index + 1}`}
              key={merchant.id}
              onClick={() => setSelected(merchant)}
              aria-pressed={selected.id === merchant.id}
              aria-label={`Sélectionner ${merchant.name}`}
            >
              <img src={asset(selected.id === merchant.id ? 'map-pin-selected.svg' : 'map-pin.svg')} alt="" />
            </button>
          ))}
        </div>
        <MerchantCard merchant={selected} compact />
      </div>
    </AppShell>
  )
}

export function MerchantScreen() {
  const { state, dispatch } = useDemo()
  const merchant = merchants[0]
  const navigate = useNavigate()
  const [directionsOpen, setDirectionsOpen] = useState(false)
  const favorite = state.favorites.includes(merchant.id)
  return (
    <AppShell bottomNav padded={false}>
      <div className="merchant-detail">
        <div className="merchant-hero">
          <img src={asset('cafe-central-hero.jpg')} alt="Intérieur chaleureux de Café Central" />
          <Link to="/client/home" className="floating-control" aria-label="Retour">‹</Link>
          <button type="button" className="floating-control floating-control--right" onClick={() => dispatch({ type: 'FAVORITE', merchantId: merchant.id })}>{favorite ? 'Enregistré' : 'Enregistrer'}</button>
        </div>
        <div className="merchant-detail__body">
          <span className="offer-pill">Offre · −5 %</span>
          <h1>Café Central <span className="verified-mark">Vérifié</span></h1>
          <p>Café · Brunch · Charleroi centre · à 450 m</p>
          <strong className="rating">★ 4,9 (176 avis)</strong>
          <span className="social-proof">+15 · Recommandé par 18 personnes</span>
          <div className="detail-tabs"><b>À propos</b><Link to="/client/reviews">Avis</Link><span>Offres</span><span>Photos</span></div>
          <p>Un café de quartier lumineux, des produits maison et une équipe qui connaît ses habitués.</p>
          <button type="button" className="visit-card" onClick={() => navigate('/client/qr')}>
            <strong>Visite vérifiée</strong>
            <span>Scanne le code en caisse et gagne +50 points locaux</span>
          </button>
          <p className="hours">Ouvert · ferme à 18h00<br />Rue de la Montagne 12, 6000 Charleroi</p>
          {directionsOpen && <p className="inline-success" role="status">Itinéraire simulé · 6 min à pied depuis ta position.</p>}
          <div className="two-actions"><Button full onClick={() => navigate('/client/qr')}>Valider ma visite</Button><Button full variant="secondary" onClick={() => setDirectionsOpen(true)}>Itinéraire</Button></div>
        </div>
      </div>
    </AppShell>
  )
}

export function QrScreen() {
  const navigate = useNavigate()
  const { dispatch } = useDemo()
  const [scanning, setScanning] = useState(false)
  const reduced = useReducedMotion()
  function scan() {
    setScanning(true)
    window.setTimeout(() => {
      dispatch({ type: 'VERIFY_VISIT' })
      navigate('/client/visit/success')
    }, reduced ? 0 : motionDuration.response * 1000)
  }
  return (
    <AppShell>
      <PageTitle eyebrow="VISITE VÉRIFIÉE" title="Cadre le QR du commerce." body="Le code ne contient aucune donnée personnelle." />
      <div className={`qr-camera${scanning ? ' is-scanning' : ''}`}>
        <img src={asset('qr-camera.jpg')} alt="Aperçu simulé du comptoir et du QR" />
        <span className="qr-frame" aria-hidden="true" />
        {scanning && !reduced && <motion.i initial={{ top: '20%' }} animate={{ top: '75%' }} transition={motionTransition.slow} />}
      </div>
      <div className="screen-spacer" />
      <Button full onClick={scan} disabled={scanning}>{scanning ? 'Validation…' : 'Simuler le scan'}</Button>
      <Button full variant="ghost" onClick={scan}>Saisir un code</Button>
    </AppShell>
  )
}

export function VisitSuccessScreen() {
  const { state } = useDemo()
  const navigate = useNavigate()
  return (
    <AppShell tone="lime">
      <PageTitle eyebrow="BRAVO" title="Ta visite compte vraiment." body="Café Moka rejoint ton historique local." />
      <StateCard label="VISITE VÉRIFIÉE" title="+50 points locaux" body="Ta progression fidélité et ton historique ont été mis à jour." />
      <PassportCard stamps={state.stamps} />
      <div className="points-earned"><span>Points gagnés</span><strong>+50</strong></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/review/new')}>Donner mon avis vérifié</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/points')}>Voir mon historique</Button>
    </AppShell>
  )
}

export function VisitErrorScreen() {
  const navigate = useNavigate()
  return (
    <AppShell tone="info">
      <PageTitle eyebrow="ON RÉESSAIE" title="La preuve n’a pas pu être validée." body="Aucun point ni tampon n’a été ajouté." />
      <StateCard tone="error" label="PREUVE NON VALIDÉE" title="Réessaie près du comptoir" body="Vérifie ta connexion et demande un nouveau code si nécessaire." />
      <div className="tip-card"><strong>Avant de réessayer</strong><p>Reste près de la caisse.</p><p>Vérifie la luminosité du QR.</p><p>Demande un nouveau code au commerce.</p></div>
      <div className="screen-spacer" />
      <Button full onClick={() => navigate('/client/qr')}>Scanner à nouveau</Button>
      <Button full variant="ghost" onClick={() => navigate('/client/settings')}>Contacter l’aide</Button>
    </AppShell>
  )
}
