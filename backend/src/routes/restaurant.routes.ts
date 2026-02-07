import { Router } from 'express';
import { restaurantController } from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', restaurantController.getRestaurants);

// Get user's own restaurant
router.get('/user/my-restaurant', authenticate, restaurantController.getUserRestaurant);

router.get('/:id', restaurantController.getRestaurantById);

router.get('/:id/menu', restaurantController.getMenu);

router.post(
  '/',
  authenticate,
  authorize(['restaurant']),
  restaurantController.createRestaurant
);

router.put(
  '/:id',
  authenticate,
  restaurantController.updateRestaurant
);

router.post(
  '/:id/menu',
  authenticate,
  authorize(['restaurant']),
  restaurantController.createMenuItem
);

router.put(
  '/menu/:id',
  authenticate,
  restaurantController.updateMenuItem
);

router.delete(
  '/menu/:id',
  authenticate,
  restaurantController.deleteMenuItem
);

export default router;
