import { Request, Response } from 'express';
import { getUser, createUser, createSubscription } from '../db/supabase';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { validateEmail, validatePassword } from '../utils/validation';
import { badRequestError, conflictError, unauthorizedError } from '../utils/errors';

export const authController = {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name, role, phone, planId } = req.body;

      // Validation
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
        });
      }

      // Check if user exists
      const existingUser = await getUser(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await createUser(email, passwordHash, role, name, phone);

      // If restaurant role and plan selected, create subscription
      if (role === 'restaurant' && planId) {
        const subscription = await createSubscription(user.id, planId);
        console.log('💳 Subscription created:', { userId: user.id, planId, subscriptionId: subscription.id });
      }

      console.log('📝 Signup successful:', { email, role: user.role, userId: user.id, planId });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await getUser(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Compare password
      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      console.log('🔐 Login successful:', { email, role: user.role, userId: user.id });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Get user from request
      res.json({ success: true, user: req.user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Update user in database
      const updatedUser = req.body;
      res.json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
