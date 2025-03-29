import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.skip('File Download', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');
  const textbox = page.locator('#textbox');
  await textbox.pressSequentially('Hello World');
  const downloadButton = page.getByRole('button', { name: 'Generate File' });
  await downloadButton.click();

  const downloadEvent = page.waitForEvent('download');
  page.getByRole('link', { name: 'Download' }).click();
  const download = await downloadEvent

  const filename = './downloads/' + download.suggestedFilename()
  await download.saveAs( filename)
  console.log(filename)

  const contents = await fs.promises.readFile(filename);

  console.log(contents.toString())
  expect(contents.toString()).toContain('Hello World')
})

test.skip('File Upload - invalid type', async ({ page }) => {
await page.goto('https://blueimp.github.io/jQuery-File-Upload');
page.on('filechooser', async fileChooser => {
  console.log('Multiple File Chooser opened: ' + fileChooser.isMultiple());   
}) 


const uploadEvent = page.waitForEvent('filechooser');
// page.getByText('Add Files...').locator('..').click();
page.locator('input[type="file"]').click();
const fileChooser = await uploadEvent;
await fileChooser.setFiles(['C:/Users/susan/playwright/downloads/Lambdainfo.txt']);

expect(page.locator('.error')).toContainText('File type not allowed')

})

test.skip('File Upload', async ({ page }) => {
  await page.goto('https://blueimp.github.io/jQuery-File-Upload');
  page.on('filechooser', async fileChooser => {
    console.log('Multiple File Chooser opened: ' + fileChooser.isMultiple());   
  }) 
  
  
  const uploadEvent = page.waitForEvent('filechooser');
  // page.getByText('Add Files...').locator('..').click();
  page.locator('input[type="file"]').click();
  const fileChooser = await uploadEvent;
  await fileChooser.setFiles(['C:/Users/susan/playwright/downloads/house.jpg']);
  await expect(page.locator('.name')).toContainText('house.jpg');
  await expect(page.locator('.size')).toContainText('KB')
  
  })
