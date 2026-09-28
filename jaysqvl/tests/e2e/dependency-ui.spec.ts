import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // External telemetry and project metadata are not required for rendering or
  // dependency verification. Keep browser tests deterministic and offline.
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
      await route.abort();
    } else if (url.pathname === '/api/projects') {
      await route.fulfill({ status: 503, body: 'Synthetic upstream outage' });
    } else {
      await route.continue();
    }
  });
});

test('production React hydration, Next images, icons, and theme controls work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hi, I’m Jay.');
  const profile = page.getByRole('img', { name: 'Jay Esquivel Jr.', exact: true });
  await expect(profile).toBeVisible();
  await expect.poll(() => profile.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await profile.getAttribute('src')).toContain('/_next/image?');
  const toggle = page.getByRole('button', { name: 'Toggle theme', exact: true });
  await expect(toggle.locator('svg')).toHaveCount(2);
  await expect(page.locator('html')).toHaveClass(/dark/);
  const darkBackground = await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor);
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect.poll(() => page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor)).not.toBe(darkBackground);
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  expect(errors).toEqual([]);
});

test('Motion continues the terminal animation without hydration errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const active = page.locator('.lab-terminal__active');
  await expect(active).toContainText('rsync camera-roll');
  await expect(active).toContainText('npm route add lab-tools', { timeout: 10_000 });
  await expect(page.locator('.lab-terminal__history .lab-terminal__row')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('reduced-motion mode renders static terminal history', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.lab-terminal__history')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.lab-terminal__history .lab-terminal__row')).toHaveCount(3);
  await expect(page.locator('.terminal-cursor')).toHaveCount(0);
});

test('React Flow renders connections, selection, and zoom controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/lab-topology');
  const flow = page.locator('.react-flow');
  await expect(flow).toBeVisible();
  await expect(flow.locator('.react-flow__node')).toHaveCount(8);
  await expect(flow.locator('.react-flow__edge')).toHaveCount(7);
  const button = flow.getByRole('button', { name: /Cloudflare/ });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[aria-live="polite"]')).toContainText('Cloudflare');
  const viewport = flow.locator('.react-flow__viewport');
  const initial = await viewport.getAttribute('style');
  await flow.getByRole('button', { name: 'zoom in' }).click();
  await expect.poll(() => viewport.getAttribute('style')).not.toBe(initial);
  expect(errors).toEqual([]);
});

test('mobile navigation, slot-based links, and responsive Tailwind layout work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'View Projects', exact: true })).toHaveAttribute('href', '#projects');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});
