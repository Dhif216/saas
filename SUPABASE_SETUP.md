# Supabase Setup Guide

## Step 1: Create Tables in Supabase

Go to your Supabase project at: https://app.supabase.com

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste ALL the code below
4. Click **Run**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  plan VARCHAR(50) DEFAULT 'classic',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_user_id ON public.restaurants(user_id);

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  available BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  phone VARCHAR(20),
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

## Step 2: Verify Tables Created

After running the SQL:
- You should see all 5 tables in the left sidebar under **Tables**
- The tables are: `users`, `restaurants`, `menu_items`, `orders`, `order_items`

## Step 3: Start Your Backend

```bash
cd backend
npm run dev
```

The backend will:
1. Connect to your Supabase database
2. Automatically seed test data (5 restaurants, 20 menu items, 3 users)
3. Create test accounts

## Step 4: Test Login Credentials

Use these in your app:

**Customer:**
- Email: customer@test.com
- Password: Test@12345

**Restaurant (Pizza Palace):**
- Email: restaurant@test.com
- Password: Test@12345

**Restaurant (Burger Barn):**
- Email: burger@test.com
- Password: Test@12345

## Environment Variables

Your `.env` file is already configured with:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_KEY`: Service role key (for server-side operations)

## Troubleshooting

If you get "PGRST116" errors, it means the user wasn't found - this is expected behavior.

If you get connection errors:
1. Check your Supabase URL and keys are correct in `.env`
2. Make sure your Supabase project is active
3. Check network connectivity

## Next Steps

Once seeded:
1. Frontend on http://localhost:3000
2. Backend on http://localhost:5000
3. Log in and test the app!
