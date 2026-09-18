# Prototype decisions

## Added conventions not authored in Figma

- Route crossfades and restrained 8 px vertical transitions were added because Figma contains no motion timelines.
- The discovery wheel uses a 420 ms response spring; swipe acceptance uses 220 ms.
- A presenter hub (`#/hub`) provides recovery and direct surface switching without adding an overlay to the Figma screens.
- A deterministic SVG QR is generated for Business because the exported `business-qr.svg` is only a verification/check layer.
- Local state is persisted under `referio-demo-state-v1`; the hub reset restores the canonical seed.
- Lifetime Points locaux and spendable reward balance are separate state values. Spending a reward changes only the balance.
- Charleroi is the only enabled onboarding city; Bruxelles and Namur are visibly disabled future states.
- Directions, sharing, messages and exports return explicit local feedback rather than calling external services.

## Responsive decisions

- Client and Business use one route tree and one state model for both finished surfaces; there is no separate desktop-only copy of the product. The viewport selects the presentation at 900 px.
- Up to 899 px, Client and Business render the completed mobile shell with mobile navigation; it fills canonical phone viewports and stays centered at 390 px on wider tablet previews.
- From 900 px, those same routes render as a web platform without a phone shell: Client receives a fixed 76 px top header, while Business receives a persistent 240 px sidebar.
- Desktop content reflows into route-appropriate grids and split views (including home, profile, challenges/rewards, map, merchant detail and Business dashboard) while preserving the same interactions and demo state.
- `#/web/client` and `#/web/cockpit` remain convenience aliases and redirect to `#/client/home` and `#/business/dashboard`; `#/web/business` remains the standalone Business marketing page.
- Admin becomes a horizontal top navigation below 768 px; wide tables scroll inside their container.
- The standalone Business marketing page preserves its extracted 120 px gutters; Business platform routes use the 240 px sidebar.

## Reduced motion

With `prefers-reduced-motion: reduce`, transform-based transitions collapse, swipe dragging is disabled, the QR scan line is not rendered, and state mutations/navigation remain immediate. Explicit buttons remain available for every gesture.

## Simulated elements

- login, account creation, 2FA and password reset;
- camera/QR scan, geolocation and directions;
- notifications, sharing and invites;
- merchant claim/documents/uploads;
- payments/subscription changes;
- e-mail/SMS review campaign;
- CSV/PDF/download actions;
- Admin verification/moderation/security mutations.

No backend, Supabase project, payment provider, analytics SDK, external API or secret is used.

## Known source limitations

- Some Figma reference boards are flattened compositions rather than independently exportable vectors. Where needed, exact local crops from those boards are used for navigation, categories, stamps and mascot states; the nine available interface glyphs remain local SVG exports.
- The HD map asset includes a complete composition. It is cropped into the live semantic map canvas and augmented with interactive HTML buttons; it is not used as a full-screen hotspot image.
- `profile-dark-avatar.jpg` is a wide group photo and is not used in the circular portrait slot; the verified profile portrait remains consistent in light/dark mode.
- Original Figma exports are preserved for provenance. Image optimization can be added later without replacing those originals.
