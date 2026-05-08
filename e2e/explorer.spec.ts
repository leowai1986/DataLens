import { test, expect, Page } from '@playwright/test';

async function uploadAndWait(page: Page) {
  await page.locator('input[type="file"]').setInputFiles('e2e/fixtures/sample.csv');
  await expect(page.locator('p.text-sm.text-slate-500', { hasText: 'rows' }))
    .toBeVisible({ timeout: 20000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
});

test('loads homepage with dropzone', async ({ page }) => {
  await expect(page.getByText('Welcome to DataLens')).toBeVisible();
  await expect(page.getByText('Drop your CSV file here')).toBeVisible();
});

test('uploads CSV and displays data', async ({ page }) => {
  await uploadAndWait(page);
  await expect(page.getByText('sample')).toBeVisible();
  await expect(page.locator('input[type="checkbox"][aria-label^="Select row"]')).toHaveCount(6);
});

test('applies filters correctly', async ({ page }) => {
  await uploadAndWait(page);
  await page.getByRole('button', { name: 'Add Filter' }).click();
  await page.locator('select').nth(0).selectOption('age');
  await page.locator('select').nth(1).selectOption('gt');
  await page.locator('label', { hasText: 'Value' }).locator('..').locator('input').fill('28');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('span.text-sm.text-slate-500', { hasText: 'of 5 rows' })).toBeVisible();
});

test('sorts data by column', async ({ page }) => {
  await uploadAndWait(page);
  await page.locator('button.flex.items-center.gap-1', { hasText: 'age' }).click();
  await expect(
    page.locator('button.flex.items-center.gap-1', { hasText: 'age' }).locator('svg')
  ).toBeVisible();
});