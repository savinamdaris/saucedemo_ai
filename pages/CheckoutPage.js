export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.completeHeader = page.locator('.complete-header');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
  }

  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async isCheckoutInfoPageLoaded() {
    return await this.pageTitle.isVisible() && 
           await this.pageTitle.textContent() === 'Checkout: Your Information';
  }

  async isCheckoutOverviewPageLoaded() {
    return await this.pageTitle.isVisible() && 
           await this.pageTitle.textContent() === 'Checkout: Overview';
  }

  async isCheckoutCompletePageLoaded() {
    return await this.completeHeader.isVisible() && 
           await this.completeHeader.textContent() === 'Thank you for your order!';
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return parseFloat(text.replace('Total: $', ''));
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}
