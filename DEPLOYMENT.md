# FoodHub - Restaurant Food Ordering Platform

A complete full-stack SaaS application for restaurant food ordering with secure payment processing and free deployment.

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env

npm run dev
```

Backend will run on `http://localhost:5000`

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_STRIPE_KEY=pk_test_...
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
JWT_SECRET=your_secret
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
CORS_ORIGIN=http://localhost:3000
```

## Features Implemented

✅ User Authentication (Signup/Login)
✅ Restaurant Discovery & Browsing
✅ Menu Management
✅ Shopping Cart
✅ Secure Checkout
✅ Order Tracking
✅ User Profile Management
✅ Restaurant Dashboard
✅ Payment Integration (Stripe)
✅ Security Best Practices

## Security Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 🛡️ Helmet for security headers
- 🚫 CORS protection
- ⚠️ Rate limiting
- ✅ Input validation & sanitization
- 🔑 Environment variables for sensitive data
- 💳 Secure payment handling (Stripe)
- 🔑 JWT token verification

## Database Schema (Firestore)

### Collections

1. **users** - User accounts
2. **restaurants** - Restaurant information
3. **menuItems** - Menu items for restaurants
4. **orders** - Customer orders
5. **reviews** - Order reviews and ratings

## Deployment

### Frontend - Vercel (Free)

```bash
npm install -g vercel
cd frontend
vercel
```

### Backend - Railway/Render (Free Tier)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants` - Create new restaurant
- `PUT /api/restaurants/:id` - Update restaurant

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

## Project Structure

```
saas-food-ordering/
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   ├── styles/          # Global styles
│   │   └── App.tsx
│   └── package.json
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── package.json
└── README.md
```

## Future Enhancements

- Real-time order tracking with WebSocket
- Email notifications
- SMS notifications
- Payment history
- Admin dashboard
- Restaurant analytics
- Customer reviews & ratings
- Favorite restaurants
- Promotional codes
- Multi-language support
- Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please create an issue on GitHub.
