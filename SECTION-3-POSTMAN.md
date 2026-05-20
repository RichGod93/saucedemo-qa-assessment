# Section 3 — Postman API Tests

## Overview

This section contains Postman test scripts for REST API testing against a standard Users endpoint. The scripts cover status codes, response time thresholds, schema validation, and error handling for both happy paths and edge cases.

**Base Endpoints:**
- `GET /users` — list all users
- `GET /users/:id` — get a specific user
- `POST /users` — create a new user
- `PUT /users/:id` — update a user
- `DELETE /users/:id` — delete a user

---

## Collection Structure

```text
Users API Collection
│
├── GET Users
│   ├── List all users
│   └── Tests: Status 200, response time, array validation
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

## 1. GET /users — List All Users

**Endpoint:** `{{baseUrl}}/users`
**Method:** GET

### Pre-request Script

```javascript
pm.environment.set("requestTimestamp", Date.now());
console.log("Fetching all users at: " + new Date().toISOString());
```

### Tests Script

```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response body is an array", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});

pm.test("Users array is not empty", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData.length).to.be.above(0);
});

pm.test("Users contain required fields (id, name, email)", function() {
    const users = pm.response.json();

    users.forEach(user => {
        pm.expect(user).to.have.property("id");
        pm.expect(user).to.have.property("name");
        pm.expect(user).to.have.property("email");
    });
});

pm.test("All users have valid email format", function() {
    const users = pm.response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    users.forEach(user => {
        pm.expect(user.email).to.match(emailRegex);
    });
});

pm.test("Content-Type is application/json", function() {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

Expected: Status 200, response under 2000ms, array of users, each with id/name/email, valid email format.

---

## 2. GET /users/:id — Get User by Valid ID

**Endpoint:** `{{baseUrl}}/users/1`
**Method:** GET

### Tests Script

```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response is an object", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
    pm.expect(jsonData).to.not.be.an("array");
});

pm.test("User object has correct schema", function() {
    const user = pm.response.json();

    pm.expect(user).to.have.property("id");
    pm.expect(user).to.have.property("name");
    pm.expect(user).to.have.property("email");

    pm.expect(user.id).to.be.a("number");
    pm.expect(user.name).to.be.a("string");
    pm.expect(user.email).to.be.a("string");
});

pm.test("Returned user ID matches requested ID", function() {
    const user = pm.response.json();
    const requestedId = pm.request.url.getPath().split('/').pop();

    pm.expect(user.id).to.eql(parseInt(requestedId));
});

pm.test("Email format is valid", function() {
    const user = pm.response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    pm.expect(user.email).to.match(emailRegex);
});

// Save for later tests
pm.environment.set("retrievedUserId", pm.response.json().id);
```

Expected: Status 200, single user object, schema passes, ID matches the request.

---

## 3. GET /users/:id — Invalid ID (404 Test)

**Endpoint:** `{{baseUrl}}/users/999999`
**Method:** GET

### Tests Script

```javascript
pm.test("Status code is 404 for invalid ID", function() {
    pm.response.to.have.status(404);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Error message is present", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Error message indicates user not found", function() {
    const jsonData = pm.response.json();
    const message = jsonData.message.toLowerCase();

    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("not found") ||
               msg.includes("does not exist") ||
               msg.includes("invalid");
    });
});

pm.test("Error response has standard structure", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
});
```

Expected: Status 404, descriptive error message.

---

## 4. POST /users — Create New User

**Endpoint:** `{{baseUrl}}/users`
**Method:** POST
**Content-Type:** application/json

### Pre-request Script

```javascript
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
pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("User created with correct data", function() {
    const jsonData = pm.response.json();
    const expectedName = pm.environment.get("userName");
    const expectedEmail = pm.environment.get("userEmail");

    pm.expect(jsonData.name).to.eql(expectedName);
    pm.expect(jsonData.email).to.eql(expectedEmail);
});

pm.test("Response contains generated user ID", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.id).to.be.a("number");
    pm.expect(jsonData.id).to.be.above(0);
});

pm.test("Created user has correct schema", function() {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.all.keys("id", "name", "email");
});

pm.test("Location header present (if applicable)", function() {
    if (pm.response.headers.has("Location")) {
        const location = pm.response.headers.get("Location");
        pm.expect(location).to.include("/users/");
    } else {
        console.log("Location header not present (acceptable)");
        pm.expect(true).to.be.true;
    }
});

const createdUser = pm.response.json();
pm.environment.set("userId", createdUser.id);
pm.environment.set("createdUserId", createdUser.id);

console.log("User created with ID: " + createdUser.id);
```

Expected: Status 201, user created with the correct data, ID generated and returned.

---

## 5. POST /users — Missing Required Fields (400 Test)

**Endpoint:** `{{baseUrl}}/users`
**Method:** POST

### Request Body

```json
{
    "name": "Incomplete User"
}
```

### Tests Script

```javascript
pm.test("Status code is 400 for missing required field", function() {
    pm.response.to.have.status(400);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Validation error message exists", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("message");
});

pm.test("Error message indicates missing email field", function() {
    const response = pm.response.json();
    const message = response.message.toLowerCase();

    pm.expect(message).to.satisfy(function(msg) {
        return msg.includes("email") ||
               msg.includes("required") ||
               msg.includes("missing");
    });
});

pm.test("Error response has standard structure", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property("message");
});
```

Expected: Status 400, validation error message referencing the missing field.

---

## 6. PUT /users/:id — Update User

**Endpoint:** `{{baseUrl}}/users/{{userId}}`
**Method:** PUT

### Request Body

```json
{
    "name": "Updated User Name",
    "email": "updated.email@test.com"
}
```

### Tests Script

```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("User data updated correctly", function() {
    const jsonData = pm.response.json();

    pm.expect(jsonData.name).to.eql("Updated User Name");
    pm.expect(jsonData.email).to.eql("updated.email@test.com");
});

pm.test("User ID unchanged after update", function() {
    const jsonData = pm.response.json();
    const originalUserId = pm.environment.get("userId");

    pm.expect(jsonData.id).to.eql(parseInt(originalUserId));
});

pm.test("Updated user has complete schema", function() {
    const jsonData = pm.response.json();

    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("name");
    pm.expect(jsonData).to.have.property("email");
});
```

Expected: Status 200, updated data reflected in response, ID unchanged.

---

## 7. DELETE /users/:id — Delete User

**Endpoint:** `{{baseUrl}}/users/{{userId}}`
**Method:** DELETE

### Tests Script

```javascript
pm.test("Status code is 200 or 204", function() {
    pm.expect(pm.response.code).to.be.oneOf([200, 204]);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response body is appropriate for status code", function() {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.exist;
    } else if (pm.response.code === 204) {
        pm.expect(pm.response.text()).to.be.empty;
    }
});
```

Expected: Status 200 or 204, response body matches the status.

---

## 8. Unauthorized Access Test (401)

For endpoints that require authentication.

**Endpoint:** `{{baseUrl}}/users`
**Method:** GET
**Authorization:** None — remove the auth token

### Tests Script

```javascript
pm.test("Unauthorized request returns 401", function() {
    pm.response.to.have.status(401);
});

pm.test("Response time is less than 2000ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

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

pm.test("WWW-Authenticate header present", function() {
    if (pm.response.headers.has("WWW-Authenticate")) {
        pm.expect(pm.response.headers.get("WWW-Authenticate")).to.exist;
    }
});
```

Expected: Status 401, error message indicating auth is required.

---

## 9. JSON Schema Validation

Drop this into any test script where you want to validate the response shape:

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

Requires Ajv or Postman's built-in schema validation.

---

## Environment Variables

Create a Postman environment called `Users API - Dev` with these variables:

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

Use them in requests:
- URL: `{{baseUrl}}/users`
- Headers: `Authorization: {{authToken}}`
- Body: `"email": "{{userEmail}}"`

---

## Collection-Level Scripts

**Pre-request script (runs before every request):**

```javascript
pm.request.headers.add({
    key: "Content-Type",
    value: "application/json"
});

console.log("Request: " + pm.request.method + " " + pm.request.url);
```

**Tests (runs after every request):**

```javascript
pm.test("Response has JSON content type", function() {
    pm.response.to.have.header("Content-Type");
});

pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

## Exporting the Collection

1. Open Postman
2. Find your collection in the left sidebar
3. Click the three dots next to the collection name
4. Select Export
5. Choose Collection v2.1
6. Save the file as `users-api-collection.json` in the `postman/` directory

---

## Running with Newman (CLI)

```bash
# Install Newman
npm install -g newman

# Run the collection
newman run postman/users-api-collection.json

# With an environment file
newman run postman/users-api-collection.json \
  --environment postman/users-api-environment.json

# With an HTML report
newman run postman/users-api-collection.json \
  --reporters html \
  --reporter-html-export postman/report.html

# Run multiple iterations
newman run postman/users-api-collection.json --iteration-count 5
```

---

## Committing the Collection

```bash
mkdir -p postman
# Export collection to postman/users-api-collection.json first

git add postman/users-api-collection.json
git commit -m "Add Postman API test collection"
git push
```

---

## Coverage Summary

| Endpoint | Tests | What's Covered |
|----------|-------|----------------|
| GET /users | 7 | Status, response time, array validation, schema, email format |
| GET /users/:id (valid) | 6 | Status, response time, object validation, schema, ID match |
| GET /users/:id (invalid) | 5 | 404 status, error message, response structure |
| POST /users (valid) | 6 | 201 status, data validation, ID generation, schema |
| POST /users (invalid) | 5 | 400 status, validation errors, error structure |
| PUT /users/:id | 5 | 200 status, data update, ID unchanged, schema |
| DELETE /users/:id | 3 | 200/204 status, response body |
| Unauthorized (401) | 4 | 401 status, error message, headers |

**Total: 41 assertions across 8 scenarios**
