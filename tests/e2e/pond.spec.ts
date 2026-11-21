import { expect, test } from '@playwright/test';

test('renders only the three-koi canvas with no UI or pond layers', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('canvas#pond')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('button,input,select,nav,header,aside,audio,video')).toHaveCount(0);
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
