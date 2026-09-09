import { expect, test, type Page } from '@playwright/test';

const routes = [
  { path: '/', label: 'Home' },
  { path: '/work', label: 'Work' },
  { path: '/services', label: 'Services' },
] as const;

const primaryNav = (page: Page) => page.getByRole('banner').getByRole('navigation');

test.describe('portfolio journeys', () => {
  test('all routes render cleanly and fit the viewport', async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text());
    });
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('#contact')).toBeVisible();
      await expect(primaryNav(page).locator('[aria-current="page"]')).toHaveCount(1);
      for (const details of await page.locator('details').all()) {
        if (!(await details.evaluate((element: HTMLDetailsElement) => element.open))) {
          await details.locator('summary').click();
        }
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
      ).toBe(false);
    }
    expect(runtimeErrors).toEqual([]);
  });

  test('primary work, résumé, project details, and contact paths reach real destinations', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#explore-link').click();
    await expect(page).toHaveURL(/\/work\/?$/);

    const story = page.locator('#disclosure-project-two');
    await page.goto('/work#disclosure-project-two');
    await expect(story).toHaveJSProperty('open', true);
    await page.locator('a[href="#resume"]').first().click();
    await expect(page.locator('#resume')).toBeInViewport();

    await page.goto('/services');
    const assessment = page.getByRole('link', { name: 'Book Your Free Assessment', exact: true });
    await expect(assessment).toHaveCount(3);
    await expect(assessment.first()).toHaveAttribute('href', /^mailto:.*subject=/);
    await expect(page.locator('#web-development .service-action a')).toHaveAttribute(
      'href',
      /Business%20Essentials/,
    );
    await expect(page.locator('#frontend-architecture .service-action a')).toHaveAttribute(
      'href',
      /Business%20Growth/,
    );
  });

  test('keyboard users can skip navigation and operate project disclosures', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('#skip-to-content')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();

    await page.goto('/work');
    const details = page.locator('details').first();
    const summary = details.locator('summary');
    await summary.focus();
    const initial = await details.evaluate((element: HTMLDetailsElement) => element.open);
    await page.keyboard.press('Enter');
    await expect(details).toHaveJSProperty('open', !initial);
  });

  test('reduced motion keeps the main artwork still while scrolling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const artwork = page.locator('[data-scroll-art]');
    await expect(artwork).toBeVisible();
    await page.keyboard.press('End');
    await expect(artwork).toHaveCSS('transform', 'none');
    await expect(artwork).toHaveCSS('animation-name', 'none');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('navigation, contact, résumé, and native disclosures remain usable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#explore-link').click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.locator('#resume')).toBeVisible();

    const details = page.locator('details').first();
    await details.locator('summary').focus();
    const initial = await details.evaluate((element: HTMLDetailsElement) => element.open);
    await page.keyboard.press('Enter');
    await expect(details).toHaveJSProperty('open', !initial);

    await primaryNav(page).locator('a[href="/services"]').click();
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.locator('#contact')).toBeVisible();
  });
});
