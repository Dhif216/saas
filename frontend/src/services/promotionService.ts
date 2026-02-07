import { apiClient } from './apiClient';

export interface Promotion {
  id: string;
  restaurantId: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit: number;
  usageCount: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromotionInput {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit: number;
  expiryDate: string;
}

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  id: string;
}

export const promotionService = {
  // Get all promotions for a restaurant
  async getRestaurantPromotions(restaurantId: string): Promise<Promotion[]> {
    try {
      const response = await apiClient.get(`/promotions/restaurant/${restaurantId}`);
      if (response.data && response.data.data) {
        return response.data.data.map((promo: any) => ({
          ...promo,
          expiryDate: new Date(promo.expiryDate),
          createdAt: new Date(promo.createdAt),
          updatedAt: new Date(promo.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      return [];
    }
  },

  // Create a new promotion
  async createPromotion(restaurantId: string, input: CreatePromotionInput): Promise<Promotion> {
    try {
      const response = await apiClient.post('/promotions', {
        restaurantId,
        ...input,
      });
      const promo = response.data.data;
      return {
        ...promo,
        expiryDate: new Date(promo.expiryDate),
        createdAt: new Date(promo.createdAt),
        updatedAt: new Date(promo.updatedAt),
      };
    } catch (error) {
      console.error('Failed to create promotion:', error);
      throw error;
    }
  },

  // Update a promotion
  async updatePromotion(id: string, input: Partial<CreatePromotionInput>): Promise<Promotion> {
    try {
      const response = await apiClient.put(`/promotions/${id}`, input);
      const promo = response.data.data;
      return {
        ...promo,
        expiryDate: new Date(promo.expiryDate),
        createdAt: new Date(promo.createdAt),
        updatedAt: new Date(promo.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update promotion:', error);
      throw error;
    }
  },

  // Delete a promotion
  async deletePromotion(id: string): Promise<void> {
    try {
      await apiClient.delete(`/promotions/${id}`);
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      throw error;
    }
  },

  // Get promotion by code
  async getPromotionByCode(code: string): Promise<Promotion | null> {
    try {
      const response = await apiClient.get(`/promotions/code/${code}`);
      if (response.data && response.data.data) {
        const promo = response.data.data;
        return {
          ...promo,
          expiryDate: new Date(promo.expiryDate),
          createdAt: new Date(promo.createdAt),
          updatedAt: new Date(promo.updatedAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch promotion by code:', error);
      return null;
    }
  },

  // Validate and apply promotion code
  async validatePromoCode(code: string, orderTotal: number): Promise<{ isValid: boolean; discount: number; message: string }> {
    try {
      const response = await apiClient.post('/promotions/validate', { code, orderTotal });
      return response.data.data;
    } catch (error) {
      console.error('Failed to validate promotion code:', error);
      return { isValid: false, discount: 0, message: 'Invalid promotion code' };
    }
  },
};
