# Referio — clickable prototype

High-fidelity, front-end-only Referio prototype built from the canonical Figma file for client review. It covers the Client, Business, Admin and desktop Web surfaces with deterministic local state, responsive layouts and restrained motion.

## Live links

- Prototype: https://aivansoul.github.io/referio-clickable-prototype/
- Repository: https://github.com/aivansoul/referio-clickable-prototype
- Presentation hub: https://aivansoul.github.io/referio-clickable-prototype/#/hub
- Client platform: https://aivansoul.github.io/referio-clickable-prototype/#/client/home
- Business / PME platform: https://aivansoul.github.io/referio-clickable-prototype/#/business/dashboard
- Design system: https://aivansoul.github.io/referio-clickable-prototype/#/design-system

## Run locally

Requirements: Node.js 22 and npm 10.

```bash
npm install --legacy-peer-deps
npm run dev
```

Production verification:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

For browser tests, install Chromium once if it is not present, then run:

```bash
npx playwright install chromium
npm run test:e2e
```

## Demo path

1. Open `#/hub`, where the finished Client and Business/PME experiences are both exposed, and reset the demo.
2. Launch Client, then swipe the eight Pépites du jour: each unique card adds 5 Points locaux and completion adds a one-off 25-point bonus (+65 total).
3. Explore categories or the discovery wheel, then open a merchant or go directly to `#/client/qr`.
4. Simulate a QR scan: the visit adds 50 Points locaux and one merchant stamp.
5. Publish the prefilled verified review.
6. Observe the new Légende locale stamp, the level change and the unlocked reward.
7. Switch directly to the Business/PME platform to inspect the corresponding dashboard, profile, offer, reviews, QR and utilities on mobile or web.

The demo distinguishes lifetime progression (`points`) from the spendable reward balance (`balance`). In the core seeded visit/review/reward path, `1,280 + 50 + 170 - 200 = 1,300` spendable while lifetime stays at 1,500. Completing the daily swipe first adds 65 to both totals.

## Architecture

- React 19 + TypeScript + Vite
- `HashRouter`, safe for GitHub Pages refreshes
- Motion for React with `prefers-reduced-motion`
- local deterministic reducer persisted in `localStorage`
- shared responsive Client and Business/PME route trees: finished mobile shells below 900 px and web-platform layouts from 900 px
- 125 local Figma assets under `public/assets/figma`, fully inventoried in `docs/asset-manifest.json`
- reusable primitives in `src/components`
- product surfaces in `src/screens`
- unit tests with Vitest and route/interaction tests with Playwright

Key directories:

```text
src/components/     shared shell and UI primitives
src/data/           demo merchants, routes and product constants
src/screens/        Client, Business, Admin, Web and presenter surfaces
src/state/          deterministic persisted prototype state
public/assets/figma exact exported source assets
docs/               Figma audit, coverage and implementation decisions
```

## Deployment

The Vite base is `/referio-clickable-prototype/`. A push to `main` runs `.github/workflows/deploy-pages.yml`, verifies TypeScript/tests/build, uploads `dist`, and deploys it through GitHub Pages.

## Intentionally simulated

Authentication, 2FA, QR/camera access, geolocation, uploads, notifications, sharing, directions, e-mail/SMS, payments and admin decisions are local simulations. QR supports and Admin CSV files are real local downloads; nothing is sent to a backend, remote API, analytics SDK or secret-bearing service.

See [Figma audit](docs/figma-audit.md), [asset manifest](docs/asset-manifest.json), [exact crop map](docs/asset-crop-map.md), [prototype coverage](docs/prototype-coverage.md) and [prototype decisions](docs/prototype-decisions.md).
