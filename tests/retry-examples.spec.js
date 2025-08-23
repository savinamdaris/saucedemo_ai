/**
 * Example Test with Enhanced Retry Logic
 * Demonstrates how to use the RetryHelper for robust test execution
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { users } from '../test-data/testData.js';
import { RetryHelper, retryConditions } from '../utils/retryHelper.js';

test.describe('Enhanced Retry Logic Examples', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  // Example 1: Using smart retry for login
  test('should login with smart retry logic', async ({ page }) => {
    await RetryHelper.withSmartRetry(
      async () => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await expect(inventoryPage.pageTitle).toBeVisible({ timeout: 15000 });
      },
      {
        maxRetries: 3,
        retryCondition: retryConditions.smart,
        onRetry: (error, attempt) => {
          console.log(`🔄 Login retry attempt ${attempt + 1}: ${error.message}`);
        }
      }
    );
  });

  // Example 2: Using exponential backoff for flaky elements
  test('should handle flaky elements with exponential backoff', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    // Add products with exponential backoff retry
    await RetryHelper.withExponentialBackoff(
      async () => {
        await inventoryPage.addProductToCart('sauce-labs-backpack');
        await inventoryPage.addProductToCart('sauce-labs-bike-light');
        
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(2);
      },
      {
        maxRetries: 3,
        baseDelay: 1000,
        factor: 2,
        jitter: true
      }
    );
  });

  // Example 3: Using retry wrapper for individual steps
  test('should use retry wrapper for specific steps', async ({ page }) => {
    await loginPage.goto();
    
    // Wrap specific steps with retry logic
    const retryLogin = RetryHelper.retryStep(
      async (username, password) => {
        await loginPage.login(username, password);
        await expect(inventoryPage.pageTitle).toBeVisible();
      },
      {
        maxRetries: 2,
        retryCondition: retryConditions.onTimeoutOrNetwork
      }
    );

    const retryAddToCart = RetryHelper.retryStep(
      async (productId) => {
        await inventoryPage.addProductToCart(productId);
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBeGreaterThan(0);
      },
      {
        maxRetries: 3,
        retryCondition: retryConditions.onElementErrors
      }
    );

    // Execute with retry logic
    await retryLogin(users.standard.username, users.standard.password);
    await retryAddToCart('sauce-labs-backpack');
  });

  // Example 4: Standard test with comprehensive retry logic
  test('should use standard test with comprehensive retry coverage', async ({ page }) => {
    await RetryHelper.withSmartRetry(
      async () => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        
        // This entire test block will be retried if it fails
        await expect(inventoryPage.pageTitle).toBeVisible({ timeout: 15000 });
        
        const productCount = await inventoryPage.getProductCount();
        expect(productCount).toBe(6);
      },
      {
        maxRetries: 3,
        retryCondition: retryConditions.notOnAssertions,
        onRetry: (error, attempt) => {
          console.log(`🔄 Comprehensive retry attempt ${attempt + 1}: ${error.message}`);
        }
      }
    );
  });

  // Example 5: Simple test with just function-level retries (no custom test wrapper)
  test('should use standard test with manual retry logic', async ({ page }) => {
    await RetryHelper.withSmartRetry(
      async () => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        
        // Test the inventory page loads correctly
        await expect(inventoryPage.pageTitle).toBeVisible({ timeout: 15000 });
        
        const productCount = await inventoryPage.getProductCount();
        expect(productCount).toBe(6);
      },
      {
        maxRetries: 3,
        retryCondition: retryConditions.smart,
        onRetry: (error, attempt) => {
          console.log(`🔄 Manual retry attempt ${attempt + 1}: ${error.message}`);
        }
      }
    );
  });
});
