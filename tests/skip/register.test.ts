
import { test, expect } from "../../fixtures/myFixtures.ts";
import RegistrationPage from "../../pageObjects/RegistrationPage";
import * as registrationData from "../../data/registrationData.json";

test.skip("Register", async ({ page }) => {
    let registrationPage: RegistrationPage = new RegistrationPage(page);
    await registrationPage.open();
    await registrationPage.register(registrationData.firstname,registrationData.lastname,registrationData.email,registrationData.telephone,registrationData.password);
    await expect(page.getByText('Congratulations! Your new account has been successfully created!')).toBeVisible();
})