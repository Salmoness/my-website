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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grow your online identity.');
    await expect(
      page.getByRole('link', { name: 'Let’s hop on a call', exact: true }).first(),
    ).toHaveAttribute('href', '/services#contact');
    await expect(page.getByRole('link', { name: 'Explore services' })).toHaveAttribute(
      'href',
      '/services',
    );
    await expect(page.getByRole('link', { name: 'See the foundation' })).toHaveAttribute(
      'href',
      '/services#online-foundation',
    );
    await expect(page.getByRole('link', { name: 'See ongoing support' })).toHaveAttribute(
      'href',
      '/services#ongoing-visibility',
    );
    await expect(page.locator('[data-fog-field]')).toHaveCount(0);
    await expect(page.locator('.azul-hero > [data-signal-field]')).toHaveCount(0);
    await expect(page.locator('.hero-sculpture img')).toBeVisible();
    await expect(page.locator('.hero-shadow img')).toBeVisible();
    expect(
      await page
        .locator('.hero-shadow img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
  });

  test('ultrawide Home uses the canvas without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1080 });
    await page.goto('/');
    const layout = await page.evaluate(() => {
      const stage = document.querySelector('.hero-stage')!.getBoundingClientRect();
      const copy = document.querySelector('.hero-copy')!.getBoundingClientRect();
      const cube = document.querySelector('.hero-sculpture')!.getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        stageWidth: stage.width,
        copyLeft: copy.left,
        cubeRight: cube.right,
      };
    });
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);
    expect(layout.stageWidth).toBeGreaterThan(layout.viewport * 0.9);
    expect(layout.copyLeft).toBeLessThan(layout.viewport * 0.15);
    expect(layout.cubeRight).toBeLessThan(layout.viewport);
  });

  test('keyboard and reduced-motion states keep the page useful', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero-sculpture img')).toBeVisible();
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
    await expect(page.locator('.hero-sculpture img')).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.locator('#contact')).toBeVisible();
  });
});
