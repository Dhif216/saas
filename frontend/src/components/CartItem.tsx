import React, { useState } from 'react';
import type { CartItem } from '@/types';
import { X, Plus, Minus } from 'lucide-react';

interface CartItemComponentProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex gap-4 py-4 border-b">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-dark">{item.name}</h3>
        {item.specialInstructions && (
          <p className="text-sm text-gray-600">{item.specialInstructions}</p>
        )}
        <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
          className="p-1 hover:bg-light rounded"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
          className="p-1 hover:bg-light rounded"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.menuItemId)}
        className="text-red-500 hover:bg-red-50 p-2 rounded"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartItemComponent;
