import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('#/hub')
  await page.evaluate(() => localStorage.clear())
})

test('public entry exposes Client and Business PME immediately', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveURL(/#\/hub$/)
  await expect(page.getByRole('heading', { name: 'Deux expériences. Une même confiance locale.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Expérience Client' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Espace Business' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Mascotte perroquet Referio' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Explorer côté Client/ })).toHaveAttribute('href', '#/client/home')
  await expect(page.getByRole('link', { name: /Ouvrir l’espace PME/ })).toHaveAttribute('href', '#/business/dashboard')
  const metrics = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(metrics.width).toBeLessThanOrEqual(metrics.viewport)
})

test('Client and PME can switch in both directions', async ({ page }, testInfo) => {
  await page.getByRole('link', { name: /Ouvrir l’espace PME/ }).click()
  await expect(page.getByRole('heading', { name: /Bonjour Café Central|Votre visibilité/ })).toBeVisible()

  if (testInfo.project.name === 'desktop-1440') {
    await page.getByRole('link', { name: 'Voir l’expérience Client' }).click()
  } else {
    await page.getByRole('link', { name: 'Vue Client' }).click()
  }
  await expect(page.getByRole('heading', { name: /Bonjour Lana/ })).toBeVisible()
  if (testInfo.project.name === 'mobile-390') {
    await page.getByRole('link', { name: 'Ouvrir l’espace Business PME' }).click()
  } else {
    await page.getByRole('link', { name: 'Espace PME' }).click()
  }
  await expect(page.getByRole('heading', { name: /Bonjour Café Central|Votre visibilité/ })).toBeVisible()
})

test('primary Client route exposes mascot, all category references and swipe CTA', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile primary surface check')
  await page.goto('#/client/home')
  await expect(page.getByRole('img', { name: /Mascotte officielle Referio/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Swiper les pépites du jour/ })).toBeVisible()
  await expect(page.locator('.category-icon-row button')).toHaveCount(12)
  await expect(page.locator('.home-gamification-strip > a')).toHaveCount(4)
})

test('daily swipe decisions award +5 per card and the +25 bonus once', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile swipe state check')
  await page.goto('#/client/home')
  await page.getByRole('link', { name: /Swiper les pépites du jour/ }).click()
  await expect(page.getByRole('heading', { name: 'Swipe, découvre et gagne des points locaux.' })).toBeVisible()

  for (let count = 1; count <= 8; count += 1) {
    await page.getByRole('button', { name: 'Ça m’intéresse' }).click()
    if (count < 8) await expect(page.getByText(`${count}/8 aujourd’hui`, { exact: false })).toBeVisible()
  }

  await expect(page.getByRole('heading', { name: 'Les 8 pépites sont explorées !' })).toBeVisible()
  await expect(page.getByText('65 points locaux', { exact: false })).toBeVisible()
  await page.getByRole('link', { name: 'Retour à l’accueil' }).click()
  await expect(page.getByText('1 345 points locaux', { exact: false }).first()).toBeVisible()
  await page.reload()
  await expect(page.getByText('1 345 points locaux', { exact: false }).first()).toBeVisible()
  await page.goto('#/client/challenges')
  await expect(page.getByText('5 / 5 · Challenge terminé')).toBeVisible()
  await page.goto('#/client/challenges/centre-ville')
  await page.getByRole('button', { name: 'Voir ma réussite' }).click()
  await expect(page.getByRole('heading', { name: 'Cinq découvertes. Un quartier plus vivant.' })).toBeVisible()
  await expect(page.getByText('points locaux ajoutés')).toBeVisible()
  await page.goto('#/client/points')
  await expect(page.getByText('1 495 points cumulés', { exact: false })).toBeVisible()
  await page.reload()
  await expect(page.getByText('1 495 points cumulés', { exact: false })).toBeVisible()
})

test('discovery wheel responds to a drag gesture', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile wheel gesture check')
  await page.goto('#/client/discover')
  await expect(page.locator('.selected-pepite').getByRole('heading', { name: 'Café Central' })).toBeVisible()
  const wheel = await page.locator('.discovery-wheel').boundingBox()
  expect(wheel).not.toBeNull()
  await page.mouse.move(wheel!.x + wheel!.width / 2, wheel!.y + wheel!.height / 2)
  await page.mouse.down()
  await page.mouse.move(wheel!.x + wheel!.width / 2 - 120, wheel!.y + wheel!.height / 2, { steps: 6 })
  await page.mouse.up()
  await expect(page.locator('.selected-pepite').getByRole('heading', { name: 'Maison Dune' })).toBeVisible()
})

test('category selection and merchant routing change real content', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'desktop catalogue check')
  await page.goto('#/client/home')
  await page.locator('.category-icon-row').getByRole('button', { name: 'Coiffure' }).click()
  await expect(page.locator('.home-merchant-grid').getByRole('link', { name: /Studio Nola/ })).toBeVisible()
  await expect(page.locator('.home-merchant-grid').getByRole('link', { name: /Café Central/ })).toHaveCount(0)
  await page.locator('.category-icon-row').getByRole('button', { name: 'Boulangerie' }).click()
  await page.locator('.home-merchant-grid').getByRole('link', { name: /Maison Dune/ }).click()
  await expect(page.locator('.merchant-detail__body').getByRole('heading', { name: /Maison Dune/ })).toBeVisible()
  await expect(page.locator('.merchant-detail__body').getByText(/Boulangerie artisanale/)).toBeVisible()
})

test('map pins and home Pépites use the real merchant catalogue', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'desktop catalogue reference check')
  await page.goto('#/client/home')
  await expect(page.locator('.pepite-strip a').nth(0)).toHaveAttribute('href', '#/client/merchant/cafe-moka')
  await expect(page.locator('.pepite-strip a').nth(1)).toHaveAttribute('href', '#/client/merchant/studio-nola')
  await page.goto('#/client/map')
  await expect(page.locator('.map-pin')).toHaveCount(4)
  await expect(page.locator('.map-pin img').first()).toBeVisible()
})

test('Client account forms are editable and validated locally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile form interaction check')
  await page.goto('#/client/signup')
  const firstName = page.getByLabel('Prénom')
  await firstName.fill('')
  await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeDisabled()
  await firstName.fill('Lana')
  await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeEnabled()

  await page.goto('#/client/forgot-password')
  await expect(page.locator('.route-transition')).toHaveCount(1)
  await page.getByLabel('Adresse e-mail').fill('adresse-invalide')
  await expect(page.getByRole('button', { name: 'Envoyer le lien' })).toBeDisabled()
})

test('Business account links every secondary PME tool', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile PME reachability check')
  await page.goto('#/business/dashboard')
  await page.getByRole('link', { name: 'Compte' }).click()
  for (const name of ['QR de visite', 'Équipe et rôles', 'Intégrations', 'Sécurité', 'Aide et support']) {
    await expect(page.getByRole('link', { name: new RegExp(name) })).toBeVisible()
  }
  await page.getByRole('link', { name: /QR de visite/ }).click()
  await expect(page.getByRole('heading', { name: 'Un code vivant, prêt pour la caisse.' })).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Télécharger le support' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('referio-qr-cafe-moka.svg')
})

test('Business plans expose the three Figma offers and support selection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile PME plan check')
  await page.goto('#/business/subscription')
  await expect(page.getByRole('heading', { name: 'Découverte' })).toBeVisible()
  await expect(page.getByText('19 € /mois')).toBeVisible()
  await expect(page.getByText('49 € /mois')).toBeVisible()
  await page.getByRole('button', { name: 'Choisir Rayonnement' }).click()
  await expect(page.getByText('Formule sélectionnée : Rayonnement')).toBeVisible()
})

test('verified visit unlocks the review flow', async ({ page }) => {
  await page.goto('#/client/qr')
  await page.getByRole('button', { name: 'Simuler le scan' }).click()
  await expect(page.getByRole('heading', { name: 'Ta visite compte vraiment.' })).toBeVisible()
  await expect(page.getByText('5 / 6 tampons')).toBeVisible()
  await page.getByRole('button', { name: 'Donner mon avis vérifié' }).click()
  await page.getByRole('button', { name: 'Publier mon avis' }).click()
  await expect(page.getByRole('heading', { name: 'Légende locale' })).toBeVisible()
  await expect(page.getByText('1 500 points locaux cumulés')).toBeVisible()
})

test('mobile routes do not create document-level horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile geometry check')
  for (const route of ['client/home', 'client/discover', 'client/daily', 'client/map', 'client/profile', 'client/rewards', 'business/dashboard', 'business/subscription', 'design-system']) {
    await page.goto(`#/${route}`)
    const metrics = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))
    expect(metrics.width, route).toBeLessThanOrEqual(metrics.viewport)
  }
})

test('mobile discovery and business copy remain unclipped', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'mobile visual geometry check')
  await page.goto('#/client/discover')
  const wheel = await page.locator('.discovery-wheel').boundingBox()
  const controls = await page.locator('.wheel-controls').boundingBox()
  expect(wheel).not.toBeNull()
  expect(controls).not.toBeNull()
  expect(wheel!.y + wheel!.height).toBeLessThanOrEqual(controls!.y)

  await page.goto('#/business/dashboard')
  const scoreCopy = await page.locator('.business-score-copy p').evaluate((element) => ({
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  }))
  expect(scoreCopy.scrollHeight).toBeLessThanOrEqual(scoreCopy.clientHeight)
  expect(scoreCopy.scrollWidth).toBeLessThanOrEqual(scoreCopy.clientWidth)
})

test('client and business routes become full web platforms at 1440 px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'desktop platform geometry check')
  for (const route of ['client/home', 'client/discover', 'client/map', 'client/profile', 'client/rewards', 'business/dashboard', 'business/profile', 'business/subscription']) {
    await page.goto(`#/${route}`)
    await expect(page.locator('.route-transition')).toHaveCount(1)
    await expect(page.locator('.phone-shell')).toHaveCount(0)
    await expect(page.locator('.platform-panel')).toHaveCount(1)
    await expect(page.locator('.platform-panel')).toBeVisible()
    const metrics = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))
    expect(metrics.width, route).toBeLessThanOrEqual(metrics.viewport)
  }
  await page.goto('#/web/client')
  await expect(page).toHaveURL(/#\/client\/home$/)
  await page.goto('#/web/cockpit')
  await expect(page).toHaveURL(/#\/business\/dashboard$/)
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
  await page.goto('#/business/checklist')
  await page.getByRole('button', { name: /Première offre publiée/ }).click()
  await expect(page.getByText('80 % complété')).toBeVisible()
  await page.goto('#/business/dashboard')
  await page.goto('#/business/checklist')
  await expect(page.getByRole('button', { name: /Première offre publiée/ })).toBeDisabled()
})

test('admin verification can be opened and validated', async ({ page }) => {
  await page.goto('#/admin/verifications')
  await page.getByRole('row', { name: 'Café Moka BCE 0748.221.930 · Charleroi Complet Faible Ouvrir' }).click()
  await expect(page.getByRole('dialog', { name: 'Dossier Café Moka' })).toBeVisible()
  await page.getByLabel('Note interne').fill('BCE et adresse contrôlées.')
  await page.getByRole('button', { name: 'Valider', exact: true }).click()
  await expect(page.getByText('Dossier validé.')).toBeVisible()
  await expect(page.getByText('Note interne enregistrée.')).toBeVisible()
})

test('admin editable controls, filters and CSV exports are functional', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'desktop Admin interaction check')

  await page.goto('#/admin/login')
  const adminEmail = page.getByLabel('Adresse professionnelle')
  const adminPassword = page.getByLabel('Mot de passe')
  await expect(adminPassword).toHaveAttribute('type', 'password')
  await adminEmail.fill('adresse-invalide')
  await expect(page.getByRole('button', { name: 'Continuer avec la 2FA' })).toBeDisabled()
  await adminEmail.fill('admin@referio.example')
  await adminPassword.fill('mot-de-passe-demo')
  await page.getByRole('button', { name: 'Continuer avec la 2FA' }).click()
  await expect(page).toHaveURL(/#\/admin\/dashboard$/)

  await page.goto('#/admin/verifications')
  await page.getByLabel('Rechercher').fill('Namur')
  await expect(page.locator('.verification-row')).toHaveCount(1)
  await expect(page.getByRole('row', { name: /Studio Nova/ })).toBeVisible()
  const verificationDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exporter CSV' }).click()
  await expect((await verificationDownload).suggestedFilename()).toBe('referio-verifications.csv')

  await page.goto('#/admin/users')
  await page.getByLabel('Recherche', { exact: true }).fill('Modération')
  const noraCard = page.locator('.user-grid article').filter({ hasText: 'Nora D.' })
  await expect(noraCard).toHaveCount(1)
  await noraCard.getByRole('button', { name: 'Gérer' }).click()
  await page.getByLabel('Groupe de permissions').fill('Lecture')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Accès de Nora D. mis à jour.', { exact: true })).toBeVisible()
  await page.getByLabel('Recherche', { exact: true }).fill('Nora')
  await expect(page.locator('.user-grid article').filter({ hasText: 'Nora D.' })).toContainText('Lecture')

  await page.goto('#/admin/audit')
  await page.getByRole('button', { name: 'Alertes' }).click()
  await expect(page.getByRole('button', { name: 'Alertes' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.audit-table > div')).toHaveCount(2)
  await page.getByLabel('Recherche', { exact: true }).fill('RISK_ALERT')
  await expect(page.locator('.audit-table > div')).toHaveCount(1)
  const auditDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exporter CSV' }).click()
  await expect((await auditDownload).suggestedFilename()).toBe('referio-journal-audit.csv')
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
