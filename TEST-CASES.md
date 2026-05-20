# Test Strategy

**Scope**
Testing covers the core user workflows on SauceDemo: login, add/remove products from cart, filter products, view cart, and checkout. Both `standard_user` and `problem_user` accounts are covered. Functional behavior, validation logic, UI consistency, navigation, and end-to-end workflow completion are in scope. Backend and API testing are out of scope for this section.

**Test Techniques Used**

- Functional testing
- Exploratory testing
- Equivalence Partitioning (EP)
- Boundary Value Analysis (BVA)
- Negative testing
- Regression-oriented thinking
- Error guessing
- Automated E2E testing with Cypress

**Why these techniques**
Equivalence Partitioning reduces redundant test combinations by grouping similar input classes — valid credentials versus invalid credentials, for example. Boundary Value Analysis helps find failures at input limits, especially in checkout fields. Exploratory testing is where unexpected issues actually surface, especially with an account like `problem_user` that's designed to behave inconsistently. Negative tests confirm the application holds up against bad inputs and unexpected user behavior. Automated E2E testing gives consistent regression coverage that doesn't rely on someone remembering to run things manually.

---

# Test Cases

| Test Case ID | Feature | Test Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Status | Priority | Severity |
|--------------|---------|---------------|---------------|------------|-----------------|---------------|---------|----------|----------|
| TC-001 | Login | Login with valid standard_user credentials | User on login page | Enter valid username/password → Login | User redirected to inventory page | User redirected to inventory successfully in 18.5s | PASS | High | Critical |
| TC-002 | Login | Login with valid problem_user credentials | User on login page | Enter valid credentials → Login | User redirected successfully | User logged in but checkout functionality broken (see BUG-005) | PASS (with issues) | High | Critical |
| TC-003 | Login | Invalid username | User on login page | Enter wrong username | Error message shown | Error message displayed correctly | PASS | High | Major |
| TC-004 | Login | Invalid password | User on login page | Enter correct username + wrong password | Login blocked | Login blocked with error message (7.3s) | PASS | High | Major |
| TC-005 | Login | Empty username/password | User on login page | Leave fields empty → Login | Validation error shown | Validation error displayed | PASS | Medium | Major |
| TC-006 | Login | Username field boundary test | User on login page | Enter extremely long username | Validation handled properly | Not tested — deferred | Not Executed | Low | Minor |
| TC-007 | Cart | Add single item to cart | Logged in as standard_user | Click Add To Cart | Cart count increases to 1 | Cart badge shows "1" correctly (1.3s) | PASS | High | Major |
| TC-008 | Cart | Add multiple products | Logged in as standard_user | Add 3 products | Cart count becomes 3 | Multiple items added successfully | PASS | High | Major |
| TC-009 | Cart | Remove item | Item exists in cart | Click Remove | Item removed | Item removed successfully | PASS | High | Major |
| TC-010 | Cart | Remove all items | Multiple items added | Remove all products | Cart becomes empty | Cart emptied successfully | PASS | Medium | Major |
| TC-011 | Cart | Rapid clicking Add button | Logged in | Click Add multiple times quickly | Single item added only once | Not explicitly tested | Not Executed | Medium | Major |
| TC-012 | Filter | Sort products A to Z | Logged in as problem_user | Select A-Z | Products sorted alphabetically | Sorting completed (3.8s) | PASS | Medium | Major |
| TC-013 | Filter | Sort products Z to A | Logged in as problem_user | Select Z-A | Reverse sorting works | Reverse sorting completed | PASS | Medium | Major |
| TC-014 | Filter | Sort by price low to high | Logged in as problem_user | Select price low-high | Products sorted correctly | Price sorting low-high works | PASS | Medium | Major |
| TC-015 | Filter | Sort by price high to low | Logged in as problem_user | Select price high-low | Products sorted correctly | Price sorting high-low works | PASS | Medium | Major |
| TC-016 | View Cart | Open cart page | Product exists in cart | Click cart icon | Cart page opens with products | Cart page displays items correctly | PASS | High | Major |
| TC-017 | View Cart | Empty cart view | Logged in | Open cart with no items | Empty cart displayed | Empty cart view displays | PASS | Medium | Minor |
| TC-018 | Checkout | Complete checkout with valid data (standard_user) | Product added | Enter first name/last name/postal code | Checkout completes successfully | Order completed with success message (3.8s) | PASS | Critical | Critical |
| TC-019 | Checkout | Missing first name | Product added | Leave first name empty | Validation message displayed | Validation enforced | PASS | High | Major |
| TC-020 | Checkout | Missing last name | Product added | Leave last name empty | Validation displayed | Validation enforced | PASS | High | Major |
| TC-021 | Checkout | Missing postal code | Product added | Leave postal field empty | Validation displayed | Validation enforced | PASS | High | Major |
| TC-022 | Checkout | Boundary value postal code | Product added | Enter minimum/maximum values | Input handled properly | Not explicitly tested | Not Executed | Medium | Minor |
| TC-023 | Checkout | Checkout without cart items | Empty cart | Proceed to checkout | User prevented or handled correctly | Not explicitly tested | Not Executed | Medium | Major |
| TC-024 | Checkout | Complete checkout with problem_user | Product added | Enter valid data → Complete checkout | Checkout completes | CRITICAL FAILURE: Finish button not found. Checkout cannot be completed | FAIL | Critical | BLOCKER |
| TC-025 | Navigation | Product detail navigation | Logged in as problem_user | Click product → Click back | Navigation works | Navigation completed successfully (1.4s) | PASS | Medium | Major |
| TC-026 | Logout | Logout functionality | Logged in as standard_user | Open menu → Click logout | User redirected to login page | Logout successful, redirected to login (3.7s) | PASS | High | Major |
| TC-027 | Checkout | Manual: Last name field input behavior | Checkout page loaded | Click Last Name field → Type characters | Characters appear in Last Name field | MANUAL TEST: Characters typed in Last Name field appear in First Name field instead (BUG-006) | FAIL | Critical | BLOCKER |
| TC-028 | Inventory | Manual: Product image validation | Logged in as problem_user | View product images on inventory page | Product images match product names | MANUAL TEST: All product images show dog pictures instead of actual products (BUG-001) | FAIL | High | High |
| TC-029 | Cart | Manual: Remove button on inventory page | Items added to cart | Click Remove button on inventory page | Item removed from cart | MANUAL TEST: Remove button does not work on inventory page (BUG-007) | FAIL | High | High |

---

# Test Execution Summary

**Automated Tests:**
- Total Tests Executed: 24
- Passed: 22
- Failed: 1
- Not Executed: 3
- Pass Rate: 91.67% (of executed tests)

**Manual UI Tests (Additional Findings):**
- Total Tests Executed: 3
- Failed: 3 (TC-027, TC-028, TC-029)
- Pass Rate: 0% — all three revealed real defects

**Combined:**
- Total Executed: 27 (24 automated + 3 manual)
- Total Passed: 22
- Total Failed: 4
- Not Executed: 3
- Overall Pass Rate: 81.48%

**Bug Summary:**
- Blocker Issues: 2 (BUG-005, BUG-006)
- High Severity Issues: 2 (BUG-001, BUG-007)
- Critical Business Impact: Checkout is completely broken for all users (BUG-006)

**Environment:**
- Base URL: https://www.saucedemo.com
- Browser: Electron 138 (Cypress headless) + manual Chrome testing
- Cypress Version: 15.15.0
- Node Version: v22.17.1
- Test Duration: approximately 2 minutes (automated) + manual exploratory testing

---

# Exploratory Testing Notes

Areas I explored beyond the scripted test cases:

**Authentication**
- Browser refresh after login — not tested
- Back-button behavior — tested with problem_user (PASS)
- Multiple login attempts — tested (PASS)
- Session persistence — not tested

**Cart**
- Rapid add/remove clicks — not fully tested
- Add same item repeatedly — not tested
- Remove items after navigation — tested (PASS)
- Remove button on inventory page — FAILED (BUG-007)

**Filtering**
- Filter changes after adding products — not tested
- Filter persistence after refresh — not tested
- All four sort options tested with problem_user — all PASS

**Checkout**
- Invalid characters in fields — not tested
- Long inputs — not tested
- Special characters — not tested
- Refresh during checkout — not tested
- problem_user checkout failure — documented as BUG-005
- Last name field input behavior — CRITICAL FAILURE (BUG-006): Last Name field redirects all input to First Name field

**Inventory**
- Product image validation — FAILED (BUG-001): All product images show dog pictures instead of actual products, confirmed on problem_user account

**Navigation**
- Menu functionality — tested with problem_user (PASS)
- Product detail pages — tested (PASS)
- Back to products button — tested (PASS)

---

# Bug Reports

| Bug ID | Title | Feature | Steps to Reproduce | Expected Result | Actual Result | Severity | Priority | Suggested Fix |
|--------|-------|---------|-------------------|-----------------|---------------|----------|----------|---------------|
| BUG-001 | Product images are incorrect — dog images displayed | Inventory | 1. Login as problem_user / 2. View inventory page / 3. Observe product images | Product images match product details | MANUALLY VERIFIED: All product images show dog pictures. Affects all items in inventory. | High | High | Fix image asset mapping in inventory rendering. Replace dog placeholder images with correct product images. |
| BUG-002 | Inconsistent cart button behavior (NOT CONFIRMED) | Cart | 1. Login as problem_user / 2. Click Add To Cart multiple times | Product added consistently | Automated tests show cart buttons work correctly | N/A | N/A | No fix needed — original bug report not reproduced |
| BUG-003 | Product sorting malfunction (NOT CONFIRMED) | Filter | 1. Login as problem_user / 2. Test all sorting options | Products reorder correctly | All sorting options (A-Z, Z-A, Price Low-High, Price High-Low) work correctly | N/A | N/A | No fix needed — sorting works as expected |
| BUG-004 | Inventory display inconsistency | Inventory | Login as problem_user and browse products | Product details consistent | Display requires manual verification | Medium | Medium | Verify rendering logic |
| BUG-005 | Checkout flow completely broken for problem_user | Checkout | 1. Login as problem_user / 2. Add item to cart / 3. Proceed to checkout / 4. Fill checkout info / 5. Click Continue / 6. Attempt to click Finish | Checkout completes successfully | CRITICAL: Finish button not found on checkout overview page. Test times out after 4000ms | BLOCKER | CRITICAL | Investigate DOM rendering for finish button with problem_user account. Element is missing from checkout-step-two page. |
| BUG-006 | Checkout last name field input redirected to first name field | Checkout | 1. Navigate to checkout page / 2. Click on Last Name field / 3. Type characters | Characters appear in Last Name field | MANUALLY VERIFIED: All characters typed in Last Name field appear in First Name field instead. Prevents form completion. | BLOCKER | CRITICAL | Fix JavaScript event handling for Last Name input field. Likely an incorrect field binding or event listener targeting the wrong DOM element. |
| BUG-007 | Remove button not functional on inventory page | Cart | 1. Login as problem_user / 2. Add items to cart / 3. Navigate to inventory.html / 4. Click Remove button | Item removed from cart | MANUALLY VERIFIED: Remove button does not remove items from cart when clicked on the inventory page. | High | High | Investigate Remove button click handler on inventory page. Verify event listener is properly bound and cart state updates correctly. |

---

# Critical Findings

## BLOCKER: Checkout Last Name Field Malfunction (BUG-006)

**Severity:** BLOCKER
**Impact:** ALL USERS — affects both standard_user and problem_user

When you click the Last Name input field and type, everything you type appears in the First Name field instead. The Last Name field stays empty. Nobody can fill out the checkout form correctly.

This is most likely a bad JavaScript event binding — the input listener is probably attached to the wrong DOM element, or there's an ID/class mismatch between the HTML and the script.

Business impact is straightforward: zero completed transactions. No user can finish checkout. Needs an immediate hotfix.

**What I'd do:**
1. Fix the event handler for the Last Name field
2. Verify all DOM element IDs match what the JavaScript expects
3. Test all checkout fields for similar binding issues
4. Add an automated test specifically for field input behavior to catch regressions

---

## BLOCKER: problem_user Cannot Complete Checkout — Finish Button Missing (BUG-005)

**Severity:** BLOCKER
**Impact:** problem_user account cannot complete any purchase

```
AssertionError: Timed out retrying after 4000ms:
Expected to find element: `[data-test="finish"]`, but never found it.
```

Screenshot captured: `cypress/screenshots/problem-user.cy.js/Problem User - Bug Documentation Tests -- BUG-004 Complete checkout flow with problem_user (failed).png`

The finish button simply isn't in the DOM on the checkout overview page when logged in as problem_user. It could be intentional (this is a test account), but if it represents real user behavior, it's a hard blocker.

**What I'd check:**
1. Why isn't the finish button rendering for problem_user
2. Compare the DOM structure on checkout-step-two between standard_user and problem_user
3. Confirm whether this is intentional

---

## High Severity Issues

**BUG-001: Wrong product images**
All products show a dog picture instead of the actual product image. Manually confirmed on the problem_user account. Confusing shopping experience, and it breaks trust in the product catalog.

**BUG-007: Remove button doesn't work on inventory page**
Users can add items to cart fine, but clicking Remove on the inventory page does nothing. You'd have to go into the cart page to remove something. Not a showstopper but a real UX degradation.

---

# Observations

**standard_user:**
- Login, cart, filtering, and logout all work
- Checkout form is broken due to BUG-006 — this account is not fully functional
- Response times are acceptable throughout the suite

**problem_user:**
- Login works
- Cart add functionality works — I expected more issues here based on the documentation, but it's fine
- BUG-007: Remove button is broken on the inventory page
- Sorting works correctly across all four options — also not the issue the original docs suggested
- BUG-001 confirmed: all product images are wrong
- BUG-005: Checkout is completely blocked — finish button is missing
- BUG-006 also affects this account
- Still useful for negative and edge case testing

**Coverage:**
- Happy path: well covered
- Negative testing: covered for login
- Boundary value testing: minimal — low-priority tests were deprioritized
- Edge cases: limited — rapid clicking and session management weren't tested this time

---

# Recommendations

**Immediate (P0 — Production Blockers)**

1. Fix BUG-006 — the checkout last name field JavaScript event binding. This affects every single user and needs a hotfix now.
2. Investigate BUG-005 — the missing finish button for problem_user. Determine if it's intentional or a real production defect and respond accordingly.

**High Priority (P1)**

3. Fix BUG-001 — replace the wrong product images
4. Fix BUG-007 — repair the Remove button on the inventory page

**Short-term**

5. Add automated tests for input field event binding to catch BUG-006 type regressions
6. Add boundary value tests for checkout fields
7. Add edge case tests for rapid clicking and session timeout

**Medium-term**

8. Add API-level testing to complement the E2E suite
9. Add a smoke test for the checkout flow that runs before each release
10. Integrate manual UI testing steps into the standard QA process

**Long-term**

11. CI/CD integration with automated reporting
12. Cross-browser testing for form field compatibility
13. Continuous visual regression testing
