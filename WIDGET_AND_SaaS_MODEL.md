# 🎯 Restaurant Widget & Embedding System

## Business Model Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   RESTAURANT WEBSITE                             │
│                   (restaurant.com)                               │
│                                                                   │
│  "Order Now" Button embedded with FoodHub Widget                │
│                                                                   │
│  <script src="https://foodhub.com/widget.js"></script>         │
│  <div id="foodhub-widget" data-restaurant-id="rest123"></div>   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    Customer clicks "Order"
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              FOODHUB PLATFORM (Our SaaS)                         │
│                  localhost:3000                                  │
│                                                                  │
│  ✅ Restaurant Menu (from restaurant ID)                        │
│  ✅ Shopping Cart                                               │
│  ✅ Checkout & Payment (Stripe)                                │
│  ✅ Order Confirmation                                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    Order created with
              restaurant_id + order_id
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           RESTAURANT DASHBOARD                                   │
│          (admin.foodhub.com/dashboard)                           │
│                                                                  │
│  ✅ New Orders appear in real-time                              │
│  ✅ Accept/Reject/Track orders                                  │
│  ✅ View revenue & analytics                                    │
│  ✅ Manage menu items                                           │
│  ✅ Monthly billing                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Revenue Model

```
Customer pays: $30 for order
├─ Stripe takes: 2.9% + $0.30 = $0.87
├─ FoodHub takes: 15% commission = $4.50
└─ Restaurant receives: $24.63 ✅

Monthly Subscription: $29/month
├─ Basic plan: $0.15 per order (no subscription)
├─ Plus plan: $29 + $0.10 per order
└─ Pro plan: $99 + $0.05 per order
```

## Current Setup

### Database Collections

```javascript
// users
{
  id: "user123",
  name: "John Doe",
  email: "john@restaurant.com",
  role: "restaurant_owner",
  restaurantId: "rest123",
  subscription: {
    plan: "plus",
    status: "active",
    monthlyFee: 29.00,
    nextBillingDate: "2026-03-05"
  }
}

// restaurants
{
  id: "rest123",
  name: "Pizza Palace",
  owner: "user123",
  website: "https://pizzapalace.com",
  cuisineType: "Italian",
  description: "Fresh wood-fired pizza",
  logo: "https://...",
  rating: 4.8,
  deliveryFee: 2.99,
  estimatedDelivery: "30-45 mins",
  isActive: true,
  apiKey: "rest_key_abc123xyz",  // ← For widget authentication
  widgetSettings: {
    theme: "light",
    primaryColor: "#FF6B35",
    displayMode: "modal", // or "iframe"
    redirectAfterOrder: true
  }
}

// menuItems
{
  id: "item123",
  restaurantId: "rest123",
  name: "Margherita Pizza",
  price: 12.99,
  description: "Fresh mozzarella, basil, tomato",
  category: "Pizzas",
  available: true
}

// orders
{
  id: "order123",
  restaurantId: "rest123",
  customerId: "cust456",
  items: [{itemId, quantity, price}],
  totalAmount: 30.00,
  status: "pending", // pending, accepted, preparing, ready, delivered
  deliveryAddress: "...",
  timestamp: "2026-02-05T16:00:00Z",
  paymentStatus: "completed"
}
```
