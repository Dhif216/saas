# 🍔 FoodHub - Complete SaaS Food Ordering Platform

## 📋 Project Overview

FoodHub is a **production-ready, full-stack SaaS application** for restaurant food ordering with:

- ✅ Complete frontend UI/UX
- ✅ Robust backend API
- ✅ Secure authentication & authorization
- ✅ Payment processing (Stripe)
- ✅ Database (Firebase/Firestore)
- ✅ Free deployment options
- ✅ Security best practices
- ✅ Professional code structure

---

## 🚀 Quick Start

### 1. Clone/Download Project
```bash
cd saas-food-ordering
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access: http://localhost:3000

### 3. Backend Setup (in new terminal)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Firebase & Stripe credentials
npm run dev
```
Access: http://localhost:5000

---

## 📁 Project Structure

```
saas-food-ordering/
├── frontend/                          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── RestaurantCard.tsx
│   │   │   └── MenuItemCard.tsx
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── RestaurantPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── RestaurantDashboard.tsx
│   │   ├── services/                 # API calls
│   │   │   ├── apiClient.ts
│   │   │   ├── authService.ts
│   │   │   ├── restaurantService.ts
│   │   │   ├── orderService.ts
│   │   │   └── reviewService.ts
│   │   ├── contexts/                 # State management
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useToast.ts
│   │   │   ├── useAsync.ts
│   │   │   └── ProtectedRoute.tsx
│   │   ├── types/                    # TypeScript types
│   │   │   └── index.ts
│   │   ├── styles/                   # CSS
│   │   │   ├── globals.css
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── restaurant.routes.ts
│   │   │   └── order.routes.ts
│   │   ├── controllers/              # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── restaurant.controller.ts
│   │   │   └── order.controller.ts
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── services/                 # Business logic
│   │   │   ├── db.service.ts
│   │   │   └── payment.service.ts
│   │   ├── utils/                    # Utilities
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── validation.ts
│   │   │   └── errors.ts
│   │   ├── config/                   # Configuration
│   │   │   └── firebase.ts
│   │   ├── types/                    # TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts                  # Main server
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── README.md                          # Project overview
├── SETUP_GUIDE.md                     # Installation guide
├── API.md                             # API documentation
├── DEPLOYMENT.md                      # Deployment guide
└── .gitignore
```

---

## 🎨 Frontend Features

### Pages & Components
1. **Home Page** - Restaurant discovery, search, filters
2. **Authentication** - Login & signup with form validation
3. **Restaurant Page** - Menu browsing, item selection
4. **Shopping Cart** - Item management, quantity adjustment
5. **Checkout** - Address, payment method selection
6. **Order Tracking** - Real-time order status updates
7. **User Profile** - Profile management, address management
8. **Restaurant Dashboard** - Order management for restaurants

### Technologies
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **State:** Context API + Zustand-ready
- **Routing:** React Router v6
- **HTTP:** Axios with interceptors
- **Icons:** Lucide React

---

## ⚙️ Backend Features

### API Endpoints

**Authentication**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

**Restaurants**
- `GET /restaurants` - List restaurants
- `GET /restaurants/:id` - Restaurant details
- `GET /restaurants/:id/menu` - Menu items
- `POST /restaurants` - Create restaurant
- `PUT /restaurants/:id` - Update restaurant

**Orders**
- `POST /orders` - Create order
- `GET /orders` - User orders
- `GET /orders/:id` - Order details
- `PUT /orders/:id/status` - Update status
- `PUT /orders/:id/cancel` - Cancel order

### Technologies
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Firebase Firestore
- **Authentication:** JWT
- **Security:** Helmet, CORS, Rate Limiting
- **Payments:** Stripe
- **Password:** bcryptjs

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Secure token validation

✅ **Data Protection**
- Input validation and sanitization
- Environment variables for secrets
- HTTPS ready
- Secure password requirements

✅ **API Security**
- Helmet security headers
- CORS configuration
- Rate limiting (100 requests/15 min)
- SQL injection prevention

✅ **Payment Security**
- Stripe integration
- PCI compliance ready
- Secure payment intent handling
- Webhook verification

✅ **Error Handling**
- Comprehensive error responses
- Sensitive data masking
- Logging for debugging
- Proper HTTP status codes

---

## 📊 Database Schema (Firestore)

### Collections

**users**
```
{
  id: string
  email: string
  passwordHash: string
  name: string
  phone: string
  address: Address
  role: "customer" | "restaurant" | "admin"
  createdAt: Date
  updatedAt: Date
}
```

**restaurants**
```
{
  id: string
  ownerId: string
  name: string
  description: string
  logo: string (URL)
  address: Address
  phone: string
  rating: number (1-5)
  reviews: number
  cuisine: string[]
  deliveryTime: number (minutes)
  deliveryFee: number
  minimumOrder: number
  isOpen: boolean
  createdAt: Date
  updatedAt: Date
}
```

**menuItems**
```
{
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string (URL)
  category: string
  dietary: string[] (vegan, vegetarian, etc)
  spicy: number (1-5)
  available: boolean
  createdAt: Date
  updatedAt: Date
}
```

**orders**
```
{
  id: string
  userId: string
  restaurantId: string
  items: OrderItem[]
  deliveryAddress: Address
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: "card" | "paypal" | "cash"
  paymentStatus: "pending" | "completed" | "failed"
  estimatedDeliveryTime: number
  createdAt: Date
  updatedAt: Date
}
```

---

## 💳 Payment Integration (Stripe)

- Create payment intents
- Confirm payments
- Webhook handling
- Test mode ready
- Production compatible

---

## 🌐 Deployment

### Frontend - Vercel (Free)
```bash
npm install -g vercel
cd frontend
vercel
```
Deployed in seconds! Auto-scaling, global CDN, serverless functions.

### Backend - Railway (Free Tier)
1. Push to GitHub
2. Connect repository on Railway.app
3. Set environment variables
4. Auto-deploy on push
5. Free tier: $5/month credit

**Alternative: Render.com** (Also free)

### Database - Firebase (Free Tier)
- 1GB storage
- 50k read/write operations per day
- Real-time sync
- Auto-scaling

---

## 📝 Configuration

### Environment Variables Setup

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_your_key
```

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_your_key
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Testing

### Test Credentials
- **Email:** test@example.com
- **Password:** TestPass123

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- CVC: Any 3 digits
- Date: Any future date

---

## 📚 Documentation

1. **[README.md](./README.md)** - Project overview
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step setup
3. **[API.md](./API.md)** - Complete API reference
4. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions

---

## 🎯 Features Checklist

### Core Features
- ✅ User authentication (signup/login)
- ✅ Restaurant discovery
- ✅ Menu browsing
- ✅ Shopping cart
- ✅ Checkout process
- ✅ Order tracking
- ✅ User profile
- ✅ Restaurant dashboard

### Security
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Security headers
- ✅ Error handling

### Payments
- ✅ Stripe integration
- ✅ Payment intents
- ✅ Webhook handling
- ✅ Multiple payment methods

### Database
- ✅ Firebase Firestore
- ✅ Real-time updates
- ✅ Proper indexing
- ✅ Data validation

---

## 🚀 What's Next?

### Immediate Next Steps
1. Configure Firebase & Stripe accounts
2. Set environment variables
3. Run frontend: `npm run dev`
4. Run backend: `npm run dev`
5. Test the application

### Future Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Advanced search & filtering
- [ ] Favorite restaurants
- [ ] Promotional codes
- [ ] Admin dashboard
- [ ] Restaurant analytics
- [ ] Customer reviews & ratings
- [ ] Multiple payment gateways
- [ ] Delivery tracking map
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## 💡 Key Technical Decisions

1. **Frontend:** React + TypeScript for type safety
2. **Backend:** Node.js + Express for scalability
3. **Database:** Firebase for real-time sync & free tier
4. **Payments:** Stripe for security & features
5. **Deployment:** Vercel (frontend) + Railway (backend) for free
6. **Styling:** Tailwind CSS for rapid development
7. **Auth:** JWT for stateless authentication

---

## 🤝 Contributing

To extend this project:

1. Create feature branches
2. Follow the existing code structure
3. Add TypeScript types
4. Test your changes
5. Update documentation

---

## 📧 Support

For issues or questions:
1. Check documentation first
2. Review API documentation
3. Check environment variables
4. Review browser console errors

---

## 📄 License

MIT License - Free to use and modify

---

## 🎉 You're All Set!

Your complete food ordering SaaS platform is ready! 

**Next Steps:**
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Configure Firebase & Stripe accounts
3. Run the application locally
4. Deploy to production

Happy coding! 🚀
