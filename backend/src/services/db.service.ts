import { db } from '../config/firebase';
import type { User, Restaurant, MenuItem, Order } from '../types';

// User Service
export const userService = {
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = db.collection('users').doc().id;
    const now = new Date();
    const user: User = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('users').doc(id).set(user);
    return user;
  },

  async getUserById(id: string) {
    const doc = await db.collection('users').doc(id).get();
    return doc.data() as User | undefined;
  },

  async getUserByEmail(email: string) {
    const snap = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    return snap.docs[0]?.data() as User | undefined;
  },

  async updateUser(id: string, data: Partial<User>) {
    const updateData = { ...data, updatedAt: new Date() };
    await db.collection('users').doc(id).update(updateData);
    return this.getUserById(id);
  },
};

// Restaurant Service
export const restaurantService = {
  async createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = db.collection('restaurants').doc().id;
    const now = new Date();
    const restaurant: Restaurant = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('restaurants').doc(id).set(restaurant);
    return restaurant;
  },

  async getRestaurantById(id: string) {
    const doc = await db.collection('restaurants').doc(id).get();
    return doc.data() as Restaurant | undefined;
  },

  async getRestaurants(filters?: { isOpen?: boolean; cuisine?: string }) {
    let query = db.collection('restaurants');

    if (filters?.isOpen !== undefined) {
      query = query.where('isOpen', '==', filters.isOpen);
    }

    const snap = await query.get();
    let restaurants = snap.docs.map((doc: any) => doc.data() as Restaurant);

    if (filters?.cuisine) {
      restaurants = restaurants.filter((r: any) =>
        r.cuisine.includes(filters.cuisine!)
      );
    }

    return restaurants;
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>) {
    const updateData = { ...data, updatedAt: new Date() };
    await db.collection('restaurants').doc(id).update(updateData);
    return this.getRestaurantById(id);
  },
};

// Menu Item Service
export const menuItemService = {
  async createMenuItem(data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = db.collection('menuItems').doc().id;
    const now = new Date();
    const item: MenuItem = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('menuItems').doc(id).set(item);
    return item;
  },

  async getMenuItemsByRestaurant(restaurantId: string) {
    const snap = await db
      .collection('menuItems')
      .where('restaurantId', '==', restaurantId)
      .get();
    return snap.docs.map((doc: any) => doc.data() as MenuItem);
  },

  async updateMenuItem(id: string, data: Partial<MenuItem>) {
    const updateData = { ...data, updatedAt: new Date() };
    await db.collection('menuItems').doc(id).update(updateData);
    const doc = await db.collection('menuItems').doc(id).get();
    return doc.data() as MenuItem;
  },
};

// Order Service
export const orderService = {
  async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = db.collection('orders').doc().id;
    const now = new Date();
    const order: Order = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('orders').doc(id).set(order);
    return order;
  },

  async getOrderById(id: string) {
    const doc = await db.collection('orders').doc(id).get();
    return doc.data() as Order | undefined;
  },

  async getOrdersByUser(userId: string) {
    const snap = await db
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((doc: any) => doc.data() as Order);
  },

  async getOrdersByRestaurant(restaurantId: string) {
    const snap = await db
      .collection('orders')
      .where('restaurantId', '==', restaurantId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((doc: any) => doc.data() as Order);
  },

  async updateOrder(id: string, data: Partial<Order>) {
    const updateData = { ...data, updatedAt: new Date() };
    await db.collection('orders').doc(id).update(updateData);
    return this.getOrderById(id);
  },
};
