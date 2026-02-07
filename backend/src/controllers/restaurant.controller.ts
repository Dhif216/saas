import { Request, Response } from 'express';
import { getAllRestaurants, getRestaurant, getMenuItems, createRestaurant as createSupabaseRestaurant, updateRestaurant, createMenuItem, updateMenuItem, deleteMenuItem, getRestaurantsByUserId } from '../db/supabase';

export const restaurantController = {
  async getRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await getAllRestaurants();
      res.json({ success: true, data: restaurants });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getUserRestaurant(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const restaurants = await getRestaurantsByUserId(req.user.userId);
      
      if (!restaurants || restaurants.length === 0) {
        return res.status(404).json({ success: false, message: 'No restaurant found for this user' });
      }

      // Return the first restaurant owned by this user
      res.json({ success: true, data: restaurants[0] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getRestaurantById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const restaurant = await getRestaurant(id);

      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      res.json({ success: true, data: restaurant });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const items = await getMenuItems(id);
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createRestaurant(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const restaurant = await createSupabaseRestaurant(req.user.userId, req.body.name, req.body.description, req.body.imageUrl, req.body.plan);
      res.status(201).json({ success: true, data: restaurant });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateRestaurant(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const restaurant = await getRestaurant(id);

      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      const updated = await updateRestaurant(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createMenuItem(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id: restaurantId } = req.params;
      const { name, description, price, category, image_url: imageUrl } = req.body;
      
      if (!restaurantId || !name || !price) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      
      const item = await createMenuItem(restaurantId, name, description, price, category, imageUrl);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      console.error('Create menu item error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateMenuItem(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const updated = await updateMenuItem(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteMenuItem(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      await deleteMenuItem(id);
      res.json({ success: true, message: 'Menu item deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
