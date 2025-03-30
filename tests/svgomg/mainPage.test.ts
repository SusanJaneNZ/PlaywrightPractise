// import { test, expect } from "../../fixtures/myFixtures.ts";
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.use({
    baseURL: 'https://demo.playwright.dev/',
})

test.beforeEach(async ({ page }) => {
    // Navigate to the SVGOMG main page before each test
    await page.goto('/svgomg/');

    expect(await page.title()).toContain('SVGOMG');
});


test('SVGOMG - Main Page', async ({ page }) => {

    const menu = page.locator('.menu');
    const menuItems = menu.locator('li');

    await expect(menu).toBeVisible();
    await expect(menuItems).toHaveCount(4);
    await expect(menuItems).toHaveText([
        'Open SVG',
        'Paste markup',
        'Demo',
        'Contribute']);
})

test.describe('SVGOMG - Demo Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to Demo before each test
        await page.locator('.menu li', { hasText: 'Demo' }).click();
        expect(page.locator('.svg-output')).toBeVisible();
    })

    test('Menu Bar', async ({ page }) => {

        await expect(page.locator('label', { hasText: /Image/ })).toBeVisible();
        await expect(page.locator('label', { hasText: /Markup/ })).toBeVisible();

    })

    test('Global Settings', async ({ page }) => {

        const menuSettings = page.locator('section', { hasText: 'Global settings' }).locator('label');
        await expect(menuSettings).toHaveCount(5);
        await expect(menuSettings).toHaveText([
            /Show original/,
            /Compare gzipped/,
            /Prettify markup/,
            /Multipass/,
            /Precision/]);

        await expect(page.locator('label', { hasText: /Show original/ }).getByRole('checkbox')).not.toBeChecked();
        await expect(page.locator('label', { hasText: /Compare gzipped/ }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('label', { hasText: /Prettify markup/ }).getByRole('checkbox')).not.toBeChecked();
        await expect(page.locator('label', { hasText: /Multipass/ }).getByRole('checkbox')).not.toBeChecked();

    })

    test('Feature Settings', async ({ page }) => {

        const menuFeaturesLocator = page.locator('section', { hasText: 'Features' }).locator('label');
        await expect(menuFeaturesLocator).toHaveCount(43);

        const enabledFeatures = [
            'Remove doctype',
            'Remove XML instructions',
            'Remove comments',
            'Remove <metadata>',
            'Remove editor data'
        ];

        const disabledFeatures = [
            'Remove xmlns',
            'Style to attributes',
            'Remove raster images',
            'Round/rewrite number lists',
            'Replace duplicate elements with links',
            'Sort attrs',
            'Prefer viewBox to width/height',
            'Remove style elements',
            'Remove script elements'
        ];


        (await menuFeaturesLocator.allInnerTexts()).forEach(async (featureText: string, index) => {
            console.log(`Feature: ${featureText}`);
            console.log(`Index: ${index}`);
            if (enabledFeatures.includes(featureText)) {
                await expect(menuFeaturesLocator.nth(index).getByRole('checkbox')).toBeChecked();
            } else if (disabledFeatures.includes(featureText)) {
                await expect(menuFeaturesLocator.nth(index).getByRole('checkbox')).not.toBeChecked();
            } else {
                await expect(menuFeaturesLocator.nth(index).getByRole('checkbox')).toBeChecked();
            }
        }
        )

    })

    test('Reset Settings', async ({ page }) => {
        const CompareGzippedLabelLocator = page.locator('label', { hasText: /Compare gzipped/ });
        const CompareGzippedCheckboxLocator = CompareGzippedLabelLocator.getByRole('checkbox');
        const removeCommentsLabelLocator = page.locator('label', { hasText: /Remove comments/ });
        const removeCommentsCheckboxLocator = removeCommentsLabelLocator.getByRole('checkbox');
        const sortAttrsLabelLocator = page.locator('label', { hasText: /Sort attrs/ });
        const sortAttrsCheckboxLocator = sortAttrsLabelLocator.getByRole('checkbox');

        //uncheck compare gzipped
        await expect(CompareGzippedCheckboxLocator).toBeChecked();
        await CompareGzippedLabelLocator.click();
        await expect(CompareGzippedCheckboxLocator).not.toBeChecked();

        //uncheck Remove comments
        await expect(removeCommentsCheckboxLocator).toBeChecked();
        await removeCommentsLabelLocator.click();
        await expect(removeCommentsCheckboxLocator).not.toBeChecked();


        //check Sort attrs
        await expect(sortAttrsCheckboxLocator).not.toBeChecked();
        await sortAttrsLabelLocator.click();
        await expect(sortAttrsCheckboxLocator).toBeChecked();

        //reset checkboxes to default
        const resetButtonLocator = page.locator('button', { hasText: 'Reset all' });
        await expect(resetButtonLocator).toBeVisible();
        await resetButtonLocator.click();

        await expect(CompareGzippedCheckboxLocator).toBeChecked();
        await expect(removeCommentsCheckboxLocator).toBeChecked();
        await expect(sortAttrsCheckboxLocator).not.toBeChecked();

    })

    test('download result', async ({ page }) => {

        const downloadEvent = page.waitForEvent('download');
        page.getByRole('link', { name: 'Download' }).click();
        const download = await downloadEvent;

    
          const filename = './downloads/' + download.suggestedFilename()
          await download.saveAs( filename)
          console.log(filename)
        
          const contents = await fs.promises.readFile(filename);


        expect(contents).toContain(/^<svg/);


    })

})