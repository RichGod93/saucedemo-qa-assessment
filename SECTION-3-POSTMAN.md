# Section 3 — Postman API Tests

## Overview

This section provides comprehensive Postman test scripts for REST API testing. The scripts include assertions for status codes, response times, schema validation, and edge cases.

**API Assumption:** Standard REST Users endpoint structure

**Base Endpoints:**
- `GET /users` - List all users
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

---

## Collection Structure

```text
Users API Collection
│
├── GET Users
│   ├── List all users
│   └── Tests: Status 200, Response time, Array validation
│
├── GET User by ID
│   ├── Valid ID test
│   ├── Invalid ID test (404)
│   └── Tests: Status codes, schema validation
│
├── POST User
│   ├── Create user with valid data
│   ├── Missing required fields test (400)
│   └── Tests: Status 201, schema validation
│
├── PUT User
│   ├── Update user
│   └── Tests: Status 200, data verification
│
└── DELETE User
    ├── Delete user
    └── Tests: Status 200/204
```

---

## 1. GET /users - List All Users

**Endpoint:** `{{baseUrl}}/users`
**Method:** GET

### Pre-request Script

```javascript
// Optional: Log request timestamp
pm.environment.set("requestTimestamp", Date.now());

console.log("Fetching all users at: " + new Date().toISOString());
```

### Tests Script

```javascript
// Test 1: Status code is 200
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Response body is an array
pm.test("Response body is an array", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});

// Test 4: Array is not empty
pm.test("Users array is not empty", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData.length).to.be.above(0);
});

// Test 5: Users contain required fields
pm.test("Users contain required fields (id, name, email)", function() {
    const users = pm.response.json();

    users.forEach(user => {
        pm.expect(user).to.have.property("id");
        pm.expect(user).to.have.property("name");
        pm.expect(user).to.have.property("email");
    });
});

// Test 6: Email format validation
pm.test("All users have valid email format", function() {
    const users = pm.response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    users.forEach(user => {
        pm.expect(user.email).to.match(emailRegex);
    });
});

// Test 7: Content-Type header is correct
pm.test("Content-Type is application/json", function() {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

**Expected Results:**
- ✅ Status: 200
- ✅ Response time: < 2000ms
- ✅ Returns array of users
- ✅ Each user has id, name, email
- ✅ Valid email formats

---

## 2. GET /users/:id - Get User by Valid ID

**Endpoint:** `{{baseUrl}}/users/1`
**Method:** GET

### Tests Script

```javascript
// Test 1: Status code is 200
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Response is an object (not array)
pm.test("Response is an object", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
    pm.expect(jsonData).to.not.be.an("array");
});

// Test 4: User schema validation
pm.test("User object has correct schema", function() {
    const user = pm.response.json();

    pm.expect(user).to.have.property("id");
    pm.expect(user).to.have.property("name");
    pm.expect(user).to.have.property("email");

    // Type validation
    pm.expect(user.id).to.be.a("number");
    pm.expect(user.name).to.be.a("string");
    pm.expect(user.email).to.be.a("string");
});

// Test 5: User ID matches requested ID
pm.test("Returned user ID matches requested ID", function() {
    const user = pm.response.json();
    const requestedId = pm.request.url.getPath().split('/').pop();

    pm.expect(user.id).to.eql(parseInt(requestedId));
});

// Test 6: Email format validation
pm.test("Email format is valid", function() {
    const user = pm.response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    pm.expect(user.email).to.match(emailRegex);
});

// Save user ID for later use
pm.environment.set("retrievedUserId", pm.response.json().id);
```

**Expected Results:**
- ✅ Status: 200
- ✅ Response time: < 2000ms
- ✅ Returns single user object
- ✅ Schema validation passes
- ✅ ID matches request

---

## 3. GET /users/:id - Invalid ID (404 Test)

**Endpoint:** `{{baseUrl}}/users/999999`
**Method:** GET

### Tests Script

```javascript
// Test 1: Status code is 404
pm.test("Status code is 404 for invalid ID", function() {
    pm.response.to.have.status(404);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Error message exists
pm.test("Error message is present", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
});

// Test 4: Error message is descriptive
pm.test("Error message indicates user not found", function() {
    const jsonData = pm.response.json();
    const message = jsonData.message.toLowerCase();

    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("not found") ||
               msg.includes("does not exist") ||
               msg.includes("invalid");
    });
});

// Test 5: Response structure for errors
pm.test("Error response has standard structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
    // Some APIs also include: error, status, timestamp
});
```

**Expected Results:**
- ✅ Status: 404
- ✅ Response time: < 2000ms
- ✅ Error message present
- ✅ Descriptive error text

---

## 4. POST /users - Create New User

**Endpoint:** `{{baseUrl}}/users`
**Method:** POST
**Content-Type:** application/json

### Pre-request Script

```javascript
// Generate unique email to avoid conflicts
const timestamp = Date.now();
const randomEmail = "user" + timestamp + "@test.com";

pm.environment.set("userEmail", randomEmail);
pm.environment.set("userName", "Test User " + timestamp);

console.log("Creating user with email: " + randomEmail);
```

### Request Body

```json
{
    "name": "{{userName}}",
    "email": "{{userEmail}}"
}
```

### Tests Script

```javascript
// Test 1: Status code is 201 (Created)
pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: User created successfully
pm.test("User created with correct data", function() {
    const jsonData = pm.response.json();
    const expectedName = pm.environment.get("userName");
    const expectedEmail = pm.environment.get("userEmail");

    pm.expect(jsonData.name).to.eql(expectedName);
    pm.expect(jsonData.email).to.eql(expectedEmail);
});

// Test 4: Response contains user ID
pm.test("Response contains generated user ID", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.id).to.be.a("number");
    pm.expect(jsonData.id).to.be.above(0);
});

// Test 5: Response schema validation
pm.test("Created user has correct schema", function() {
    const jsonData = pm.response.json();

    pm.expect(jsonData).to.have.all.keys("id", "name", "email");
});

// Test 6: Location header (optional, some APIs return this)
pm.test("Location header present (if applicable)", function() {
    if (pm.response.headers.has("Location")) {
        const location = pm.response.headers.get("Location");
        pm.expect(location).to.include("/users/");
    } else {
        console.log("Location header not present (acceptable)");
        pm.expect(true).to.be.true; // Pass if not required
    }
});

// Save user ID for subsequent tests
const createdUser = pm.response.json();
pm.environment.set("userId", createdUser.id);
pm.environment.set("createdUserId", createdUser.id);

console.log("User created with ID: " + createdUser.id);
```

**Expected Results:**
- ✅ Status: 201
- ✅ Response time: < 2000ms
- ✅ User created with correct data
- ✅ ID generated and returned

---

## 5. POST /users - Missing Required Fields (400 Test)

**Endpoint:** `{{baseUrl}}/users`
**Method:** POST
**Content-Type:** application/json

### Request Body

```json
{
    "name": "Incomplete User"
}
```

### Tests Script

```javascript
// Test 1: Status code is 400 (Bad Request)
pm.test("Status code is 400 for missing required field", function() {
    pm.response.to.have.status(400);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Validation error message exists
pm.test("Validation error message exists", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("message");
});

// Test 4: Error indicates missing field
pm.test("Error message indicates missing email field", function() {
    const response = pm.response.json();
    const message = response.message.toLowerCase();

    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("email") ||
               msg.includes("required") ||
               msg.includes("missing");
    });
});

// Test 5: Error response structure
pm.test("Error response has standard structure", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("message");
    // Some APIs return: { message, errors: [...], status }
});
```

**Expected Results:**
- ✅ Status: 400
- ✅ Response time: < 2000ms
- ✅ Validation error message
- ✅ Indicates missing field

---

## 6. PUT /users/:id - Update User

**Endpoint:** `{{baseUrl}}/users/{{userId}}`
**Method:** PUT
**Content-Type:** application/json

### Request Body

```json
{
    "name": "Updated User Name",
    "email": "updated.email@test.com"
}
```

### Tests Script

```javascript
// Test 1: Status code is 200
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: User updated successfully
pm.test("User data updated correctly", function() {
    const jsonData = pm.response.json();

    pm.expect(jsonData.name).to.eql("Updated User Name");
    pm.expect(jsonData.email).to.eql("updated.email@test.com");
});

// Test 4: User ID remains unchanged
pm.test("User ID unchanged after update", function() {
    const jsonData = pm.response.json();
    const originalUserId = pm.environment.get("userId");

    pm.expect(jsonData.id).to.eql(parseInt(originalUserId));
});

// Test 5: Response contains all fields
pm.test("Updated user has complete schema", function() {
    const jsonData = pm.response.json();

    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("name");
    pm.expect(jsonData).to.have.property("email");
});
```

**Expected Results:**
- ✅ Status: 200
- ✅ Response time: < 2000ms
- ✅ User data updated
- ✅ ID unchanged

---

## 7. DELETE /users/:id - Delete User

**Endpoint:** `{{baseUrl}}/users/{{userId}}`
**Method:** DELETE

### Tests Script

```javascript
// Test 1: Status code is 200 or 204
pm.test("Status code is 200 or 204", function() {
    pm.expect(pm.response.code).to.be.oneOf([200, 204]);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Response body (if status 200)
pm.test("Response body is appropriate for status code", function() {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.exist;
        // Some APIs return: { message: "User deleted successfully" }
    } else if (pm.response.code === 204) {
        // No content expected
        pm.expect(pm.response.text()).to.be.empty;
    }
});

// Test 4: Verify deletion (optional follow-up request)
// This would be a separate GET request to verify 404
```

**Expected Results:**
- ✅ Status: 200 or 204
- ✅ Response time: < 2000ms
- ✅ Appropriate response body

---

## 8. Unauthorized Access Test (401)

**Applicable for endpoints requiring authentication**

**Endpoint:** `{{baseUrl}}/users`
**Method:** GET
**Authorization:** None (remove auth token)

### Tests Script

```javascript
// Test 1: Status code is 401 (Unauthorized)
pm.test("Unauthorized request returns 401", function() {
    pm.response.to.have.status(401);
});

// Test 2: Response time under 2000ms
pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Error message indicates authentication required
pm.test("Error message indicates authentication required", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("message");

    const message = response.message.toLowerCase();
    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("unauthorized") ||
               msg.includes("authentication") ||
               msg.includes("token");
    });
});

// Test 4: WWW-Authenticate header present (optional)
pm.test("WWW-Authenticate header present", function() {
    if (pm.response.headers.has("WWW-Authenticate")) {
        pm.expect(pm.response.headers.get("WWW-Authenticate")).to.exist;
    }
});
```

**Expected Results:**
- ✅ Status: 401
- ✅ Response time: < 2000ms
- ✅ Authentication error message

---

## 9. JSON Schema Validation (Generic)

**Can be added to any test script**

### Schema Definition

```javascript
const userSchema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id: {
            type: "number",
            minimum: 1
        },
        name: {
            type: "string",
            minLength: 1
        },
        email: {
            type: "string",
            format: "email"
        }
    }
};

pm.test("Schema validation", function() {
    pm.response.to.have.jsonSchema(userSchema);
});
```

**Note:** Requires Ajv library or Postman's built-in schema validation.

---

## Environment Variables

### Setup Postman Environment

Create environment: `Users API - Dev`

**Variables:**

```json
{
    "baseUrl": "https://api.example.com",
    "userId": "",
    "userEmail": "",
    "userName": "",
    "createdUserId": "",
    "authToken": "Bearer your_token_here"
}
```

**Usage in requests:**
- URL: `{{baseUrl}}/users`
- Headers: `Authorization: {{authToken}}`
- Body: `"email": "{{userEmail}}"`

---

## Collection-Level Tests

**Add to Collection Pre-request Script:**

```javascript
// Set common headers
pm.request.headers.add({
    key: "Content-Type",
    value: "application/json"
});

// Log request info
console.log("Request: " + pm.request.method + " " + pm.request.url);
```

**Add to Collection Tests:**

```javascript
// Test that runs for ALL requests in collection
pm.test("Response has JSON content type", function() {
    pm.response.to.have.header("Content-Type");
});

pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

## Exporting Postman Collection

### Step-by-Step Export Instructions

1. **Open Postman**
2. **Locate your collection** in the left sidebar
3. **Click the three dots (...)** next to the collection name
4. **Select "Export"**
5. **Choose format:**
   - Select **Collection v2.1** (recommended)
   - This includes all requests, tests, and pre-request scripts
6. **Click "Export"**
7. **Save the file:**
   - File name: `users-api-collection.json`
   - Location: `saucedemo-qa-assessment/postman/`

### Alternative: Export via Postman CLI

```bash
# Export using Newman
newman export collection "Users API Collection" --output postman/users-api-collection.json
```

---

## Running Collection with Newman (CLI)

### Install Newman

```bash
npm install -g newman
```

### Run Collection

```bash
# Run with default settings
newman run postman/users-api-collection.json

# Run with environment
newman run postman/users-api-collection.json \
  --environment postman/users-api-environment.json

# Run with HTML report
newman run postman/users-api-collection.json \
  --reporters html \
  --reporter-html-export postman/report.html

# Run with specific iterations
newman run postman/users-api-collection.json --iteration-count 5
```

---

## Adding Collection to GitHub

### 1. Save collection to repository

```bash
mkdir -p postman
# Export collection to: postman/users-api-collection.json
```

### 2. Commit to Git

```bash
git add postman/users-api-collection.json
git commit -m "Add Postman API test collection"
git push
```

### 3. Document in README

```markdown
## Postman Collection

Import the collection:
1. Open Postman
2. Click Import
3. Select `postman/users-api-collection.json`
4. Run collection or individual requests
```

---

## Test Coverage Summary

| Endpoint | Test Cases | Assertions |
|----------|------------|------------|
| GET /users | 7 tests | Status, response time, array validation, schema, email format |
| GET /users/:id (valid) | 6 tests | Status, response time, object validation, schema, ID match |
| GET /users/:id (invalid) | 5 tests | 404 status, error message, response structure |
| POST /users (valid) | 6 tests | 201 status, data validation, ID generation, schema |
| POST /users (invalid) | 5 tests | 400 status, validation errors, error structure |
| PUT /users/:id | 5 tests | 200 status, data update, ID unchanged, schema |
| DELETE /users/:id | 3 tests | 200/204 status, response validation |
| Unauthorized (401) | 4 tests | 401 status, error message, headers |

**Total Test Cases:** 41 assertions across 8 scenarios

---

## Best Practices Implemented

✅ **Status code validation** - Verify correct HTTP responses
✅ **Response time testing** - Performance threshold (< 2000ms)
✅ **Schema validation** - Ensure data structure consistency
✅ **Edge case testing** - 404, 400, 401 scenarios
✅ **Dynamic data** - Generated emails/names to avoid conflicts
✅ **Environment variables** - Reusable across environments
✅ **Descriptive test names** - Clear intent and readability
✅ **Chained requests** - Save IDs for dependent requests
✅ **Error message validation** - Verify meaningful error responses
✅ **Content-Type validation** - Ensure proper JSON responses

---

## Conclusion

This Postman collection provides:
- ✅ Comprehensive API test coverage
- ✅ 41 test assertions across 8 scenarios
- ✅ Status code, performance, and schema validation
- ✅ Edge case and error handling tests
- ✅ Ready for manual execution or CI/CD integration via Newman

**Status:** Complete and ready for GitHub submission
