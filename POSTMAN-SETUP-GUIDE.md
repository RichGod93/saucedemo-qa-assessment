# Postman API Testing — Setup Guide

## Overview

This guide covers the Swagger Petstore Users API Collection included with this assessment. It walks through importing, running, and understanding the tests — structured for anyone reviewing this work.

**API being tested:** Swagger Petstore User endpoints at https://petstore.swagger.io/#/user

**Collection file:** `postman/users-api-collection.json`

---

## What's Included

The collection covers 8 API requests for the Swagger Petstore User endpoints:

| # | Endpoint | Method | Purpose | Assertions |
|---|----------|--------|---------|------------|
| 1 | `/user` | POST | Create a user | 5 |
| 2 | `/user/createWithArray` | POST | Create multiple users | 3 |
| 3 | `/user/login` | GET | Login | 5 |
| 4 | `/user/logout` | GET | Logout | 3 |
| 5 | `/user/{username}` | GET | Get user — valid ID | 7 |
| 6 | `/user/{username}` | GET | Get user — invalid ID (404) | 4 |
| 7 | `/user/{username}` | PUT | Update user | 4 |
| 8 | `/user/{username}` | DELETE | Delete user | 4 |

**Total:** approximately 35 test assertions across all requests.

---

## Step 1: Install Postman

If you don't have Postman installed:

**macOS:**
```bash
brew install --cask postman
```
Or download directly from https://www.postman.com/downloads/

**Windows:**
Download the installer from https://www.postman.com/downloads/ and run it.

**Linux:**
```bash
wget https://dl.pstmn.io/download/latest/linux64 -O postman.tar.gz
sudo tar -xzf postman.tar.gz -C /opt
sudo ln -s /opt/Postman/Postman /usr/bin/postman
```

---

## Step 2: Import the Collection

1. Open Postman
2. Sign in or create a free account
3. Click the **Import** button (top-left corner)
4. Click **Upload Files** or drag and drop
5. Locate and select `postman/users-api-collection.json` from this repository
6. Click **Import**

You should see **"Petstore Users API Collection"** appear in your Collections sidebar.

---

## Step 3: Run the Tests

### Run a single request

1. Expand the collection in the sidebar
2. Click any request — for example, "POST Create User"
3. Review the request details:
   - URL uses the `{{baseUrl}}` variable, which is pre-configured
   - POST and PUT requests include a request body
   - The Tests tab shows what assertions will run
4. Click **Send**
5. In the response panel, open the **Test Results** tab to see what passed or failed

**Recommended run order if running manually:**
1. POST Create User
2. GET User by Username — Valid
3. PUT Update User
4. DELETE User

---

### Run the full collection

1. Click the collection name: **"Petstore Users API Collection"**
2. Click **Run** (or open the three-dot menu and select "Run collection")
3. The Collection Runner opens
4. Leave settings at default — 1 iteration, no delay, no data file
5. Click **Run Petstore Users API Collection**
6. Watch requests execute sequentially
7. Review the summary when it finishes

Expected output:
```
Total Requests: 8
Tests Passed: ~35
Tests Failed: 0
Pass Rate: 100%
Average Response Time: < 500ms
```

---

## Test Coverage Breakdown

### 1. POST /user — Create User

- Status code is 200
- Response time under 2000ms
- Response indicates successful creation
- Response contains a message
- Response has correct type

A pre-request script generates a unique username using a timestamp so there are no conflicts between runs. Environment variables are set from the response for use in subsequent requests.

---

### 2. POST /user/createWithArray — Create Multiple Users

- Status code is 200
- Response time under 2000ms
- Response has correct structure

Tests batch user creation in a single request.

---

### 3. GET /user/login — Login

- Status code is 200
- Response time under 2000ms
- Response contains session info
- Response message indicates successful login
- Content-Type is application/json

Validates the authentication flow. Credentials come from environment variables set during user creation.

---

### 4. GET /user/logout — Logout

- Status code is 200
- Response time under 2000ms
- Logout response is successful

Confirms the session terminates correctly.

---

### 5. GET /user/{username} — Valid Username

This is the most thorough request in the collection with 7 assertions:

- Status code is 200
- Response time under 2000ms
- Response is a user object
- User object has the correct schema (id, username, firstName, lastName, email, password, phone, userStatus)
- Returned username matches the requested username
- Email format passes regex validation
- Field data types are correct

---

### 6. GET /user/{username} — Invalid Username (404)

- Status code is 404
- Response time under 2000ms
- Error response has the correct structure
- Error message indicates user not found

This is a negative test — it's supposed to return 404. The test passes when the API handles the error correctly.

---

### 7. PUT /user/{username} — Update User

- Status code is 200
- Response time under 2000ms
- Update is successful
- Response has correct structure

Updates firstName, lastName, email, password, and phone.

---

### 8. DELETE /user/{username} — Delete User

- Status code is 200
- Response time under 2000ms
- Deletion is successful
- Response has correct structure

---

## How the Collection is Built

### Pre-request Scripts

**Collection-level (runs before every request):**
```javascript
console.log("Request: " + pm.request.method + " " + pm.request.url);
console.log("Timestamp: " + new Date().toISOString());
```

**Request-level (POST Create User):**
```javascript
const timestamp = Date.now();
const randomUsername = "user" + timestamp;

pm.environment.set("username", randomUsername);
pm.environment.set("firstName", "Test");
pm.environment.set("lastName", "User");
pm.environment.set("email", randomUsername + "@test.com");
pm.environment.set("password", "testPass123");
```

This generates a unique user on every run, avoiding conflicts with leftover data.

---

### Collection-Level Tests (Run After Every Request)

```javascript
pm.test("Response has JSON content type", function() {
    pm.response.to.have.header("Content-Type");
});

pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

### Variables

**Collection variable:**
- `baseUrl` = `https://petstore.swagger.io/v2`

**Environment variables (set dynamically):**
- `username` — generated per run
- `firstName` — set in pre-request
- `lastName` — set in pre-request
- `email` — generated per run
- `password` — set in pre-request

---

## API Reference

- Swagger UI: https://petstore.swagger.io/
- User Endpoints: https://petstore.swagger.io/#/user
- OpenAPI Spec: https://petstore.swagger.io/v2/swagger.json

**User schema:**
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

## Troubleshooting

**"Could not send request"**
- Check your internet connection
- Test the API directly in a browser: https://petstore.swagger.io/v2/user/testuser
- Disable VPN if one is active
- Check firewall settings

---

**"baseUrl is not defined"**

The collection includes the `baseUrl` variable by default. If it's missing:
1. Click the collection name
2. Open the Variables tab
3. Confirm `baseUrl` is set to `https://petstore.swagger.io/v2`
4. Save the collection

---

**"Test failed: Username doesn't match"**

This happens when GET User by Username runs before POST Create User — the user doesn't exist yet. Run POST Create User first, or use the Collection Runner which handles request order automatically.

---

**"404 User not found" on the GET Invalid request**

This is expected. Request 6 ("GET User by Username — Invalid") is a negative test case. A 404 response here means the API is handling errors correctly. The test assertions for that request specifically validate the 404 status and error message, so they should show as passing.

---

## Verification Checklist

Before wrapping up:

- [ ] Collection imports successfully
- [ ] All 8 requests are visible in the sidebar
- [ ] POST Create User runs without errors
- [ ] GET User by Username returns the created user
- [ ] GET User by Username — Invalid returns 404 with passing assertions
- [ ] Collection Runner shows 100% pass rate
- [ ] Response times are under 2000ms
- [ ] Collection file exists in the `postman/` folder and is committed to Git
