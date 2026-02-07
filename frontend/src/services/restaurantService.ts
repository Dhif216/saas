import apiClient from './apiClient';
import type { Restaurant, MenuItem } from '../types';

export const restaurantService = {
  async getRestaurants(filters?: {
    cuisine?: string;
    deliveryTime?: number;
    rating?: number;
    isOpen?: boolean;
  }): Promise<Restaurant[]> {
    const response = await apiClient.get('/restaurants', { params: filters });
    let restaurants = response.data.data || response.data;
    
    // Map cuisines based on restaurant name if not from database
    const cuisineMap: { [key: string]: string[] } = {
      'Pizza Palace': ['Italian', 'Pizza'],
      'Burger Barn': ['American', 'Burgers'],
      'Sushi Express': ['Japanese', 'Sushi'],
      'Taco Fiesta': ['Mexican', 'Tacos'],
      'Curry House': ['Indian', 'Curry'],
    };
    
    restaurants = restaurants.map((r: any) => ({
      ...r,
      cuisine: cuisineMap[r.name] || r.cuisine || [],
    }));
    
    return restaurants;
  },

  async getRestaurantById(id: string): Promise<Restaurant> {
    const response = await apiClient.get(`/restaurants/${id}`);
    return response.data.data || response.data;
  },

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}/menu`);
      const items = response.data.data || response.data || [];
      console.log(`Menu items for ${restaurantId}:`, items);
      
      // Map database fields to frontend fields
      return items.map((item: any) => ({
        id: item.id,
        restaurantId: item.restaurant_id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image_url || item.image,
        category: item.category,
        available: item.available,
        ratings: item.ratings || 0,
        reviews: item.reviews || 0,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error(`Failed to fetch menu items for ${restaurantId}:`, error);
      return [];
    }
  },

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    const response = await apiClient.get('/restaurants/search', {
      params: { q: query },
    });
    return response.data.data || response.data;
  },

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await apiClient.post('/restaurants', data);
    return response.data.data || response.data;
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await apiClient.put(`/restaurants/${id}`, data);
    return response.data.data || response.data;
  },

  async getRestaurantStats(id: string): Promise<any> {
    const response = await apiClient.get(`/restaurants/${id}/stats`);
    return response.data.data || response.data;
  },

  async getUserRestaurant(): Promise<Restaurant | null> {
    try {
      const response = await apiClient.get('/restaurants/user/my-restaurant');
      return response.data.data || response.data || null;
    } catch (error) {
      console.error('Failed to fetch user restaurant:', error);
      return null;
    }
  },

  async updateRestaurantPlan(restaurantId: string, plan: 'basic' | 'pro' | 'premium'): Promise<any> {
    const response = await apiClient.put(`/restaurants/${restaurantId}`, { plan });
    return response.data.data || response.data || { success: true };
  },
};
