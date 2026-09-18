# Prototype coverage

Status: **implemented and clickable** unless marked as a deliberate simulation.

## Client

| Routes | Screens and interactions |
|---|---|
| `#/splash`, `#/onboarding/1` … `/4` | Splash, value story, city choice, interests; enabled/disabled states and navigation |
| `#/client/login`, `/signup`, `/forgot-password` | Local form states, simulated sign-in/signup/recovery feedback |
| `#/client/permissions/location`, `/notifications` | Permission explanation and allow/skip paths without real device permissions |
| `#/client/home` | Mascot, Points locaux progress, all 12 Figma category icons with live filtering, gamification shortcuts, daily swipe CTA, merchant and map links |
| `#/client/discover` | Draggable rotating discovery wheel, category filters, previous/next/select controls and merchant CTA |
| `#/client/daily` | Eight draggable cards plus Passer/Enregistrer/Ça m’intéresse alternatives; +5 per unique card and a one-off +25 completion bonus, persisted locally |
| `#/client/search` | Editable query plus open, verified and under-1-km filters with live merchant results |
| `#/client/map` | Local map composition, category filters, four clickable merchant pins and selected merchant card |
| `#/client/merchant/:id` | Route-driven merchant detail, favorite toggle, simulated directions, QR entry and reviews |
| `#/client/reviews`, `/review/new`, `/review/success` | Verified reviews, stars/tags/text, publish mutation, badge and level reveal |
| `#/client/qr`, `/visit/success`, `/visit/error` | Deterministic scan, +50 points, merchant stamp, success/error recovery |
| `#/client/profile` | Light/dark presentation, progression, impact, imagery and sharing feedback |
| `#/client/ranking` | Podium and current-user ranking |
| `#/client/favorites`, `/favorites/empty` | Lists, new-list feedback, favorite cards and empty state |
| `#/client/notifications` | Unread/read states and “mark all read” |
| `#/client/passports`, `/passports/cafe-moka` | Multi-merchant stamps, next reward and visit history |
| `#/client/points` | Separate spendable balance and lifetime Points locaux history |
| `#/client/challenges`, `/challenges/centre-ville`, `/success` | State-driven progress, completed challenge reveal and idempotent +150-point reward |
| `#/client/rewards`, `/rewards/atelier-basilic`, `/active` | Locked/unlocked catalogue, activation code and balance-only redemption |
| `#/client/collections` | Collection list plus create/invite local feedback |
| `#/client/settings`, `/privacy` | Working switches, account navigation, consent save and logout route |
| `#/client/error/network`, `/error/location` | Retry and manual-location recovery states |

## Business / PME

| Routes | Screens and interactions |
|---|---|
| `#/business/landing`, `/login`, `/plans` | Entry, simulated login, selectable plan |
| `#/business/claim`, `/verification` | Merchant selection, local proof status, submit feedback |
| `#/business/onboarding/info`, `/hours`, `/media` | Editable profile fields, Sunday switch, media-add state |
| `#/business/preview`, `/checklist` | Public preview and deterministic completion progress |
| `#/business/dashboard`, `/visibility` | Score, metrics, links to QR/offers/reviews, persistent mobile navigation and desktop sidebar |
| `#/business/profile`, `/stats`, `/publish`, `/reviews` | Editable profile/offer fields, save feedback, chart, public preview, offer publish and owner reply |
| `#/business/subscription` | Plan detail, route to plan change and access to QR, team, integrations, security and support |
| `#/business/qr` | Real deterministic SVG QR and local code renewal |
| `#/business/review-campaign` | Ethical campaign preview feedback |
| `#/business/team`, `/integrations`, `/security`, `/support` | Utility screens with local success states |

## Admin

| Routes | Screens and interactions |
|---|---|
| `#/admin/login` | Editable, validated strengthened login with masked password and simulated 2FA |
| `#/admin/dashboard` | Trust metrics, priorities and recent activity |
| `#/admin/verifications` | Live search, CSV export, editable internal note, accessible drawer and validate/reject mutation |
| `#/admin/moderation` | Selectable reports, editable notes and keep/remove feedback |
| `#/admin/appeals` | Selectable appeals and four-step review |
| `#/admin/users` | Live filtering, editable invite/manage drawer and local save feedback |
| `#/admin/audit` | Searchable/filterable audit log plus real local CSV export |
| `#/admin/system` | System metrics and working anti-fraud toggles |

## Desktop and presenter

| Routes | Coverage |
|---|---|
| `#/web/business` | 1440 px Business landing with exact 80 px header and 120 px gutters |
| `#/web/client` | Convenience alias to the responsive Client home at `#/client/home` |
| `#/web/cockpit` | Convenience alias to the responsive Business cockpit at `#/business/dashboard` |
| `#/hub` | Public responsive gateway exposing Client and Business/PME immediately, with mascot, two-way surface switching, scenario state and reset |
| `#/design-system` | Tokens, type, actions, fields, cards, 12 categories, 11 gamification references, official icons/badges/stamps/mascots and all seven Figma reference boards |

## State scenarios

Seed state: active Local Hero at 1,280 lifetime/spendable points, 4/6 Café Moka stamps, one favorite, reward locked, Business/PME 72% complete, 14 Admin items pending.

Core visit/review/reward flow: 1,280 → 1,330 after the visit → 1,500 after the review → 1,300 spendable after the 200-point reward; lifetime points stay at 1,500.

Daily swipe flow: eight unique cards × 5 points plus the one-off 25-point completion bonus = +65. From the seed this produces 1,345 lifetime/spendable points. If completed before the core flow, the final totals are 1,565 lifetime and 1,365 spendable after reward use.

Challenge flow: the daily discoveries advance the centre-ville challenge from 2/5 to 5/5. Opening its success screen then adds 150 lifetime/spendable points exactly once.

## Responsive coverage

- 360 × 800: full-width phone canvas; no document overflow.
- 390 × 844: canonical phone canvas.
- Up to 899 px: Client and Business/PME use completed mobile shells and navigation; the canonical 390 px canvas stays centered on wider tablet previews.
- From 900 px: the same Client and Business/PME routes become true responsive web-platform layouts; Client uses a fixed top header and Business/PME uses a 240 px sidebar.
- The public gateway is responsive and both experiences expose a direct switch to the other surface.
- 1440 × 900: full-width Client, Business/PME and Admin desktop geometry; no phone shell is rendered on the Client or Business/PME platform routes.
