import { test } from "../../fixtures/myFixtures.ts";
import { expect } from "@playwright/test";
import * as registrationData from "../../data/registrationData.json";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login(registrationData.email, registrationData.password);
});

test("Add camera to Cart", async ({ page, homePage }) => {
  const cameraIndex = 2;
  await homePage.shopByCategoryLink.click();
  await homePage.camerasLink.click();
  await page.waitForLoadState('domcontentloaded');


  const cameraAlt = await homePage.selectCameraImageLocator(cameraIndex).getAttribute('alt');

  await expect(homePage.selectCameraImageLocator(cameraIndex)).toBeVisible();
  await homePage.selectCameraLocator(cameraIndex).scrollIntoViewIfNeeded();
  await homePage.selectCameraImageLocator(cameraIndex).hover();

  //wait for add to cart api to complete
  const addToCartApi = "index.php?route=checkout/cart/add";
  const addToCartReponse = page.waitForResponse(resp => resp.url().includes(addToCartApi) && resp.status() === 200);
  await homePage.selectCameraAddToCartLocator(cameraIndex).click();

  // Wait for one of the conditions to be met
  await Promise.race([
    page.locator('#product-quick-view').waitFor(),
    page.locator('.toast-body').waitFor(),
    // page.waitForResponse(resp => resp.url().includes(addToCartApi) && resp.status() === 200)
  ]);

  if (await page.locator('#product-quick-view').first().isVisible()) {
    await expect(page.locator('#product-quick-view').locator('h1[class="h4"]')).toContainText(`${cameraAlt}`);
  } else {
    await addToCartReponse;
    //close toast
    await page.locator('.toast-header').getByLabel('Close').click();
    await homePage.cartIcon.click();
    await expect(page.locator('tr', { hasText: `${cameraAlt}` })).toBeVisible();
  

  //edit Cart and remove item
  await page.getByRole('button', { name: /Edit cart/ }).click();
  await page.waitForLoadState('domcontentloaded');
  expect(page.getByRole('heading', { name: /Shopping Cart/ })).toBeVisible();
  await page.pause();

  // await expect(page.locator('tr', {hasText: `${cameraAlt}`})).toBeVisible();
  await expect(page.locator('tr', { hasText: `${cameraAlt}` }).locator('input')).toBeVisible();

  const numberOfItems = await page.locator('#content').locator('tr').count();

  const cameraQuantity = page.locator('tr', { hasText: `${cameraAlt}` }).locator('input');
  await cameraQuantity.fill('0');

  const refreshCart = "index.php?route=checkout/cart";
  const refreshCartReponse = page.waitForResponse(resp => resp.url().includes(refreshCart) && resp.status() === 200);
  await page.locator('tr', { hasText: `${cameraAlt}` }).locator('button[type="submit"]').click();
  //wait for cart refresh
  await refreshCartReponse;

  if (await page.locator('#error-not-found').isVisible()) {
    expect(page.locator('#content').getByText('Your shopping cart is empty!')).toBeVisible();
  } else {
    const newNumberOfItems = await page.locator('#content').locator('tr').count();
    console.log(`Number of items in cart before update: ${numberOfItems} after: ${newNumberOfItems}`);
    expect(newNumberOfItems).toBeLessThan(numberOfItems);
  }
}

})


