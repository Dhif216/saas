import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import orderRoutes from './routes/order.routes';
import { authenticate } from './middleware/auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { sanitizeRequest } from './middleware/validation';
import { seedSupabase } from './seeds/seedSupabase';
import { initializeDatabase } from './db/supabase';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) as any * 60 * 1000,
  max: (process.env.RATE_LIMIT_MAX_REQUESTS || 100) as any,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Input Sanitization
app.use(sanitizeRequest);

// Health Check
app.get('/health', (req: any, res: any) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Seed database on startup
async function initializeApp() {
  try {
    await initializeDatabase();
    console.log('🚀 Connected to Supabase PostgreSQL Database');
    await seedSupabase();
    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
  initializeApp();
});

export default app;
