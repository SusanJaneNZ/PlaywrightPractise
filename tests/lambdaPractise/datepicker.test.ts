import { test, expect } from "../../fixtures/myFixtures.ts";

test('native datepicker', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthday = page.getByRole('textbox', { name: 'Birthday' });

  await birthday.pressSequentially('26/01/2021');
  expect(birthday).toHaveValue('2021-01-26');

  //we cannot test the html native datepicker for type=date as this is the domain of the browser

})

test('bootstrap datepicker in current month', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const date = page.getByPlaceholder('Start date');
  await date.click();
  const enabledDays = page.locator('td[class="day"]');

  //choose 4th of current month
  await enabledDays.filter({ hasText: /^4$/ }).click();
  const today = new Date();
  const expectedDate = new Date(today.getFullYear(), today.getMonth(), 4);
  const formattedDate = `04/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  expect(date).toHaveValue(formattedDate);

})

test('bootstrap datepicker in next month', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const date = page.getByPlaceholder('Start date');
  await date.click();
  
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  const monthName = nextMonth.toLocaleString('default', { month: 'long' });
  const monthYear = `${monthName} ${nextMonth.getFullYear()}`
  console.log('Next  Month Name is:' + monthYear);

//change datepicker to next month
  const next = page.locator('.datepicker-days').locator('.next');
  await next.click();
  await expect(page.locator('.datepicker-days').locator('.datepicker-switch')).toContainText(monthYear);


  //there could be a second 5 for the next month
  const fifth = page.getByRole('cell', { name: '5', exact: true}).first();
  await fifth.click();

  //choose 5th of next month
  const formattedDate = `05/${String(nextMonth.getMonth() + 1).padStart(2, '0')}/${nextMonth.getFullYear()}`;
  expect(date).toHaveValue(formattedDate);

})