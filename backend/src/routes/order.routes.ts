import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, orderController.createOrder);

router.get('/', authenticate, orderController.getOrders);

router.get('/:id', authenticate, orderController.getOrderById);

router.put('/:id/status', authenticate, orderController.updateOrderStatus);

router.put('/:id/cancel', authenticate, orderController.cancelOrder);

export default router;
