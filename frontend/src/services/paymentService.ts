import apiClient from './apiClient';

export interface PaymentMethod {
  type: 'card';
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export const paymentService = {
  async processPayment(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post('/payments/process', data);
    return response.data;
  },

  async createPaymentIntent(amount: number, orderId: string) {
    const response = await apiClient.post('/payments/intent', { amount, orderId });
    return response.data;
  },

  async confirmPayment(paymentIntentId: string, token: string) {
    const response = await apiClient.post('/payments/confirm', {
      paymentIntentId,
      token,
    });
    return response.data;
  },
};
