export type Merchant = {
  id: string
  name: string
  category: string
  district: string
  distance: string
  rating: number
  reviews: number
  recommendedBy: number
  image: string
  accent: 'sun' | 'lime' | 'lavender'
  offer?: string
}

export const merchants: Merchant[] = [
  {
    id: 'cafe-central',
    name: 'Café Central',
    category: 'Café · Brunch',
    district: 'Charleroi',
    distance: '450 m',
    rating: 4.9,
    reviews: 176,
    recommendedBy: 18,
    image: `${import.meta.env.BASE_URL}assets/figma/home-cafe-central.jpg`,
    accent: 'lime',
    offer: '−5 % sur votre première visite',
  },
  {
    id: 'maison-dune',
    name: 'Maison Dune',
    category: 'Boulangerie artisanale',
    district: 'Ville-Basse',
    distance: '320 m',
    rating: 4.8,
    reviews: 93,
    recommendedBy: 9,
    image: `${import.meta.env.BASE_URL}assets/figma/discovery-card.jpg`,
    accent: 'sun',
  },
  {
    id: 'atelier-basilic',
    name: 'Atelier Basilic',
    category: 'Restaurant',
    district: 'Quai 10',
    distance: '900 m',
    rating: 4.7,
    reviews: 128,
    recommendedBy: 14,
    image: `${import.meta.env.BASE_URL}assets/figma/reward-photo.jpg`,
    accent: 'lavender',
  },
]

export const levels = ['Curieux', 'Explorateur', 'Insider', 'Local Hero', 'Légende locale'] as const

export const categories = ['Tout', 'Manger', 'Beauté', 'Shopping', 'Nouveau']

export const prototypeRoutes = {
  client: [
    ['/client/home', 'Accueil'],
    ['/client/discover', 'Pépites du jour'],
    ['/client/daily', 'Commerces du jour'],
    ['/client/search', 'Recherche'],
    ['/client/map', 'Carte'],
    ['/client/merchant/cafe-central', 'Fiche commerce'],
    ['/client/reviews', 'Avis'],
    ['/client/review/new', 'Mon avis'],
    ['/client/profile', 'Profil'],
    ['/client/ranking', 'Classement'],
    ['/client/challenges', 'Challenges'],
    ['/client/rewards', 'Récompenses'],
    ['/client/favorites', 'Favoris'],
    ['/client/notifications', 'Notifications'],
    ['/client/qr', 'Scan QR'],
    ['/client/passports', 'Passeports'],
    ['/client/points', 'Historique des points'],
    ['/client/settings', 'Paramètres'],
    ['/client/privacy', 'Confidentialité'],
  ],
  business: [
    ['/business/dashboard', 'Dashboard'],
    ['/business/visibility', 'Visibilité'],
    ['/business/profile', 'Ma fiche'],
    ['/business/stats', 'Statistiques'],
    ['/business/publish', 'Publier'],
    ['/business/reviews', 'Répondre à un avis'],
    ['/business/subscription', 'Abonnement'],
  ],
  admin: [
    ['/admin/dashboard', 'Dashboard confiance'],
    ['/admin/verifications', 'File de vérification'],
    ['/admin/moderation', 'Modération avis'],
    ['/admin/appeals', 'Appels'],
    ['/admin/users', 'Utilisateurs & rôles'],
    ['/admin/audit', 'Journal d’audit'],
    ['/admin/system', 'Système & anti-fraude'],
  ],
} as const
