import apiClient from './apiClient';
import type { MenuItem } from '../types';

export const menuService = {
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
      console.error('Failed to fetch menu items:', error);
      return [];
    }
  },

  async createMenuItem(restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await apiClient.post(`/restaurants/${restaurantId}/menu`, {
        restaurantId,
        ...data,
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to create menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(menuItemId: string, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await apiClient.put(`/restaurants/menu/${menuItemId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to update menu item:', error);
      throw error;
    }
  },

  async deleteMenuItem(menuItemId: string): Promise<void> {
    try {
      await apiClient.delete(`/restaurants/menu/${menuItemId}`);
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      throw error;
    }
  },
};
