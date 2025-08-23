# SauceDemo Playwright Automation

This project contains automated tests for the [SauceDemo](https://www.saucedemo.com) application using Playwright with JavaScript, featuring advanced test sharding, smart retry mechanisms, and performance optimizations.

## 🚀 Key Features

- ✅ **Test Sharding**: Parallel execution across multiple shards for faster CI/CD
- ✅ **Smart Retry Logic**: Intelligent retry mechanisms with exponential backoff
- ✅ **Performance Optimizations**: Browser-specific optimizations and reduced timeouts
- ✅ **Cross-Browser Testing**: Desktop (Chrome, Firefox, Safari) and Mobile testing
- ✅ **Advanced Reporting**: Unified HTML reports with GitHub Pages deployment
- ✅ **Environment Configuration**: Flexible configuration via environment variables

## Project Structure

```
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                  # Test files
│   ├── login.spec.js
│   ├── inventory.spec.js
│   ├── e2e-shopping.spec.js
│   ├── retry-examples.spec.js    # 🆕 Retry logic examples
│   └── performance.perf.spec.js  # 🆕 Performance tests
├── test-data/             # Test data and constants
│   └── testData.js
├── utils/                 # Utility functions and helpers
│   ├── helpers.js
│   ├── retryHelper.js          # 🆕 Smart retry mechanisms
│   ├── environmentConfig.js    # 🆕 Environment configuration
│   ├── globalSetup.js          # 🆕 Global test setup
│   └── globalTeardown.js       # 🆕 Global test teardown
├── .github/workflows/     # CI/CD pipeline
│   └── playwright.yml          # 🆕 Enhanced GitHub Actions workflow
├── playwright.config.js   # Playwright configuration with optimizations
├── .env.example           # 🆕 Environment variables template
├── .gitignore            # 🆕 Git ignore rules
└── package.json          # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run install:browsers
   ```

4. (Optional) Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

## Running Tests

### 🎯 Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# View test reports
npm run test:report
```

### 🌐 Browser-Specific Testing

```bash
# Run tests for specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run mobile tests
npm run test:mobile

# Run all browsers at once
npm run test:all-browsers
```

### 🔄 Advanced Testing with Retry & Performance

```bash
# Test with enhanced retry logic (5 retries)
npm run test:retry

# Test with extended timeouts (60s test, 20s action)
npm run test:timeout

# Run performance tests only
npm run test:performance

# Simulate sharded execution locally
npm run test:sharded

# Run with CI settings locally
npm run test:ci
```

### 🌍 Environment-Specific Testing

```bash
# Test against staging environment
npm run test:staging

# Test against production environment
npm run test:prod

# Run with custom environment variables
BASE_URL=https://custom.env.com RETRIES=5 npm test

# Run specific test file with retries
npm run test:retry -- tests/login.spec.js --project=chromium
```

## Environment Variables

The project supports various environment variables for configuration:

### Core Settings
- `BASE_URL`: Base URL of the application (default: https://www.saucedemo.com)
- `TIMEOUT`: Timeout for actions and navigation in milliseconds (default: 15000)
- `TEST_TIMEOUT`: Overall test timeout in milliseconds (default: 30000)
- `EXPECT_TIMEOUT`: Assertion timeout in milliseconds (default: 10000)
- `RETRIES`: Number of retries for failed tests in CI (default: 3)

### Execution Settings
- `WORKERS`: Number of parallel workers (default: 2 for CI, 50% CPU locally)
- `CI`: Indicates if running in CI environment (default: false)
- `TEST_ENV`: Test environment identifier (dev, staging, production)
- `HEADLESS`: Run tests in headless mode (default: true)

### Advanced Configuration
- `GLOBAL_SETUP`: Enable global setup/teardown (default: true)
- `SHARD`: Enable test sharding (default: false)
- `SHARD_CURRENT`: Current shard number (1-based)
- `SHARD_TOTAL`: Total number of shards

### Using Environment Variables

1. **Local Development**: Copy `.env.example` to `.env` and modify values
   ```bash
   cp .env.example .env
   ```

2. **Command Line**: Set variables inline
   ```bash
   BASE_URL=https://staging.example.com TIMEOUT=60000 npm test
   ```

3. **GitHub Actions**: Variables are automatically set in the CI workflow

## 🧪 Test Coverage

The test suite covers the following scenarios:

### Login Tests (`login.spec.js`)
- ✅ Successful login with valid credentials
- ✅ Error handling for locked out user
- ✅ Error handling for invalid credentials
- ✅ Error message clearing functionality
- ✅ Session persistence after page refresh

### Inventory Tests (`inventory.spec.js`)
- ✅ Product display verification
- ✅ Add/remove products to/from cart
- ✅ Product sorting (by name and price)
- ✅ Navigation to cart
- ✅ Logout functionality

### End-to-End Shopping Flow (`e2e-shopping.spec.js`)
- ✅ Complete shopping flow from login to order completion
- ✅ Cart operations (add, remove, update quantities)
- ✅ Checkout form validation
- ✅ Order summary verification
- ✅ Cancellation and navigation flows

### 🆕 Retry Logic Examples (`retry-examples.spec.js`)
- ✅ Smart retry mechanisms for login flows
- ✅ Exponential backoff for flaky elements
- ✅ Step-level retry wrappers
- ✅ Comprehensive retry coverage examples

### 🆕 Performance Tests (`performance.perf.spec.js`)
- ✅ Page load time measurements
- ✅ Login flow performance validation
- ✅ Inventory page load efficiency testing

## 🔄 Smart Retry Mechanisms

The project includes advanced retry logic with multiple strategies:

### RetryHelper Features
- **Smart Retry**: Automatically determines retry strategy based on error type
- **Exponential Backoff**: Scales delay between retries to prevent overwhelming
- **Error-Specific Handling**: Different strategies for timeout, network, element, and navigation errors
- **Retry Conditions**: Configurable conditions to avoid retrying assertion errors

### Example Usage

```javascript
// Function-level retry with smart conditions
await RetryHelper.withSmartRetry(async () => {
  await loginPage.login(username, password);
}, { 
  maxRetries: 3, 
  retryCondition: retryConditions.smart 
});

// Exponential backoff for flaky operations
await RetryHelper.withExponentialBackoff(async () => {
  await inventoryPage.addProductToCart(productId);
}, { 
  maxRetries: 3, 
  baseDelay: 1000, 
  factor: 2 
});

// Step-level retry wrapper
const retryLogin = RetryHelper.retryStep(loginFunction, {
  maxRetries: 2,
  retryCondition: retryConditions.onTimeoutOrNetwork
});
```

## ⚡ Performance Optimizations

### Browser-Level Optimizations
- **Chromium**: Disabled web security, IPC flooding protection, renderer backgrounding
- **Firefox**: Disabled media permissions, configured fake media streams
- **WebKit**: Disabled web security for faster execution

### Configuration Optimizations
- **Reduced Timeouts**: 15s action timeout, 30s test timeout
- **Smart Workers**: 2 workers for CI, 50% CPU cores locally
- **Memory Optimization**: Increased Node.js heap size to 4GB
- **Motion Reduction**: Eliminates animation delays
- **Network Optimizations**: Bypass CSP, ignore HTTPS errors

### Global Setup/Teardown
- **Lightweight Mode**: HTTP health checks for sharded execution
- **Performance Monitoring**: Setup/teardown timing metrics
- **Cleanup Automation**: Automatic removal of old test artifacts
- **Authentication Caching**: Reuse login sessions across tests

## Test Data

The project uses predefined test data located in `test-data/testData.js`, including:
- Different user types (standard, locked out, problem user, etc.)
- Product information
- Checkout form data
- Expected error messages

## Page Object Model

The tests follow the Page Object Model pattern for better maintainability:
- **LoginPage**: Handles login functionality
- **InventoryPage**: Manages product listing and cart operations
- **CartPage**: Handles cart review and checkout initiation
- **CheckoutPage**: Manages checkout flow and order completion

## Configuration

Test configuration is managed in `playwright.config.js`:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile testing support
- Screenshot and video recording on failures
- Test reporting (HTML, JSON, JUnit)
- Trace collection for debugging

## Utilities

Helper functions are available in `utils/helpers.js` for:
- Random data generation
- String manipulation
- Date/time formatting
- Currency formatting

## Troubleshooting

### Common Issues

1. **Browser installation issues**:
   ```bash
   npx playwright install --with-deps
   ```

2. **Test failures due to timing**:
   - Check if elements are loaded before interaction
   - Increase timeout values if needed

3. **Debugging failing tests**:
   ```bash
   npm run test:debug
   ```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add appropriate test data to `test-data/testData.js`
3. Use Page Object Model pattern for new page interactions
4. Include proper assertions and error handling
5. Update this README for any significant changes

## Reports

Test results are generated in multiple formats:
- HTML report: `playwright-report/index.html`
- JSON report: `test-results/results.json`
- JUnit report: `test-results/results.xml`

Access the HTML report by running:
```bash
npm run test:report
```

# Run all tests (headless mode)
```bash
npm test
```
or

```bash
npx playwright test
```

# Run tests in headed mode (you can see the browser)
```bash
npm run test:headed
```
or

```bash
npx playwright test --headed
```

# Run tests with UI mode (interactive test runner)
```bash
npm run test:ui
```
or

```bash
npx playwright test --ui
```

# Run tests only in Chrome
```bash
npm run test:chrome
```
or

```bash
npx playwright test --project=chromium
```

# Run tests only in Firefox
```bash
npm run test:firefox
```
or

```bash
npx playwright test --project=firefox
```

# Run tests only in Safari
```bash
npm run test:safari
```
or

```bash
npx playwright test --project=webkit
```

## 🛠️ Advanced Command Reference

### Direct Playwright Commands

```bash
# Run specific test file
npx playwright test tests/login.spec.js

# Run tests matching a pattern
npx playwright test --grep "should login successfully"

# Run tests in debug mode (step through tests)
npx playwright test --debug

# Run tests with specific project
npx playwright test --project=chromium

# Run tests with headed browser
npx playwright test --headed

# Run tests with UI mode (interactive)
npx playwright test --ui

# Show test report
npx playwright show-report
```

### Sharding Commands (Advanced)

```bash
# Run specific shard locally
npx playwright test --shard=1/3

# Test sharding simulation
SHARD_CURRENT=1 SHARD_TOTAL=3 npm run test:chrome

# List tests that would run in shard
npx playwright test --shard=1/3 --list
```

## 🛠️ Troubleshooting

### Common Issues

1. **Retry Test Failures**:
   ```bash
   # Check retry configuration
   npm run test:retry -- tests/retry-examples.spec.js --project=chromium
   
   # Verify RetryHelper imports are working
   grep -r "RetryHelper" tests/
   ```

2. **Timeout Issues**:
   ```bash
   # Run with extended timeouts
   npm run test:timeout
   
   # Or set custom timeouts
   TEST_TIMEOUT=60000 TIMEOUT=20000 npm test
   ```

3. **Browser Installation Issues**:
   ```bash
   # Full browser installation with dependencies
   npx playwright install --with-deps
   
   # Install specific browser
   npx playwright install chromium
   ```

4. **Sharding Issues**:
   ```bash
   # Test sharding locally
   SHARD_CURRENT=1 SHARD_TOTAL=3 npm run test:chrome
   
   # Verify shard distribution
   npm run test:sharded -- --list
   ```

5. **Environment Variable Issues**:
   ```bash
   # Check current environment variables
   printenv | grep -E "(BASE_URL|TIMEOUT|RETRIES)"
   
   # Test with explicit variables
   BASE_URL=https://www.saucedemo.com RETRIES=3 npm test
   ```

### Performance Issues

1. **Slow Test Execution**:
   - Reduce worker count: `WORKERS=1 npm test`
   - Check browser launch arguments in `playwright.config.js`
   - Verify system resources (CPU, memory)

2. **Memory Issues**:
   - Increase Node.js heap size: `NODE_OPTIONS="--max-old-space-size=8192"`
   - Close unnecessary browser tabs/applications
   - Use headless mode for better performance

3. **Network Issues**:
   - Check BASE_URL accessibility
   - Verify internet connection stability
   - Consider using retry mechanisms for network-dependent tests

### CI/CD Issues

1. **GitHub Actions Failures**:
   - Check Actions tab for detailed error logs
   - Verify browser installation step succeeds
   - Review environment variable configuration
   - Monitor artifact upload/download processes

2. **Sharding Problems**:
   - Verify matrix configuration in workflow file
   - Check shard environment variables are passed correctly
   - Ensure all shards complete before report merging

3. **Report Generation Issues**:
   - Verify all test artifacts are uploaded
   - Check GitHub Pages deployment permissions
   - Review report merging script logs

## 📚 Additional Resources

- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md` for comprehensive feature documentation
- **Playwright Documentation**: https://playwright.dev/docs/test-reporters
- **GitHub Actions Guide**: https://docs.github.com/en/actions
- **Environment Configuration**: Review `.env.example` for all available variables

## 🎯 Next Steps

### Potential Enhancements
1. **Visual Testing**: Integrate screenshot comparison tools
2. **Performance Monitoring**: Add Lighthouse integration for web vitals
3. **Security Testing**: Integrate security vulnerability scanning
4. **Accessibility Testing**: Add automated accessibility checks
5. **Custom Notifications**: Set up Slack/email alerts for test failures

---

**Note**: This test suite is production-ready with enterprise-level features including test sharding, smart retry mechanisms, performance optimizations, and comprehensive CI/CD pipeline. 🚀

# Run specific test file
```bash
npx playwright test tests/login.spec.js
```

# Run tests matching a pattern
```bash
npx playwright test --grep "should login successfully"
```

# View test report after running tests
```bash
npm run test:report
```
or

```bash
npx playwright show-report
```

## 🚀 GitHub Actions CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright.yml`) with advanced features:

### 🎯 Workflow Features
1. **Test Sharding**: Desktop tests run across 3 shards per browser for optimal performance
2. **Cross-Browser Testing**: Parallel execution on Chromium, Firefox, and WebKit
3. **Mobile Testing**: Dedicated testing for Mobile Chrome and Mobile Safari
4. **Performance Testing**: Specialized performance test suite
5. **Smart Reporting**: Unified HTML reports with GitHub Pages deployment
6. **Artifact Management**: 30-60 day retention with organized naming
7. **Scheduled Execution**: Daily automated runs at 2 AM UTC

### 🔢 Execution Matrix
```yaml
Desktop Tests (Sharded):
- chromium: shard 1/3, 2/3, 3/3
- firefox: shard 1/3, 2/3, 3/3  
- webkit: shard 1/3, 2/3, 3/3
Total: 9 parallel desktop jobs

Mobile Tests:
- Mobile Chrome
- Mobile Safari
Total: 2 parallel mobile jobs

Performance Tests:
- Dedicated Chromium performance suite
Total: 1 specialized job

Grand Total: 12 parallel jobs for maximum efficiency
```

### 🎮 Workflow Triggers
- **Push**: Automatic execution on `main` and `develop` branches
- **Pull Request**: Testing for all PRs to `main` and `develop`
- **Schedule**: Daily execution at 2 AM UTC
- **Manual**: Can be triggered manually from GitHub Actions tab

### 📊 Advanced Features
- **Environment Variables**: Configurable BASE_URL, timeouts, retry counts
- **Fail-Safe Execution**: Continues testing all browsers even if one fails
- **Report Merging**: Combined view of all browser and shard results
- **GitHub Pages Integration**: Automatic deployment of test reports
- **Notification System**: Detailed success/failure summaries with troubleshooting tips

### 🔧 Setup Instructions
The workflow file is already configured at `.github/workflows/playwright.yml`. To get started:

1. **Push to Repository**: Workflow triggers automatically on push to `main` or `develop`
2. **Monitor Execution**: Go to **Actions** tab in your GitHub repository
3. **View Results**: Download artifacts or view deployed reports
4. **Enable GitHub Pages** (Optional):
   - Go to repository **Settings** → **Pages**
   - Select **Deploy from a branch** → **gh-pages**
   - Reports available at: `https://[username].github.io/[repository]/test-reports/`

## Additional: 

1. Monitor the Workflow - go to Actions tab in Github and cick on the workflow run (“In progress”).
N.B! You can view each step as it runs (checkout, setup, install, test).

2. Review Results
If tests pass, you’ll see a green checkmark.
If any step fails, you’ll see an error message or stack trace – this helps you debug!

3. Next Steps
Set up Test reports - Playwright HTML reports or uploads can be integrated via following this documentation: https://playwright.dev/docs/test-reporters
 
N.B! Notifications on test status (and failures()) sent to my email mapped to this GitHub repo :)