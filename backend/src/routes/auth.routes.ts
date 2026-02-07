import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequestBody } from '../middleware/validation.js';

const router = Router();

router.post(
  '/signup',
  validateRequestBody(['email', 'password', 'name', 'role']),
  authController.signup
);

router.post(
  '/login',
  validateRequestBody(['email', 'password']),
  authController.login
);

router.get('/me', authenticate, authController.getCurrentUser);

router.put('/profile', authenticate, authController.updateProfile);

export default router;
