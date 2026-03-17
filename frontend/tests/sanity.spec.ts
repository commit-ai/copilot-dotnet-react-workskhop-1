import { expect, test } from '@playwright/test';

test('can compare two superheroes and generate battle narration', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /^superheroes$/i })).toBeVisible();

  const checkboxes = page.getByRole('checkbox');
  await checkboxes.nth(3).check();
  await checkboxes.nth(7).check();

  await page.getByRole('button', { name: /compare heroes/i }).click();

  await expect(page.getByRole('heading', { name: /superhero comparison/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /wins!/i })).toBeVisible();

  await page.getByRole('button', { name: /generate epic battle story/i }).click();

  await expect(page.getByText(/blockbuster showdown/i)).toBeVisible();
});
