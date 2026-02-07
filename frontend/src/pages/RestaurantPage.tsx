import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign, RefreshCw } from 'lucide-react';
import MenuItemCard from '@/components/MenuItemCard';
import { restaurantService } from '@/services/restaurantService';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';
import type { Restaurant, MenuItem } from '@/types';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleRefreshMenu = async () => {
    if (!id) return;
    try {
      setRefreshing(true);
      const itemsData = await restaurantService.getMenuItems(id);
      setMenuItems(itemsData);
      addToast('Menu updated!', 'success');
    } catch (error) {
      console.error('Failed to refresh menu:', error);
      addToast('Failed to refresh menu', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [restaurantData, itemsData] = await Promise.all([
        restaurantService.getRestaurantById(id),
        restaurantService.getMenuItems(id),
      ]);

      setRestaurant(restaurantData);
      console.log('Fetched menu items:', itemsData);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
      addToast('Failed to load restaurant', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, addToast]);

  // Refetch data when page comes into view
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refetch menu items
        if (id) {
          restaurantService.getMenuItems(id).then(setMenuItems).catch(error => {
            console.error('Failed to refetch menu items:', error);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant) return;

    addItem({
      menuItemId: item.id,
      restaurantId: restaurant.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });

    addToast(`${item.name} added to cart`, 'success');
  };

  const categories = ['all', ...new Set(menuItems.map((item) => item.category))];
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Cover Image */}
      {restaurant.coverImage && (
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Restaurant Info */}
      <div className="container-max py-8 border-b">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Logo and Basic Info */}
          <div className="flex gap-4">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="flex flex-wrap gap-2">
                {(restaurant.cuisine || []).length > 0 ? (
                  (restaurant.cuisine || []).map((c) => (
                    <span key={c} className="badge-primary">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No cuisine info</span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-yellow-400" fill="currentColor" />
              <span className="font-semibold">{restaurant.rating || 4.5}</span>
              <span className="text-gray-600">({restaurant.reviews || 0} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>{restaurant.deliveryTime || 30} min delivery</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign size={20} />
              <span>${(restaurant.deliveryFee || 2.99).toFixed(2)} delivery fee</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <span>{restaurant.address?.street || 'Address not provided'}, {restaurant.address?.city || ''}</span>
            </div>

            {!restaurant.isOpen && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg font-semibold">
                Restaurant is currently closed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container-max py-12">
        {/* Menu Header with Refresh Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark">Menu</h2>
          <button
            onClick={handleRefreshMenu}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No items available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
