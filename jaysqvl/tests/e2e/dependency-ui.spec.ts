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
  await expect(page.getByRole('link', { name: 'LinkedIn profile', exact: true })).toBeVisible();
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
  const terminal = page.locator('[data-operation]');
  await terminal.scrollIntoViewIfNeeded();
  await expect(terminal).toHaveAttribute('data-playing', 'true');
  const firstEntry = terminal.locator('[data-step="0"]');
  await expect(firstEntry).toContainText('tailscale up');
  const initialY = await firstEntry.evaluate(entry => entry.getBoundingClientRect().top);
  const screen = terminal.locator('[data-terminal-screen]');
  const initialHeight = await screen.evaluate(element => element.clientHeight);
  const initialOperation = await terminal.getAttribute('data-operation');
  await expect.poll(() => terminal.getAttribute('data-operation'), { timeout: 10_000 }).not.toBe(initialOperation);
  await expect.poll(() => terminal.locator('[data-terminal-history] > div').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(4);
  await expect(firstEntry).toContainText('tailscale up');
  await expect(terminal.locator('[data-terminal-history]')).toContainText('tailscale ping --c 1 nas');
  await expect.poll(() => screen.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect.poll(() => firstEntry.evaluate(entry => entry.getBoundingClientRect().top)).toBeLessThan(initialY);
  expect(await screen.evaluate(element => element.clientHeight)).toBe(initialHeight);
  const pause = page.getByRole('button', { name: 'Pause terminal animation', exact: true });
  await pause.click();
  await expect(terminal).toHaveAttribute('data-playing', 'false');
  const pausedText = await terminal.textContent();
  await page.waitForTimeout(1200);
  expect(await terminal.textContent()).toBe(pausedText);
  expect(errors).toEqual([]);
});

test('reduced-motion mode renders static terminal history', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const terminal = page.locator('[data-operation]');
  await expect(terminal).toHaveAttribute('data-playing', 'false');
  await expect(terminal).toHaveAttribute('data-phase', 'idle');
  await expect(terminal.locator('[data-terminal-history]')).toContainText('app');
  await expect(terminal.locator('[data-terminal-history]')).toContainText('worker');
  await expect(terminal.locator('[data-terminal-history]')).not.toContainText(/immich|photos/i);
  await expect(terminal.locator('[data-terminal-cursor]')).toBeHidden();
  await page.getByRole('button', { name: 'Play terminal animation', exact: true }).click();
  await expect(terminal).toHaveAttribute('data-playing', 'true');
  await expect(terminal.locator('[data-terminal-cursor]')).toBeVisible();
  await expect(terminal).toHaveAttribute('data-operation', 'tailscale up');
  await expect.poll(() => terminal.getAttribute('data-operation'), { timeout: 10_000 }).not.toBe('tailscale up');
});

test('React Flow renders connections, selection, and zoom controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/lab-topology');
  const flow = page.locator('.react-flow');
  await expect(flow).toBeVisible();
  await expect(flow.locator('.react-flow__node')).toHaveCount(8);
  await expect(flow.locator('.react-flow__edge')).toHaveCount(7);
  const button = flow.getByRole('button', { name: 'Tunnel edge Cloudflare', exact: true });
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
