export class CartPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartQuantity = page.locator('.cart_quantity');
  }

  async isPageLoaded() {
    return await this.pageTitle.isVisible() && 
           await this.pageTitle.textContent() === 'Your Cart';
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(productName) {
    const removeButton = this.page.locator(`[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await removeButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getTotalItems() {
    const quantities = await this.cartQuantity.allTextContents();
    return quantities.reduce((sum, qty) => sum + parseInt(qty), 0);
  }
}
