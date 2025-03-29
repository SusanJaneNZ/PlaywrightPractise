import { test, expect } from "../../fixtures/myFixtures.ts";

test("Input", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo");

    const messageInput = page.getByPlaceholder('Please enter your Message')


    expect(messageInput).toHaveAttribute('placeholder', 'Please enter your Message');

    await messageInput.fill('Hello World');

    await page.locator('button#showInput').click();
    const messageOutput = page.locator('#message');


    expect(messageOutput).toContainText('Hello World');



});

test("adder", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo");

    const first = page.getByPlaceholder("Please enter first value");
    const second = page.getByPlaceholder('Please enter second value');
    const num1 = 22
    const num2 = 34
    const add = page.getByRole('button', { name: 'Get Sum' });

    const output = page.locator('#addmessage');

    await first.scrollIntoViewIfNeeded();
    await first.fill(num1.toString());
    expect(await first.inputValue()).toBe(num1.toString());
    await second.fill(num2.toString());
    expect(await second.inputValue()).toBe(num2.toString());
    await add.click();
    expect(await output.textContent()).toBe((num1 + num2).toString());
    expect(output).toHaveText((num1 + num2).toString());
})

test("checkbox", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/checkbox-demo");
    const checkbox = page.getByLabel('Click on check box');
    expect(checkbox).not.toBeChecked();
    await checkbox.check();
    expect(checkbox).toBeChecked();;


})


test("multi checkbox", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/checkbox-demo");

    // const checkbox1 = page.locator('div').filter({ hasText: /Disabled Checkbox Demo/ }).getByRole('checkbox').first();
    const checkbox1a = page.locator("div", { has: page.getByText('Disabled Checkbox Demo') }).getByRole('checkbox').first();
    const checkbox1b = page.locator('div:has-text("Disabled Checkbox Demo")').getByRole('checkbox').first();
    const checkbox1 = page.getByText('Disabled Checkbox Demo').locator('..').getByRole('checkbox').first();

    //interestingly this finds the highest level div containing the text, so  checkbox will be a child even though a sibling of that text
    /*
    <div>
    <div>Disabled Checkbox Demo</div>
    <div><input type='checkbox'></div>
    </div>
    
    */
    const checkbox2 = page.locator('div').filter({ hasText: /Disabled Checkbox Demo/ }).getByRole('checkbox').nth(2);
    const checkbox3 = page.locator('div').filter({ hasText: /Disabled Checkbox Demo/ }).getByRole('checkbox').nth(3);
    const checkbox4 = page.locator('div').filter({ hasText: /Disabled Checkbox Demo/ }).getByRole('checkbox').nth(4);

    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).not.toBeChecked();
    expect(checkbox3).not.toBeChecked();
    expect(checkbox4).not.toBeChecked();

    expect(checkbox1).not.toBeDisabled();
    expect(checkbox2).not.toBeDisabled();
    expect(checkbox3).toBeDisabled();
    expect(checkbox4).toBeDisabled();


    const multiCheckbox1 = page.locator('div').filter({ hasText: /Multiple Checkbox Demo/ }).getByRole('checkbox').first();
    const multiCheckbox2 = page.locator('div').filter({ hasText: /Multiple Checkbox Demo/ }).getByRole('checkbox').nth(2);
    const multiCheckbox3 = page.locator('div').filter({ hasText: /Multiple Checkbox Demo/ }).getByRole('checkbox').nth(3);
    const multiCheckbox4 = page.locator('div').filter({ hasText: /Multiple Checkbox Demo/ }).getByRole('checkbox').nth(4);


    expect(multiCheckbox1).not.toBeChecked();
    expect(multiCheckbox2).not.toBeChecked();
    expect(multiCheckbox3).not.toBeChecked();
    expect(multiCheckbox4).not.toBeChecked();

    await multiCheckbox1.check();
    await checkbox2.check();

    expect(multiCheckbox1).toBeChecked();
    expect(checkbox2).toBeChecked();

})

test("Alert", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo");
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        switch (dialog.message()) {
            case 'I am an alert box!':
                await dialog.accept();
                break;
            case 'Press a button!':
                await dialog.accept();
                break;
            case 'Press a button!':
                await dialog.dismiss();
                break;
        }
    });

    const jsAlertButton1 = page.getByRole('button', { name: 'Click Me' }).first();
    await jsAlertButton1.click();

    const choiceAlertButton = page.getByRole('button', { name: 'Click Me' }).nth(1);
    await choiceAlertButton.click();
    expect(await page.locator('p#confirm-demo').textContent()).toBe('You pressed OK!');
    //better as more consice
    expect(page.locator('p#confirm-demo')).toHaveText('You pressed OK!');
})


test("Alert-cancel", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo");
    page.on('dialog', async dialog => {
        console.log(dialog.message());

        await dialog.dismiss();

    })

    const choiceAlertButtona = page.getByRole('button', { name: 'Click Me' }).nth(1);
    const choiceAlertButton = page.locator('p').filter({ hasText: /Confirm box:/ }).getByRole('button')
    await choiceAlertButton.click();
    expect(page.locator('p#confirm-demo')).toContainText('Cancel');
})

test("Alert-cancel-using-waitForEvent", async ({ page }) => {
//this is best option since we know the event that triggers the dialog
    await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo");


    const dialogEvent = page.waitForEvent('dialog');
    // const choiceAlertButton = page.getByRole('button', { name: 'Click Me' }).nth(1);
    const choiceAlertButton = page.locator('p').filter({ hasText: /Confirm box:/ }).getByRole('button')
    choiceAlertButton.click();
    const dialog = await dialogEvent;
    await dialog.dismiss();
    expect(page.locator('#confirm-demo')).toContainText('Cancel');
})



test("Alert-input", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo");
    page.on('dialog', async dialog => {
        console.log(dialog.message());

        await dialog.accept("Hello World");

    })

    const choiceAlertButton = page.getByRole('button', { name: 'Click Me' }).nth(2);
    await choiceAlertButton.click();
    expect(page.locator('p#prompt-demo')).toContainText('Hello World');
})

test("Modal-input", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo");


    const launchModalButton = page.locator("button[data-target='#myModal']")
    await launchModalButton.click();

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await saveButton.click();
})


test("dropdown-list", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/select-dropdown-demo");

    const dropdown = page.locator('select#select-demo');
    const combobox = page.locator('select#multi-select');

    const comboboxOptions = page.locator('select#multi-select > option');

    await dropdown.selectOption({ label: 'Tuesday' });
    // await page.locator('option').filter({ hasText: 'Monday' }).click(); 

    expect(dropdown).toHaveValue('Tuesday');

    expect(page.locator('.selected-value')).toContainText('Tuesday');

    //select two options from combobox
    await combobox.selectOption(['Texas', 'Ohio']);
    expect(combobox).toHaveValues([/Ohio/, /Texas/]);
    expect(combobox).not.toHaveValues([/New York/]);
})  