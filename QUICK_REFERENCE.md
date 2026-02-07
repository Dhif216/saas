# 📋 Quick Reference Card

## 🚀 Quick Start (Copy & Paste Commands)

### Terminal 1: Frontend
```bash
cd frontend
npm install
npm run dev
```
**Result:** http://localhost:3000

### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev
```
**Result:** http://localhost:5000

---

## 🔑 Environment Variables

### Backend .env
```env
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
JWT_SECRET=your-secret-key-make-it-long
STRIPE_SECRET_KEY=sk_test_xxxxx
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env.local
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

---

## 🧪 Test Credentials

### Test Account
- Email: `test@example.com`
- Password: `TestPass123!`

### Test Card (Stripe)
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

## 📱 API Endpoints

### Auth
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
```

### Restaurants
```
GET    /api/restaurants
GET    /api/restaurants/:id
GET    /api/restaurants/:id/menu
POST   /api/restaurants
PUT    /api/restaurants/:id
```

### Orders
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
PUT    /api/orders/:id/cancel
```

---

## 📁 Important Files

| Path | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main React app & routing |
| `frontend/src/pages/` | All 8 pages |
| `frontend/src/components/` | Reusable components |
| `frontend/src/services/` | API client code |
| `backend/src/index.ts` | Main server file |
| `backend/src/routes/` | API routes |
| `backend/src/controllers/` | Route handlers |
| `backend/.env` | Configuration |

---

## 🔐 Security Headers

All responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 📊 Database Schema

### Collections
- `users` - User accounts
- `restaurants` - Restaurant info
- `menuItems` - Menu items
- `orders` - Orders

### Auth
- JWT tokens stored in localStorage
- Tokens expire in 7 days
- Refresh on each request

---

## 🐛 Common Issues

### Port in use?
```bash
# Kill port 3000
npx kill-port 3000

# Kill port 5000
npx kill-port 5000
```

### npm install fails?
```bash
npm cache clean --force
npm install
```

### Firebase error?
- Check `.env` has correct credentials
- Verify Firestore database exists
- Check project ID matches

### Stripe error?
- Use test keys (start with `test_`)
- Check keys in both `.env` files
- Verify Stripe account is active

---

## 🚀 Deployment Commands

### Deploy Frontend
```bash
npm install -g vercel
cd frontend
vercel
```

### Deploy Backend
```bash
# Push to GitHub first
git add .
git commit -m "Deploy"
git push origin main

# Then deploy on Railway.app or Render.com
```

---

## 📚 Documentation Files

| File | Read When |
|------|-----------|
| README.md | Project overview |
| START_HERE.md | Just starting |
| GETTING_STARTED.md | Setting up locally |
| SETUP_GUIDE.md | Detailed setup |
| PROJECT_SUMMARY.md | Understanding code |
| API.md | Using APIs |
| DEPLOYMENT.md | Going to production |
| COMPLETE_CHECKLIST.md | Verifying features |

---

## 💡 Tips

- Keep both terminals open while developing
- Use VS Code's terminal split for convenience
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Firebase console for database inspection
- Stripe dashboard for payment testing

---

## 🎯 Development Workflow

1. **Make changes** in code
2. **See hot reload** in browser/terminal
3. **Test locally** before deployment
4. **Check errors** in console/terminal
5. **Deploy** when ready

---

## 🔄 Git Workflow

```bash
# Make changes
git status

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Deploy automatically
# (if set up with Vercel/Railway)
```

---

## 📈 Monitoring

### Frontend
- Browser DevTools (F12)
- Network tab for API calls
- Console tab for errors
- Application tab for localStorage

### Backend
- Terminal output for logs
- Firestore Console for data
- Stripe Dashboard for payments
- Network requests in browser DevTools

---

## 🆘 Debug Mode

### Frontend
```js
// Add to App.tsx for debugging
console.log('Auth Context:', authContext);
console.log('Cart Context:', cartContext);
```

### Backend
```js
// Add to routes for debugging
console.log('Request:', req.body);
console.log('User:', req.user);
console.log('Error:', error);
```

---

## 📞 Quick Links

- [Firebase Console](https://console.firebase.google.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Vercel Dashboard](https://vercel.com/)
- [Railway Dashboard](https://railway.app/)
- [GitHub Repository](https://github.com/)

---

## ✅ Pre-Deployment Checklist

- [ ] Frontend runs locally
- [ ] Backend runs locally
- [ ] Can create account
- [ ] Can view restaurants
- [ ] Can add to cart
- [ ] Payment works
- [ ] Order created in database
- [ ] All pages load without errors
- [ ] No console errors
- [ ] Environment variables set

---

## 🎊 Next Steps

1. ✅ Run locally (5 min)
2. ✅ Test features (15 min)
3. ✅ Deploy frontend (10 min)
4. ✅ Deploy backend (10 min)
5. ✅ Test in production (5 min)

**Total: 45 minutes to live production!**

---

*Bookmark this page for quick reference!*
