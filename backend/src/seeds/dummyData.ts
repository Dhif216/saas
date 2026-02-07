import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';

// Hash passwords for test users
const testPassword = 'Test@12345';
const passwordHash = bcrypt.hashSync(testPassword, 10);

export const dummyUsers = [
  {
    id: 'user_customer_001',
    email: 'customer@test.com',
    passwordHash,
    name: 'John Customer',
    phone: '555-1000',
    role: 'customer',
    createdAt: new Date(),
  },
  {
    id: 'user_restaurant_001',
    email: 'restaurant@test.com',
    passwordHash,
    name: 'Maria Owner',
    phone: '555-2000',
    role: 'restaurant',
    restaurantId: 'rest_001',
    createdAt: new Date(),
  },
  {
    id: 'user_restaurant_002',
    email: 'burger@test.com',
    passwordHash,
    name: 'Bob Burger',
    phone: '555-2001',
    role: 'restaurant',
    restaurantId: 'rest_002',
    createdAt: new Date(),
  },
];

export const dummyRestaurants = [
  {
    id: 'rest_001',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizza with fresh ingredients',
    logo: 'https://images.unsplash.com/photo-1596040424949-e0fcae5fdb51?w=500&h=500&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1596040424949-e0fcae5fdb51?w=1200&h=300&fit=crop',
    address: {
      street: '123 Main St',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
    },
    phone: '555-0101',
    email: 'contact@pizzapalace.com',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.8,
    reviews: 245,
    deliveryTime: 40,
    deliveryFee: 2.99,
    minimumOrder: 15,
    isOpen: true,
  },
  {
    id: 'rest_002',
    name: 'Burger Barn',
    description: 'Juicy burgers and crispy fries',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=300&fit=crop',
    address: {
      street: '456 Oak Ave',
      city: 'Midtown',
      state: 'CA',
      zipCode: '90211',
    },
    phone: '555-0102',
    email: 'contact@burgerbarn.com',
    cuisine: ['American', 'Burgers'],
    rating: 4.6,
    reviews: 189,
    deliveryTime: 25,
    deliveryFee: 1.99,
    minimumOrder: 10,
    isOpen: true,
  },
  {
    id: 'rest_003',
    name: 'Sushi Express',
    description: 'Fresh sushi and authentic Japanese cuisine',
    logo: 'https://images.unsplash.com/photo-1579584425555-c3fb46f1c925?w=500&h=500&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1579584425555-c3fb46f1c925?w=1200&h=300&fit=crop',
    address: {
      street: '789 Pine Rd',
      city: 'Uptown',
      state: 'CA',
      zipCode: '90212',
    },
    phone: '555-0103',
    email: 'contact@sushiexpress.com',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.9,
    reviews: 312,
    deliveryTime: 30,
    deliveryFee: 3.99,
    minimumOrder: 20,
    isOpen: true,
  },
  {
    id: 'rest_004',
    name: 'Taco Fiesta',
    description: 'Mexican street food and traditional tacos',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=300&fit=crop',
    address: {
      street: '321 Elm St',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
    },
    phone: '555-0104',
    email: 'contact@tacofiesta.com',
    cuisine: ['Mexican', 'Tacos'],
    rating: 4.7,
    reviews: 156,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minimumOrder: 12,
    isOpen: true,
  },
  {
    id: 'rest_005',
    name: 'Curry House',
    description: 'Authentic Indian cuisine and spices',
    logo: 'https://images.unsplash.com/photo-1565557623814-550f2054d0f3?w=500&h=500&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1565557623814-550f2054d0f3?w=1200&h=300&fit=crop',
    address: {
      street: '654 Birch Ln',
      city: 'Uptown',
      state: 'CA',
      zipCode: '90212',
    },
    phone: '555-0105',
    email: 'contact@curryhouse.com',
    cuisine: ['Indian', 'Curry'],
    rating: 4.5,
    reviews: 128,
    deliveryTime: 40,
    deliveryFee: 2.99,
    minimumOrder: 18,
    isOpen: true,
  },
];

export const dummyMenuItems: { [key: string]: any[] } = {
  rest_001: [
    { id: 'menu_001', name: 'Margherita Pizza', description: 'Fresh basil, mozzarella, and tomato sauce', price: 14.99 },
    { id: 'menu_002', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni slices', price: 15.99 },
    { id: 'menu_003', name: 'Garlic Bread', description: 'Crispy bread with garlic butter', price: 5.99 },
    { id: 'menu_004', name: 'Caesar Salad', description: 'Romaine lettuce with parmesan and croutons', price: 8.99 },
  ],
  rest_002: [
    { id: 'menu_101', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, onion', price: 10.99 },
    { id: 'menu_102', name: 'Double Cheeseburger', description: 'Two patties with cheddar cheese', price: 12.99 },
    { id: 'menu_103', name: 'Crispy Fries', description: 'Golden and delicious', price: 4.99 },
    { id: 'menu_104', name: 'Chicken Sandwich', description: 'Grilled chicken with special sauce', price: 9.99 },
  ],
  rest_003: [
    { id: 'menu_201', name: 'California Roll', description: 'Crab, avocado, cucumber', price: 12.99 },
    { id: 'menu_202', name: 'Spicy Tuna Roll', description: 'Spicy tuna with sriracha', price: 13.99 },
    { id: 'menu_203', name: 'Salmon Nigiri', description: 'Fresh salmon, 6 pieces', price: 11.99 },
    { id: 'menu_204', name: 'Miso Soup', description: 'Traditional miso broth', price: 4.99 },
  ],
  rest_004: [
    { id: 'menu_301', name: 'Carnitas Tacos', description: 'Slow-cooked pork, 3 tacos', price: 9.99 },
    { id: 'menu_302', name: 'Al Pastor Tacos', description: 'Marinated chicken, 3 tacos', price: 8.99 },
    { id: 'menu_303', name: 'Guacamole & Chips', description: 'Fresh guacamole with tortilla chips', price: 6.99 },
    { id: 'menu_304', name: 'Burrito Combo', description: 'Burrito with rice and beans', price: 11.99 },
  ],
  rest_005: [
    { id: 'menu_401', name: 'Chicken Tikka Masala', description: 'Tender chicken in creamy sauce', price: 13.99 },
    { id: 'menu_402', name: 'Butter Chicken', description: 'Classic butter chicken with naan', price: 12.99 },
    { id: 'menu_403', name: 'Vegetable Curry', description: 'Mixed vegetables in spiced sauce', price: 10.99 },
    { id: 'menu_404', name: 'Naan Bread', description: 'Authentic Indian flatbread', price: 3.99 },
  ],
};

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding dummy data...');

    // Add test users
    for (const user of dummyUsers) {
      await db.collection('users').doc(user.id).set(user);
      console.log(`✅ Added user: ${user.email} (${user.role})`);
    }

    // Add restaurants
    for (const restaurant of dummyRestaurants) {
      await db.collection('restaurants').doc(restaurant.id).set(restaurant);
      console.log(`✅ Added restaurant: ${restaurant.name}`);
    }

    // Add menu items
    for (const [restaurantId, items] of Object.entries(dummyMenuItems)) {
      for (const item of items) {
        await db
          .collection('restaurants')
          .doc(restaurantId)
          .collection('menu')
          .doc(item.id)
          .set(item);
      }
      console.log(`✅ Added ${items.length} menu items for ${restaurantId}`);
    }

    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📝 TEST LOGIN CREDENTIALS:');
    console.log('   Customer:');
    console.log('   - Email: customer@test.com');
    console.log('   - Password: Test@12345');
    console.log('');
    console.log('   Restaurant Owner (Pizza Palace):');
    console.log('   - Email: restaurant@test.com');
    console.log('   - Password: Test@12345');
    console.log('');
    console.log('   Restaurant Owner (Burger Barn):');
    console.log('   - Email: burger@test.com');
    console.log('   - Password: Test@12345');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
