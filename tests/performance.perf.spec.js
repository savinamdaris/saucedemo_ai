/**
 * Performance Tests for SauceDemo Application
 * Tests page load times, network requests, and overall performance metrics
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { users } from '../test-data/testData.js';

test.describe('Performance Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test('should load login page within performance threshold', async ({ page }) => {
    const startTime = Date.now();
    
    await loginPage.goto();
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Login page load time: ${loadTime}ms`);
    
    // Performance assertion - should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should complete login flow within performance threshold', async ({ page }) => {
    await loginPage.goto();
    
    const startTime = Date.now();
    
    await loginPage.loginAndWaitForSuccess(users.standard.username, users.standard.password);
    await inventoryPage.isPageLoaded();
    
    const loginTime = Date.now() - startTime;
    console.log(`Login flow completion time: ${loginTime}ms`);
    
    // Performance assertion - login should complete within 5 seconds
    expect(loginTime).toBeLessThan(5000);
  });

  test('should load inventory page efficiently', async ({ page }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForSuccess(users.standard.username, users.standard.password);
    
    const startTime = Date.now();
    
    // Wait for all products to be visible
    await page.waitForSelector('.inventory_item', { state: 'visible' });
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Inventory page load time: ${loadTime}ms`);
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    // Verify all products are loaded
    const productCount = await page.locator('.inventory_item').count();
    expect(productCount).toBe(6);
  });
});
