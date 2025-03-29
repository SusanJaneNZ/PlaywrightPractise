import { test, expect } from "../../fixtures/myFixtures.ts";
import { Page } from '@playwright/test';


let facebookPopup: Page;
let twitterPopup: Page;
test('One Popup', async ({ page }) => {
    page.on('request', request => console.log(`Request sent: ${request.url()}`));
    page.on('requestfinished', (request) => {
        const requestBody = request.postData();
        if (requestBody) {
            try {
                const jsonRequestBody = JSON.parse(requestBody);
                console.log(`Request sent: ${jsonRequestBody}`);
            } catch (error) {
                console.log(`Request sent: ${requestBody}`);
            }
        }
    });

    await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');

    const popupWindowEvent = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Follow On Twitter' }).click()
    const popupWindow = await popupWindowEvent;

    // const [popupWindow] = await Promise.all([
    //     page.waitForEvent('popup'),
    //     page.getByRole('link', { name: 'Follow On Twitter' }).click()
    // ])

    await popupWindow.waitForLoadState();
    console.log('New Window URL: ' + popupWindow.url());

    expect(popupWindow.getByTestId('login')).toBeVisible();
    expect(popupWindow.getByRole('link', { name: 'Sign up' })).toBeVisible();
    await expect(popupWindow.getByRole('button', { name: 'Follow' })).toBeVisible();

    //title only sure to be this value once the Follow button is visible
    expect(await popupWindow.title()).toContain('LambdaTest');

})

test.only('Two Popups', async ({ page }) => {

    await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');

    // Get all popups when they open
    page.on('popup', async popup => {
        await popup.waitForLoadState();
        console.log('Popup Title: ' + await popup.title());
    });

    // page.getByRole('link', { name: 'Follow On Twitter'}).click();
    const [popupWindows] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator('#followboth').click()
    ])

    await popupWindows.waitForLoadState();

    page.context().pages().forEach(async popupWindow => {
        console.log('New Window URL: ' + popupWindow.url());
        if (popupWindow.url().includes('facebook')) {
            facebookPopup = popupWindow;
        } else if (popupWindow.url().includes('x')) {
            twitterPopup = popupWindow;
        }
    })

    console.log('Facebook URL: ' + facebookPopup.url());
    console.log('Twitter URL: ' + twitterPopup.url());

    //for some reason these two assertions work locally but not on LambdaTest, so commented out for now
    //this selects the form element provided it has a child (or children) with the text
    // await expect(facebookPopup.locator('#login_popup_cta_form').filter({ hasText: /See more from LambdaTest/ })).toBeVisible();
    //this one is the same but is more performant as no post selection filtering
    // await expect(facebookPopup.locator('#login_popup_cta_form', { hasText: /See more from LambdaTest/ })).toBeVisible();
  
    //one below matches two elements, as its selecting the actual text element which exists twice- so this fails with a strict violation
    // await expect(facebookPopup.locator('#login_popup_cta_form').locator("text=See more from LambdaTest")).toBeVisible();

    await expect(twitterPopup.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(facebookPopup.getByRole('link', { name: 'Log in' })).toBeVisible();

})


test('Two Popups - event known', async ({ page }) => {

    await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');

    // Start waiting for popup before clicking. Note no await.
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#followboth').click()
    const popupWindows = await popupPromise;
    await popupWindows.waitForLoadState();

    page.context().pages().forEach(async popupWindow => {
        console.log('New Window URL: ' + popupWindow.url());
        if (popupWindow.url().includes('facebook')) {
            facebookPopup = popupWindow;
        } else if (popupWindow.url().includes('x')) {
            twitterPopup = popupWindow;
        }
    })

    console.log('Facebook URL: ' + facebookPopup.url());
    console.log('Twitter URL: ' + twitterPopup.url());

})

