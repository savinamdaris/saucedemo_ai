import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { users, checkoutInfo } from '../test-data/testData.js';

test.describe('End-to-End Shopping Flow', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.loginAndWaitForSuccess(users.standard.username, users.standard.password);
  });

  test('should complete full shopping flow', async () => {
    // Add products to cart
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    
    // Verify cart count
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
    
    // Go to cart
    await inventoryPage.goToCart();
    expect(await cartPage.isPageLoaded()).toBeTruthy();
    
    // Verify items in cart
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);
    
    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    expect(await checkoutPage.isCheckoutInfoPageLoaded()).toBeTruthy();
    
    // Fill checkout information
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode
    );
    
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.isCheckoutOverviewPageLoaded()).toBeTruthy();
    
    // Verify order summary
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    
    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBe(subtotal + tax);
    
    // Complete order
    await checkoutPage.finishOrder();
    expect(await checkoutPage.isCheckoutCompletePageLoaded()).toBeTruthy();
  });

  test('should handle cart operations', async () => {
    // Add multiple products
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await inventoryPage.addProductToCart('sauce-labs-bolt-t-shirt');
    
    await inventoryPage.goToCart();
    
    // Remove one item from cart
    await cartPage.removeItem('sauce-labs-bike-light');
    
    const remainingItems = await cartPage.getCartItemCount();
    expect(remainingItems).toBe(2);
    
    // Continue shopping
    await cartPage.continueShopping();
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
    
    // Verify cart count is preserved
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
  });

  test('should validate checkout form fields', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Test each invalid scenario
    for (const invalidInfo of checkoutInfo.invalid) {
      await checkoutPage.fillCheckoutInfo(
        invalidInfo.firstName,
        invalidInfo.lastName,
        invalidInfo.postalCode
      );
      
      await checkoutPage.continueToOverview();
      
      const errorMessage = await checkoutPage.getErrorMessage();
      expect(errorMessage).toBe(invalidInfo.expectedError);
      
      // Clear the form for next iteration
      await checkoutPage.page.reload();
      await checkoutPage.page.waitForLoadState('networkidle');
    }
  });

  test('should allow cancellation during checkout', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Cancel checkout
    await checkoutPage.cancelCheckout();
    
    // Should return to cart
    expect(await cartPage.isPageLoaded()).toBeTruthy();
    
    // Items should still be in cart
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
  });

  test('should return to products after completing order', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode
    );
    
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();
    
    // Return to products
    await checkoutPage.backToProducts();
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
    
    // Cart should be empty
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });
});
