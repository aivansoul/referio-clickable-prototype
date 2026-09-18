# Referio — clickable prototype

High-fidelity, front-end-only Referio prototype built from the canonical Figma file for client review. It covers the Client, Business, Admin and desktop Web surfaces with deterministic local state, responsive layouts and restrained motion.

## Live links

- Prototype: https://aivansoul.github.io/referio-clickable-prototype/
- Repository: https://github.com/aivansoul/referio-clickable-prototype
- Presentation hub: https://aivansoul.github.io/referio-clickable-prototype/#/hub
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

1. Open `#/hub` and reset the demo.
2. Launch Client and explore Charleroi.
3. Open a merchant or go directly to `#/client/qr`.
4. Simulate a QR scan: the visit adds 50 Points locaux and one merchant stamp.
5. Publish the prefilled verified review.
6. Observe the Guide du centre badge, the level change to Légende locale and the unlocked reward.
7. Continue to the reward or return to discovery.

The demo distinguishes lifetime progression (`points`) from the spendable reward balance (`balance`). Reward redemption never decreases lifetime progression.

## Architecture

- React 19 + TypeScript + Vite
- `HashRouter`, safe for GitHub Pages refreshes
- Motion for React with `prefers-reduced-motion`
- local deterministic reducer persisted in `localStorage`
- local Figma assets under `public/assets/figma`
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

Authentication, 2FA, QR/camera access, geolocation, uploads, notifications, sharing, directions, e-mail/SMS, payments, exports and admin decisions are all local simulations. There is no backend, remote API, analytics SDK or secret in this repository.

See [Figma audit](docs/figma-audit.md), [prototype coverage](docs/prototype-coverage.md) and [prototype decisions](docs/prototype-decisions.md).
