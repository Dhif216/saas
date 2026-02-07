import { Request, Response } from 'express';
import { createOrder, getOrder, getUserOrders, updateOrderStatus, createOrderItem } from '../db/supabase';
import { paymentService } from '../services/payment.service';

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const order = await createOrder(
        req.user.userId,
        req.body.restaurantId,
        req.body.totalAmount,
        req.body.deliveryAddress,
        req.body.phone,
        req.body.specialInstructions
      );

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(
        order.total_amount,
        order.id
      );

      res.status(201).json({
        success: true,
        data: order,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { status } = req.query;
      let orders = await getUserOrders(req.user.userId);

      if (status) {
        orders = orders.filter(o => o.status === status);
      }

      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await getOrder(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check authorization
      if (req.user && order.user_id !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const { status } = req.body;

      const order = await getOrder(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Only restaurant owner or admin can update status
      if (order.restaurant_id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const updated = await updateOrderStatus(id, status);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async cancelOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const order = await getOrder(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.user_id !== req.user.userId) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      if (['delivered', 'cancelled'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel this order',
        });
      }

      const updated = await updateOrderStatus(id, 'cancelled');
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
