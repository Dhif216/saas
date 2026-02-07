export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  role: 'customer' | 'restaurant' | 'admin';
  createdAt: Date;
  updatedAt: Date;
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

export interface Restaurant {
  id: string;
  ownerId: string;
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
  deliveryTime: number;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  dietary?: string[];
  spicy?: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  estimatedDeliveryTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
