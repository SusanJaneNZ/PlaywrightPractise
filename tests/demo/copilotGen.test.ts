import { test, expect } from '@playwright/test';

test('Borrow or Place a Hold on Thursday Murder Club', async ({ page }) => {
  // Navigate to the OverDrive website
  await page.goto('https://wcl.overdrive.com/');

  // Click on the Sign In button
  await page.click('text=Sign In');

  // Fill in the credentials
  await page.fill('input[name="username"]', 'C6316475');
  await page.fill('input[name="password"]', '9862');

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait for the page to load after login
  await page.waitForLoadState('networkidle');

  // Search for the book "Thursday Murder Club"
  await page.fill('input[aria-label="Search"]', 'Thursday Murder Club');
  await page.press('input[aria-label="Search"]', 'Enter');

  // Wait for search results to load
  await page.waitForSelector('text=Thursday Murder Club');

  // Verify the book title appears in the search results
  const bookTitle = await page.locator('text=Thursday Murder Club').first();
  await expect(bookTitle).toBeVisible();

  // Verify the author is Richard Osman
  const authorName = await page.locator('text=Richard Osman').first();
  await expect(authorName).toBeVisible();

  // Check if the "Borrow" button is available
  const borrowButton = page.locator('button:has-text("Borrow")');
  if (await borrowButton.isVisible()) {
    // Click the "Borrow" button
    await borrowButton.click();

    // Confirm borrowing for 14 days
    await page.click('button:has-text("Borrow for 14 days")');
  } else {
    // If "Borrow" is not available, click "Place a Hold"
    const placeHoldButton = page.locator('button:has-text("Place a Hold")');
    await expect(placeHoldButton).toBeVisible();
    await placeHoldButton.click();
  }

  // Verify the action was successful
  await page.waitForSelector('text=Success', { timeout: 5000 });
});