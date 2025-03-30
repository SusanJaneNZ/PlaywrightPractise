import { test, expect } from "../../fixtures/myFixtures.ts";

test.beforeEach(async ({ page }) => {
    page.goto('https://demo.playwright.dev/todomvc/');
    expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
})

test('Add new todos', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Make dinner');
    await todoInput.press('Enter');
    await todoInput.fill('Go shopping');
    await todoInput.press('Enter');

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText(['Make dinner', 'Go shopping']);
});

test.describe('Edit todos', () => {
    test.beforeEach(async ({ page }) => {
        const todoInput = page.getByPlaceholder('What needs to be done?');
        await todoInput.fill('Make dinner');
        await todoInput.press('Enter');
    })

    test('Edit todo', async ({ page }) => {
        const firstItem = page.getByRole('listitem').first();
        await firstItem.dblclick();
        for (let i = 0; i <= 5; i++) {
            await page.keyboard.press('Backspace');
        }
        await firstItem.pressSequentially('lunch');
        await firstItem.press('Enter');

        await expect(firstItem).toHaveText(['Make lunch']);
    });

    test('Cancel edit', async ({ page }) => {
        const firstItem = page.getByRole('listitem').first();
        await firstItem.dblclick();

        await firstItem.getByRole('textbox', { name: "Edit" }).fill('make breakafast');
        await firstItem.press('Escape');

        await expect(firstItem).toHaveText('Make dinner');
    });

    test('Delete todo', async ({ page }) => {

        const firstItem = page.getByRole('listitem').first();
        await firstItem.hover();

        const deleteFirstItem = page.getByRole('listitem').first().getByRole('button', { name: 'Delete' });
        await deleteFirstItem.click();

        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(0);
    })


    test('Complete todo', async ({ page }) => {

        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(1);

        const firstItem = page.getByRole('listitem').first();

        const completeFirstItem = page.getByRole('listitem').first().getByRole('checkbox', { name: 'Toggle Todo' });
        await completeFirstItem.click();
        expect(firstItem).toHaveClass(/completed/);

        const clearCompleted = page.getByRole('button', { name: 'Clear completed' });
        expect(clearCompleted).toBeVisible();
        await (clearCompleted).click();

        await expect(todoItems).toHaveCount(0);

    })

    test('Untick todo', async ({ page }) => {

        const firstItem = page.getByRole('listitem').first();

        const completeFirstItem = page.getByRole('listitem').first().getByRole('checkbox', { name: 'Toggle Todo' });
        await completeFirstItem.click();
        expect(firstItem).toHaveClass(/completed/);

        await completeFirstItem.click();
        expect(firstItem).not.toHaveClass(/completed/);
        expect(page.getByTestId('todo-count')).toHaveText('1 item left');

    })
})


test.describe('Multiple todos', () => {
    test.beforeEach(async ({ page }) => {
        const todoInput = page.getByPlaceholder('What needs to be done?');
        await todoInput.fill('Make dinner');
        await todoInput.press('Enter');

        await todoInput.fill('Make lunch');
        await todoInput.press('Enter');

        await todoInput.fill('Make breakfast');
        await todoInput.press('Enter');
        
        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(3);

        const secondItem = page.getByRole('listitem').nth(1);
        const completeFirstItem = secondItem.getByRole('checkbox', { name: 'Toggle Todo' });
        await completeFirstItem.click();
        expect(secondItem).toHaveClass(/completed/);
    
    })

    test('Check todo fiters', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'All' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'All' })).toHaveClass(/selected/);
        await expect(page.getByRole('link', { name: 'Active' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Completed' })).toBeVisible();
    })

    test('Check todo filtering', async ({ page }) => {
        const todoItems = page.locator('.todo-list li');
        await page.getByRole('link', { name: 'Active' }).click();
        await expect(todoItems).toHaveCount(2);
        await page.getByRole('link', { name: 'Completed' }).click();
        await expect(todoItems).toHaveCount(1);
        await page.getByRole('link', { name: 'All' }).click();
        await expect(todoItems).toHaveCount(3);
    })

    test('Clear completed todos', async ({ page }) => {
        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(3);

        const clearCompleted = page.getByRole('button', { name: 'Clear completed' });
        expect(clearCompleted).toBeVisible();
        await (clearCompleted).click();

        await expect(todoItems).toHaveCount(2);
    })

})