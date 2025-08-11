# SauceDemo Playwright Automation

This project contains automated tests for the [SauceDemo](https://www.saucedemo.com) application using Playwright with JavaScript.

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

### View test reports
```bash
npm run test:report
```

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

1. In the repo, go to .github/workflows/ (create these folders if they don't exist).
2. In that folder, create a file called .github/workflows/playwright.yml with content:

```bash
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'   # Or your desired Node version

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run tests (Chromium)
        run: npx playwright test --project=chromium
```

 3. Commit and push to your GitHub repository.
 4. Every time you push or open a pull request to main, GitHub Actions will:
- Check out your code
- Install Node.js and dependencies
- Install the Playwright browsers
- Run your tests using npx playwright test --project=chromium
- You can monitor the workflow status by clicking on the Actions tab in your repository.      

In addition in VSCode you will be asked "Do you want to install the recommended 'GitHub Actions' extension from GitHub for playwright.yml?"

## Additional: 

1. Monitor the Workflow - go to Actions tab in Github and cick on the workflow run (“In progress”).
N.B! You can view each step as it runs (checkout, setup, install, test).

2. Review Results
If tests pass, you’ll see a green checkmark.
If any step fails, you’ll see an error message or stack trace – this helps you debug!

3. Next Steps
Set up Test reports - Playwright HTML reports or uploads can be integrated via following this documentation: https://playwright.dev/docs/test-reporters
 
N.B! Notifications on failure can be sent by integrating email/slack or use GitHub status checks.