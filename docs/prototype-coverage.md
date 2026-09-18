# Prototype coverage

Status: **implemented and clickable** unless marked as a deliberate simulation.

## Client

| Routes | Screens and interactions |
|---|---|
| `#/splash`, `#/onboarding/1` … `/4` | Splash, value story, city choice, interests; enabled/disabled states and navigation |
| `#/client/login`, `/signup`, `/forgot-password` | Local form states, simulated sign-in/signup/recovery feedback |
| `#/client/permissions/location`, `/notifications` | Permission explanation and allow/skip paths without real device permissions |
| `#/client/home` | Category selection, Points locaux progress, daily discoveries, merchant links, map link |
| `#/client/discover` | Rotating discovery wheel, previous/next/select controls, merchant CTA |
| `#/client/daily` | Draggable swipe card plus Passer/Enregistrer/Coup de cœur alternatives |
| `#/client/search` | Editable query, verified filter and live merchant results |
| `#/client/map` | Local map composition, three clickable pins, selected merchant card |
| `#/client/merchant/:id` | Detail, favorite toggle, simulated directions, QR entry, reviews |
| `#/client/reviews`, `/review/new`, `/review/success` | Verified reviews, stars/tags/text, publish mutation, badge and level reveal |
| `#/client/qr`, `/visit/success`, `/visit/error` | Deterministic scan, +50 points, merchant stamp, success/error recovery |
| `#/client/profile` | Light/dark presentation, progression, impact, imagery and sharing feedback |
| `#/client/ranking` | Podium and current-user ranking |
| `#/client/favorites`, `/favorites/empty` | Lists, new-list feedback, favorite cards and empty state |
| `#/client/notifications` | Unread/read states and “mark all read” |
| `#/client/passports`, `/passports/cafe-moka` | Multi-merchant stamps, next reward and visit history |
| `#/client/points` | Separate spendable balance and lifetime Points locaux history |
| `#/client/challenges`, `/challenges/centre-ville`, `/success` | Active/completed challenges, progress and success reveal |
| `#/client/rewards`, `/rewards/atelier-basilic`, `/active` | Locked/unlocked catalogue, activation code and balance-only redemption |
| `#/client/collections` | Collection list plus create/invite local feedback |
| `#/client/settings`, `/privacy` | Working switches, account navigation, consent save and logout route |
| `#/client/error/network`, `/error/location` | Retry and manual-location recovery states |

## Business

| Routes | Screens and interactions |
|---|---|
| `#/business/landing`, `/login`, `/plans` | Entry, simulated login, selectable plan |
| `#/business/claim`, `/verification` | Merchant selection, local proof status, submit feedback |
| `#/business/onboarding/info`, `/hours`, `/media` | Editable profile fields, Sunday switch, media-add state |
| `#/business/preview`, `/checklist` | Public preview and deterministic completion progress |
| `#/business/dashboard`, `/visibility` | Score, metrics, links to QR/offers/reviews and navigation |
| `#/business/profile`, `/stats`, `/publish`, `/reviews` | Save feedback, chart, offer publish and owner reply |
| `#/business/subscription` | Plan detail and route to plan change |
| `#/business/qr` | Real deterministic SVG QR and local code renewal |
| `#/business/review-campaign` | Ethical campaign preview feedback |
| `#/business/team`, `/integrations`, `/security`, `/support` | Utility screens with local success states |

## Admin

| Routes | Screens and interactions |
|---|---|
| `#/admin/login` | Simulated strengthened login/2FA |
| `#/admin/dashboard` | Trust metrics, priorities and recent activity |
| `#/admin/verifications` | Selectable rows, accessible decision drawer, validate/reject mutation |
| `#/admin/moderation` | Selectable reports and keep/remove feedback |
| `#/admin/appeals` | Selectable appeals and four-step review |
| `#/admin/users` | Invite/manage drawer and local save |
| `#/admin/audit` | Audit log plus print/export simulation |
| `#/admin/system` | System metrics and working anti-fraud toggles |

## Desktop and presenter

| Routes | Coverage |
|---|---|
| `#/web/business` | 1440 px Business landing with exact 80 px header and 120 px gutters |
| `#/web/client` | Convenience alias to the responsive Client home at `#/client/home` |
| `#/web/cockpit` | Convenience alias to the responsive Business cockpit at `#/business/dashboard` |
| `#/hub` | Scenario launcher, surface switching, current state and reset |
| `#/design-system` | Tokens, type, actions, fields, cards, official icons/badges/stamps/mascots and Figma reference boards |

## State scenarios

Seed state: active Local Hero at 1,280 lifetime/spendable points, 4/6 Café Moka stamps, one favorite, reward locked, Business 72% complete, 14 Admin items pending.

Main mutation: visit → 1,330 points/5 stamps → review → 1,500 points/Légende locale/badge/reward → reward use → 900 spendable balance while lifetime points stay 1,500.

## Responsive coverage

- 360 × 800: full-width phone canvas; no document overflow.
- 390 × 844: canonical phone canvas.
- Up to 899 px: Client and Business use the completed mobile shell and mobile navigation; the canonical 390 px canvas stays centered on wider tablet previews.
- From 900 px: the same Client and Business routes become true responsive web-platform layouts; Client uses a fixed top header and Business uses a 240 px sidebar.
- 1440 × 900: full-width Client, Business and Admin desktop geometry; no phone shell is rendered on the Client or Business platform routes.
