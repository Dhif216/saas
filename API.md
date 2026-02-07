# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-api.railway.app/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Headers will include:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: remaining requests
  - `X-RateLimit-Reset`: reset time

---

## Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "customer",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "customer",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  }
}

Response: 200 OK
```

---

### Restaurants

#### Get All Restaurants
```http
GET /restaurants?isOpen=true&cuisine=Italian

Query Parameters:
- isOpen: boolean (optional)
- cuisine: string (optional)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "rest123",
      "name": "Pizza Palace",
      "description": "Best pizza in town",
      "rating": 4.8,
      "reviews": 156,
      "cuisine": ["Italian", "Pizza"],
      "deliveryTime": 25,
      "deliveryFee": 2.99,
      "isOpen": true
    }
  ]
}
```

#### Get Restaurant Details
```http
GET /restaurants/{restaurantId}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "rest123",
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "logo": "https://example.com/logo.png",
    "coverImage": "https://example.com/cover.png",
    "address": {
      "street": "123 Pizza Lane",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "phone": "+1234567890",
    "email": "pizzapalace@example.com",
    "rating": 4.8,
    "reviews": 156,
    "cuisine": ["Italian", "Pizza"],
    "deliveryTime": 25,
    "deliveryFee": 2.99,
    "minimumOrder": 15,
    "isOpen": true
  }
}
```

#### Get Restaurant Menu
```http
GET /restaurants/{restaurantId}/menu

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "item123",
      "restaurantId": "rest123",
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza",
      "price": 12.99,
      "image": "https://example.com/pizza.png",
      "category": "Pizza",
      "dietary": ["vegetarian"],
      "spicy": 1,
      "available": true,
      "ratings": 4.7,
      "reviews": 89
    }
  ]
}
```

#### Create Restaurant (Restaurant Owner)
```http
POST /restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Restaurant",
  "description": "Description",
  "cuisine": ["Italian"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "phone": "+1234567890",
  "email": "contact@myrestaurant.com",
  "deliveryTime": 30,
  "deliveryFee": 2.99,
  "minimumOrder": 15
}

Response: 201 Created
```

#### Update Restaurant
```http
PUT /restaurants/{restaurantId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: 200 OK
```

---

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "rest123",
  "items": [
    {
      "menuItemId": "item123",
      "name": "Margherita Pizza",
      "price": 12.99,
      "quantity": 2,
      "image": "url"
    }
  ],
  "deliveryAddress": {
    "street": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  },
  "phone": "+1234567890",
  "paymentMethod": "card",
  "specialInstructions": "Extra cheese please"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "order123",
    "userId": "user123",
    "restaurantId": "rest123",
    "status": "pending",
    "paymentStatus": "pending",
    "total": 32.97,
    "estimatedDeliveryTime": 30,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "paymentIntent": {
    "id": "pi_...",
    "clientSecret": "pi_..._secret_..."
  }
}
```

#### Get User Orders
```http
GET /orders?status=delivered

Query Parameters:
- status: pending|confirmed|preparing|ready|out_for_delivery|delivered|cancelled (optional)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "order123",
      "restaurantId": "rest123",
      "status": "delivered",
      "total": 32.97,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Order Details
```http
GET /orders/{orderId}
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "order123",
    "userId": "user123",
    "restaurantId": "rest123",
    "items": [...],
    "status": "delivered",
    "paymentStatus": "completed",
    "deliveryAddress": {...},
    "subtotal": 25.98,
    "tax": 2.60,
    "deliveryFee": 2.99,
    "total": 32.97,
    "estimatedDeliveryTime": 30,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### Update Order Status (Restaurant/Admin)
```http
PUT /orders/{orderId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "preparing"
}

Response: 200 OK
```

#### Cancel Order
```http
PUT /orders/{orderId}/cancel
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "order123",
    "status": "cancelled"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Missing or invalid authorization header",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "code": "INTERNAL_SERVER_ERROR"
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Create Order (with token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...order data...}'
```

---

## Webhook Events

### Stripe Payment Events

The backend listens for Stripe webhooks:

- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed

Configure webhook URL in Stripe Dashboard:
```
https://your-api.railway.app/api/webhooks/stripe
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Version History

- **v1.0.0** - Initial release with core features
