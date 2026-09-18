import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('#/hub')
  await page.evaluate(() => localStorage.clear())
})

test('hub exposes all four product surfaces', async ({ page }) => {
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Hub du prototype' })).toBeVisible()
  await expect(page.locator('.hub-grid > a')).toHaveCount(4)
  await expect(page.locator('.hub-grid').getByRole('heading', { name: 'Client', exact: true })).toBeVisible()
  await expect(page.locator('.hub-grid').getByRole('heading', { name: 'Business', exact: true })).toBeVisible()
  await expect(page.locator('.hub-grid').getByRole('heading', { name: 'Admin', exact: true })).toBeVisible()
  await expect(page.locator('.hub-grid').getByRole('heading', { name: 'Web desktop', exact: true })).toBeVisible()
})

test('verified visit unlocks the review flow', async ({ page }) => {
  await page.goto('#/client/qr')
  await page.getByRole('button', { name: 'Simuler le scan' }).click()
  await expect(page.getByRole('heading', { name: 'Ta visite compte vraiment.' })).toBeVisible()
  await expect(page.getByText('5 / 6 tampons')).toBeVisible()
  await page.getByRole('button', { name: 'Donner mon avis vérifié' }).click()
  await page.getByRole('button', { name: 'Publier mon avis' }).click()
  await expect(page.getByRole('heading', { name: 'Guide du centre' })).toBeVisible()
  await expect(page.getByText('1 500 points locaux cumulés')).toBeVisible()
})

test('mobile routes do not create document-level horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile geometry check')
  for (const route of ['client/home', 'client/discover', 'client/daily', 'client/map', 'client/rewards', 'business/dashboard']) {
    await page.goto(`#/${route}`)
    const metrics = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))
    expect(metrics.width, route).toBeLessThanOrEqual(metrics.viewport)
  }
})

test('reduced motion keeps scan state functional', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile motion check')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('#/client/qr')
  await page.getByRole('button', { name: 'Simuler le scan' }).click()
  await expect(page.getByRole('heading', { name: 'Ta visite compte vraiment.' })).toBeVisible()
})

test('business submission and publishing states respond immediately', async ({ page }) => {
  await page.goto('#/business/verification')
  await page.getByRole('button', { name: 'Envoyer mon dossier' }).click()
  await expect(page.getByText('Vérification en cours')).toBeVisible()
  await page.goto('#/business/publish')
  await page.getByRole('button', { name: 'Publier l’offre' }).click()
  await expect(page.getByText('Visible dès maintenant')).toBeVisible()
})

test('admin verification can be opened and validated', async ({ page }) => {
  await page.goto('#/admin/verifications')
  await page.getByRole('row', { name: 'Café Moka BCE 0748.221.930 · Charleroi Complet Faible Ouvrir' }).click()
  await expect(page.getByRole('dialog', { name: 'Dossier Café Moka' })).toBeVisible()
  await page.getByRole('button', { name: 'Valider', exact: true }).click()
  await expect(page.getByText('Dossier validé.')).toBeVisible()
})

test('every delivered route renders with no broken local image', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'single-project route smoke test')
  test.setTimeout(60_000)
  const routes = [
    'splash', 'onboarding/1', 'onboarding/2', 'onboarding/3', 'onboarding/4',
    'client/login', 'client/signup', 'client/forgot-password', 'client/permissions/location', 'client/permissions/notifications',
    'client/home', 'client/discover', 'client/daily', 'client/search', 'client/map', 'client/merchant/cafe-central',
    'client/reviews', 'client/review/new', 'client/review/success', 'client/qr', 'client/visit/success', 'client/visit/error',
    'client/profile', 'client/ranking', 'client/favorites', 'client/favorites/empty', 'client/notifications',
    'client/passports', 'client/passports/cafe-moka', 'client/points', 'client/challenges', 'client/challenges/centre-ville',
    'client/challenges/centre-ville/success', 'client/rewards', 'client/rewards/atelier-basilic',
    'client/rewards/atelier-basilic/active', 'client/collections', 'client/settings', 'client/privacy',
    'client/error/network', 'client/error/location',
    'business/landing', 'business/login', 'business/plans', 'business/claim', 'business/verification',
    'business/onboarding/info', 'business/onboarding/hours', 'business/onboarding/media', 'business/preview',
    'business/checklist', 'business/dashboard', 'business/visibility', 'business/profile', 'business/stats',
    'business/publish', 'business/reviews', 'business/subscription', 'business/qr', 'business/review-campaign',
    'business/team', 'business/integrations', 'business/security', 'business/support',
    'admin/login', 'admin/dashboard', 'admin/verifications', 'admin/moderation', 'admin/appeals', 'admin/users',
    'admin/audit', 'admin/system', 'web/business', 'web/client', 'web/cockpit', 'hub', 'design-system',
  ]

  for (const route of routes) {
    await page.goto(`#/${route}`)
    await expect(page.locator('.route-transition')).toHaveCount(1)
    await expect(page.locator('.route-transition')).toBeVisible()
    const broken = await page.locator('img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src')))
    expect(broken, route).toEqual([])
  }
})
