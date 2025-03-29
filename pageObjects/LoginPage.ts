import { Locator, Page, expect } from "@playwright/test";
export default class LoginPage {
   
    email: Locator;
    password: Locator;
    loginButton: Locator;

    constructor(public page: Page) {
        this.email = page.getByPlaceholder('E-Mail Address');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', {name: 'Login'});
    }

    async open() {
        await this.page.goto('index.php?route=account/login');
    }

    async login(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.getByRole('heading', { name: 'My Account' })).toBeVisible();
    }
}