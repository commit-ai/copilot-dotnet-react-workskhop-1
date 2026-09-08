import { test, expect } from '@playwright/test';

test('superheroes table renders with data', async ({ page }) => {
  await page.goto('/');

  const table = page.locator('table');
  await expect(table).toBeVisible();

  // Header columns match the App.jsx table markup
  const headerCells = table.locator('thead tr th');
  await expect(headerCells).toHaveText([
    'ID',
    'Name',
    'Image',
    'Intelligence',
    'Strength',
    'Speed',
    'Durability',
    'Power',
    'Combat',
  ]);

  // Data loaded from the backend renders at least one row
  const rows = table.locator('tbody tr');
  await expect(rows.first()).toBeVisible();
  await expect(rows).not.toHaveCount(0);
});
