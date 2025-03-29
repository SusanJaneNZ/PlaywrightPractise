import { test } from "../../fixtures/myFixtures.ts";
import { expect } from "@playwright/test";
import * as registrationData from "../../data/registrationData.json";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login(registrationData.email, registrationData.password);
});

test("Add camera to Cart", async ({ page, homePage }) => {
  const cameraIndex = 1;
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
    await expect(page.getByRole('cell', { name: `${cameraAlt}`, exact: true }).first()).toBeVisible();
  }

})
