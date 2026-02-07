import apiClient from './apiClient';
import type { Review } from '../types';

export const reviewService = {
  async createReview(orderId: string, data: Omit<Review, 'id' | 'userId' | 'createdAt'>): Promise<Review> {
    const response = await apiClient.post(`/reviews`, {
      ...data,
      orderId,
    });
    return response.data;
  },

  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    const response = await apiClient.get(`/restaurants/${restaurantId}/reviews`);
    return response.data;
  },

  async getReviewStats(restaurantId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
  }> {
    const response = await apiClient.get(`/restaurants/${restaurantId}/review-stats`);
    return response.data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`/reviews/${reviewId}`);
  },
};
