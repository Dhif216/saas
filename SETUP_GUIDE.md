# Complete Setup & Installation Guide

## Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase Project** (create at [firebase.google.com](https://firebase.google.com/))
- **Stripe Account** (create at [stripe.com](https://stripe.com/))

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "FoodHub" (or your choice)
4. Enable Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose your preferred region
5. Click "Create"

### 1.3 Get Service Account Credentials

1. Go to Project Settings (⚙️ icon)
2. Click "Service Accounts" tab
3. Click "Generate a new private key"
4. Save the JSON file - you'll need these values for backend .env

### 1.4 Enable Authentication

1. Go to "Authentication" in left menu
2. Click "Get started"
3. Enable "Email/Password" provider

## Step 2: Stripe Setup

### 2.1 Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up and verify email
3. Complete account setup

### 2.2 Get API Keys

1. Go to Developers → API Keys
2. Copy "Publishable key" (for frontend)
3. Copy "Secret key" (for backend)
4. Keep webhook signing secret for later

## Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# VITE_API_URL=http://localhost:5000/api
# VITE_STRIPE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
# VITE_FIREBASE_API_KEY=YOUR_FIREBASE_KEY
```

### Frontend Environment Variables (.env)

```
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe (Public Key)
VITE_STRIPE_KEY=pk_test_YOUR_KEY_HERE

# Firebase (Optional for client-side auth)
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
```

### Run Frontend Development Server

```bash
npm run dev
```

Access at `http://localhost:3000`

## Step 4: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Firebase credentials and Stripe keys
```

### Backend Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Run Backend Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Step 5: Testing the Application

### 5.1 Create Test Account

1. Open frontend at `http://localhost:3000`
2. Click "Sign Up"
3. Register as a customer
4. Login with your credentials

### 5.2 Create Test Restaurant

1. Login or create another account as "Restaurant"
2. Go to "Dashboard"
3. Fill in restaurant details
4. Add menu items

### 5.3 Test Ordering

1. Login as customer
2. Browse restaurants
3. Add items to cart
4. Proceed to checkout
5. Use Stripe test card: `4242 4242 4242 4242`
6. Any future date and any CVC

## Step 6: Database Schema Setup

The application automatically creates Firestore collections when first needed. Collections created:

1. **users** - User accounts
2. **restaurants** - Restaurant info
3. **menuItems** - Menu items
4. **orders** - Orders

## Deployment

### Frontend Deployment (Vercel - Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow the prompts
```

### Backend Deployment (Railway - Free Tier)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app/)
3. "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables
6. Deploy

**Alternative: Render.com** (Also free)
1. Go to [Render.com](https://render.com/)
2. Create "New Web Service"
3. Connect GitHub
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

## Troubleshooting

### Firebase Connection Issues

- Check FIREBASE_PRIVATE_KEY format (should start with `-----BEGIN PRIVATE KEY-----`)
- Ensure newlines are preserved: use `\n` in .env

### CORS Errors

- Update CORS_ORIGIN in backend .env to match frontend URL
- For production, add your domain

### Payment Testing

- Use Stripe test mode
- Test cards: https://stripe.com/docs/testing
- Webhook testing: Use Stripe CLI for local development

### Port Already in Use

```bash
# Change PORT in .env
# Or kill the process:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

## Development Tips

### Hot Reload
- Frontend: Automatically reloads on file changes
- Backend: Use `npm run dev` with tsx watch

### Database Testing
- Use Firebase Console to view/edit data
- Test collections before production

### API Testing
- Use Postman or Insomnia
- Import endpoints from backend routes

### Local HTTPS (Optional)
- Generate SSL certificates for local HTTPS testing
- Update CORS_ORIGIN accordingly

## Next Steps

1. ✅ Complete frontend/backend setup
2. ✅ Test all features locally
3. ✅ Deploy to Vercel and Railway
4. ✅ Setup custom domain (optional)
5. ✅ Enable email notifications
6. ✅ Setup monitoring and logging

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)
