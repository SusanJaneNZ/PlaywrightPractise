import { Page, Locator } from '@playwright/test';

export default class HomePage {
    // Locators
    specialHotLink: Locator;
    shopByCategoryLink: Locator;
    camerasLink: Locator;
    firstCamera: Locator;
    firstCameraImage: Locator;
    firstCameraAddToCart: Locator;
    secondCamera: Locator;
    secondCameraImage: Locator;
    secondCameraAddToCart: Locator;
    cartIcon: Locator;

    constructor(public page: Page) {
        this.specialHotLink = page.getByRole('link', { name: 'Special Hot', exact: true })
        this.shopByCategoryLink = page.getByRole('button', { name: 'Shop by Category' });
        this.camerasLink = page.getByRole('link', { name: 'Cameras', exact: true })
        this.firstCamera = page.locator('.row').locator('.image').first();
        this.firstCameraImage = this.firstCamera.locator('.active').locator("img[class='lazy-load']");
        this.firstCameraAddToCart = page.locator('.row').locator('.product-action').first().filter({hasText: 'Add to Cart'});
        this.secondCamera = page.locator('.row').locator('.image').nth(1);
        this.secondCameraImage = this.firstCamera.locator('.active').locator("img[class='lazy-load']");
        this.secondCameraAddToCart = page.locator('.row').locator('.product-action').nth(1).filter({hasText: 'Add to Cart'});
        
        // (//a[contains(@class,'cart text-reset')])[1]
        // this.cartIcon = page.getByRole('link', {class: 'cart'});
        this.cartIcon = page.getByRole('button').locator('.cart-icon');
        
        // this.cartIcon = page.getByRole('button').filter({class : 'cart text-reset'});
    }

    selectCameraLocator(index: number): Locator {
        return this.page.locator('.row').locator('.image').nth(index-1);
    }
    selectCameraImageLocator(index: number): Locator {
        return this.page.locator('.row').locator('.image').nth(index-1).locator('.active').locator("img[class='lazy-load']");
    }
    selectCameraAddToCartLocator(index: number): Locator {
        // return this.page.locator('.row').locator('.product-action').nth(index-1).filter({hasText: 'Add to Cart'});
        return this.page.locator('.row').locator('.product-action').nth(index-1).getByRole('button').filter({hasText: 'Add to Cart'});
    }


}   