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

- Client and Business mobile screens stay at the canonical 390 × 844 canvas on tablet and are centered with a device-like radius/shadow.
- At 360 × 800 they become full viewport with 16 px gutters and a scrollable shell.
- Admin becomes a horizontal top navigation below 768 px; wide tables scroll inside their container.
- Desktop pages preserve the extracted 120 px gutters and 240 px cockpit/admin sidebar.

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

- A few exported SVG files contain only a base layer; CSS composes the missing visible glyph without introducing a third-party icon set.
- The HD map asset includes a complete composition. It is cropped into the live semantic map canvas and augmented with interactive HTML buttons; it is not used as a full-screen hotspot image.
- `profile-dark-avatar.jpg` is a wide group photo and is not used in the circular portrait slot; the verified profile portrait remains consistent in light/dark mode.
- Original Figma exports are preserved for provenance. Image optimization can be added later without replacing those originals.
