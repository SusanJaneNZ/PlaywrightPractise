import { test, expect } from "../../fixtures/myFixtures.ts";

test('Frames', async ({ page }) => {
    await page.goto('https://letcode.in/frame');

    // const allFrames = page.frames();
    // console.log("Number of frames: " + allFrames.length);
      const frame1 = page.frameLocator('#firstFr');


    
    await frame1.getByPlaceholder('Enter name').fill('Firstname')
    // await frame1.getByRole('textbox', {name: fname}).fill('Firstname')
    expect(frame1.locator("input[name='fname']")).toHaveValue('Firstname')

    await frame1.getByPlaceholder('Enter email').fill('Lastname')
    expect(frame1.locator("input[name='lname']")).toHaveValue('Lastname')   

    expect(frame1.getByText('You have entered')).toContainText('Firstname Lastname')

    expect(frame1.locator('.title.has-text-info')).toContainText('Firstname Lastname')


 const innerFrame = frame1.frameLocator('iframe[src="innerframe"]');
    await innerFrame.getByPlaceholder('Enter email').fill('nobody@gmail.com')
})
