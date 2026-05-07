import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('DataExplorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads homepage with dropzone', async ({ page }) => {
    await expect(page.getByText('Welcome to DataLens')).toBeVisible();
    await expect(page.getByText('Drop your CSV file here')).toBeVisible();
  });

  test('uploads CSV and displays data', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('or click to browse').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'sample.csv'));

    await expect(page.getByText('sample')).toBeVisible();
    await expect(page.getByText('5 rows')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /Select row/ })).toHaveCount(5);
  });

  test('applies filters correctly', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('or click to browse').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'sample.csv'));

    await page.getByRole('button', { name: 'Add Filter' }).click();
    await page.getByLabel('Column').selectOption('age');
    await page.getByLabel('Operator').selectOption('gt');
    await page.getByLabel('Value').fill('28');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('3 of 5 rows')).toBeVisible();
  });

  test('sorts data by column', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('or click to browse').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'sample.csv'));

    await page.getByRole('button', { name: 'age' }).click();
    await expect(page.locator('text=age').locator('..').locator('svg')).toBeVisible();
  });
});
