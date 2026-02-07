import apiClient from './apiClient';
import type { Order, OrderStatus } from '../types';

export const orderService = {
  async createOrder(data: any): Promise<Order> {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  async getOrders(status?: OrderStatus): Promise<Order[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  async trackOrder(id: string): Promise<{
    orderId: string;
    status: OrderStatus;
    estimatedDelivery: number;
    currentLocation?: { lat: number; lng: number };
  }> {
    const response = await apiClient.get(`/orders/${id}/track`);
    return response.data;
  },

  async getOrderHistory(): Promise<Order[]> {
    const response = await apiClient.get('/orders/history');
    return response.data;
  },
};
