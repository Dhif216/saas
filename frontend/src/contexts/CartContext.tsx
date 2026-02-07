import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartItem, Cart } from '../types';

interface CartContextType {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; tax: number; deliveryFee: number; total: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.1;
const DELIVERY_FEE = 2.99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const getTotals = useCallback(() => {
    if (!cart || cart.items.length === 0) {
      return { subtotal: 0, tax: 0, deliveryFee: 0, total: 0 };
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const deliveryFee = DELIVERY_FEE;
    const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

    return { subtotal, tax, deliveryFee, total };
  }, [cart]);

  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      if (!prevCart || prevCart.restaurantId !== item.restaurantId) {
        return {
          items: [item],
          restaurantId: item.restaurantId,
          subtotal: item.price * item.quantity,
          deliveryFee: DELIVERY_FEE,
          tax: (item.price * item.quantity * TAX_RATE),
          total: item.price * item.quantity + (item.price * item.quantity * TAX_RATE) + DELIVERY_FEE,
        };
      }

      const existingItem = prevCart.items.find((i) => i.menuItemId === item.menuItemId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        prevCart.items.push(item);
      }

      const totals = getTotals();
      return {
        ...prevCart,
        ...totals,
      };
    });
  };

  const removeItem = (menuItemId: string) => {
    setCart((prevCart) => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.filter((i) => i.menuItemId !== menuItemId);
      if (updatedItems.length === 0) return null;

      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
      const deliveryFee = DELIVERY_FEE;
      const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

      return {
        ...prevCart,
        items: updatedItems,
        subtotal,
        tax,
        deliveryFee,
        total,
      };
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setCart((prevCart) => {
      if (!prevCart) return null;

      const item = prevCart.items.find((i) => i.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
      }

      const subtotal = prevCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
      const deliveryFee = DELIVERY_FEE;
      const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

      return {
        ...prevCart,
        subtotal,
        tax,
        deliveryFee,
        total,
      };
    });
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, getTotals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
