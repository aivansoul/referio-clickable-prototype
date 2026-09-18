import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Badge, Button, Chip, Field, Icon, MerchantCard, PageTitle, PassportCard, PointsCard, SectionHeading, StampBadge, StateCard } from '../components/ui'
import { categories, merchants } from '../data/demo'
import { useDemo } from '../state/DemoContext'
import { motionDuration, motionTransition } from '../motion'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

function merchantsForCategory(category: string) {
  if (category === 'Tout') return merchants
  if (category === 'Manger') return merchants.filter((merchant) => /café|restaurant|boulangerie/i.test(merchant.category))
  if (category === 'Nouveau') return merchants.filter((merchant) => merchant.new)
  return merchants.filter((merchant) => merchant.category.toLocaleLowerCase('fr').includes(category.toLocaleLowerCase('fr')))
}

const dailyCards = [
  { ...merchants[0], discoveryId: 'daily-cafe-central', headline: 'réveille le quartier' },
  { ...merchants[1], discoveryId: 'daily-maison-dune', headline: 'fait croustiller la Ville-Basse' },
  { ...merchants[2], discoveryId: 'daily-atelier-basilic', headline: 'met Charleroi à table' },
  { ...merchants[0], id: 'studio-nola', discoveryId: 'daily-studio-nola', name: 'Studio Nola', category: 'Coiffure · Beauté', distance: '650 m', rating: 4.8, reviews: 84, recommendedBy: 12, image: asset('business-asset-1.jpg'), headline: 'prend soin du quartier' },
  { ...merchants[1], id: 'boulangerie-louise', discoveryId: 'daily-boulangerie-louise', name: 'Boulangerie Louise', category: 'Boulangerie artisanale', distance: '780 m', rating: 4.9, reviews: 112, recommendedBy: 21, image: asset('challenge-photo.jpg'), headline: 'fait lever les bonnes idées' },
  { ...merchants[2], id: 'atelier-vert', discoveryId: 'daily-atelier-vert', name: 'Atelier Vert', category: 'Fleuriste · Artisanat', distance: '1,1 km', rating: 4.7, reviews: 67, recommendedBy: 8, image: asset('collection-photo.jpg'), headline: 'fleurit les petites attentions' },
  { ...merchants[1], id: 'librairie-moliere', discoveryId: 'daily-librairie-moliere', name: 'Librairie Molière', category: 'Culture · Shopping', distance: '500 m', rating: 4.9, reviews: 204, recommendedBy: 26, image: asset('business-asset-2.jpg'), headline: 'fait voyager le centre-ville' },
  { ...merchants[0], id: 'quai-10', discoveryId: 'daily-quai-10', name: 'Quai 10', category: 'Culture · Loisirs', distance: '900 m', rating: 4.8, reviews: 148, recommendedBy: 19, image: asset('business-asset-3.jpg'), headline: 'anime les sorties locales' },
] as const

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
  const reduced = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState('Tout')
  const filteredMerchants = merchantsForCategory(activeCategory)
  const dailyCount = Math.min(state.dailyDiscoveries.length, dailyCards.length)
  const pepites = [
    { image: 'home-pepite-1.png', label: 'Café Moka', merchantId: 'cafe-moka' },
    { image: 'home-pepite-2.png', label: 'Studio Nola', merchantId: 'studio-nola' },
    { image: 'home-pepite-3.png', label: 'Maison Dune', merchantId: 'maison-dune' },
    { image: 'home-pepite-4.png', label: 'Atelier Basilic', merchantId: 'atelier-basilic' },
  ]
  const categoryIcons = [
    ['Manger', 'category-food.png'],
    ['Café', 'category-cafe.png'],
    ['Boulangerie', 'category-bakery.png'],
    ['Beauté', 'category-beauty.png'],
    ['Coiffure', 'category-hair-salon.png'],
    ['Shopping', 'category-shopping.png'],
    ['Bien-être', 'category-wellness.png'],
    ['Fleuriste', 'category-florist.png'],
    ['Garage', 'category-garage.png'],
    ['Culture', 'category-culture.png'],
    ['Loisirs', 'category-leisure.png'],
    ['Artisanat', 'category-craft.png'],
  ]
  return (
    <AppShell topBar statusBar={false} bottomNav padded={false} className="home-shell">
      <div className="home-page">
        <section className="home-reference-hero">
          <div className="home-reference-hero__copy">
            <span className="eyebrow">TA SÉLECTION LOCALE</span>
            <h1>Bonjour Lana,<br />envie de découvrir quoi aujourd’hui&nbsp;?</h1>
            <p>La mascotte Referio t’a préparé huit pépites. Chaque découverte rapporte 5 points locaux.</p>
            <Link className="home-daily-cta" to="/client/daily">
              <Icon name="star" />
              <span><strong>Swiper les pépites du jour</strong><small>{dailyCount}/8 · +5 points par carte</small></span>
              <Icon name="chevronRight" />
            </Link>
          </div>
          <motion.div
            className="home-reference-hero__mascot"
            initial={reduced ? false : { opacity: 0, y: 18, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={reduced ? { duration: 0 } : motionTransition.slow}
          >
            <img src={asset('mascot-discover.png')} alt="Mascotte officielle Referio avec sa loupe" />
          </motion.div>
        </section>
        <Link className="search-box" to="/client/search"><Icon name="search" />Rechercher un commerce…</Link>
        <div className="category-icon-row" aria-label="Catégories illustrées">
          {categoryIcons.map(([category, image]) => <button type="button" className={activeCategory === category ? 'is-active' : ''} onClick={() => setActiveCategory(category)} key={category}><img src={asset(image)} alt="" /><span>{category}</span></button>)}
        </div>
        <div className="chip-row" aria-label="Catégories">
          {categories.map((category) => (
            <Chip key={category} active={category === activeCategory} tone={category === 'Nouveau' ? 'new' : undefined} onClick={() => setActiveCategory(category)}>
              {category}
            </Chip>
          ))}
        </div>
        <PointsCard points={state.points} level={state.level} />
        <div className="home-gamification-strip" aria-label="Progression locale">
          <Link to="/client/points"><img src={asset('gamification-points.png')} alt="" /><span><strong>{state.points.toLocaleString('fr-BE')}</strong><small>Points locaux</small></span></Link>
          <Link to="/client/profile"><img src={asset('gamification-badge.png')} alt="" /><span><strong>{state.level}</strong><small>Badge actif</small></span></Link>
          <Link to="/client/challenges"><img src={asset('gamification-streak.png')} alt="" /><span><strong>4 jours</strong><small>Série locale</small></span></Link>
          <Link to="/client/rewards"><img src={asset('gamification-reward.png')} alt="" /><span><strong>{state.rewardUnlocked ? 'Disponible' : 'À débloquer'}</strong><small>Récompense</small></span></Link>
        </div>
        <SectionHeading title="Pépites du jour" action="Voir tout" to="/client/discover" />
        <div className="home-mobile-feed"><div className="pepite-strip">
          {pepites.map(({ image, label, merchantId }) => (
            <Link to={`/client/merchant/${merchantId}`} key={label} aria-label={`Ouvrir la fiche de ${label}`}>
              <img src={asset(image)} alt="" />
            </Link>
          ))}
        </div><MerchantCard merchant={merchants[0]} /></div>
        <div className="home-merchant-grid">{filteredMerchants.map((merchant) => <MerchantCard merchant={merchant} key={merchant.id} />)}</div>
      </div>
    </AppShell>
  )
}

export function DiscoverScreen() {
  const [selected, setSelected] = useState(0)
  const [activeCategory, setActiveCategory] = useState('Tout')
  const reduced = useReducedMotion()
  const visibleMerchants = merchantsForCategory(activeCategory).slice(0, 8)
  const wheelItems = [...visibleMerchants, ...visibleMerchants].slice(0, Math.max(6, Math.min(8, visibleMerchants.length * 2)))
  const current = visibleMerchants[selected % visibleMerchants.length]
  const wheelStep = 360 / wheelItems.length
  const rotate = selected * -wheelStep
  const moveWheel = (step: -1 | 1) => setSelected((value) => (value + step + visibleMerchants.length) % visibleMerchants.length)
  const selectCategory = (category: string) => { setActiveCategory(category); setSelected(0) }
  return (
    <AppShell topBar bottomNav className="discover-shell">
      <section className="discover-copy">
        <PageTitle title="Pépites du jour" body="Faites tourner pour explorer les adresses du coin." />
        <div className="chip-row">{['Tout', 'Manger', 'Beauté', 'Shopping'].map((category) => <Chip key={category} active={activeCategory === category} onClick={() => selectCategory(category)}>{category}</Chip>)}</div>
        <article className="selected-pepite">
          <div><h2>{current.name}</h2><p className="selected-pepite__meta">{current.category} · <span><Icon name="star" />{current.rating.toFixed(1)}</span> · {current.distance}</p></div>
          <Link className="button button--primary" to={`/client/merchant/${current.id}`}>Découvrir</Link>
        </article>
        <Link className="discover-daily-cta" to="/client/daily"><Icon name="star" /><span><strong>Swiper les 8 pépites du jour</strong><small>+5 points par découverte · bonus +25</small></span><Icon name="chevronRight" /></Link>
      </section>
      <section className="discover-experience" aria-label="Roue de découverte locale">
        <motion.div
          className="discovery-wheel"
          animate={{ rotate, x: 0 }}
          drag={reduced ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.22}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x < -42) moveWheel(1)
            if (info.offset.x > 42) moveWheel(-1)
          }}
          transition={reduced ? { duration: 0 } : motionTransition.response}
        >
          {wheelItems.map((merchant, index) => (
            <button
              type="button"
              key={`${merchant.id}-${index}`}
              className={index === selected ? 'is-selected' : ''}
              style={{ transform: `rotate(${index * wheelStep}deg) translateY(-118px) rotate(${-index * wheelStep}deg)` }}
              onClick={() => setSelected(index)}
              aria-label={`Sélectionner ${merchant.name}`}
            >
              <img src={index === selected ? asset('pepite-selected.png') : asset(index % 2 ? 'pepite-2.png' : 'pepite-1.png')} alt="" />
            </button>
          ))}
        </motion.div>
        <div className="wheel-controls">
          <Button variant="ghost" onClick={() => moveWheel(-1)}><Icon name="chevronRight" className="icon-previous" />Précédente</Button>
          <Button variant="secondary" onClick={() => moveWheel(1)}>Suivante<Icon name="chevronRight" /></Button>
        </div>
        <p className="gesture-help"><span className="gesture-help__mobile">Fais glisser la roue avec le pouce</span><span className="gesture-help__desktop">Fais glisser la roue, clique sur une adresse ou utilise les flèches</span>.</p>
      </section>
    </AppShell>
  )
}

export function DailyDiscoveryScreen() {
  const { state, dispatch } = useDemo()
  const [index, setIndex] = useState(() => Math.min(state.dailyDiscoveries.length, dailyCards.length))
  const [direction, setDirection] = useState<'left' | 'right' | 'save' | null>(null)
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const completed = index >= dailyCards.length
  const card = dailyCards[Math.min(index, dailyCards.length - 1)]
  const discoveredCount = Math.min(state.dailyDiscoveries.length, dailyCards.length)
  const earnedToday = discoveredCount * 5 + (state.dailyBonusClaimed ? 25 : 0)

  function decide(next: 'left' | 'right' | 'save') {
    if (!card || direction) return

    const alreadyDiscovered = state.dailyDiscoveries.includes(card.discoveryId)
    setDirection(next)
    dispatch({ type: 'DISCOVER_MERCHANT', discoveryId: card.discoveryId })
    if (next === 'right') dispatch({ type: 'INTEREST', merchantId: card.id })
    if (next === 'save' && !state.favorites.includes(card.id)) dispatch({ type: 'FAVORITE', merchantId: card.id })

    if (!alreadyDiscovered) {
      const reachesTarget = discoveredCount + 1 === dailyCards.length && !state.dailyBonusClaimed
      setFeedback(reachesTarget ? '+30 points · bonus quotidien débloqué !' : '+5 points locaux')
    } else {
      setFeedback('Pépite déjà comptabilisée')
    }

    window.setTimeout(() => {
      setIndex((value) => Math.min(value + 1, dailyCards.length))
      setDirection(null)
      setFeedback('')
    }, reduced ? 0 : motionDuration.base * 1000)
  }

  return (
    <AppShell bottomNav padded={false}>
      <div className="daily-page">
        <header className="daily-guide">
          <div>
            <PageTitle eyebrow="PÉPITES DU JOUR" title="Swipe, découvre et gagne des points locaux." />
            <p>À gauche pour passer, à droite si ça t’intéresse. Chaque carte explorée compte.</p>
            <div className="daily-points-summary"><span className="points-pill">+5 par découverte</span><strong>{state.points.toLocaleString('fr-BE')} points</strong></div>
          </div>
          <motion.div
            className="daily-guide__mascot"
            initial={reduced ? false : { opacity: 0, scale: 0.82, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={reduced ? { duration: 0 } : motionTransition.response}
          >
            <img src={asset('mascot-discover.png')} alt="Mascotte officielle Referio guidant les découvertes" />
          </motion.div>
        </header>

        <div className="daily-progress" aria-label={`${discoveredCount} pépites découvertes sur ${dailyCards.length}`}>
          <motion.span animate={{ width: `${(discoveredCount / dailyCards.length) * 100}%` }} transition={reduced ? { duration: 0 } : motionTransition.slow} />
        </div>

        {completed ? (
          <motion.section
            className="daily-complete"
            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduced ? { duration: 0 } : motionTransition.response}
            aria-live="polite"
          >
            <div className="daily-complete__mascot"><img src={asset('mascot-welcome.png')} alt="Mascotte Referio célébrant le bonus quotidien" /></div>
            <Badge variant="reward">Bonus quotidien · +25 points</Badge>
            <Icon name="star" />
            <h1>Les 8 pépites sont explorées !</h1>
            <p>Tu as gagné <strong>{earnedToday} points locaux</strong> aujourd’hui. Reviens demain pour une nouvelle sélection.</p>
            <Link className="button button--secondary" to="/client/home">Retour à l’accueil</Link>
            <Link className="button button--ghost" to="/client/discover">Continuer à explorer</Link>
          </motion.section>
        ) : (
          <>
            <motion.article
              className="swipe-card"
              key={card.discoveryId}
              drag={reduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              dragMomentum={false}
              animate={direction === 'right'
                ? { x: 480, y: 0, rotate: 8, opacity: 0 }
                : direction === 'left'
                  ? { x: -480, y: 0, rotate: -8, opacity: 0 }
                  : direction === 'save'
                    ? { x: 0, y: 480, rotate: 0, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 90) decide('right')
                else if (info.offset.x < -90) decide('left')
              }}
              transition={reduced ? { duration: 0 } : motionTransition.base}
            >
              <img src={card.image} alt={`Devanture de ${card.name}`} />
              <span className="swipe-card__category">{card.category.split(' · ')[0].toUpperCase()}</span>
              {direction && <span className={`swipe-decision swipe-decision--${direction}`}>{direction === 'right' ? 'ÇA M’INTÉRESSE' : direction === 'save' ? 'ENREGISTRÉE' : 'PASSER'}</span>}
              {feedback && <motion.span className="swipe-feedback" initial={reduced ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} role="status">{feedback}</motion.span>}
              <div className="swipe-card__copy">
                <h1>{card.name}<br />{card.headline}</h1>
                <p className="swipe-card__meta"><span><Icon name="star" />{card.rating.toFixed(1)} ({card.reviews})</span><span>{card.distance}</span><span><Icon name="heart" />{card.recommendedBy} recommandations</span></p>
              </div>
              <button type="button" onClick={() => navigate(`/client/merchant/${card.id}`)}>Ouvrir la fiche</button>
            </motion.article>
            <div className="swipe-actions" aria-label="Actions de la pépite">
              <Button variant="ghost" disabled={Boolean(direction)} onClick={() => decide('left')}><Icon name="close" />Passer</Button>
              <Button variant="secondary" disabled={Boolean(direction)} onClick={() => decide('save')}><Icon name="heart" />Enregistrer</Button>
              <Button disabled={Boolean(direction)} onClick={() => decide('right')}><Icon name="check" />Ça m’intéresse</Button>
            </div>
            <p className="swipe-progress">{discoveredCount}/{dailyCards.length} aujourd’hui · {state.dailyBonusClaimed ? 'bonus +25 obtenu' : `encore ${dailyCards.length - discoveredCount} pour le bonus +25`}</p>
          </>
        )}
      </div>
    </AppShell>
  )
}

export function SearchScreen() {
  const [query, setQuery] = useState('café')
  const [verified, setVerified] = useState(true)
  const [openNow, setOpenNow] = useState(false)
  const [nearby, setNearby] = useState(false)
  const results = useMemo(() => merchants.filter((merchant) => {
    const matchesQuery = `${merchant.name} ${merchant.category}`.toLowerCase().includes(query.toLowerCase()) || !query
    return matchesQuery && (!verified || merchant.verified) && (!openNow || merchant.open) && (!nearby || (merchant.distanceMeters ?? Infinity) <= 1000)
  }), [nearby, openNow, query, verified])
  return (
    <AppShell bottomNav>
      <PageTitle eyebrow="RECHERCHE" title="Qu’est-ce qui te ferait plaisir ?" />
      <Field label="Recherche" value={query} onChange={setQuery} />
      <div className="chip-row"><Chip active={openNow} onClick={() => setOpenNow(!openNow)}>Ouvert</Chip><Chip active={verified} onClick={() => setVerified(!verified)}>Vérifié</Chip><Chip active={nearby} onClick={() => setNearby(!nearby)}>À moins de 1 km</Chip></div>
      <p className="results-count">{results.length} adresse{results.length > 1 ? 's' : ''} autour de toi</p>
      <div className="stack-list">
        {results.map((merchant) => <MerchantCard key={merchant.id} merchant={merchant} compact />)}
      </div>
    </AppShell>
  )
}

export function MapScreen() {
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [selected, setSelected] = useState(merchants[0])
  const visibleMerchants = merchantsForCategory(activeCategory).slice(0, 4)
  function selectCategory(category: string) {
    const next = merchantsForCategory(category).slice(0, 4)
    setActiveCategory(category)
    setSelected(next[0])
  }
  return (
    <AppShell bottomNav padded={false}>
      <div className="map-page">
        <PageTitle eyebrow="CARTE" title="Autour de Charleroi" />
        <Link className="search-box" to="/client/search"><Icon name="search" />Rechercher sur la carte…</Link>
        <div className="chip-row map-filters" aria-label="Filtrer les commerces">{['Tout', 'Café', 'Manger', 'Beauté'].map((category) => <Chip key={category} active={activeCategory === category} onClick={() => selectCategory(category)}>{category}</Chip>)}</div>
        <div className="map-canvas" style={{ backgroundImage: `url(${asset('map-background-clean.png')})` }} aria-label="Carte simulée de Charleroi">
          <i className="road road--one" /><i className="road road--two" /><i className="road road--three" />
          {visibleMerchants.map((merchant, index) => (
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
  const { merchantId } = useParams()
  const merchant = merchants.find((item) => item.id === merchantId) ?? merchants[0]
  const navigate = useNavigate()
  const [directionsOpen, setDirectionsOpen] = useState(false)
  const favorite = state.favorites.includes(merchant.id)
  return (
    <AppShell bottomNav padded={false}>
      <div className="merchant-detail">
        <div className="merchant-hero">
          <img src={merchant.id === 'cafe-central' ? asset('cafe-central-hero.jpg') : merchant.image} alt={`Devanture de ${merchant.name}`} />
          <Link to="/client/home" className="floating-control floating-control--back" aria-label="Retour"><Icon name="chevronRight" /></Link>
          <button type="button" className="floating-control floating-control--right" onClick={() => dispatch({ type: 'FAVORITE', merchantId: merchant.id })}><Icon name="heart" />{favorite ? 'Enregistré' : 'Enregistrer'}</button>
        </div>
        <div className="merchant-detail__body">
          <span className="offer-pill">{merchant.offer ? `Offre · ${merchant.offer}` : 'Pépite locale'}</span>
          <h1>{merchant.name} {merchant.verified && <Badge variant="verified" />}</h1>
          <p>{merchant.category} · {merchant.district} · à {merchant.distance}</p>
          <strong className="rating"><Icon name="star" />{merchant.rating.toFixed(1).replace('.', ',')} ({merchant.reviews} avis)</strong>
          <span className="social-proof">Recommandé par {merchant.recommendedBy} personnes</span>
          <div className="detail-tabs"><b>À propos</b><Link to="/client/reviews">Avis</Link><span>Offres</span><span>Photos</span></div>
          <p>Une adresse locale appréciée pour son accueil, son savoir-faire et les recommandations vérifiées de la communauté.</p>
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
      <Button full onClick={scan} disabled={scanning}><Icon name="scan" />{scanning ? 'Validation…' : 'Simuler le scan'}</Button>
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
      <div className="visit-celebration"><StampBadge name="premiereVisite" /><img src={asset('mascot-welcome.png')} alt="Mascotte Referio célébrant la visite" /><div><Badge variant="reward" /><strong>Premier passage validé</strong><span>Série locale : 1 jour</span></div></div>
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
