# SauceDemo QA Assessment

## Overview

This repo contains my QA assessment deliverables for testing the SauceDemo application — https://www.saucedemo.com.

What's in here:

- Manual test cases with actual execution results
- Exploratory testing notes with real observations
- Bug reports backed by evidence
- Cypress E2E automation built with the Page Object Model
- Postman API test scripts with assertions
- Supporting docs

The automation side focuses on the critical user flows and is set up to be readable and easy to extend.

---

## What I Found

**Test run summary:**
- Automated: 24 test cases — 22 passed, 1 failed, 1 skipped
- Manual UI: 3 test cases — all 3 failed and revealed real defects
- Combined: 27 tests, 22 passed — 81.48% pass rate

**The big ones:**

**BUG-006 — Checkout last name field is broken (affects every user)**
Characters typed into the Last Name field show up in the First Name field instead. Nobody can complete checkout. This was caught during manual testing.

**BUG-005 — problem_user can't finish checkout**
The finish button simply doesn't exist on the final checkout step for this account. Caught by automation.

**Other confirmed issues:**
- BUG-001: All product images show a dog picture — manually verified
- BUG-007: The remove button on the inventory page doesn't work — manually verified

**A few corrections from earlier assumptions:**
- standard_user is NOT fully functional — the checkout form is broken
- Cart functionality and sorting both work fine — previous reports of issues weren't reproducible

---

## What's Tested

1. Login — valid credentials, invalid credentials, error messages
2. Cart — adding items, badge count, multi-item handling
3. Product filtering — A-Z, Z-A, price low-high, price high-low
4. Cart page — item display, empty state
5. Checkout — full end-to-end flow, field validation, order confirmation

**Accounts used:**
- `standard_user` / `secret_sauce` — mostly functional, checkout form is broken (BUG-006)
- `problem_user` / `secret_sauce` — multiple issues, checkout is completely blocked

---

## Tech Stack

- **Cypress 15.15.0** — E2E automation
- **JavaScript (ES6+)** — test scripting
- **Page Object Model** — keeps the test code clean and maintainable
- **Postman** — API test scripts
- **Git / GitHub** — version control

---

## Prerequisites

- Node.js v18+
- npm v9+
- Git
- Postman (for the API tests)

Check your versions:

```bash
node -v
npm -v
git --version
```

---

## Project Structure

```text
saucedemo-qa-assessment/
│
├── cypress/
│   ├── e2e/
│   │   ├── saucedemo.cy.js          # Main test suite (standard_user)
│   │   └── problem-user.cy.js       # problem_user bug documentation
│   │
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   │
│   ├── screenshots/                  # Captured screenshots
│   │
│   └── support/
│       ├── commands.js               # Custom commands
│       └── e2e.js
│
├── postman/
│   └── users-api-collection.json
│
├── cypress.env.json                  # Test credentials (gitignored)
├── cypress.config.js
├── package.json
│
├── SECTION-1-TEST-CASES.md
├── SECTION-2-CYPRESS.md
├── SECTION-3-POSTMAN.md
└── README.md
```

---

## Setup

### Clone and install

```bash
git clone <repository-url>
cd saucedemo-qa-assessment
npm install
```

### Environment config

Create a `cypress.env.json` file in the project root — this file is gitignored and needs to be created manually:

```json
{
    "STANDARD_USER": "standard_user",
    "PROBLEM_USER": "problem_user",
    "PASSWORD": "secret_sauce"
}
```

Verify Cypress is installed correctly:

```bash
npx cypress verify
```

---

## Running the Tests

### Interactive mode (UI)

```bash
npx cypress open
```

Select E2E Testing, pick a browser, then click a spec file:
- `saucedemo.cy.js` — standard_user suite
- `problem-user.cy.js` — problem_user bug documentation

This is the best mode for debugging or watching tests run step by step.

### Headless mode

```bash
npx cypress run
```

Runs everything, captures screenshots on failures, prints results to terminal. Takes about 2 minutes.

### Run a specific file

```bash
npx cypress run --spec "cypress/e2e/saucedemo.cy.js"
npx cypress run --spec "cypress/e2e/problem-user.cy.js"
```

### Run in a specific browser

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## Expected Results

**saucedemo.cy.js:**

```text
SauceDemo Test Suite
  - Successful Login (18499ms)
  - Failed Login (7275ms)
  - Add item and verify cart count (1329ms)
  - Complete Checkout Flow (3796ms)
  - Logout (3721ms)

5 passing (35s)
```

**problem-user.cy.js:**

```text
Problem User - Bug Documentation Tests
  - BUG-001: Verify product images are displayed correctly (44164ms)
  - BUG-002: Test Add to Cart button behavior (6662ms)
  - BUG-003: Test product sorting functionality (3787ms)
  1) BUG-004: Complete checkout flow with problem_user
  - Exploratory: Test navigation and UI consistency (1439ms)

4 passing (1m)
1 failing
```

The BUG-004 failure is expected — it's documenting the checkout blocker.

---

## Postman Collection

### Import

1. Open Postman
2. Click Import
3. Upload `postman/users-api-collection.json`

### What's in the collection

REST API tests against a standard Users endpoint:

- GET `/users` — list all users
- GET `/users/:id` — get by ID, including invalid ID tests
- POST `/users` — create user with validation checks
- PUT `/users/:id` — update user
- DELETE `/users/:id` — delete user
- Unauthorized access handling (401 tests)

### Running the collection

For a single request: hit Send, check the Test Results tab.

For the full collection: open the collection, click Run, select all requests, and run. After it finishes you can export the results as JSON.

---

## Test Strategy

The focus was on critical end-to-end flows — login, cart management, product filtering, and checkout. I used functional testing, exploratory testing, negative testing, equivalence partitioning, and boundary value analysis to find real issues without writing redundant tests.

The high-priority flows were automated because they're the most likely regression candidates. Manual exploratory testing filled in the gaps and is actually what caught the worst bug (BUG-006).

**Automation approach:**
- Page Object Model keeps selectors and actions separate from test logic
- Environment variables keep credentials out of the codebase
- Screenshots are captured automatically on failure
- Custom commands cut down on repeated login boilerplate

---

## Known Issues

### Blockers

**BUG-006: Checkout last name field is broken**
- Severity: Blocker
- Affects all users — 100% checkout abandonment
- Typing in the Last Name field inputs into the First Name field instead — likely a bad event binding
- Manually verified
- Needs an immediate hotfix

**BUG-005: problem_user can't finish checkout**
- Severity: Blocker
- The finish button is missing from the checkout confirmation step
- Screenshot captured in `cypress/screenshots/`
- Could be intentional for this test account — needs investigation

### High severity

**BUG-001: Wrong product images**
- All products show a dog picture on the problem_user account
- Manually verified

**BUG-007: Remove button doesn't work on inventory page**
- Users can't remove items from cart while on the inventory page
- Manually verified

### Medium

**BUG-004: Inventory display inconsistency**
- Minor UI inconsistencies on the inventory page
- Needs further manual verification

### Not reproduced

- BUG-002 (cart button issues) — cart works fine in testing
- BUG-003 (sorting malfunction) — all four sorting options work correctly

---

## Observations

**standard_user:**
- Login, cart, filtering, and logout all work
- Checkout is broken (BUG-006) — this account should not be marked as fully functional
- Response times are acceptable across the suite

**problem_user:**
- Login works
- Cart adding works (contrary to what I expected)
- Sorting works correctly
- Product images are all wrong (BUG-001 confirmed)
- Remove button is broken (BUG-007 confirmed)
- Checkout is completely blocked (BUG-005)
- Checkout form is also broken (BUG-006 affects this account too)
- Still useful for validating negative test scenarios

**Coverage:**
- Happy path: well covered
- Negative testing: covered for login
- Boundary values: minimal, low-priority tests were deferred
- Edge cases: limited — rapid clicking and session management weren't tested

---

## Possible Next Steps

**Short-term:**
- Add boundary value tests for input fields (postal codes, long names)
- Add edge case tests (rapid clicking, session timeout behavior)
- Data-driven tests for multiple product scenarios

**Medium-term:**
- Set up GitHub Actions for CI/CD integration
- Add Mochawesome or a similar HTML reporter
- Look into visual regression testing (Percy or Applitools)

**Longer-term:**
- Push test coverage to 95%+ of critical paths
- Add security testing (XSS, CSRF, SQL injection basics)
- Accessibility testing against WCAG 2.1
- Mobile responsive testing
- Cross-browser matrix (Chrome, Firefox, Safari, Edge)

---

## Adding Tests

Create a new spec file in `cypress/e2e/`, import whatever page objects you need, and write tests using the standard `describe`/`it` pattern.

For new page objects, create a file in `cypress/pages/`, define selectors as class properties, write action methods, and export the class. See the existing page files for reference.

---

## Documentation

- `SECTION-1-TEST-CASES.md` — detailed test cases with actual results
- `SECTION-2-CYPRESS.md` — Cypress setup and implementation notes
- `SECTION-3-POSTMAN.md` — Postman API test scripts

---

**Assessment completed:** May 2026
**Framework:** Cypress 15.15.0 | Node.js v22.17.1
**Test environment:** https://www.saucedemo.com
