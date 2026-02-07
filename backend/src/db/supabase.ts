import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export async function initializeDatabase() {
  console.log('✅ Connected to Supabase PostgreSQL');
}

// User operations
export async function getUser(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUser(email: string, passwordHash: string, role: string, name: string, phone: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password_hash: passwordHash, role, name, phone }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Restaurant operations
export async function getRestaurant(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getRestaurantsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function getAllRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function createRestaurant(userId: string, name: string, description: string, imageUrl: string, plan: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert([{ user_id: userId, name, description, image_url: imageUrl, plan }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateRestaurant(id: string, updates: any) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Menu items operations
export async function getMenuItems(restaurantId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId);
  
  if (error) throw error;
  return data;
}

export async function getMenuItem(id: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createMenuItem(restaurantId: string, name: string, description: string, price: number, category: string, imageUrl: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([{ restaurant_id: restaurantId, name, description, price, category, image_url: imageUrl }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, updates: any) {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Orders operations
export async function createOrder(userId: string, restaurantId: string, totalAmount: number, deliveryAddress: string, phone: string, specialInstructions: string) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: userId, restaurant_id: restaurantId, total_amount: totalAmount, delivery_address: deliveryAddress, phone, special_instructions: specialInstructions }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getRestaurantOrders(restaurantId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Order items operations
export async function createOrderItem(orderId: string, menuItemId: string, quantity: number, price: number) {
  const { data, error } = await supabase
    .from('order_items')
    .insert([{ order_id: orderId, menu_item_id: menuItemId, quantity, price }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getOrderItems(orderId: string) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  if (error) throw error;
  return data;
}
// Subscription operations
export async function createSubscription(userId: string, planId: string) {
  const now = new Date();
  const nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      user_id: userId,
      plan_id: planId,
      status: 'active',
      start_date: now.toISOString(),
      next_billing_date: nextBillingDate.toISOString(),
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateSubscription(subscriptionId: string, updates: any) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}