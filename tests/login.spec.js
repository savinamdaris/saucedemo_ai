import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { users, invalidUsers } from '../test-data/testData.js';

test.describe('Login Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    
    await expect(inventoryPage.pageTitle).toBeVisible();
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
  });

  test('should display error for locked out user', async () => {
    await loginPage.login(users.locked.username, users.locked.password);
    
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Sorry, this user has been locked out');
  });

  test.describe('Invalid login attempts', () => {
    invalidUsers.forEach((user, index) => {
      test(`should display error for invalid credentials - case ${index + 1}`, async () => {
        await loginPage.login(user.username, user.password);
        
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(user.expectedError);
      });
    });
  });

  test('should clear error message when clicking X button', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    
    await loginPage.clearError();
    expect(await loginPage.isErrorDisplayed()).toBeFalsy();
  });

  test('should maintain login session after page refresh', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
    
    await loginPage.page.reload();
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
  });
});
