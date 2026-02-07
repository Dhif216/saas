# How Restaurants Add Their Menu to FoodHub

## 3-Step Process

### Step 1: Sign Up as Restaurant
Restaurant owner creates an account:
- Go to `/signup`
- Select "Restaurant" role
- Enter name, email, password
- Create restaurant info (name, address, phone, cuisine)
- Get approved (admin verification)

### Step 2: Access Restaurant Dashboard
After approval:
- Login with restaurant account
- Navigate to `/dashboard`
- See statistics (orders, revenue, ratings)
- View all menu management options

### Step 3: Add Menu Items
Go to `/dashboard/menu` to manage menu:

**Add New Item:**
- Click "Add Menu Item" button
- Fill in details:
  - Item name (required)
  - Price (required)
  - Description
  - Category (Pizza, Salads, Appetizers, Beverages, etc.)
  - Image URL
  - Available (toggle on/off)
- Click "Add Item"

**Edit Item:**
- Click edit icon on any item card
- Update details
- Click "Save Changes"

**Delete Item:**
- Click trash icon on any item card
- Item removed immediately

**Manage Availability:**
- Toggle checkbox on item card to mark available/unavailable
- Unavailable items won't show to customers

---

## Data Structure

### Each Menu Item Contains:
```typescript
{
  id: string;              // Unique ID
  restaurantId: string;    // Which restaurant owns it
  name: string;            // "Margherita Pizza"
  description: string;     // "Fresh basil, mozzarella, tomato"
  price: number;           // 14.99
  category: string;        // "Pizza", "Salads", etc.
  image: string;           // Image URL (Unsplash, etc.)
  available: boolean;      // In stock or not
  dietary?: string[];      // "vegan", "vegetarian", "gluten-free"
  spicy?: number;          // 1-5 scale for heat level
  ratings?: number;        // Customer average rating
  reviews?: number;        // Number of reviews
  createdAt: Date;         // When item was added
}
```

---

## API Endpoints (Backend)

### Get Restaurant's Menu
```
GET /api/restaurants/:restaurantId/menu
Response: Array of MenuItems
```

### Add Menu Item
```
POST /api/restaurants/:restaurantId/menu
Body: {
  name: string,
  description: string,
  price: number,
  category: string,
  image?: string,
  available: boolean
}
Response: Created MenuItem
```

### Update Menu Item
```
PUT /api/restaurants/:restaurantId/menu/:itemId
Body: Partial MenuItem data
Response: Updated MenuItem
```

### Delete Menu Item
```
DELETE /api/restaurants/:restaurantId/menu/:itemId
Response: { success: true }
```

---

## Customer Flow

1. Customer visits FoodHub at `/`
2. Searches for restaurant (e.g., "Pizza Palace")
3. Clicks on restaurant card → `/restaurant/rest_001`
4. Sees all **available menu items** with:
   - Item image
   - Name & description
   - Price
   - Category
   - Ratings (if available)
5. Can filter by category
6. Adds items to cart
7. Proceeds to checkout

---

## Subscription Plans & Revenue

### Starter Plan ($0/month)
- Add up to 100 menu items
- Limited to 100 orders/month
- 15% commission per order

### Plus Plan ($29/month) ⭐ **Most Popular**
- Unlimited menu items
- Unlimited orders
- 10% commission per order
- Widget embedding on website

### Professional Plan ($99/month)
- All Plus features
- 5% commission per order
- Multi-location support
- Advanced analytics
- Priority support

### Enterprise Plan (Custom)
- Dedicated support
- Custom commission rates
- API access
- White-label option

---

## Example: Pizza Palace Workflow

**Monday - Restaurant Setup:**
1. Owner (Maria) signs up at FoodHub
2. Creates restaurant profile: "Pizza Palace"
3. Goes to `/dashboard/menu`
4. Adds 15 menu items:
   - Margherita Pizza - $14.99
   - Pepperoni Pizza - $15.99
   - Garlic Bread - $5.99
   - Caesar Salad - $8.99
   - etc.

**Tuesday - First Customer:**
1. Customer searches for "pizza" on FoodHub
2. Finds "Pizza Palace" on home page
3. Clicks restaurant card
4. Sees all 15 menu items with images
5. Orders: 1 Margherita + 1 Garlic Bread = $20.98
6. Pays via Stripe
7. Order appears in Maria's dashboard instantly

**Maria's Dashboard:**
- Total Orders: 1
- Revenue: $20.98
- FoodHub takes: $2.10 (10% commission)
- Maria receives: $18.88 ✅

**Next Month:**
- 150 orders
- Total revenue: $3,147
- FoodHub takes: $314.70
- Maria receives: $2,832.30

---

## Key Features

✅ **Easy to Use** - No technical skills needed  
✅ **Real-time Updates** - Changes show immediately  
✅ **Image Support** - Add photos to items  
✅ **Categories** - Organize menu by type  
✅ **Availability Toggle** - Mark items in/out of stock  
✅ **Pricing Control** - Set any price  
✅ **Analytics** - Track orders & revenue  
✅ **Widget Embedding** - Customers can order from restaurant's website  
✅ **Mobile Friendly** - Works on all devices  
✅ **Secure** - Restaurant data isolated  

---

## Next Steps

1. **Try it:** Go to `/dashboard/menu` and add some menu items
2. **View on Home:** Go to `/` and see your restaurant listed
3. **Test Ordering:** Click your restaurant and try ordering
4. **Track Orders:** See orders in `/dashboard`

---

## Support

- Email: support@foodhub.com
- Chat: In-app chat (icon in top-right)
- Help Center: docs.foodhub.com
- Video Tutorials: youtube.com/foodhub-tutorials
