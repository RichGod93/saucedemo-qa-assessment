# Postman API Tests

## Overview

This section documents the Postman test collection built for the Swagger Petstore User endpoints as part of this assessment.

**API:** Swagger Petstore — https://petstore.swagger.io/v2
**Collection file:** `postman/users-api-collection.json`
**Collection name:** Petstore Users API Collection

---

## What's Covered

8 requests across the full user management lifecycle:

| # | Request Name | Method | Endpoint | Assertions |
|---|-------------|--------|----------|------------|
| 1 | POST Create User | POST | `/user` | 5 |
| 2 | POST Create Users with Array | POST | `/user/createWithArray` | 3 |
| 3 | GET User Login | GET | `/user/login` | 5 |
| 4 | GET User Logout | GET | `/user/logout` | 3 |
| 5 | GET User by Username — Valid | GET | `/user/{username}` | 7 |
| 6 | GET User by Username — Invalid (404) | GET | `/user/invalidusername999999` | 4 |
| 7 | PUT Update User | PUT | `/user/{username}` | 4 |
| 8 | DELETE User | DELETE | `/user/{username}` | 4 |

**Total:** 35 test assertions across all requests.

---

## Collection Variables

**Base URL (collection-level):**
- `baseUrl` = `https://petstore.swagger.io/v2`

**Dynamic variables (set by pre-request script on POST Create User):**
- `username` — generated from timestamp (e.g., `user1716300000000`)
- `firstName` — `Test`
- `lastName` — `User`
- `email` — `user1716300000000@test.com`
- `password` — `testPass123`

These variables carry through to GET, PUT, and DELETE so requests run in sequence without manual input.

---

## User Schema

The Petstore API uses this structure for user objects:

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

Most write operations return a response in this format:

```json
{
  "code": 200,
  "type": "unknown",
  "message": "string"
}
```

---

## Request Breakdown

### 1. POST /user — Create User

**Pre-request script:**
```javascript
// Generate unique username to avoid conflicts
const timestamp = Date.now();
const randomUsername = "user" + timestamp;

pm.environment.set("username", randomUsername);
pm.environment.set("firstName", "Test");
pm.environment.set("lastName", "User");
pm.environment.set("email", randomUsername + "@test.com");
pm.environment.set("password", "testPass123");

console.log("Creating user: " + randomUsername);
```

**Request body:**
```json
{
  "id": 0,
  "username": "{{username}}",
  "firstName": "{{firstName}}",
  "lastName": "{{lastName}}",
  "email": "{{email}}",
  "password": "{{password}}",
  "phone": "1234567890",
  "userStatus": 1
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response indicates successful creation", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData.code).to.be.a("number");
});

pm.test("Response contains message", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Response has correct type", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("type");
});
```

---

### 2. POST /user/createWithArray — Create Multiple Users

**Request body:** An array of two user objects with hardcoded values (`arrayuser1`, `arrayuser2`).

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has correct structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("type");
    pm.expect(jsonData).to.have.property("message");
});
```

---

### 3. GET /user/login — Login

**Endpoint:** `{{baseUrl}}/user/login?username={{username}}&password={{password}}`

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response contains login session info", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Response message indicates successful login", function() {
    const jsonData = pm.response.json();
    const message = jsonData.message.toLowerCase();
    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("logged") || msg.includes("session");
    });
});

pm.test("Content-Type is application/json", function() {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

---

### 4. GET /user/logout — Logout

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Logout successful", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("message");
});
```

---

### 5. GET /user/{username} — Valid Username

The most thorough request in the collection. Uses `{{username}}` from the environment (set during POST Create User).

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response is a user object", function() {
    const user = pm.response.json();
    pm.expect(user).to.be.an("object");
    pm.expect(user).to.not.be.an("array");
});

pm.test("User object has correct schema", function() {
    const user = pm.response.json();

    pm.expect(user).to.have.property("id");
    pm.expect(user).to.have.property("username");
    pm.expect(user).to.have.property("firstName");
    pm.expect(user).to.have.property("lastName");
    pm.expect(user).to.have.property("email");
    pm.expect(user).to.have.property("password");
    pm.expect(user).to.have.property("phone");
    pm.expect(user).to.have.property("userStatus");
});

pm.test("Returned username matches requested username", function() {
    const user = pm.response.json();
    const requestedUsername = pm.environment.get("username");

    pm.expect(user.username).to.eql(requestedUsername);
});

pm.test("Email format is valid", function() {
    const user = pm.response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    pm.expect(user.email).to.match(emailRegex);
});

pm.test("Field data types are correct", function() {
    const user = pm.response.json();

    pm.expect(user.id).to.be.a("number");
    pm.expect(user.username).to.be.a("string");
    pm.expect(user.firstName).to.be.a("string");
    pm.expect(user.lastName).to.be.a("string");
    pm.expect(user.email).to.be.a("string");
    pm.expect(user.userStatus).to.be.a("number");
});
```

---

### 6. GET /user/invalidusername999999 — Invalid Username (404)

A negative test. The endpoint uses a hardcoded username that doesn't exist, confirming the API returns the correct error.

**Tests:**
```javascript
pm.test("Status code is 404 for invalid username", function() {
    pm.response.to.have.status(404);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Error response has correct structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("type");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Error message indicates user not found", function() {
    const jsonData = pm.response.json();
    const message = jsonData.message.toLowerCase();

    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("not found") || msg.includes("user not found");
    });
});
```

---

### 7. PUT /user/{username} — Update User

**Request body:**
```json
{
  "id": 0,
  "username": "{{username}}",
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated.{{email}}",
  "password": "newPass456",
  "phone": "9876543210",
  "userStatus": 1
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Update successful", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Response has correct structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("type");
});
```

---

### 8. DELETE /user/{username} — Delete User

**Tests:**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Deletion successful", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("code");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Response has correct structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("type");
});
```

---

## Collection-Level Scripts

These run for every request in the collection.

**Pre-request (collection-level):**
```javascript
console.log("Request: " + pm.request.method + " " + pm.request.url);
console.log("Timestamp: " + new Date().toISOString());
```

**Tests (collection-level):**
```javascript
pm.test("Response has JSON content type", function() {
    pm.response.to.have.header("Content-Type");
});

pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

## Recommended Run Order

Running with the Collection Runner handles ordering automatically. If running manually, follow this sequence to ensure `{{username}}` is populated before dependent requests:

1. POST Create User
2. POST Create Users with Array
3. GET User Login
4. GET User Logout
5. GET User by Username — Valid
6. GET User by Username — Invalid (404)
7. PUT Update User
8. DELETE User

---

## Coverage Summary

| Endpoint | Assertions | What's Covered |
|----------|------------|----------------|
| POST /user | 5 | Status 200, response time, code/message/type properties |
| POST /user/createWithArray | 3 | Status 200, response time, structure |
| GET /user/login | 5 | Status 200, response time, session info, login message, content-type |
| GET /user/logout | 3 | Status 200, response time, logout confirmation |
| GET /user/{username} valid | 7 | Status 200, response time, object type, full schema, username match, email format, data types |
| GET /user/invalidusername999999 | 4 | Status 404, response time, error structure, error message |
| PUT /user/{username} | 4 | Status 200, response time, update confirmation, structure |
| DELETE /user/{username} | 4 | Status 200, response time, deletion confirmation, structure |

**Total: 35 assertions**

---

## Importing and Running

Import `postman/users-api-collection.json` into Postman and run via Collection Runner. See `POSTMAN-SETUP-GUIDE.md` for step-by-step instructions.

For CLI execution with Newman:

```bash
npm install -g newman
newman run postman/users-api-collection.json
```
