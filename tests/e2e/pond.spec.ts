import { expect, test } from '@playwright/test';

test('renders only the three-koi canvas with no UI or pond layers', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('canvas#pond')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('nav.glass-menu')).toBeVisible();
  await expect(page.locator('#presets button')).toHaveCount(9);
  await expect(page.locator('aside,audio,video')).toHaveCount(0);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.waitForTimeout(500);
  const alphaPixels = await page.locator('#pond').evaluate((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return 0;
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0; for (let index = 3; index < data.length; index += 4) if (data[index] > 0) count += 1;
    return count;
  });
  expect(alphaPixels).toBeGreaterThan(100);
  expect(errors).toEqual([]);
});

test('applies Glyphmix presets, cell sizing, and restores normal rendering', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#pond');
  await page.waitForTimeout(400);
  const normal = await canvas.screenshot();
  await page.getByRole('radio', { name: /Terminal/ }).click();
  await page.locator('#cell-size').fill('18');
  await page.waitForTimeout(100);
  const terminal = await canvas.screenshot();
  expect(terminal.equals(normal)).toBe(false);
  await expect(page.locator('#cell-output')).toHaveValue('18');
  await page.getByRole('radio', { name: /None/ }).click();
  await expect(page.getByRole('radio', { name: /None/ })).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', './favicon.svg');
});

test('responds to pointer movement and remains viewport-fitted', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#pond');
  const before = await canvas.screenshot();
  const viewport = page.viewportSize();
  await page.mouse.move(viewport!.width * .85, viewport!.height * .2);
  await page.waitForTimeout(1200);
  const after = await canvas.screenshot();
  expect(after.equals(before)).toBe(false);
  const bounds = await canvas.boundingBox();
  expect(Math.round(bounds!.width)).toBe(viewport!.width);
  expect(Math.round(bounds!.height)).toBe(viewport!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight)).toBe(false);
});
