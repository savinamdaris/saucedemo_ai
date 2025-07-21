/**
 * Generate random string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} Random string
 */
export function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email address
 * @returns {string} Random email address
 */
export function generateRandomEmail() {
  const username = generateRandomString(8);
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'test.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

/**
 * Generate random postal code
 * @returns {string} Random 5-digit postal code
 */
export function generateRandomPostalCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Wait for specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format currency to 2 decimal places
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get current timestamp in YYYY-MM-DD-HH-mm-ss format
 * @returns {string} Formatted timestamp
 */
export function getTimestamp() {
  const now = new Date();
  return now.toISOString()
    .replace(/T/, '-')
    .replace(/:/g, '-')
    .replace(/\..+/, '');
}
