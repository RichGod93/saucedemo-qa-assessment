# Section 2 — Cypress Automation (Page Object Model)

## Overview

This section covers the Cypress E2E test automation setup using the Page Object Model pattern.

- Framework: Cypress 15.15.0
- Pattern: Page Object Model (POM)
- Language: JavaScript ES6+
- Test Files: 2 spec files (saucedemo.cy.js, problem-user.cy.js)
- Page Objects: 4 (Login, Inventory, Cart, Checkout)

---

## Project Structure

```text
cypress/
├── e2e/
│   ├── saucedemo.cy.js          # Main test suite (standard_user)
│   └── problem-user.cy.js       # problem_user bug documentation
│
├── pages/
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
│
├── screenshots/                  # Auto-captured on failures
│
└── support/
    ├── commands.js               # Custom commands
    └── e2e.js

cypress.config.js
cypress.env.json                  # Not committed — create this manually
package.json
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

`allowCypressEnv: false` prevents credentials from being exposed in the browser context. The `getEnv` task reads from `config.env` on the Node.js side instead.

---

### cypress.env.json

```json
{
    "STANDARD_USER": "standard_user",
    "PROBLEM_USER": "problem_user",
    "PASSWORD": "secret_sauce"
}
```

This file is gitignored. If you're cloning the repo, create it manually in the project root with the values above. Never hardcode credentials in the test files themselves.

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

Handles login, logout, and login validation.

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

Usage:

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

Handles adding items to cart and navigating to the cart.

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

Verifies cart contents and moves to checkout.

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

Fills the checkout form and confirms order completion.

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

This command handles login in a single call so tests don't have to repeat the same steps. It reads credentials from the Node side via `cy.task` rather than from `Cypress.env()` directly, which keeps sensitive values out of the browser context.

Usage:

```javascript
it('Test that requires login', () => {
    cy.loginStandardUser();
    // continue with test
});
```

---

## Test Suites

### Suite 1: saucedemo.cy.js (standard_user)

Validates core functionality with the standard_user account.

Tests:
1. Successful Login
2. Failed Login
3. Add item and verify cart count
4. Complete Checkout Flow
5. Logout

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

Execution results:

```text
SauceDemo Test Suite
  - Successful Login (18499ms)
  - Failed Login (7275ms)
  - Add item and verify cart count (1329ms)
  - Complete Checkout Flow (3796ms)
  - Logout (3721ms)

5 passing (35s)
```

---

### Suite 2: problem-user.cy.js (problem_user)

Documents known bugs with the problem_user account. Most tests pass — they confirm what works and what doesn't. The BUG-004 test is expected to fail — that's the point.

Tests:
1. BUG-001: Verify product images
2. BUG-002: Test Add to Cart button
3. BUG-003: Test product sorting
4. BUG-004: Complete checkout flow (fails — documents the blocker)
5. Exploratory: Navigation and UI consistency

Execution results:

```text
Problem User - Bug Documentation Tests
  - BUG-001: Verify product images are displayed correctly (44164ms)
  - BUG-002: Test Add to Cart button behavior (6662ms)
  - BUG-003: Test product sorting functionality (3787ms)
  1) BUG-004: Complete checkout flow with problem_user
  - Exploratory: Test navigation and UI consistency (1439ms)

4 passing (1m)
1 failing

1) BUG-004: Complete checkout flow with problem_user:
   AssertionError: Timed out retrying after 4000ms:
   Expected to find element: [data-test="finish"], but never found it.
```

---

## Running the Tests

### Interactive mode

```bash
npx cypress open
```

Select E2E Testing, pick a browser, click on a spec file. Best for debugging or watching individual tests run.

### Headless mode

```bash
# Run everything
npx cypress run

# Run a specific file
npx cypress run --spec "cypress/e2e/saucedemo.cy.js"

# Run in a specific browser
npx cypress run --browser chrome

# With video recording
npx cypress run --config video=true
```

### Using npm scripts

```bash
npm test                   # Run all tests headless
npm run test:ui            # Open Cypress UI
npm run test:chrome        # Run in Chrome
npm run test:standard      # standard_user tests only
npm run test:problem       # problem_user tests only
```

---

## Design Decisions

**Page Object Model** — selectors and actions live in the page class, not in the test. If a selector changes, you update it in one place. Tests stay readable and focused on what they're testing, not on how to find elements.

**data-test attributes** — more stable than class or ID selectors. SauceDemo exposes these attributes and using them means UI restyling won't break the tests.

**Custom commands** — the login sequence gets used in multiple tests. Centralizing it in `loginStandardUser` means it's consistent and if it ever needs to change, it changes in one place.

**cy.task for credentials** — reading credentials through a Node task keeps them out of the browser context. `allowCypressEnv: false` enforces this at the config level.

---

## Debugging

If a test is failing and you need to investigate:

```javascript
// Pause execution at a specific point
cy.get('.selector').click();
cy.pause();

// Log element details
cy.get('.selector').debug();
```

Run with the Cypress UI for the best debugging experience — you can step through commands, inspect the DOM at each point, and see exactly what state the app was in when something failed.

Screenshots are captured automatically on failure in `cypress/screenshots/`.

---

## Common Issues

**Test times out (`Timed out retrying after 4000ms`)**
- Increase the timeout: `cy.get('.selector', { timeout: 10000 })`
- Verify the selector is correct in the current DOM state
- Check if the element is hidden or behind another element

**Element not found**
- Confirm the element exists in the DOM at the point the test is looking for it
- Check if the page finished loading before the selector ran
- Verify the selector in the browser DevTools first

**Flaky tests (passes sometimes, fails other times)**
- Look for race conditions — something might not be loaded when the next command runs
- Cypress automatically retries assertions, but not all commands. Use `cy.should()` where possible to trigger retries.

---

## CI/CD (Future)

GitHub Actions example:

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

## Execution Times

- Full suite: approximately 2 minutes
- Successful Login: 18.5s
- Failed Login: 7.3s
- Cart operations: 1.3s
- Complete Checkout: 3.8s
- Logout: 3.7s
