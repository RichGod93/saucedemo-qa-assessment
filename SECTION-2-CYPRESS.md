# Section 2 — Cypress Automation (Page Object Model)

## Overview

This section documents the Cypress E2E test automation implementation using the Page Object Model (POM) design pattern.

**Framework:** Cypress 15.15.0
**Pattern:** Page Object Model (POM)
**Language:** JavaScript ES6+
**Test Files:** 2 spec files (saucedemo.cy.js, problem-user.cy.js)
**Page Objects:** 4 pages (Login, Inventory, Cart, Checkout)

---

## Project Structure

```text
cypress/
├── e2e/
│   ├── saucedemo.cy.js          # Main test suite (standard_user)
│   └── problem-user.cy.js       # Problem user bug documentation
│
├── pages/
│   ├── LoginPage.js             # Login page object
│   ├── InventoryPage.js         # Product inventory page object
│   ├── CartPage.js              # Shopping cart page object
│   └── CheckoutPage.js          # Checkout flow page object
│
├── screenshots/                  # Auto-captured on failures
│
└── support/
    ├── commands.js               # Custom commands
    └── e2e.js                    # Cypress configuration

cypress.config.js                 # Cypress configuration
cypress.env.json                  # Environment variables (credentials)
package.json                      # Node dependencies
```

---

## Configuration Files

### cypress.config.js

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      on('task', {
        getEnv(key) {
          return config.env[key] ?? null;
        }
      });
      return config;
    }
  }
});
```

**Key Features:**
- `baseUrl` set to SauceDemo application
- Custom `getEnv` task for secure credential access
- Node event listeners configured

---

### cypress.env.json

```json
{
    "STANDARD_USER": "standard_user",
    "PROBLEM_USER": "problem_user",
    "PASSWORD": "secret_sauce"
}
```

**Security Notes:**
- Credentials stored separately from code
- Accessed via `Cypress.env()` or `cy.task('getEnv', 'KEY')`
- Should be added to `.gitignore` in real projects
- Never hardcode credentials in test files

---

### package.json

```json
{
  "name": "saucedemo-qa-assessment",
  "version": "1.0.0",
  "description": "QA Assessment - SauceDemo E2E Testing",
  "main": "index.js",
  "scripts": {
    "test": "cypress run",
    "test:ui": "cypress open",
    "test:chrome": "cypress run --browser chrome",
    "test:standard": "cypress run --spec 'cypress/e2e/saucedemo.cy.js'",
    "test:problem": "cypress run --spec 'cypress/e2e/problem-user.cy.js'"
  },
  "keywords": ["cypress", "testing", "e2e", "qa"],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "cypress": "^15.15.0"
  }
}
```

---

## Page Objects

### 1. LoginPage.js

**Location:** `cypress/pages/LoginPage.js`

**Responsibilities:**
- Handle login functionality
- Verify login success/failure
- Manage logout process

**Implementation:**

```javascript
class LoginPage {

    usernameInput = '[data-test="username"]';
    passwordInput = '[data-test="password"]';
    loginBtn = '[data-test="login-button"]';
    errorMessage = '[data-test="error"]';
    menuButton = '#react-burger-menu-btn';
    logoutButton = '#logout_sidebar_link';

    visit() {
        cy.visit('/');
    }

    enterUsername(username){
        cy.get(this.usernameInput).clear().type(username);
    }

    enterPassword(password){
        cy.get(this.passwordInput).clear().type(password);
    }

    clickLogin(){
        cy.get(this.loginBtn).click();
    }

    login(username, password){
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }

    verifyLoginSuccess(){
        cy.url().should('include','inventory');
    }

    verifyError(){
        cy.get(this.errorMessage).should('be.visible');
    }

    logout(){
        cy.get(this.menuButton).click();
        cy.get(this.logoutButton).click();
    }

}

export default LoginPage;
```

**Usage Example:**

```javascript
import LoginPage from '../pages/LoginPage';

const loginPage = new LoginPage();

it('Login test', () => {
    loginPage.visit();
    loginPage.login('standard_user', 'secret_sauce');
    loginPage.verifyLoginSuccess();
});
```

---

### 2. InventoryPage.js

**Location:** `cypress/pages/InventoryPage.js`

**Responsibilities:**
- Add items to cart
- Verify cart count
- Navigate to cart

**Implementation:**

```javascript
class InventoryPage {

    cartBadge = '.shopping_cart_badge';
    addBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
    cartIcon = '.shopping_cart_link';

    addItemToCart(){
        cy.get(this.addBackpack).click();
    }

    verifyCartCount(count){
        cy.get(this.cartBadge).should('have.text', count);
    }

    goToCart(){
        cy.get(this.cartIcon).click();
    }

}

export default InventoryPage;
```

---

### 3. CartPage.js

**Location:** `cypress/pages/CartPage.js`

**Responsibilities:**
- Verify items in cart
- Proceed to checkout

**Implementation:**

```javascript
class CartPage {

    checkoutButton = '[data-test="checkout"]';

    verifyItemExists(itemName){
        cy.contains(itemName).should('exist');
    }

    proceedCheckout(){
        cy.get(this.checkoutButton).click();
    }

}

export default CartPage;
```

---

### 4. CheckoutPage.js

**Location:** `cypress/pages/CheckoutPage.js`

**Responsibilities:**
- Fill checkout information
- Complete order
- Verify order success

**Implementation:**

```javascript
class CheckoutPage {

    firstName = '[data-test="firstName"]';
    lastName = '[data-test="lastName"]';
    postalCode = '[data-test="postalCode"]';
    continueBtn = '[data-test="continue"]';
    finishBtn = '[data-test="finish"]';

    fillCheckoutInfo(first, last, postal){
        cy.get(this.firstName).type(first);
        cy.get(this.lastName).type(last);
        cy.get(this.postalCode).type(postal);
    }

    continue(){
        cy.get(this.continueBtn).click();
    }

    finish(){
        cy.get(this.finishBtn).click();
    }

    verifyOrderSuccess(){
        cy.contains('Thank you for your order!').should('be.visible');
    }

}

export default CheckoutPage;
```

---

## Custom Commands

### cypress/support/commands.js

```javascript
// Custom Cypress Commands

Cypress.Commands.add('loginStandardUser', () => {

    cy.visit('/');

    cy.task('getEnv', 'STANDARD_USER').then((username) => {
        cy.get('[data-test="username"]').type(username);
    });

    cy.task('getEnv', 'PASSWORD').then((password) => {
        cy.get('[data-test="password"]').type(password);
    });

    cy.get('[data-test="login-button"]').click();

});
```

**Usage:**

```javascript
it('Test that requires login', () => {
    cy.loginStandardUser();
    // Continue with test...
});
```

**Benefits:**
- Reusable across multiple tests
- Reduces code duplication
- Centralizes authentication logic
- Makes tests more readable

---

## Test Suites

### Test Suite 1: saucedemo.cy.js (standard_user)

**Location:** `cypress/e2e/saucedemo.cy.js`

**Purpose:** Validate core functionality with standard_user account

**Test Cases:**
1. ✅ Successful Login
2. ✅ Failed Login
3. ✅ Add item and verify cart count
4. ✅ Complete Checkout Flow
5. ✅ Logout

**Full Implementation:**

```javascript
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('SauceDemo Test Suite', () => {

    beforeEach(() => {
        loginPage.visit();
    });

    it('Successful Login', () => {
        cy.task('getEnv', 'STANDARD_USER').then((username) => {
            cy.task('getEnv', 'PASSWORD').then((password) => {
                loginPage.login(username, password);
            });
        });
        loginPage.verifyLoginSuccess();
    });

    it('Failed Login', () => {
        loginPage.login('wrong_user', 'wrong_password');
        loginPage.verifyError();
    });

    it('Add item and verify cart count', () => {
        cy.loginStandardUser();
        inventoryPage.addItemToCart();
        inventoryPage.verifyCartCount('1');
    });

    it('Complete Checkout Flow', () => {
        cy.loginStandardUser();
        inventoryPage.addItemToCart();
        inventoryPage.goToCart();
        cartPage.verifyItemExists('Sauce Labs Backpack');
        cartPage.proceedCheckout();
        checkoutPage.fillCheckoutInfo('RichGod', 'Usen', '12345');
        checkoutPage.continue();
        checkoutPage.finish();
        checkoutPage.verifyOrderSuccess();
    });

    it('Logout', () => {
        cy.loginStandardUser();
        loginPage.logout();
        cy.url().should('eq', 'https://www.saucedemo.com/');
    });

});
```

**Execution Results:**

```text
SauceDemo Test Suite
  ✓ Successful Login (18499ms)
  ✓ Failed Login (7275ms)
  ✓ Add item and verify cart count (1329ms)
  ✓ Complete Checkout Flow (3796ms)
  ✓ Logout (3721ms)

5 passing (35s)
```

**Status:** ✅ All tests passing

---

### Test Suite 2: problem-user.cy.js (problem_user)

**Location:** `cypress/e2e/problem-user.cy.js`

**Purpose:** Document known bugs with problem_user account

**Test Cases:**
1. ✅ BUG-001: Verify product images
2. ✅ BUG-002: Test Add to Cart button
3. ✅ BUG-003: Test product sorting
4. ❌ BUG-004: Complete checkout flow (FAILS - documents blocker)
5. ✅ Exploratory: Navigation and UI consistency

**Key Finding:**
- **BUG-004 fails intentionally** to document the critical checkout blocker
- Screenshot captured: `cypress/screenshots/problem-user.cy.js/...`

**Execution Results:**

```text
Problem User - Bug Documentation Tests
  ✓ BUG-001: Verify product images are displayed correctly (44164ms)
  ✓ BUG-002: Test Add to Cart button behavior (6662ms)
  ✓ BUG-003: Test product sorting functionality (3787ms)
  1) BUG-004: Complete checkout flow with problem_user
  ✓ Exploratory: Test navigation and UI consistency (1439ms)

4 passing (1m)
1 failing

1) BUG-004: Complete checkout flow with problem_user:
   AssertionError: Timed out retrying after 4000ms:
   Expected to find element: [data-test="finish"], but never found it.
```

**Status:** ⚠️ 1 expected failure documenting checkout blocker

---

## Setup and Execution

### Initial Setup

```bash
# Create project directory
mkdir saucedemo-qa-assessment
cd saucedemo-qa-assessment

# Initialize npm
npm init -y

# Install Cypress
npm install cypress --save-dev

# Open Cypress (creates folder structure)
npx cypress open
```

---

### Running Tests

#### 1. Interactive Mode (Cypress UI)

```bash
npx cypress open
```

- Select **E2E Testing**
- Choose browser (Chrome, Electron, Firefox, Edge)
- Click on test file to run

**Use Case:** Test development, debugging, visual inspection

---

#### 2. Headless Mode (CLI)

```bash
# Run all tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/saucedemo.cy.js"

# Run in specific browser
npx cypress run --browser chrome

# Run with video recording
npx cypress run --config video=true
```

**Use Case:** CI/CD integration, automated testing

---

#### 3. Using npm Scripts

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run in Chrome
npm run test:chrome

# Run standard_user tests only
npm run test:standard

# Run problem_user tests only
npm run test:problem
```

---

## Best Practices Implemented

### 1. Page Object Model (POM)
✅ Separates test logic from page structure
✅ Improves maintainability
✅ Reduces code duplication
✅ Makes tests more readable

### 2. Environment Variables
✅ Credentials stored securely
✅ Easy to update without changing code
✅ Supports multiple environments

### 3. Custom Commands
✅ Reusable login functionality
✅ Consistent across tests
✅ Reduces test complexity

### 4. Data-Driven Selectors
✅ Uses `data-test` attributes
✅ More stable than class/ID selectors
✅ Aligned with SauceDemo best practices

### 5. Descriptive Test Names
✅ Clear intent (e.g., "Complete Checkout Flow")
✅ Easy to understand failures
✅ Good documentation

### 6. Proper Assertions
✅ Verifies expected behavior
✅ Uses should() for automatic retries
✅ Meaningful error messages

---

## Debugging Tips

### 1. Use `.debug()` command

```javascript
cy.get('.selector').debug();
```

### 2. Add `.pause()` for manual inspection

```javascript
cy.get('.selector').click();
cy.pause(); // Pauses test execution
```

### 3. Check screenshots on failures

```bash
cypress/screenshots/
```

### 4. Enable video recording

```javascript
// cypress.config.js
video: true
```

### 5. Use Cypress UI for step-by-step debugging

```bash
npx cypress open
```

---

## Common Issues and Solutions

### Issue 1: Test times out

**Symptom:** `Timed out retrying after 4000ms`

**Solution:**
- Increase timeout: `cy.get('.selector', { timeout: 10000 })`
- Add explicit waits: `cy.wait(500)`
- Verify selector is correct

---

### Issue 2: Element not found

**Symptom:** `Expected to find element but never found it`

**Solution:**
- Verify element exists in DOM
- Check if element is visible
- Use correct selector
- Wait for page to load

---

### Issue 3: Flaky tests

**Symptom:** Tests pass sometimes, fail others

**Solution:**
- Add proper waits
- Use Cypress auto-retry mechanism
- Verify network requests complete
- Check for race conditions

---

## CI/CD Integration (Future Enhancement)

### GitHub Actions Example

```yaml
name: Cypress E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          browser: chrome
          headed: false
```

---

## Performance Metrics

**Full Test Suite Execution:**
- **Total Duration:** ~2 minutes
- **Tests:** 10 (5 standard_user + 5 problem_user)
- **Pass Rate:** 90% (9/10 pass, 1 expected failure)

**Individual Test Times:**
- Successful Login: 18.5s
- Failed Login: 7.3s
- Cart operations: 1.3s
- Complete Checkout: 3.8s
- Logout: 3.7s

---

## Conclusion

This Cypress implementation provides:
✅ Robust E2E test coverage
✅ Maintainable Page Object Model architecture
✅ Secure credential management
✅ Evidence-based bug documentation
✅ Ready for CI/CD integration
✅ Comprehensive test reporting

**Status:** Production-ready automation framework
