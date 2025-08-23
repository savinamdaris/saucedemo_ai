import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { users, products, sortOptions } from '../test-data/testData.js';

test.describe('Inventory Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    
    // Wait for inventory page to be fully loaded
    await inventoryPage.isPageLoaded();
  });

  test('should display all products on inventory page', async () => {
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);
  });

  test('should add product to cart', async () => {
    const initialCartCount = await inventoryPage.getCartItemCount();
    
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    
    const finalCartCount = await inventoryPage.getCartItemCount();
    expect(finalCartCount).toBe(initialCartCount + 1);
  });

  test('should add multiple products to cart', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await inventoryPage.addProductToCart('sauce-labs-bolt-t-shirt');
    
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });

  test('should remove product from cart', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
    
    await inventoryPage.removeProductFromCart('sauce-labs-backpack');
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });

  test.describe('Product sorting', () => {
    test('should sort products by name A-Z', async () => {
      await inventoryPage.sortProducts(sortOptions.nameAZ);
      
      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort();
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by name Z-A', async () => {
      await inventoryPage.sortProducts(sortOptions.nameZA);
      
      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort().reverse();
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by price low to high', async () => {
      await inventoryPage.sortProducts(sortOptions.priceLowHigh);
      
      const productPrices = await inventoryPage.getProductPrices();
      const sortedPrices = [...productPrices].sort((a, b) => a - b);
      expect(productPrices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async () => {
      await inventoryPage.sortProducts(sortOptions.priceHighLow);
      
      const productPrices = await inventoryPage.getProductPrices();
      const sortedPrices = [...productPrices].sort((a, b) => b - a);
      expect(productPrices).toEqual(sortedPrices);
    });
  });

  test('should navigate to cart page', async () => {
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await expect(inventoryPage.page.locator('.title')).toHaveText('Your Cart');
  });

  test('should logout successfully', async () => {
    await inventoryPage.logout();
    
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });
});
