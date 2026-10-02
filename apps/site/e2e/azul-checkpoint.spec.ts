import { expect, test, type Page } from '@playwright/test';

const mainRoutes = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/how-we-work', 'How We Work'],
  ['/about', 'About'],
] as const;

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('Azul checkpoint one', () => {
  test('shared navigation resolves and every checkpoint route fits', async ({ page }) => {
    const errors = collectRuntimeErrors(page);

    for (const [path, label] of mainRoutes) {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(
        page.getByRole('banner').getByRole('link', { name: label, exact: true }),
      ).toHaveAttribute('aria-current', 'page');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
      ).toBe(false);
      await expect(page.locator('.route-hero__media img')).toHaveCount(path === '/' ? 0 : 1);
    }

    const privacyResponse = await page.goto('/privacy');
    expect(privacyResponse?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');
    await expect(page.locator('.route-hero__media img')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('Home communicates the proposition and primary paths', async ({ page }) => {
    await page.goto('/');
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toHaveText('Grow your online Identity');
    await expect(heroHeading.locator('span')).toHaveText(['Grow your', 'online Identity']);
    await expect(
      page.getByRole('link', { name: 'Let’s hop on a call', exact: true }).first(),
    ).toHaveAttribute('href', '/services#contact');
    await expect(page.getByRole('link', { name: 'Explore services' })).toHaveAttribute(
      'href',
      '/services',
    );
    await expect(page.getByRole('link', { name: 'Foundation details' })).toHaveAttribute(
      'href',
      '/services#online-foundation',
    );
    await expect(page.getByRole('link', { name: 'Visibility details' })).toHaveAttribute(
      'href',
      '/services#ongoing-visibility',
    );
    await expect(page.locator('[data-fog-field]')).toHaveCount(0);
    await expect(page.locator('.azul-hero > [data-signal-field]')).toHaveCount(0);
    await expect(page.locator('.hero-scene img')).toBeVisible();
    expect(
      await page
        .locator('.hero-scene img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
  });

  test('ultrawide Home uses the canvas without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1080 });
    await page.goto('/');
    const layout = await page.evaluate(() => {
      const stage = document.querySelector('.hero-stage')!.getBoundingClientRect();
      const copy = document.querySelector('.hero-copy')!.getBoundingClientRect();
      const scene = document.querySelector('.hero-scene')!.getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        stageWidth: stage.width,
        copyLeft: copy.left,
        sceneWidth: scene.width,
        sceneRight: scene.right,
      };
    });
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);
    expect(layout.stageWidth).toBeGreaterThan(layout.viewport * 0.9);
    expect(layout.copyLeft).toBeLessThan(layout.viewport * 0.15);
    expect(layout.sceneWidth).toBeGreaterThan(layout.viewport * 0.9);
    expect(layout.sceneRight).toBeLessThanOrEqual(layout.viewport);
  });

  test('keyboard and reduced-motion states keep the page useful', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero-scene img')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('#skip-to-content')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });
});

test.describe('Azul without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('Home content, navigation, and consultation path remain available', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.hero-scene img')).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.locator('#contact')).toBeVisible();
  });
});

test.describe('Home loading screen', () => {
  test('shows on Home for at least one second, then clears', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    const loader = page.locator('[data-site-loader]');
    await expect(loader).toBeVisible();
    await expect(loader.locator('.azul-logo--stacked')).toBeVisible();
    const shownAt = Date.now();
    await expect(loader).toHaveCount(0, { timeout: 7000 });
    expect(Date.now() - shownAt).toBeGreaterThanOrEqual(900);
    await expect(page.locator('html')).not.toHaveClass(/is-loading/);
  });

  test('does not appear on other pages', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('[data-site-loader]')).toHaveCount(0);
  });
});

test.describe('Home problem story', () => {
  test('plays once when scrolled into view and ends on the finished scene', async ({ page }) => {
    await page.goto('/');
    const story = page.locator('[data-search-story]');
    await expect(story).toHaveAttribute('data-step', '0');
    await page.locator('.search-story').scrollIntoViewIfNeeded();
    await expect(story).toHaveAttribute('data-step', 'done', { timeout: 10000 });
    await expect(page.locator('.search-result__tag')).toBeVisible();
  });

  test('shows the finished scene immediately with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-search-story]')).toHaveAttribute('data-step', 'done');
  });
});
