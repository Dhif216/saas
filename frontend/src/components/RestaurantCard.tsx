import React from 'react';
import { Star } from 'lucide-react';
import type { Restaurant } from '@/types';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="card overflow-hidden h-full hover:shadow-xl transition-all cursor-pointer">
        {/* Image */}
        {(restaurant.coverImage || restaurant.logo) && (
          <img
            src={restaurant.coverImage || restaurant.logo}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-dark mb-1">{restaurant.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {restaurant.description}
          </p>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(restaurant.cuisine || []).slice(0, 2).map((c) => (
              <span
                key={c}
                className="badge-primary text-xs"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Rating and Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" fill="currentColor" />
              <span className="font-semibold">{restaurant.rating || 4.5}</span>
              <span className="text-gray-600">({restaurant.reviews || 0})</span>
            </div>
          </div>

          {/* Delivery and Price */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-2 pt-2 border-t">
            <span>⏱️ {restaurant.deliveryTime || 30}min</span>
            <span>🚚 ${(restaurant.deliveryFee || 2.99).toFixed(2)}</span>
            {restaurant.isOpen === false && (
              <span className="text-red-500 font-semibold">Closed</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
