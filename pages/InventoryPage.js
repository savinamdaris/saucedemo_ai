export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async isPageLoaded() {
    return await this.pageTitle.isVisible() && 
           await this.pageTitle.textContent() === 'Products';
  }

  async getProductCount() {
    return await this.inventoryItems.count();
  }

  async addProductToCart(productName) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await addButton.click();
  }

  async removeProductFromCart(productName) {
    const removeButton = this.page.locator(`[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await removeButton.click();
  }

  async getCartItemCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      return parseInt(await this.shoppingCartBadge.textContent());
    }
    return 0;
  }

  async sortProducts(sortOption) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async getProductNames() {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  async getProductPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
