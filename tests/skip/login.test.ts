import { chromium, expect, test } from "@playwright/test";



test.skip("Login", async () => {
  console.log("usernaem" + process.env.LT_USERNAME);
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://ecommerce-playground.lambdatest.io/");
    await page.getByRole('button', { name: 'My Account' }).hover();

    await page.getByRole('link', { name: 'Login' }).click();

    await page.close();
    await context.close();
    await browser.close();
})

test.skip("Login with Page fixture", async ({ page }) => {
    await page.goto("http://ecommerce-playground.lambdatest.io/");
    await page.getByRole('button', { name: 'My Account' }).hover();

    await page.getByRole('link', { name: 'Login' }).click();
    expect(page.url()).toContain('/login');

    // await new Promise(() => {}); // prevents your script from exiting! 
    // await browser.close();
})