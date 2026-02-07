import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import type { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="card p-4 hover:shadow-lg transition-all">
      {/* Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}

      {/* Content */}
      <h3 className="font-bold text-dark mb-1">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {item.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {item.dietary?.map((d) => (
          <span key={d} className="badge-primary text-xs">
            {d}
          </span>
        ))}
        {item.spicy && (
          <span className="badge-warning text-xs">
            🌶️ {item.spicy}/5
          </span>
        )}
      </div>

      {/* Rating and Price */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {item.ratings && (
            <>
              <Star size={14} className="text-yellow-400" fill="currentColor" />
              <span className="text-sm font-semibold">{item.ratings}</span>
            </>
          )}
        </div>
        <span className="font-bold text-primary text-lg">
          ${item.price.toFixed(2)}
        </span>
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.available}
        className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
          item.available
            ? 'btn-primary'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ShoppingCart size={16} />
        {item.available ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default MenuItemCard;
