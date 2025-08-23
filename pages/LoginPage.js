export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('.error-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait a moment for the page to process the login
    await this.page.waitForTimeout(1000);
  }

  async loginAndWaitForSuccess(username, password) {
    await this.login(username, password);
    
    // Wait for navigation to complete with longer timeout
    await this.page.waitForURL('**/inventory.html', { timeout: 30000 });
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorDisplayed() {
    return await this.errorMessage.isVisible();
  }

  async clearError() {
    await this.errorButton.click();
  }

  async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }
}
