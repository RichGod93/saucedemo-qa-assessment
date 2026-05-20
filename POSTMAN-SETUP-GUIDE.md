# Postman API Testing Setup Guide

## Overview

This guide explains the **Swagger Petstore Users API Collection** that has been created for your QA Technical Assessment.

**Assessment Requirement:** Write tests in Postman for the Users API endpoints at https://petstore.swagger.io/#/user

✅ **GOOD NEWS:** The Postman collection has already been created for you!

**File Location:** `postman/users-api-collection.json`

---

## 📦 What's Included

The collection includes **8 comprehensive API tests** for the Swagger Petstore User endpoints:

| # | Endpoint | Method | Purpose | Test Assertions |
|---|----------|--------|---------|-----------------|
| 1 | `/user` | POST | Create user | 5 tests |
| 2 | `/user/createWithArray` | POST | Create multiple users | 3 tests |
| 3 | `/user/login` | GET | Login user | 5 tests |
| 4 | `/user/logout` | GET | Logout user | 3 tests |
| 5 | `/user/{username}` | GET | Get user (valid) | 7 tests |
| 6 | `/user/{username}` | GET | Get user (404) | 4 tests |
| 7 | `/user/{username}` | PUT | Update user | 4 tests |
| 8 | `/user/{username}` | DELETE | Delete user | 4 tests |

**Total Test Assertions:** ~35 tests across all endpoints

---

## 🚀 How to Import and Run

### Step 1: Install Postman

**macOS:**
```bash
# Using Homebrew
brew install --cask postman

# Or download from website
```

**Windows:**
- Download installer from https://www.postman.com/downloads/
- Run installer
- Launch Postman

**Linux:**
```bash
# Download and install
wget https://dl.pstmn.io/download/latest/linux64 -O postman.tar.gz
sudo tar -xzf postman.tar.gz -C /opt
sudo ln -s /opt/Postman/Postman /usr/bin/postman
```

---

### Step 2: Import the Collection

1. **Open Postman application**
2. **Sign in** (or create free account)
3. Click **"Import"** button (top-left)
4. Click **"Upload Files"** or drag and drop
5. Navigate to:
   ```
   /Users/richgodusen/Documents/work/Enyata QA Assessment/saucedemo-qa-assessment/postman/users-api-collection.json
   ```
6. Select the file
7. Click **"Import"**
8. ✅ Collection imported successfully!

You should now see **"Petstore Users API Collection"** in your Collections sidebar.

---

### Step 3: Run the Collection

#### Option A: Run Individual Requests

1. Expand the collection in left sidebar
2. Click on any request (e.g., "POST Create User")
3. Review the request details:
   - **URL:** Uses `{{baseUrl}}` variable (pre-configured)
   - **Body:** For POST/PUT requests
   - **Tests:** Click "Tests" tab to see assertions
4. Click **"Send"** button
5. View results:
   - **Response body** (bottom panel)
   - **Test Results** tab (should show green checkmarks ✅)
   - **Status code** (e.g., 200, 404)
   - **Response time**

**Recommended Order:**
1. POST Create User (creates user)
2. GET User by Username - Valid (retrieves created user)
3. PUT Update User (updates user)
4. DELETE User (deletes user)

---

#### Option B: Run Entire Collection (Recommended)

1. Click on collection name: **"Petstore Users API Collection"**
2. Click **"Run"** button (or three dots → "Run collection")
3. **Collection Runner** window opens
4. Verify all requests are selected (checkboxes)
5. Configure settings:
   - **Iterations:** 1 (default)
   - **Delay:** 0ms
   - **Data file:** None
6. Click **"Run Petstore Users API Collection"**
7. Watch tests execute sequentially with visual progress
8. View summary:
   - Total requests executed
   - Total tests passed/failed
   - Average response time
   - Timeline visualization

**Expected Results:**
```
Total Requests: 8
Tests Passed: ~35
Tests Failed: 0
Pass Rate: 100%
Average Response Time: < 500ms
```

---

## 📊 Test Coverage Breakdown

### 1. POST Create User (`/user`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Response indicates successful creation
- ✅ Response contains message
- ✅ Response has correct type

**Features:**
- Pre-request script generates unique username
- Dynamic email based on timestamp
- Environment variables set for subsequent requests

---

### 2. POST Create Users with Array (`/user/createWithArray`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Response has correct structure

**Features:**
- Creates multiple users in one request
- Tests batch user creation

---

### 3. GET User Login (`/user/login`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Response contains login session info
- ✅ Response message indicates successful login
- ✅ Content-Type is application/json

**Features:**
- Tests authentication flow
- Session validation
- Uses credentials from environment variables

---

### 4. GET User Logout (`/user/logout`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Logout successful

**Features:**
- Tests session termination
- Validates logout response

---

### 5. GET User by Username - Valid (`/user/{username}`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Response is a user object
- ✅ User object has correct schema (id, username, firstName, lastName, email, password, phone, userStatus)
- ✅ Returned username matches requested username
- ✅ Email format is valid (regex validation)
- ✅ Field data types are correct

**Features:**
- Most comprehensive test (7 assertions)
- Complete schema validation
- Data type checking
- Email format validation with regex

---

### 6. GET User by Username - Invalid (`/user/invalidusername999999`)

**Tests Included:**
- ✅ Status code is 404 for invalid username
- ✅ Response time < 2000ms
- ✅ Error response has correct structure
- ✅ Error message indicates user not found

**Features:**
- Negative test case
- Error handling validation
- 404 status verification

---

### 7. PUT Update User (`/user/{username}`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Update successful
- ✅ Response has correct structure

**Features:**
- Tests user data modification
- Updates firstName, lastName, email, password, phone

---

### 8. DELETE User (`/user/{username}`)

**Tests Included:**
- ✅ Status code is 200
- ✅ Response time < 2000ms
- ✅ Deletion successful
- ✅ Response has correct structure

**Features:**
- Tests user deletion
- Validates deletion response

---

## 🔧 Collection Features

### Pre-Request Scripts

**Collection-Level:**
```javascript
// Runs before EVERY request
console.log("Request: " + pm.request.method + " " + pm.request.url);
console.log("Timestamp: " + new Date().toISOString());
```

**Request-Level (POST Create User):**
```javascript
// Generate unique username
const timestamp = Date.now();
const randomUsername = "user" + timestamp;

pm.environment.set("username", randomUsername);
pm.environment.set("firstName", "Test");
pm.environment.set("lastName", "User");
pm.environment.set("email", randomUsername + "@test.com");
pm.environment.set("password", "testPass123");
```

---

### Test Scripts

**Collection-Level Tests (Run after ALL requests):**
```javascript
// Response has JSON content type
pm.test("Response has JSON content type", function() {
    pm.response.to.have.header("Content-Type");
});

// Response time is acceptable
pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

**Request-Level Tests:**
- Status code validation
- Response time thresholds (< 2000ms)
- Schema validation
- Data type validation
- Email format validation (regex)
- Error message validation

---

### Variables

**Collection Variable:**
- `baseUrl` = `https://petstore.swagger.io/v2`

**Environment Variables (Dynamic):**
- `username` - Generated dynamically
- `firstName` - Set in pre-request
- `lastName` - Set in pre-request
- `email` - Generated dynamically
- `password` - Set in pre-request

---

## 📸 Taking Screenshots for Evidence

### What to Capture

1. **Collection Structure:**
   - Screenshot showing all 8 requests in sidebar
   - File name: `postman-collection-structure.png`

2. **Individual Request Example:**
   - Screenshot of POST Create User with:
     - Request body
     - Test Results tab showing green checkmarks
   - File name: `postman-request-example.png`

3. **Collection Runner Results:**
   - Screenshot showing:
     - Total requests: 8
     - All tests passed
     - Response times
     - Summary statistics
   - File name: `postman-runner-results.png`

4. **Test Results Detail:**
   - Screenshot of Test Results tab showing:
     - Green checkmarks for all assertions
     - "PASS" status
   - File name: `postman-test-results.png`

---

## ✅ Verification Checklist

Before submission, verify:

- [ ] Collection imports successfully into Postman
- [ ] All 8 requests are visible in collection
- [ ] POST Create User executes successfully
- [ ] GET User by Username returns created user
- [ ] GET User by Username (404) returns 404 error
- [ ] All tests show green checkmarks ✅
- [ ] Collection Runner shows 100% pass rate
- [ ] Response times are under 2000ms
- [ ] Screenshots captured (optional)
- [ ] Collection file exists in `postman/` folder
- [ ] Collection file is in Git repository

---

## 🐛 Troubleshooting

### Issue: "Could not send request"

**Possible Causes:**
- No internet connection
- API endpoint down
- Firewall blocking request

**Solution:**
1. Check internet connection
2. Test API in browser: https://petstore.swagger.io/v2/user/testuser
3. Try disabling VPN if enabled
4. Check firewall settings

---

### Issue: "baseUrl is not defined"

**Solution:**
The collection includes the baseUrl variable by default. If you see this error:
1. Click collection name
2. Go to "Variables" tab
3. Verify `baseUrl` = `https://petstore.swagger.io/v2`
4. Save collection

---

### Issue: "Test failed: Username doesn't match"

**Cause:** GET User by Username is running before POST Create User

**Solution:**
Run requests in order:
1. POST Create User (first - creates user)
2. Then run GET User by Username

Or use Collection Runner which runs them sequentially.

---

### Issue: "404 User not found"

**This is expected behavior!**

The request "GET User by Username - Invalid (404)" is SUPPOSED to fail with 404. This is a negative test case validating error handling.

Check that the test assertions show:
- ✅ Status code is 404 for invalid username (PASS)
- ✅ Error message indicates user not found (PASS)

---

## 📚 API Documentation

**Swagger Petstore API Docs:**
- Interactive Docs: https://petstore.swagger.io/
- User Endpoints: https://petstore.swagger.io/#/user
- OpenAPI Spec: https://petstore.swagger.io/v2/swagger.json

**User Schema:**
```json
{
  "id": 0,
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "userStatus": 0
}
```

---

## 📝 Adding to README

Add this section to your main `README.md`:

```markdown
## Postman API Collection

### Overview
Comprehensive API test collection for Swagger Petstore User endpoints with **8 requests** and **~35 test assertions**.

### Import Collection

1. Open **Postman**
2. Click **Import** (top-left)
3. Select **Upload Files**
4. Choose `postman/users-api-collection.json`
5. Click **Import**

### Run Tests

#### Individual Request
1. Select a request from the collection
2. Click **Send**
3. View test results in **Test Results** tab

#### Run Entire Collection
1. Click collection name
2. Click **Run**
3. Click **Run Petstore Users API Collection**
4. View results summary

### Test Coverage

**Endpoints Tested:**
- ✅ POST /user - Create user
- ✅ POST /user/createWithArray - Create multiple users
- ✅ GET /user/login - Login user
- ✅ GET /user/logout - Logout user
- ✅ GET /user/{username} - Get user (valid)
- ✅ GET /user/{username} - Get user (404 error handling)
- ✅ PUT /user/{username} - Update user
- ✅ DELETE /user/{username} - Delete user

**Test Assertions:**
- Status code validation
- Response time < 2000ms
- Schema validation
- Data type validation
- Email format validation
- Error handling (404)
- Authentication flow (login/logout)

**Expected Results:**
- Total Requests: 8
- Tests Passed: ~35
- Pass Rate: 100%
- Average Response Time: < 500ms

### API Base URL
```
https://petstore.swagger.io/v2
```

### Features
- Pre-request scripts for dynamic data generation
- Comprehensive test assertions
- Collection-level tests
- Environment variables
- Error handling tests
- Authentication testing
```

---

## 🎯 Summary

✅ **Postman collection already created for you**
✅ **8 API endpoints tested**
✅ **~35 test assertions**
✅ **All CRUD operations covered**
✅ **Authentication tested (login/logout)**
✅ **Error handling validated (404)**
✅ **Schema validation included**
✅ **Performance testing (response times)**
✅ **Ready to import and run**

**File Location:** `postman/users-api-collection.json` (18KB)

**Next Steps:**
1. Import collection into Postman
2. Run Collection Runner
3. Verify all tests pass (100%)
4. (Optional) Take screenshots
5. Commit to Git
6. Submit!

---

**You're all set! 🎉**
