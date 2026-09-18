import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Chip, Field, Icon, MerchantCard, PageTitle, PassportCard, PointsCard, StampBadge, StateCard, type IconName, type StampName } from '../components/ui'
import { merchants, prototypeRoutes } from '../data/demo'
import { useDemo } from '../state/DemoContext'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/figma/${name}`

const categoryAssets = [
  ['category-food.png', 'Manger'], ['category-cafe.png', 'Café'], ['category-bakery.png', 'Boulangerie'],
  ['category-beauty.png', 'Beauté'], ['category-hair-salon.png', 'Coiffure'], ['category-shopping.png', 'Shopping'],
  ['category-wellness.png', 'Bien-être'], ['category-florist.png', 'Fleuriste'], ['category-garage.png', 'Garage'],
  ['category-culture.png', 'Culture'], ['category-leisure.png', 'Loisirs'], ['category-craft.png', 'Artisanat'],
] as const

const gamificationAssets = [
  ['gamification-points.png', 'Points locaux'], ['gamification-badge.png', 'Badge'], ['gamification-streak.png', 'Série'],
  ['gamification-reward.png', 'Récompense'], ['gamification-challenge.png', 'Challenge'], ['gamification-verified.png', 'Vérifié'],
  ['gamification-community.png', 'Communauté'], ['gamification-crown.png', 'Légende locale'], ['gamification-coupon.png', 'Coupon'],
  ['gamification-loyalty.png', 'Fidélité'], ['gamification-progression.png', 'Progression'],
] as const

export function PrototypeHubScreen() {
  const { state, reset } = useDemo()
  const reduced = useReducedMotion()
  return (
    <main className="hub-page gateway-page">
      <header className="gateway-header">
        <Link className="wordmark" to="/hub" aria-label="Referio, choix de l’expérience"><span className="wordmark__dot" />referio.</Link>
        <div className="gateway-header__meta"><span>PLATEFORME RESPONSIVE</span><b>Mobile + Web</b></div>
      </header>

      <section className="gateway-hero">
        <div className="gateway-hero__copy">
          <span>REFERIO · CHARLEROI</span>
          <h1>Deux expériences.<br />Une même confiance locale.</h1>
          <p>Choisissez le côté de la plateforme à explorer. Chaque espace est entièrement cliquable, responsive et relié à l’autre.</p>
        </div>
        <motion.img
          className="gateway-mascot"
          src={asset('mascot-discover.png')}
          alt="Mascotte perroquet Referio"
          initial={reduced ? false : { opacity: 0, y: 18, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 16 }}
        />
      </section>

      <section className="gateway-surfaces" aria-label="Choisir une expérience Referio">
        <Link className="gateway-surface gateway-surface--client" to="/client/home">
          <div className="gateway-surface__icon"><img src={asset('nav-discover.png')} alt="" /></div>
          <span>POUR LES HABITANTS</span>
          <h2>Expérience Client</h2>
          <p>Découvrir, swiper les Pépites, vérifier une visite et gagner des Points locaux.</p>
          <ul><li><Icon name="mapPin" />Adresses locales</li><li><Icon name="heart" />Coups de cœur</li><li><img src={asset('stamp-local-hero.png')} alt="" />Badges & niveaux</li></ul>
          <b>Explorer côté Client <Icon name="chevronRight" /></b>
        </Link>
        <Link className="gateway-surface gateway-surface--business" to="/business/dashboard">
          <div className="gateway-surface__icon"><img src={asset('icon-settings.svg')} alt="" /></div>
          <span>POUR LES COMMERCES & PME</span>
          <h2>Espace Business</h2>
          <p>Piloter sa fiche, sa visibilité, ses offres, ses avis et ses visites vérifiées.</p>
          <ul><li><Icon name="check" />Fiche vérifiée</li><li><Icon name="star" />Avis clients</li><li><Icon name="scan" />QR de visite</li></ul>
          <b>Ouvrir l’espace PME <Icon name="chevronRight" /></b>
        </Link>
      </section>

      <section className="gateway-demo">
        <div><span>DÉMO CLIENT PRÊTE</span><h2>Swipe → visite → avis → récompense</h2><p>Le scénario crédite les Points locaux, remplit le passeport et révèle la progression.</p></div>
        <div className="gateway-demo__actions"><Link className="button button--secondary" to="/client/daily">Swiper les Pépites</Link><Link className="button button--ghost" to="/design-system">Voir toutes les références</Link></div>
      </section>

      <section className="hub-state"><div><span>ÉTAT COURANT</span><strong>{state.points.toLocaleString('fr-BE')} points · {state.level}</strong><p>{state.stamps}/6 tampons · badge {state.badgeUnlocked ? 'débloqué' : 'à débloquer'} · récompense {state.rewardUnlocked ? 'disponible' : 'verrouillée'}</p></div><Button variant="ghost" onClick={reset}>Réinitialiser la démo</Button></section>
      <details className="gateway-index"><summary>Index complet du prototype</summary><div className="hub-columns"><section><h2>Client</h2>{prototypeRoutes.client.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}</section><section><h2>Business / PME</h2>{prototypeRoutes.business.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}</section><section><h2>Administration & contrôle</h2>{prototypeRoutes.admin.map(([to, label]) => <Link key={to} to={to}>{label}<span>›</span></Link>)}<Link to="/design-system">Design system<span>›</span></Link></section></div></details>
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
      <section><PageTitle eyebrow="BIBLIOTHÈQUE FIGMA" title="Icônes officielles" body="Exports vectoriels 24 × 24 du nœud Tier 0 · 59:5." /><div className="icon-library">{(['search', 'close', 'check', 'chevronRight', 'mapPin', 'scan', 'star', 'heart', 'settings'] as IconName[]).map((name) => <div key={name}><Icon name={name} /><span>{name}</span></div>)}</div><div className="badge-library"><Badge variant="reward" /><Badge variant="verified" /><Badge variant="new" /><Badge variant="level" /></div></section>
      <section><PageTitle eyebrow="CATÉGORIES" title="Les 12 repères officiels" body="Crops lossless de la planche Figma, utilisés dans l’accueil Client." /><div className="reference-asset-library">{categoryAssets.map(([image, label]) => <figure key={label}><img src={asset(image)} alt="" /><figcaption>{label}</figcaption></figure>)}</div></section>
      <section><PageTitle eyebrow="STATUTS" title="Gamification et progression" body="Points, badges, série, récompense, challenge, communauté et fidélité." /><div className="reference-asset-library reference-asset-library--gamification">{gamificationAssets.map(([image, label]) => <figure key={label}><img src={asset(image)} alt="" /><figcaption>{label}</figcaption></figure>)}</div></section>
      <section><PageTitle eyebrow="GAMIFICATION" title="Timbres papier découpé" body="Les dix références originales de la planche Figma D-031." /><div className="stamp-library">{(['curieux', 'explorateur', 'insider', 'localHero', 'legendeLocale', 'premiereVisite', 'avisVerifie', 'serieLocale', 'ambassadeur', 'fideliteComplete'] as StampName[]).map((name, index) => <StampBadge name={name} locked={index > 7} key={name} />)}</div></section>
      <section><PageTitle eyebrow="PERSONNALITÉ" title="Mascotte et états" /><div className="mascot-library"><figure><img src={asset('mascot.png')} alt="Mascotte Referio" /><figcaption>Profil · impact local</figcaption></figure><figure><img src={asset('mascot-welcome.png')} alt="Mascotte de bienvenue" /><figcaption>Bienvenue</figcaption></figure><figure><img src={asset('mascot-discover.png')} alt="Mascotte avec loupe" /><figcaption>Découverte</figcaption></figure><figure><img src={asset('mascot-favorites.png')} alt="Mascotte avec boîte vide" /><figcaption>Favoris vides</figcaption></figure><figure><img src={asset('mascot-network.png')} alt="Mascotte et câble débranché" /><figcaption>Erreur réseau</figcaption></figure><figure><img src={asset('mascot-location.png')} alt="Repère endormi" /><figcaption>Localisation refusée</figcaption></figure></div></section>
      <section><PageTitle eyebrow="PLANCHES SOURCES" title="Toutes les références visuelles Figma" body="Navigation, catégories, gamification, tampons, visite vérifiée et états de mascotte — conservés sans redessin." /><div className="reference-board-grid"><img src={asset('reference-navigation-actions.png')} alt="Planche des icônes de navigation et actions" /><img src={asset('reference-categories.png')} alt="Planche des icônes de catégories" /><img src={asset('reference-gamification.png')} alt="Planche des icônes de gamification" /><img src={asset('reference-stamps.png')} alt="Planche des dix tampons Referio" /><img src={asset('reference-visit-sequence.png')} alt="Séquence de visite vérifiée" /><img src={asset('reference-mascot-onboarding.png')} alt="Mascotte dans l’onboarding" /><img src={asset('reference-mascot-states.png')} alt="États fonctionnels de la mascotte" /></div></section>
      <section><PageTitle eyebrow="COMPOSANTS" title="Cartes produit" /><div className="card-grid"><PointsCard points={state.points} level={state.level} /><PassportCard stamps={state.stamps} /><MerchantCard merchant={merchants[0]} /><StateCard label="VISITE VÉRIFIÉE" title="+50 points locaux" body="La progression et le passeport sont à jour." /><StateCard tone="error" label="PREUVE NON VALIDÉE" title="Réessaie près du comptoir" body="Aucune progression n’a été modifiée." /></div></section>
      <section><PageTitle eyebrow="RÈGLES" title="Contrat visuel" /><ul className="design-rules"><li>Jamais de texte blanc sur Sun.</li><li>Lime n’est jamais une couleur de texte.</li><li>Aucun bouton outline.</li><li>Glassmorphism réservé aux avis.</li><li>Gradients de célébration réservés aux récompenses.</li><li>« points locaux », jamais XP.</li></ul></section>
    </main>
  )
}
