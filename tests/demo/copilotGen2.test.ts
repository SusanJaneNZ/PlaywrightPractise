import { test, expect } from '@playwright/test';

test('Borrow or Place Hold on Thursday Murder Club', async ({ page }) => {
  // Navigate to the library website
  await page.goto('https://wcl.overdrive.com/');

  // Sign in
  await page.getByRole('presentation').getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', {name:'Library Card'}).fill('C6316475');

  await page.getByRole('textbox', {name:'PIN'}).fill('9862');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Search for the book
  await page.getByRole('button', {name: 'Search'}).click();
  const searchBox = page.getByRole('textbox', {name: 'Search'});
  await searchBox.fill('Thursday Murder Club');
  await searchBox.press('Enter');

  // Check the book appears in the search results
  const searchResults = page.getByRole('heading', { name: 'Search Results for Thursday Murder Club' });
  await expect(searchResults).toBeVisible();
  
  const bookItem = page.getByRole('listitem').filter({hasText: 'Thursday Murder Club' });
  await expect(bookItem).toBeVisible();

  // Check the author is Richard Osman
  const authorName = bookItem.getByRole('link').filter({hasText: 'Richard Osman'});
  await expect(authorName).toBeVisible();

  // Borrow or Place a Hold
  const borrowButton = bookItem.getByRole('button', { name: 'Borrow' });
  const placeHoldButton = bookItem.getByRole('button').filter({hasText: 'Place a Hold' });

  if (await borrowButton.isVisible()) {
    await borrowButton.click();
    await page.getByRole('button', { name: 'Borrow for 14 days' }).click();

  } else if (await placeHoldButton.isVisible()) {
    await placeHoldButton.click();
    await expect(page.getByRole('heading', {name: 'Success!'})).toBeVisible();
  }
});