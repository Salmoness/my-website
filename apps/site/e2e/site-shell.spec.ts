import { expect, test, type Page } from '@playwright/test';

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('Azul MVP journeys', () => {
  test('the service guide recommends a path and transfers useful context', async ({ page }) => {
    const errors = collectRuntimeErrors(page);
    await page.goto('/services');

    await page.locator('input[name="guide-stage"][value="starting"]').check();
    await page.locator('input[name="guide-presence"][value="none"]').check();
    await page.locator('input[name="guide-goal"][value="credible"]').check();

    await expect(page.locator('[data-guide-title]')).toHaveText('Online Foundation');
    await expect(page.locator('[data-guide-apply]')).not.toHaveAttribute('aria-disabled');
    await page.locator('[data-guide-apply]').click();

    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('[data-enquiry-stage]')).toHaveValue('starting');
    await expect(page.locator('[data-service-interest]')).toHaveValue('Online Foundation');
    await expect(page.locator('[data-enquiry-goal]')).toHaveValue('Look credible');
    await expect(page.locator('[data-guide-summary]')).toHaveValue(/suggestion=Online Foundation/);

    await page.locator('[data-service-interest]').selectOption('Social Content');
    await expect(page.locator('[data-content-needs]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    expect(errors).toEqual([]);
  });

  test('process and founder pages make responsibilities and positioning explicit', async ({
    page,
  }) => {
    const errors = collectRuntimeErrors(page);

    await page.goto('/how-we-work');
    await expect(page.locator('.work-steps__list > li')).toHaveCount(4);
    await expect(page.getByText('You bring', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('I handle', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Everything I set up/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );

    await page.goto('/about');
    await expect(page.getByText('Saymon Rivas', { exact: true })).toBeVisible();
    await expect(page.getByText('Founder of Azul Online Projects', { exact: true })).toBeVisible();
    await expect(page.getByText('University of Central Florida')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    expect(errors).toEqual([]);
  });

  test('offer buttons pre-select the matching service in the enquiry', async ({ page }) => {
    const errors = collectRuntimeErrors(page);
    await page.goto('/services');
    await page.getByRole('link', { name: 'Ask about monthly work' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('[data-service-interest]')).toHaveValue('Ongoing management');

    await page.goto('/services?interest=Google%20or%20Meta%20ads#contact');
    await expect(page.locator('[data-service-interest]')).toHaveValue('Google or Meta ads');

    await page.goto('/services#crm');
    await expect(page.locator('#crm details')).toHaveAttribute('open', '');
    expect(errors).toEqual([]);
  });

  test('consultation and privacy paths stay useful before a form provider is connected', async ({
    page,
  }) => {
    await page.goto('/services#contact');
    await expect(
      page.getByRole('heading', { name: 'Tell me what you’re working through.' }),
    ).toBeVisible();
    await expect(page.locator('[data-enquiry-form]')).toBeVisible();
    await expect(
      page.locator('#contact').getByRole('link', { name: 'saymonrivas@azulonlineprojects.com' }),
    ).toHaveAttribute('href', 'mailto:saymonrivas@azulonlineprojects.com');

    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy, in plain language.' })).toBeVisible();
    await expect(
      page.locator('main').getByText('Saymon Rivas, operating as Azul Online Projects'),
    ).toBeVisible();
  });
});

test.describe('Azul essentials without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('services, direct contact, and process content remain available', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: 'Online Foundation' }).first()).toBeVisible();
    await expect(page.locator('[data-service-guide]')).toBeVisible();
    await expect(page.locator('[data-enquiry-form]')).toBeVisible();
    await expect(
      page.locator('#contact').getByRole('link', { name: 'saymonrivas@azulonlineprojects.com' }),
    ).toBeVisible();
    await page.goto('/how-we-work');
    await expect(page.locator('.work-steps__list > li')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
});
