# OnCampus Marketplace - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### Register

**POST** `/auth/register`

Register a new user (Vendor or Customer)

**Request Body:**

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "role": "Vendor|Customer",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token",
  "user": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role_id": 2,
    "account_status": "Pending"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate user

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

### Get Current User

**GET** `/auth/me`

Requires authentication

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products`

Requires authentication

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "description": "Description",
      "price": 10000,
      "quantity": 5,
      "category_name": "Electronics",
      "vendor_id": 2,
      "first_name": "John",
      "last_name": "Doe",
      "approval_status": "Approved",
      "product_status": "Active",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get Product by ID

**GET** `/products/{id}`

Requires authentication

### Create Product

**POST** `/products`

Requires authentication + Vendor role

**Request Body (multipart/form-data):**

- category_id: number
- product_name: string
- description: string
- sku: string
- price: number
- quantity: number
- product_status: string
- image: file (optional)

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "product_id": 1
}
```

### Update Product

**PUT** `/products/{id}`

Requires authentication + Vendor role

**Request Body:** Same as Create

### Delete Product

**DELETE** `/products/{id}`

Requires authentication + Admin role

### Approve Product

**PUT** `/products/{id}/approve`

Requires authentication + Admin role

### Reject Product

**PUT** `/products/{id}/reject`

Requires authentication + Admin role

---

## Category Endpoints

### Get All Categories

**GET** `/categories`

Requires authentication

### Get Category by ID

**GET** `/categories/{id}`

Requires authentication

### Create Category

**POST** `/categories`

Requires authentication + Admin role

**Request Body:**

```json
{
  "category_name": "string",
  "description": "string"
}
```

### Update Category

**PUT** `/categories/{id}`

Requires authentication + Admin role

### Delete Category

**DELETE** `/categories/{id}`

Requires authentication + Admin role

---

## Vendor Endpoints

### Get All Vendors

**GET** `/vendors`

Requires authentication + Admin role

### Get Vendor by ID

**GET** `/vendors/{id}`

Requires authentication + Admin role

### Get Vendor Statistics

**GET** `/vendors/stats`

Requires authentication + Admin role

**Response:**

```json
{
  "success": true,
  "data": {
    "total_vendors": 10,
    "approved": 7,
    "pending": 2,
    "rejected": 1,
    "suspended": 0
  }
}
```

### Approve Vendor

**PUT** `/vendors/{id}/approve`

Requires authentication + Admin role

### Reject Vendor

**PUT** `/vendors/{id}/reject`

Requires authentication + Admin role

### Suspend Vendor

**PUT** `/vendors/{id}/suspend`

Requires authentication + Admin role

---

## Role-Based Access Control

- **Role 1:** Administrator (Full access)
- **Role 2:** Vendor (Can create/manage products)
- **Role 3:** Customer (View-only access to products)

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Common HTTP Status Codes:**

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Client-Side Configuration

Configuration is centralized in `config.js`:

```javascript
const CONFIG = {
  API: {
    BASE_URL: "http://localhost:5000/api",
    ENDPOINTS: {
      AUTH: { REGISTER, LOGIN, ME },
      PRODUCTS: { LIST, GET, CREATE, UPDATE, DELETE, APPROVE, REJECT },
      CATEGORIES: { LIST, GET, CREATE, UPDATE, DELETE },
      VENDORS: { LIST, GET, STATS, APPROVE, REJECT, SUSPEND },
    },
  },
  ROLES: {
    ADMIN: 1,
    VENDOR: 2,
    CUSTOMER: 3,
  },
};
```

---

## Common Usage Patterns

### Making API Calls

```javascript
// GET
const result = await API.get(CONFIG.API.ENDPOINTS.PRODUCTS.LIST);

// POST
const result = await API.post(CONFIG.API.ENDPOINTS.AUTH.LOGIN, {
  email,
  password,
});

// PUT
const result = await API.put(CONFIG.API.ENDPOINTS.PRODUCTS.UPDATE(id), data);

// DELETE
const result = await API.delete(CONFIG.API.ENDPOINTS.PRODUCTS.DELETE(id));

// With FormData (file upload)
const result = await API.post(endpoint, formData, true); // third param: useFormData
```

### Authentication Checks

```javascript
// Require login
requireLogin();

// Require specific role
requireRole(CONFIG.ROLES.ADMIN);

// Require any role
requireAnyRole(CONFIG.ROLES.ADMIN, CONFIG.ROLES.VENDOR);
```

### Notifications

```javascript
showSuccess("Title", "Message");
showError("Title", "Message");
showWarning("Title", "Message");
showInfo("Title", "Message");
const confirmed = await showConfirm("Title", "Message");
```

---

## Database Schema

### users

- user_id (PK)
- first_name
- last_name
- email (UNIQUE)
- phone
- password_hash
- role_id (FK)
- account_status
- created_at

### products

- product_id (PK)
- category_id (FK)
- vendor_id (FK)
- product_name
- description
- sku
- price
- quantity
- image
- product_status
- approval_status
- created_at

### categories

- category_id (PK)
- category_name
- description
- created_at

### roles

- role_id (PK)
- role_name

---
