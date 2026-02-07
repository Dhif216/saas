// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  role: 'customer' | 'restaurant' | 'admin';
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address: Address;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  cuisine: string[];
  deliveryTime: number; // in minutes
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours?: OpeningHours;
  menu?: MenuItem[];
  plan?: 'basic' | 'pro' | 'premium';
  widgetTheme?: 'basic' | 'pro' | 'premium';
  createdAt: Date;
}

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

// Menu Types
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  dietary?: string[]; // vegan, vegetarian, gluten-free, etc.
  spicy?: number; // 1-5 scale
  available: boolean;
  ratings?: number;
  reviews?: number;
  createdAt: Date;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  items: MenuItem[];
}

// Order Types
export interface CartItem {
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'card' | 'paypal' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  estimatedDeliveryTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  review?: Review;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

// Review and Rating
export interface Review {
  id: string;
  userId: string;
  userName: string;
  restaurantId?: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  image?: string;
  createdAt: Date;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'restaurant';
  phone?: string;
  planId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
