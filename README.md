# SauceDemo Playwright Automation

This project contains automated tests for the [SauceDemo](https://www.saucedemo.com) application using Playwright with JavaScript.

## Project Structure

```
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/ ## Additional: 

### Workflow Monitoring & Management:

1. **Monitor the Workflow** - Go to **Actions** tab in GitHub
   - View real-time execution status for all browser tests
   - See parallel execution of desktop and mobile tests
   - Download test artifacts (reports, screenshots, videos)

2. **Review Results**
   - ✅ Green checkmarks indicate all browser tests passed
   - ❌ Red X shows which specific browsers/tests failed
   - Detailed logs help debug cross-browser issues
   - View HTML reports directly in browser

3. **Advanced Features**
   - **Matrix Strategy**: Tests run in parallel across all browsers
   - **Artifact Management**: Reports stored for 30 days with browser-specific naming
   - **Environment Variables**: Configurable BASE_URL, timeouts, and retry counts
   - **Mobile Testing**: Dedicated job for mobile viewports
   - **Report Merging**: Unified view of all browser test results
   - **GitHub Pages**: Automatic deployment of test reports
   - **Scheduled Runs**: Daily automated testing at 2 AM UTC

4. **Environment Configuration**
   ```yaml
   env:
     BASE_URL: https://www.saucedemo.com
     TIMEOUT: 30000
     RETRIES: 2
   ```

5. **Cross-Browser Coverage**
   - **Desktop**: Chromium, Firefox, WebKit (Safari)
   - **Mobile**: Mobile Chrome, Mobile Safari
   - **Parallel Execution**: All browsers tested simultaneously
   - **Fail-Fast Disabled**: Continue testing all browsers even if one fails

6. **Reporting Features**
   - HTML reports with screenshots and videos
   - JUnit XML for CI/CD integration
   - JSON reports for custom analysis
   - GitHub-specific reporting format
   - Merged reports across all browsers

7. **Next Steps**
   - **Slack/Email Notifications**: Add webhook integrations for team alerts
   - **Performance Testing**: Add Lighthouse integration for performance metrics
   - **Visual Testing**: Integrate screenshot comparison tools
   - **Security Scanning**: Add security vulnerability checks
   - **Custom Browsers**: Add Edge, Chrome Beta, or specific versions

### Troubleshooting CI/CD Issues:

- **Browser Installation Failures**: Check if all browsers install correctly
- **Test Flakiness**: Review retry settings and timeout configurations
- **Mobile Test Issues**: Verify mobile viewport configurations
- **Report Generation**: Ensure all artifact paths are correctly configured
- **Environment Variables**: Validate all required env vars are set    # Test files
│   ├── login.spec.js
│   ├── inventory.spec.js
│   └── e2e-shopping.spec.js
├── test-data/             # Test data and constants
│   └── testData.js
├── utils/                 # Utility functions
│   └── helpers.js
├── playwright.config.js   # Playwright configuration
└── package.json          # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
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

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests for specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Run mobile tests
```bash
npm run test:mobile
```

### Run all browsers at once
```bash
npm run test:all-browsers
```

### Run tests with environment variables
```bash
# Test against staging environment
npm run test:staging

# Test against production environment
npm run test:prod

# Run with CI settings locally
npm run test:ci
```

### View test reports
```bash
npm run test:report
```

## Environment Variables

The project supports various environment variables for configuration:

- `BASE_URL`: Base URL of the application (default: https://www.saucedemo.com)
- `TIMEOUT`: Timeout for actions and navigation in milliseconds (default: 30000)
- `RETRIES`: Number of retries for failed tests in CI (default: 2)
- `CI`: Indicates if running in CI environment (default: false)
- `TEST_ENV`: Test environment identifier (dev, staging, production)
- `HEADLESS`: Run tests in headless mode (default: true)

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

## Test Coverage

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

# Run tests in debug mode (step through tests)
```bash
npm run test:debug
```
or

```bash
npx playwright test --debug
```

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

## How to create Github Actions workflow for CI/CD: 

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright.yml`) that provides:

### Features:
1. **Cross-browser Testing**: Runs tests on Chromium, Firefox, and WebKit
2. **Mobile Testing**: Tests on Mobile Chrome and Mobile Safari
3. **Test Reporting**: Generates HTML, JSON, and JUnit reports
4. **Artifact Storage**: Stores test results and reports for 30 days
5. **Environment Variables**: Supports configurable test environments
6. **GitHub Pages Deployment**: Auto-deploys reports to GitHub Pages
7. **Scheduled Runs**: Daily automated test execution
8. **Parallel Execution**: Runs browser tests in parallel for faster feedback

### Workflow Structure:
- **Desktop Tests**: Runs on chromium, firefox, webkit in parallel
- **Mobile Tests**: Runs on Mobile Chrome and Mobile Safari
- **Report Merging**: Combines all reports into a unified view
- **Notifications**: Success/failure notifications with detailed status

### Setup:
1. The workflow file is already created at `.github/workflows/playwright.yml`
2. Push to `main` or `develop` branch to trigger tests
3. Create pull requests to run tests automatically
4. Tests also run daily at 2 AM UTC

### Monitoring:
- Go to **Actions** tab in your GitHub repository
- Click on workflow runs to see detailed results
- Download artifacts (test reports, videos, screenshots)
- View deployed reports on GitHub Pages (if enabled)

### GitHub Pages Setup (Optional):
To enable automatic report deployment:
1. Go to repository **Settings** → **Pages**
2. Select **Deploy from a branch**
3. Choose **gh-pages** branch
4. Reports will be available at: `https://[username].github.io/[repository]/test-reports/`

## Additional: 

1. Monitor the Workflow - go to Actions tab in Github and cick on the workflow run (“In progress”).
N.B! You can view each step as it runs (checkout, setup, install, test).

2. Review Results
If tests pass, you’ll see a green checkmark.
If any step fails, you’ll see an error message or stack trace – this helps you debug!

3. Next Steps
Set up Test reports - Playwright HTML reports or uploads can be integrated via following this documentation: https://playwright.dev/docs/test-reporters
 
N.B! Notifications on failure can be sent by integrating email/slack or use GitHub status checks.