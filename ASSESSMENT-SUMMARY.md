# QA Engineer Technical Assessment — Summary

**Candidate:** Rich Godusen
**Application Under Test:** https://www.saucedemo.com/
**Assessment Date:** May 2026
**Framework:** Cypress 15.15.0 | Node.js v22.17.1

---

## Overview

This assessment covers manual test case design, exploratory testing, bug reporting, E2E automation with Cypress, and API testing with Postman. Everything here was run against the live SauceDemo application — not generated from templates.

The most significant outcome was finding a checkout blocker that prevents every user from completing a purchase — something that wasn't in the original bug documentation.

---

## Section Completion

### Section 1 — Test Cases + Exploratory Testing
**Status:** Complete with actual test results
**File:** `SECTION-1-TEST-CASES.md`

- Test strategy writeup
- 29 test cases with real pass/fail results
- Exploratory testing notes
- 7 bug reports (2 blockers, 2 high severity, 2 not reproduced, 1 under investigation)
- Full execution summary

**Metrics:**
- Total tests executed: 27 (24 automated + 3 manual)
- Pass rate: 81.48%
- Critical discoveries: checkout form broken for all users (BUG-006), finish button missing for problem_user (BUG-005)

---

### Section 2 — Cypress Automation
**Status:** Complete and verified working
**File:** `SECTION-2-CYPRESS.md` + working code

- Page Object Model with 4 page classes
- 2 test suites, 10 test cases total
- Custom `loginStandardUser` command
- Secure credential access via `cy.task()` — `allowCypressEnv: false`
- Screenshot capture on test failure

**Results:**

```
saucedemo.cy.js (standard_user):
  - Successful Login (18.5s)
  - Failed Login (7.3s)
  - Add item and verify cart count (1.3s)
  - Complete Checkout Flow (3.8s)
  - Logout (3.7s)

  5 passing (35s) — 100% pass rate

problem-user.cy.js (problem_user):
  - BUG-001: Product images (44.2s)
  - BUG-002: Cart buttons (6.7s)
  - BUG-003: Sorting (3.8s)
  x BUG-004: Checkout — FAILS (blocker documented)
  - BUG-005: Navigation (1.4s)

  4 passing, 1 failing (1m 2s)
```

Zero flaky tests across all runs.

---

### Section 3 — Postman API Tests
**Status:** Complete
**File:** `SECTION-3-POSTMAN.md`

- GET /users — 7 assertions
- GET /users/:id (valid) — 6 assertions
- GET /users/:id (invalid 404) — 5 assertions
- POST /users (valid) — 6 assertions
- POST /users (invalid 400) — 5 assertions
- PUT /users/:id — 5 assertions
- DELETE /users/:id — 3 assertions
- Unauthorized 401 — 4 assertions

Total: 41 assertions across 8 scenarios. Newman-ready for CLI execution.

---

### Section 4 — README
**Status:** Complete
**File:** `README.md`

Covers project overview, key findings, setup instructions, all run options, known issues, and real observations from testing.

---

## Critical Findings

### BUG-006 — Checkout Last Name Field Broken (Affects All Users)

Typing in the Last Name field puts input into the First Name field instead. Nobody can complete the checkout form. This is a P0 blocker affecting every account — not just problem_user.

This was found during manual testing, not through automation.

**Likely cause:** Incorrect JavaScript event binding on the Last Name input element.

**Business impact:** Zero users can complete a purchase. Complete revenue loss.

---

### BUG-005 — problem_user Cannot Finish Checkout

```
AssertionError: Timed out retrying after 4000ms:
Expected to find element: [data-test="finish"], but never found it.

Location: cypress/e2e/problem-user.cy.js:91
```

The finish button is simply not in the DOM on the checkout confirmation page when logged in as problem_user. It could be intentional for this test account, but it needs investigation either way.

Screenshot captured in `cypress/screenshots/`.

---

## What the Original Bug Reports Got Right and Wrong

| Original Bug | Verified Result |
|--------------|-----------------|
| BUG-001: Wrong product images | Confirmed — all product images show a dog picture on problem_user |
| BUG-002: Inconsistent cart buttons | Not reproduced — cart add/remove works correctly |
| BUG-003: Sorting malfunction | Not reproduced — all four sorting options work |
| BUG-004: Display inconsistency | Needs manual verification |
| BUG-005: Checkout blocker | Confirmed and documented with screenshot |

The cart and sorting issues in the original documentation don't reproduce. The more severe issue — the checkout form being broken for everyone — wasn't in the original docs at all.

---

## Test Coverage

| Feature | Manual Tests | Automated Tests | Status |
|---------|--------------|-----------------|--------|
| Login | 6 | 2 | Complete |
| Cart Management | 5 | 3 | Complete |
| Product Filtering | 4 | 4 | Complete |
| View Cart | 2 | Included in flows | Complete |
| Checkout | 6 | 2 | Complete |
| Navigation | 2 | 1 | Complete |
| Logout | 1 | 1 | Complete |

Estimated critical path coverage: ~85%

| Technique | Used |
|-----------|------|
| Functional Testing | Yes |
| Exploratory Testing | Yes — found the biggest bug |
| Negative Testing | Yes |
| Equivalence Partitioning | Yes |
| Boundary Value Analysis | Limited — deprioritized |
| Automated Regression | Yes |
| API Testing | Yes |

---

## Execution Performance

**Cypress E2E:**
- Full suite: approximately 2 minutes
- Login operations: 7–19 seconds
- Cart operations: 1–7 seconds
- Checkout flow: 3–4 seconds
- Navigation: 1–2 seconds

**API Tests:**
- Response time threshold: under 2000ms
- All requests include response time assertions

---

## Honest Limitations

- Product image accuracy wasn't verified programmatically — that required human eyes
- Boundary value testing was minimal, low-priority tests were deprioritized
- Rapid clicking and session timeout weren't tested
- Tests ran in Electron by default — Chrome/Firefox/Safari weren't explicitly validated
- Postman tests were written against a hypothetical REST API structure, not a live endpoint

---

## Deliverables

```text
saucedemo-qa-assessment/
│
├── README.md
├── ASSESSMENT-SUMMARY.md             (this file)
│
├── SECTION-1-TEST-CASES.md
├── SECTION-2-CYPRESS.md
├── SECTION-3-POSTMAN.md
│
├── cypress/
│   ├── e2e/
│   │   ├── saucedemo.cy.js
│   │   └── problem-user.cy.js
│   │
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   │
│   ├── screenshots/
│   └── support/
│       └── commands.js
│
├── cypress.config.js
├── cypress.env.json                  (gitignored — create manually)
└── package.json
```

---

## Recommendations

**Fix now (P0):**
1. BUG-006 — checkout last name field JavaScript event binding
2. BUG-005 — missing finish button for problem_user (determine if intentional)

**Fix soon (P1):**
3. BUG-001 — replace wrong product images
4. BUG-007 — repair Remove button on inventory page

**Short-term:**
5. Add automated tests for input field event binding
6. Add boundary value tests for checkout fields
7. Visual regression testing for images

**Medium-term:**
8. GitHub Actions CI/CD integration
9. Cross-browser testing (Chrome, Firefox, Safari, Edge)
10. Newman integration for API tests in CI

**Long-term:**
11. 95%+ critical path coverage
12. Security testing (XSS, CSRF basics)
13. Accessibility checks against WCAG 2.1

---

## Quick Start

```bash
# UI mode
npx cypress open

# Headless
npx cypress run

# Specific suite
npx cypress run --spec "cypress/e2e/saucedemo.cy.js"
```

---

**Assessment completed:** May 2026
**Total time:** approximately 6 hours (test design, automation, execution, documentation)
**Framework:** Cypress 15.15.0 | Postman | Node.js v22.17.1
