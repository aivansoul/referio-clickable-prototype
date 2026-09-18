# Figma audit

## Source of truth

- File: `Referio — Prototype`
- File key: `iBw0ng5smCjxLaSmtxFI1z`
- Canonical implementation pages: Dev Client (`2:4`), Dev Business (`2:5`), Dev Web (`2:6`), Client Complete (`70:2`), Business Complete (`87:469`) and Admin (`95:2`).
- The Dev screens are canonical; HD compositions were used as visual references, never as whole-screen clickable images.

Design context was collected for every canonical page and for representative frame-level implementations before coding. Oversized pages were decomposed into individual screens/components.

## Canonical frames

### Client core

| Node | Frame |
|---|---|
| `7:79` | Accueil |
| `9:56` | Pépites |
| `10:84` | Commerces du jour |
| `12:84` | Fiche commerce |
| `13:84` | Profil |
| `20:105` | Avis |
| `30:106` | Recherche |
| `31:123` | Carte |
| `32:140` | Mon avis |
| `36:140` | Profil sombre |
| `37:140` | Classement |
| `38:157` | Challenges |
| `38:222` | Récompenses |
| `39:191` | Favoris |
| `39:246` | Notifications |
| `41:208`, `41:214`, `41:225`, `41:236` | Onboarding 1–4 |
| `41:259`, `41:265`, `41:271` | Empty/network/location states |

### Client complete

`71:2` Splash, `71:12` Connexion, `71:35` Inscription, `71:63` Mot de passe oublié, `75:31` Permission localisation, `75:50` Permission notifications, `75:70` Recherche active, `75:101` Carte sélectionnée, `77:64` Scan QR, `77:82` Visite réussie, `77:109` Erreur visite, `77:129` Passeports, `81:114` Détail passeport, `81:149` Historique points, `81:184` Détail challenge, `81:213` Challenge réussi, `82:134` Détail récompense, `82:155` Récompense activée, `82:173` Collections, `82:196` Paramètres, `82:225` Confidentialité.

### Business

Core: `14:2`, `42:19`, `43:36`, `43:98`, `44:70`, `44:126`, `44:154`.

Complete: `88:2`, `88:27`, `88:50`, `88:73`, `92:27`, `92:55`, `92:89`, `92:156`, `93:79`, `93:98`, `93:125`, `93:157`, `94:116`, `94:152`, `94:178`, `94:205`.

### Admin and Web

Admin: `97:2`, `97:19`, `97:79`, `98:42`, `98:115`, `98:164`, `99:92`, `99:165`.

Web: `15:2` business landing, `47:2` business cockpit and `47:67` client home.

## Foundations extracted

| Token | Value |
|---|---|
| Forest | `#243838` |
| Lime | `#B2FA63` |
| Sun | `#FF7833` |
| Lavender | `#B2A1FF` |
| Cream | `#F6F7F7` |
| Ink | `#1A2020` |
| Border | `#E6E8E8` |
| Spacing | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px |
| Radii | 8, 12, 16, 20, 28, 32, 999 px |
| Display | Archivo ExtraBold 34/28 |
| Body | Inter 16 |
| Caption | Inter SemiBold 12 |

Contract rules: no white text on Sun; Lime is not text color; no outline-button style; glass only on reviews; celebration gradients only on reward/progression moments; forest-tinted shadows.

## Reusable components

`AppShell`, `StatusBar`, `TopBar`, `BottomNavigation`, `PageTitle`, `Button`, `Chip`, `Field`, `PointsCard`, `MerchantCard`, `PassportCard`, `StateCard`, `ListRow`, Business shell/navigation, Admin shell/sidebar/table/drawer and desktop Web shells.

The bottom navigation follows the current Figma labels exactly: Accueil, Carte, Découvrir, Classement, Profil.

## Assets

All runtime assets are versioned locally in `public/assets/figma`; there are no temporary Figma/CDN URLs. The implementation uses the official brand texture/mark, merchant photography, discovery art, permission scenes, QR camera, profile/ranking imagery, rewards, onboarding, admin login art and Business photography.

The correction pass also integrates the visual language that was previously absent from the clickable experience:

- the official mascot on the public gateway, Client home, daily swipe, completion and recovery states, plus the welcome, discovery, favorites, network and location variants;
- nine exported SVG interface icons: search, close, check, chevron, map pin, scan, star, heart and settings;
- the four official Badge component variants (reward, verified, new and level);
- all ten official stamp crops, including Curieux, Explorateur, Insider, Local Hero, Légende locale, Première visite, Avis vérifié, Série locale, Ambassadeur and Fidélité complète;
- the official bottom-navigation and notification assets;
- all twelve Figma category references: food, café, bakery, beauty, hair salon, shopping, wellness, florist, garage, culture, leisure and craft;
- all eleven Figma gamification references: points, badge, streak, reward, challenge, verified, community, crown, coupon, loyalty and progression;
- the seven Figma reference boards for navigation/actions, categories, gamification, stamps, the verified-visit sequence, onboarding mascots and mascot states. These boards are exposed in `#/design-system` for implementation comparison; the interactive product continues to use semantic components and individual local assets rather than screenshot hotspots.

The asset manifest now inventories all 125 files under `public/assets/figma`. The nineteen category and gamification additions are lossless crops from the original Figma boards; their exact source rectangles, output sizes and parity checks are recorded in [`asset-crop-map.md`](asset-crop-map.md).

`business-qr.svg` was confirmed to be a checkmark layer, so the Business QR screen uses a deterministic real SVG QR instead of misrepresenting it as a QR matrix.

## Motion source audit

Motion context returned no authored Figma timelines for the sampled canonical screens. Motion in the code is therefore a documented product extension, using 120 ms micro feedback, 220 ms navigation, 360 ms progress/success and a 420 ms response spring. No decorative loop or continuous motion was added.
