import { Locator, Page } from 'playwright';  
export default class RegistrationPage {
    firstName: Locator;
    lastName: Locator;  
    email: Locator;
    telephone: Locator;
    password: Locator;
    passwordConfirm: Locator;
    agreeMessage: Locator;
    continueButton: Locator;

    constructor(public page: Page) {
        this.firstName = this.page.getByPlaceholder('First Name');
        this.lastName = this.page.getByPlaceholder('Last Name');  
        this.email = this.page.getByPlaceholder('E-Mail');
        this.telephone = this.page.getByPlaceholder('Telephone');
        this.password = this.page.getByPlaceholder(/Password$/);
        this.passwordConfirm = this.page.getByPlaceholder('Password Confirm');
        this.agreeMessage = this.page.getByText('I have read and agree to the');
        this.continueButton = this.page.getByRole('button', {name: 'Continue'});
    }

    // Methods
    async open() {
        await this.page.goto('index.php?route=account/register');
    }

    async register(firstName: string, lastName: string, email: string, telephone: string, password: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email);
        await this.telephone.pressSequentially(telephone);
        await this.password.fill(password);
        await this.passwordConfirm.fill(password);
        await this.agreeMessage.click();
        await this.continueButton.click();
    }
}